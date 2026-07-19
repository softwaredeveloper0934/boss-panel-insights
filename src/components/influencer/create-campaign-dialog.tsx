import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  Coins,
  FileText,
  ListChecks,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type StepKey = "basics" | "budget" | "guidelines" | "approval";

const STEPS: { key: StepKey; label: string; icon: ReactNode }[] = [
  { key: "basics", label: "Basics", icon: <Target className="h-3.5 w-3.5" /> },
  { key: "budget", label: "Budget & Schedule", icon: <Coins className="h-3.5 w-3.5" /> },
  { key: "guidelines", label: "Content Guidelines", icon: <FileText className="h-3.5 w-3.5" /> },
  { key: "approval", label: "Approval & Review", icon: <ListChecks className="h-3.5 w-3.5" /> },
];

export function CreateCampaignDialog({ open, onOpenChange }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    objective: "Awareness",
    description: "",
    budget: "",
    currency: "USD",
    startDate: "",
    endDate: "",
    contentTypes: [] as string[],
    guidelines: "",
    requireApproval: true,
    autoAssign: false,
  });

  const errors = useMemo(() => validate(form, stepIdx), [form, stepIdx]);
  const canNext = Object.keys(errors).length === 0;

  const reset = () => {
    setStepIdx(0);
    setForm({
      name: "",
      brand: "",
      objective: "Awareness",
      description: "",
      budget: "",
      currency: "USD",
      startDate: "",
      endDate: "",
      contentTypes: [],
      guidelines: "",
      requireApproval: true,
      autoAssign: false,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-foreground/40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[820px] -translate-x-1/2 -translate-y-1/2 gap-0 border border-border bg-surface shadow-xl rounded-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out">
          {/* Header */}
          <div className="px-5 pt-4 pb-3 border-b border-border flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
                Campaign Management
              </div>
              <h2 className="text-[17px] font-semibold text-foreground mt-0.5">
                Create campaign
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

          {/* Stepper */}
          <div className="px-5 py-3 border-b border-border bg-surface-muted">
            <ol className="flex items-center gap-2">
              {STEPS.map((s, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <li key={s.key} className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className={[
                        "h-6 w-6 rounded-full grid place-items-center text-[11px] font-semibold border",
                        done
                          ? "bg-success text-success-foreground border-success"
                          : active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-surface text-muted-foreground border-border",
                      ].join(" ")}
                    >
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground leading-none">
                        Step {i + 1}
                      </div>
                      <div
                        className={[
                          "text-[12.5px] font-medium truncate leading-tight mt-0.5",
                          active ? "text-foreground" : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {s.label}
                      </div>
                    </div>
                    {i < STEPS.length - 1 ? (
                      <div className="flex-1 h-px bg-border mx-1" />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto bg-background">
            {STEPS[stepIdx].key === "basics" && (
              <BasicsStep form={form} setForm={setForm} errors={errors} />
            )}
            {STEPS[stepIdx].key === "budget" && (
              <BudgetStep form={form} setForm={setForm} errors={errors} />
            )}
            {STEPS[stepIdx].key === "guidelines" && (
              <GuidelinesStep form={form} setForm={setForm} errors={errors} />
            )}
            {STEPS[stepIdx].key === "approval" && (
              <ApprovalStep form={form} setForm={setForm} />
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border bg-surface flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
              disabled={stepIdx === 0}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-8 px-3 rounded-md text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              {stepIdx < STEPS.length - 1 ? (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setStepIdx((s) => Math.min(STEPS.length - 1, s + 1))}
                  className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => onOpenChange(false)}
                  className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Create campaign
                </button>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/* ---------- Validation ---------- */

type Form = {
  name: string;
  brand: string;
  objective: string;
  description: string;
  budget: string;
  currency: string;
  startDate: string;
  endDate: string;
  contentTypes: string[];
  guidelines: string;
  requireApproval: boolean;
  autoAssign: boolean;
};

function validate(f: Form, step: number): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!f.name.trim()) e.name = "Campaign name is required.";
    else if (f.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    else if (f.name.length > 80) e.name = "Name must be 80 characters or less.";
    if (!f.brand.trim()) e.brand = "Brand is required.";
  }
  if (step === 1) {
    const b = Number(f.budget);
    if (!f.budget) e.budget = "Budget is required.";
    else if (Number.isNaN(b)) e.budget = "Budget must be a number.";
    else if (b <= 0) e.budget = "Budget must be greater than zero.";
    else if (b > 10_000_000) e.budget = "Budget exceeds $10,000,000 limit.";
    if (!f.startDate) e.startDate = "Start date is required.";
    if (!f.endDate) e.endDate = "End date is required.";
    if (f.startDate && f.endDate) {
      const s = new Date(f.startDate).getTime();
      const ed = new Date(f.endDate).getTime();
      if (Number.isNaN(s) || Number.isNaN(ed)) {
        e.endDate = "Invalid date.";
      } else if (ed <= s) {
        e.endDate = "End date must be after start date.";
      } else if ((ed - s) / 86_400_000 > 365) {
        e.endDate = "Duration cannot exceed 365 days.";
      }
    }
  }
  if (step === 2 && f.contentTypes.length === 0) {
    e.contentTypes = "Select at least one content type.";
  }
  return e;
}

/* ---------- Steps ---------- */

type StepProps = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  errors: Record<string, string>;
};

function BasicsStep({ form, setForm, errors }: StepProps) {
  return (
    <div className="p-5 grid gap-4">
      <FormField label="Campaign name" error={errors.name} required>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Spring launch — India creators"
          maxLength={80}
          className="form-input"
        />
        <Counter value={form.name.length} max={80} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Brand" error={errors.brand} required>
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="Brand name"
            className="form-input"
          />
        </FormField>
        <FormField label="Objective">
          <select
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
            className="form-input"
          >
            {["Awareness", "Engagement", "Traffic", "Leads", "Sales", "App Installs", "Reviews"].map(
              (o) => (
                <option key={o}>{o}</option>
              ),
            )}
          </select>
        </FormField>
      </div>

      <FormField label="Description" hint="Optional. Shown to creators in the brief.">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          maxLength={500}
          placeholder="Brief context, audience, must-haves and brand tone…"
          className="form-input resize-none"
        />
        <Counter value={form.description.length} max={500} />
      </FormField>

      <FormStyle />
    </div>
  );
}

function BudgetStep({ form, setForm, errors }: StepProps) {
  const duration =
    form.startDate && form.endDate
      ? Math.max(
          0,
          Math.round(
            (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86_400_000,
          ),
        )
      : null;
  return (
    <div className="p-5 grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Currency">
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="form-input"
          >
            {["USD", "EUR", "GBP", "INR", "AED", "SGD"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Total budget" error={errors.budget} required className="sm:col-span-2">
          <input
            type="number"
            min={0}
            step={100}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            placeholder="0"
            className="form-input"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Start date" error={errors.startDate} required>
          <div className="relative">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="form-input pr-8"
            />
            <CalendarIcon className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </FormField>
        <FormField label="End date" error={errors.endDate} required>
          <div className="relative">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="form-input pr-8"
            />
            <CalendarIcon className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </FormField>
      </div>

      {duration !== null && duration > 0 ? (
        <div className="rounded-md border border-border bg-surface-muted px-3 py-2 text-[12px] text-muted-foreground">
          Duration: <span className="text-foreground font-medium">{duration} day{duration === 1 ? "" : "s"}</span>
        </div>
      ) : null}

      <FormStyle />
    </div>
  );
}

function GuidelinesStep({ form, setForm, errors }: StepProps) {
  const allTypes = ["Post", "Reel", "Story", "Video", "Short", "Live", "Blog", "Tweet"];
  const toggle = (t: string) => {
    setForm({
      ...form,
      contentTypes: form.contentTypes.includes(t)
        ? form.contentTypes.filter((x) => x !== t)
        : [...form.contentTypes, t],
    });
  };
  return (
    <div className="p-5 grid gap-4">
      <FormField label="Content types" error={errors.contentTypes} required>
        <div className="flex flex-wrap gap-1.5">
          {allTypes.map((t) => {
            const on = form.contentTypes.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className={[
                  "h-7 px-2.5 rounded-md border text-[12px] font-medium transition-colors",
                  on
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-foreground border-border hover:bg-muted",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      </FormField>

      <FormField label="Brief / guidelines" hint="Required hashtags, mentions, do's and don'ts.">
        <textarea
          value={form.guidelines}
          onChange={(e) => setForm({ ...form, guidelines: e.target.value })}
          rows={8}
          maxLength={4000}
          placeholder={`Tone: professional, upbeat\nMust include: @software_vala, #softwarevala\nAvoid: competitor names, medical claims`}
          className="form-input resize-none font-mono text-[12px]"
        />
        <Counter value={form.guidelines.length} max={4000} />
      </FormField>

      <FormStyle />
    </div>
  );
}

function ApprovalStep({
  form,
  setForm,
}: {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
}) {
  return (
    <div className="p-5 grid gap-4">
      <ToggleRow
        title="Require content approval before publishing"
        description="Each deliverable goes through internal review before the creator can publish."
        checked={form.requireApproval}
        onChange={(v) => setForm({ ...form, requireApproval: v })}
      />
      <ToggleRow
        title="Auto-assign matching creators"
        description="Eligible verified creators in matching categories and countries are auto-invited."
        checked={form.autoAssign}
        onChange={(v) => setForm({ ...form, autoAssign: v })}
      />

      <div className="rounded-md border border-border bg-surface">
        <div className="h-9 px-3 flex items-center border-b border-border">
          <h3 className="text-[11.5px] font-semibold uppercase tracking-wide text-foreground">
            Review
          </h3>
        </div>
        <dl className="text-[12.5px] divide-y divide-border">
          <Row k="Name" v={form.name || "—"} />
          <Row k="Brand" v={form.brand || "—"} />
          <Row k="Objective" v={form.objective} />
          <Row k="Budget" v={form.budget ? `${form.currency} ${Number(form.budget).toLocaleString()}` : "—"} />
          <Row k="Schedule" v={form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "—"} />
          <Row k="Content types" v={form.contentTypes.length ? form.contentTypes.join(", ") : "—"} />
          <Row k="Approval required" v={form.requireApproval ? "Yes" : "No"} />
          <Row k="Auto-assign" v={form.autoAssign ? "Yes" : "No"} />
        </dl>
      </div>

      <FormStyle />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-3 py-2 grid grid-cols-[160px_1fr] gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-foreground truncate">{v}</dd>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3 cursor-pointer">
      <div>
        <div className="text-[13px] font-medium text-foreground">{title}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "shrink-0 mt-0.5 inline-flex h-5 w-9 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-surface shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </label>
  );
}

/* ---------- Form primitives ---------- */

function FormField({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <label className="text-[11.5px] font-medium uppercase tracking-wide text-foreground">
          {label}
          {required ? <span className="text-destructive ml-0.5">*</span> : null}
        </label>
        {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <div className="mt-1 flex items-center gap-1 text-[11.5px] text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      ) : null}
    </div>
  );
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <div className="mt-1 text-[10.5px] text-muted-foreground text-right tabular-nums">
      {value}/{max}
    </div>
  );
}

function FormStyle() {
  return (
    <style>{`.form-input{width:100%;height:34px;padding:0 10px;border-radius:6px;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-foreground);font-size:12.5px;outline:none;transition:border-color .15s,box-shadow .15s}.form-input:focus{border-color:var(--color-ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--color-ring) 25%,transparent)}textarea.form-input{height:auto;padding:8px 10px;line-height:1.5}`}</style>
  );
}
