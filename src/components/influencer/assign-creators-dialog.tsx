import { useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Search, UserPlus, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssignCreatorsDialog({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "Any",
    category: "Any",
    tier: "Any",
    minFollowers: "0",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-foreground/40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[720px] -translate-x-1/2 -translate-y-1/2 gap-0 border border-border bg-surface shadow-xl rounded-lg overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-border flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
                Campaign
              </div>
              <h2 className="text-[17px] font-semibold text-foreground mt-0.5">
                Assign creators
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-border bg-surface-muted grid gap-2">
            <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-border bg-surface">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search creators by name, handle or ID…"
                className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Select
                label="Country"
                value={filters.country}
                onChange={(v) => setFilters({ ...filters, country: v })}
                options={["Any", "India", "United States", "United Kingdom", "UAE", "Singapore"]}
              />
              <Select
                label="Category"
                value={filters.category}
                onChange={(v) => setFilters({ ...filters, category: v })}
                options={["Any", "Tech", "Business", "Finance", "Education", "Lifestyle"]}
              />
              <Select
                label="Tier"
                value={filters.tier}
                onChange={(v) => setFilters({ ...filters, tier: v })}
                options={["Any", "Tier A", "Tier B", "Tier C"]}
              />
              <Select
                label="Min. followers"
                value={filters.minFollowers}
                onChange={(v) => setFilters({ ...filters, minFollowers: v })}
                options={["0", "1k", "10k", "100k", "1M"]}
              />
            </div>
          </div>

          <div className="max-h-[40vh] overflow-y-auto bg-background">
            <div className="py-14 text-center">
              <div className="h-10 w-10 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground">
                <UserPlus className="h-4 w-4" />
              </div>
              <div className="mt-2 text-[13px] font-medium text-foreground">
                No matching creators
              </div>
              <div className="mt-1 text-[12px] text-muted-foreground max-w-sm mx-auto">
                Refine your filters or invite creators from the Influencer
                Directory.
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-border bg-surface flex items-center justify-between">
            <div className="text-[12px] text-muted-foreground">0 selected</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-8 px-3 rounded-md text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled
                className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign selected
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
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
  options: string[];
}) {
  return (
    <label className="block">
      <span className="block text-[10.5px] uppercase tracking-wide font-medium text-muted-foreground mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-2 rounded-md border border-border bg-surface text-[12.5px] outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

// Avoid unused import warning if author tweaks layout.
export type _Children = ReactNode;
