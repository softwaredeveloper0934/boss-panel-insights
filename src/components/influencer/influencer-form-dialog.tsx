import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  STATUSES,
  VERIFICATIONS,
  type Influencer,
  type InfluencerInsert,
} from "@/lib/use-influencers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: Influencer | null;
  onSubmit: (values: InfluencerInsert) => Promise<unknown>;
};

const empty = {
  full_name: "",
  handle: "",
  email: "",
  country: "",
  platform: "",
  tier: "",
  languages: "",
  categories: "",
  followers: "0",
  engagement_rate: "0",
  revenue: "0",
  commission: "0",
  health_score: "0",
  risk_score: "0",
  verification: "unverified",
  status: "pending",
  notes: "",
};

type FormState = typeof empty;

function toForm(record: Influencer): FormState {
  return {
    full_name: record.full_name,
    handle: record.handle,
    email: record.email ?? "",
    country: record.country ?? "",
    platform: record.platform ?? "",
    tier: record.tier ?? "",
    languages: (record.languages ?? []).join(", "),
    categories: (record.categories ?? []).join(", "),
    followers: String(record.followers ?? 0),
    engagement_rate: String(record.engagement_rate ?? 0),
    revenue: String(record.revenue ?? 0),
    commission: String(record.commission ?? 0),
    health_score: String(record.health_score ?? 0),
    risk_score: String(record.risk_score ?? 0),
    verification: record.verification,
    status: record.status,
    notes: record.notes ?? "",
  };
}

const list = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function InfluencerFormDialog({ open, onOpenChange, record, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(record ? toForm(record) : empty);
  }, [open, record]);

  if (!open) return null;

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.full_name.trim() || !form.handle.trim()) return;
    setSaving(true);
    await onSubmit({
      full_name: form.full_name.trim(),
      handle: form.handle.trim(),
      email: form.email.trim() || null,
      country: form.country.trim() || null,
      platform: form.platform.trim() || null,
      tier: form.tier.trim() || null,
      languages: list(form.languages),
      categories: list(form.categories),
      followers: Number(form.followers) || 0,
      engagement_rate: Number(form.engagement_rate) || 0,
      revenue: Number(form.revenue) || 0,
      commission: Number(form.commission) || 0,
      health_score: Number(form.health_score) || 0,
      risk_score: Number(form.risk_score) || 0,
      verification: form.verification as Influencer["verification"],
      status: form.status as Influencer["status"],
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-lg border border-border bg-surface p-5 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">
              {record ? "Edit influencer" : "Add influencer"}
            </h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Saved to your Influencer Manager database.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" required value={form.full_name} onChange={set("full_name")} />
          <Field label="Handle" required value={form.handle} onChange={set("handle")} />
          <Field label="Email" type="email" value={form.email} onChange={set("email")} />
          <Field label="Country" value={form.country} onChange={set("country")} />
          <Field label="Platform" value={form.platform} onChange={set("platform")} />
          <Field label="Tier" value={form.tier} onChange={set("tier")} />
          <Field
            label="Languages (comma separated)"
            value={form.languages}
            onChange={set("languages")}
          />
          <Field
            label="Categories (comma separated)"
            value={form.categories}
            onChange={set("categories")}
          />
          <Field label="Followers" type="number" value={form.followers} onChange={set("followers")} />
          <Field
            label="Engagement %"
            type="number"
            value={form.engagement_rate}
            onChange={set("engagement_rate")}
          />
          <Field label="Revenue" type="number" value={form.revenue} onChange={set("revenue")} />
          <Field
            label="Commission"
            type="number"
            value={form.commission}
            onChange={set("commission")}
          />
          <Field
            label="Health score"
            type="number"
            value={form.health_score}
            onChange={set("health_score")}
          />
          <Field
            label="Risk score"
            type="number"
            value={form.risk_score}
            onChange={set("risk_score")}
          />
          <Select
            label="Verification"
            value={form.verification}
            options={[...VERIFICATIONS]}
            onChange={set("verification")}
          />
          <Select
            label="Status"
            value={form.status}
            options={[...STATUSES]}
            onChange={set("status")}
          />
          <label className="sm:col-span-2 block">
            <span className="mb-1 block text-[11.5px] font-medium text-muted-foreground">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-2.5 py-2 text-[12.5px] text-foreground outline-none focus:border-border-strong"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md border border-border bg-surface px-3.5 text-[12.5px] font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-9 rounded-md bg-primary px-3.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : record ? "Save changes" : "Add influencer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-[12.5px] text-foreground outline-none focus:border-border-strong"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-border bg-background px-2.5 text-[12.5px] capitalize text-foreground outline-none focus:border-border-strong"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
