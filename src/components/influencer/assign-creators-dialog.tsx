import { useEffect, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Search, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AnyRow } from "@/lib/use-records";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: AnyRow[];
  onAssigned?: () => void;
};

type Creator = { id: string; full_name: string; handle: string; country: string | null; tier: string | null; followers: number };

const MIN = { "0": 0, "1k": 1_000, "10k": 10_000, "100k": 100_000, "1M": 1_000_000 } as const;

export function AssignCreatorsDialog({ open, onOpenChange, campaigns, onAssigned }: Props) {
  const [query, setQuery] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState({ country: "Any", tier: "Any", minFollowers: "0" as keyof typeof MIN });

  useEffect(() => {
    if (!open) return;
    setSelected([]);
    if (!campaignId && campaigns[0]) setCampaignId(campaigns[0].id);
    void supabase
      .from("influencers")
      .select("id, full_name, handle, country, tier, followers")
      .order("full_name")
      .then(({ data, error }) => {
        if (error) toast.error(`Failed to load creators: ${error.message}`);
        setCreators((data ?? []) as Creator[]);
      });
  }, [open, campaigns, campaignId]);

  useEffect(() => {
    if (!open || !campaignId) return;
    void supabase
      .from("campaign_creators")
      .select("influencer_id")
      .eq("campaign_id", campaignId)
      .then(({ data }) => setAssigned(new Set((data ?? []).map((r) => r.influencer_id))));
  }, [open, campaignId]);

  const countries = useMemo(
    () => ["Any", ...Array.from(new Set(creators.map((c) => c.country).filter(Boolean) as string[]))],
    [creators],
  );
  const tiers = useMemo(
    () => ["Any", ...Array.from(new Set(creators.map((c) => c.tier).filter(Boolean) as string[]))],
    [creators],
  );

  const visible = creators.filter((c) => {
    const q = query.trim().toLowerCase();
    if (q && !`${c.full_name} ${c.handle} ${c.id}`.toLowerCase().includes(q)) return false;
    if (filters.country !== "Any" && c.country !== filters.country) return false;
    if (filters.tier !== "Any" && c.tier !== filters.tier) return false;
    return Number(c.followers) >= MIN[filters.minFollowers];
  });

  const assign = async () => {
    if (!campaignId || selected.length === 0) return;
    setBusy(true);
    const { error } = await supabase
      .from("campaign_creators")
      .upsert(
        selected.map((influencer_id) => ({ campaign_id: campaignId, influencer_id })),
        { onConflict: "campaign_id,influencer_id", ignoreDuplicates: true },
      );
    setBusy(false);
    if (error) {
      toast.error(`Assign failed: ${error.message}`);
      return;
    }
    toast.success(`${selected.length} creator${selected.length === 1 ? "" : "s"} assigned`);
    onAssigned?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-foreground/40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
          <div className="flex items-start justify-between border-b border-border px-5 pb-3 pt-4">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Campaign</div>
              <DialogPrimitive.Title className="mt-0.5 text-[17px] font-semibold text-foreground">
                Assign creators
              </DialogPrimitive.Title>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-2 border-b border-border bg-surface-muted px-5 py-3">
            <Select
              label="Campaign"
              value={campaignId}
              onChange={setCampaignId}
              options={campaigns.map((c) => ({ value: c.id, label: String(c["name"]) }))}
            />
            <div className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search creators by name, handle or ID…"
                className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Select label="Country" value={filters.country} onChange={(v) => setFilters({ ...filters, country: v })} options={countries.map((o) => ({ value: o, label: o }))} />
              <Select label="Tier" value={filters.tier} onChange={(v) => setFilters({ ...filters, tier: v })} options={tiers.map((o) => ({ value: o, label: o }))} />
              <Select
                label="Min. followers"
                value={filters.minFollowers}
                onChange={(v) => setFilters({ ...filters, minFollowers: v as keyof typeof MIN })}
                options={Object.keys(MIN).map((o) => ({ value: o, label: o }))}
              />
            </div>
          </div>

          <div className="max-h-[40vh] overflow-y-auto bg-background">
            {campaigns.length === 0 ? (
              <Empty title="No campaigns yet" text="Create a campaign first, then assign creators to it." />
            ) : visible.length === 0 ? (
              <Empty title="No matching creators" text="Refine your filters or add creators in the Influencer Directory." />
            ) : (
              <ul className="divide-y divide-border">
                {visible.map((c) => {
                  const already = assigned.has(c.id);
                  return (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center gap-3 px-5 py-2.5 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          disabled={already}
                          checked={already || selected.includes(c.id)}
                          onChange={(e) =>
                            setSelected((p) => (e.target.checked ? [...p, c.id] : p.filter((x) => x !== c.id)))
                          }
                          className="h-3.5 w-3.5 accent-[color:var(--color-primary)]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12.5px] font-medium text-foreground">{c.full_name}</div>
                          <div className="truncate text-[11.5px] text-muted-foreground">
                            {c.handle} · {c.country ?? "—"} · {Number(c.followers).toLocaleString("en-US")} followers
                          </div>
                        </div>
                        {already && <span className="text-[11px] text-muted-foreground">Assigned</span>}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-3">
            <div className="text-[12px] text-muted-foreground">{selected.length} selected</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-8 rounded-md px-3 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || selected.length === 0 || !campaignId}
                onClick={() => void assign()}
                className="h-8 rounded-md bg-primary px-3 text-[12.5px] font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Assigning…" : "Assign selected"}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <UserPlus className="h-4 w-4" />
      </div>
      <div className="mt-2 text-[13px] font-medium text-foreground">{title}</div>
      <div className="mx-auto mt-1 max-w-sm text-[12px] text-muted-foreground">{text}</div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border border-border bg-surface px-2 text-[12.5px] outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
