import { useState, type ReactNode } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  IdCard,
  Landmark,
  Linkedin,
  MessageSquare,
  Percent,
  ShieldAlert,
  ShieldCheck,
  Upload,
  User as UserIcon,
  X,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetOverlay, SheetPortal } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

const STEPS = [
  { key: "identity", label: "Identity", icon: IdCard, hint: "Government-issued ID and liveness" },
  { key: "social", label: "Social", icon: Youtube, hint: "Verify ownership of social handles" },
  { key: "company", label: "Company", icon: Building2, hint: "Legal entity and registered address" },
  { key: "bank", label: "Bank", icon: Landmark, hint: "Payout destination and beneficiary" },
  { key: "tax", label: "Tax", icon: Percent, hint: "Tax residency and withholding forms" },
] as const;
type StepKey = (typeof STEPS)[number]["key"];

export function KycWizard() {
  const [stepIdx, setStepIdx] = useState(0);
  const [viewer, setViewer] = useState<{ title: string; kind: "id" | "generic" } | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const step = STEPS[stepIdx];
  const total = STEPS.length;
  const pct = Math.round(((stepIdx + 1) / total) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* Left rail */}
      <aside className="rounded-md border border-border bg-surface p-2 h-fit lg:sticky lg:top-4">
        <div className="px-2 py-1.5 flex items-center justify-between">
          <div className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
            KYC Wizard
          </div>
          <span className="text-[10.5px] text-muted-foreground tabular-nums">{pct}%</span>
        </div>
        <div className="mx-2 h-1 rounded-full bg-muted overflow-hidden mb-2">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <ol className="space-y-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === stepIdx;
            const done = i < stepIdx;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setStepIdx(i)}
                  className={[
                    "w-full text-left px-2 py-2 rounded-md flex items-start gap-2 border transition-colors",
                    active
                      ? "border-primary/40 bg-primary/5"
                      : "border-transparent hover:bg-muted",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "h-6 w-6 grid place-items-center rounded-full border text-[11px] font-semibold shrink-0",
                      done
                        ? "bg-success text-success-foreground border-success"
                        : active
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    ].join(" ")}
                  >
                    {done ? <Check className="h-3 w-3" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium text-foreground">
                      {i + 1}. {s.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{s.hint}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 border-t border-border pt-3 px-1 space-y-2">
          <button
            type="button"
            onClick={() => setStatusOpen(true)}
            className="w-full h-8 inline-flex items-center gap-1.5 justify-center rounded-md border border-border bg-surface hover:bg-muted text-[12px] font-medium"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Approval status
          </button>
          <div className="rounded-md border border-dashed border-border bg-surface-muted/50 p-2 text-[11px] text-muted-foreground">
            Progress saves automatically. You can return to any step from this rail.
          </div>
        </div>
      </aside>

      {/* Main step */}
      <section className="rounded-md border border-border bg-surface overflow-hidden">
        <header className="h-11 px-4 flex items-center justify-between border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary grid place-items-center">
              <step.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-foreground">
                Step {stepIdx + 1} of {total} · {step.label}
              </div>
              <div className="text-[11px] text-muted-foreground">{step.hint}</div>
            </div>
          </div>
          <StatusPill tone="warn">Not submitted</StatusPill>
        </header>

        <div className="p-5">
          {step.key === "identity" ? <IdentityStep onView={(t) => setViewer({ title: t, kind: "id" })} /> : null}
          {step.key === "social" ? <SocialStep /> : null}
          {step.key === "company" ? <CompanyStep onView={(t) => setViewer({ title: t, kind: "generic" })} /> : null}
          {step.key === "bank" ? <BankStep /> : null}
          {step.key === "tax" ? <TaxStep onView={(t) => setViewer({ title: t, kind: "generic" })} /> : null}
        </div>

        <footer className="h-12 px-4 flex items-center justify-between border-t border-border bg-surface">
          <button
            type="button"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success(`${step.label} saved as draft`)}
              className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
            >
              Save draft
            </button>
            {stepIdx < total - 1 ? (
              <button
                type="button"
                onClick={() => setStepIdx((i) => Math.min(total - 1, i + 1))}
                className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
              >
                Continue
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setStatusOpen(true);
                  toast.success("KYC submitted for review");
                }}
                className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Submit for review
              </button>
            )}
          </div>
        </footer>
      </section>

      <DocumentViewer viewer={viewer} onClose={() => setViewer(null)} />
      <ApprovalStatusDrawer open={statusOpen} onOpenChange={setStatusOpen} />
    </div>
  );
}

/* ---------- Steps ---------- */

function IdentityStep({ onView }: { onView: (title: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Legal full name"><Input placeholder="As printed on your ID" /></Field>
      <Field label="Date of birth"><Input type="date" /></Field>
      <Field label="Country of residence"><Input placeholder="Select country" /></Field>
      <Field label="Nationality"><Input placeholder="Select nationality" /></Field>
      <Field label="ID type">
        <select className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px]">
          <option>Passport</option>
          <option>National ID</option>
          <option>Driver&apos;s license</option>
        </select>
      </Field>
      <Field label="ID number"><Input placeholder="Document number" /></Field>
      <div className="md:col-span-2">
        <div className="grid gap-2 sm:grid-cols-3">
          <UploadTile label="ID front" onView={() => onView("ID front")} />
          <UploadTile label="ID back" onView={() => onView("ID back")} />
          <UploadTile label="Liveness selfie" onView={() => onView("Liveness selfie")} />
        </div>
      </div>
    </div>
  );
}

function SocialStep() {
  const platforms = [
    { icon: <Youtube className="h-3.5 w-3.5" />, name: "YouTube" },
    { icon: <UserIcon className="h-3.5 w-3.5" />, name: "Instagram" },
    { icon: <UserIcon className="h-3.5 w-3.5" />, name: "TikTok" },
    { icon: <Linkedin className="h-3.5 w-3.5" />, name: "LinkedIn" },
    { icon: <UserIcon className="h-3.5 w-3.5" />, name: "X" },
    { icon: <MessageSquare className="h-3.5 w-3.5" />, name: "Telegram" },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-dashed border-border bg-surface-muted/50 px-3 py-2 text-[12px] text-muted-foreground">
        Ownership is verified via OAuth handshake or a one-time verification code posted to the account bio.
      </div>
      <ul className="divide-y divide-border rounded-md border border-border bg-surface">
        {platforms.map((p) => (
          <li key={p.name} className="px-3 py-2.5 flex items-center gap-3">
            <span className="h-8 w-8 rounded-md bg-muted border border-border grid place-items-center text-muted-foreground">
              {p.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium text-foreground">{p.name}</div>
              <Input placeholder={`@handle on ${p.name}`} />
            </div>
            <button
              type="button"
              onClick={() => toast.success(`${p.name} verification code copied`)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px] font-medium"
            >
              <Copy className="h-3.5 w-3.5" />
              Get code
            </button>
            <StatusPill tone="neutral">Unverified</StatusPill>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanyStep({ onView }: { onView: (title: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Registration type">
        <select className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px]">
          <option>Individual / Sole proprietor</option>
          <option>Private limited</option>
          <option>LLP</option>
          <option>Company (Ltd)</option>
        </select>
      </Field>
      <Field label="Legal entity name"><Input placeholder="Registered name" /></Field>
      <Field label="Registration number"><Input placeholder="CIN / EIN / Reg #" /></Field>
      <Field label="Country of registration"><Input placeholder="Country" /></Field>
      <Field label="Registered address">
        <textarea rows={2} className="w-full px-2.5 py-2 rounded-md border border-border bg-background text-[13px] outline-none focus:border-ring" placeholder="Street, city, state, postal code" />
      </Field>
      <Field label="Business email"><Input type="email" placeholder="finance@company.com" /></Field>
      <div className="md:col-span-2 grid gap-2 sm:grid-cols-2">
        <UploadTile label="Certificate of incorporation" onView={() => onView("Certificate of incorporation")} />
        <UploadTile label="Address proof" onView={() => onView("Address proof")} />
      </div>
    </div>
  );
}

function BankStep() {
  const [method, setMethod] = useState("bank");
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1">Payout method</div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { k: "bank", l: "Bank" },
            { k: "upi", l: "UPI" },
            { k: "paypal", l: "PayPal" },
            { k: "wise", l: "Wise" },
          ].map((m) => (
            <button
              key={m.k}
              type="button"
              onClick={() => setMethod(m.k)}
              className={[
                "h-9 rounded-md border text-[12.5px] font-medium",
                method === m.k
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {m.l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Beneficiary name"><Input placeholder="As per bank records" /></Field>
        <Field label="Account currency"><Input placeholder="INR / USD / EUR" /></Field>
        {method === "bank" ? (
          <>
            <Field label="Account number"><Input placeholder="Account #" /></Field>
            <Field label="IFSC / SWIFT / IBAN"><Input placeholder="Routing code" /></Field>
            <Field label="Bank name"><Input placeholder="Bank" /></Field>
            <Field label="Branch address"><Input placeholder="Branch" /></Field>
          </>
        ) : null}
        {method === "upi" ? <Field label="UPI ID"><Input placeholder="name@bank" /></Field> : null}
        {method === "paypal" ? <Field label="PayPal email"><Input type="email" placeholder="paypal@email.com" /></Field> : null}
        {method === "wise" ? <Field label="Wise account email"><Input type="email" placeholder="wise@email.com" /></Field> : null}
      </div>
      <div className="rounded-md border border-warning/30 bg-warning/5 px-3 py-2 flex items-start gap-2 text-[12px]">
        <ShieldAlert className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
        A micro-deposit or name-match check runs before this destination is unlocked for payouts.
      </div>
    </div>
  );
}

function TaxStep({ onView }: { onView: (title: string) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Tax residency"><Input placeholder="Country" /></Field>
      <Field label="Tax identification number"><Input placeholder="PAN / EIN / VAT / TIN" /></Field>
      <Field label="GST / VAT registered">
        <select className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px]">
          <option>Not registered</option>
          <option>Registered</option>
        </select>
      </Field>
      <Field label="GST / VAT number"><Input placeholder="Registration number" /></Field>
      <Field label="Withholding form">
        <select className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px]">
          <option>W-9 (US person)</option>
          <option>W-8BEN (Non-US individual)</option>
          <option>W-8BEN-E (Non-US entity)</option>
          <option>Not applicable</option>
        </select>
      </Field>
      <Field label="Treaty benefits">
        <select className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px]">
          <option>Do not claim</option>
          <option>Claim treaty benefits</option>
        </select>
      </Field>
      <div className="md:col-span-2 grid gap-2 sm:grid-cols-2">
        <UploadTile label="Tax certificate" onView={() => onView("Tax certificate")} />
        <UploadTile label="Signed withholding form" onView={() => onView("Signed withholding form")} />
      </div>
    </div>
  );
}

/* ---------- Reusable primitives ---------- */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px] outline-none focus:border-ring focus:ring-1 focus:ring-ring/30"
    />
  );
}

function UploadTile({ label, onView }: { label: string; onView: () => void }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-3">
      <div className="flex items-center gap-2 text-[12px] font-medium text-foreground">
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">PDF, JPG or PNG · up to 10 MB</div>
      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => toast.success(`${label} upload dialog would open`)}
          className="h-7 px-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>
        <button
          type="button"
          onClick={onView}
          className="h-7 px-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
      </div>
    </div>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "bad" | "neutral";
  children: ReactNode;
}) {
  const cls =
    tone === "good"
      ? "bg-success/10 text-success border-success/20"
      : tone === "warn"
        ? "bg-warning/15 text-warning-foreground border-warning/30"
        : tone === "bad"
          ? "bg-destructive/10 text-destructive border-destructive/20"
          : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10.5px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

/* ---------- Document viewer ---------- */

function DocumentViewer({
  viewer,
  onClose,
}: {
  viewer: { title: string; kind: "id" | "generic" } | null;
  onClose: () => void;
}) {
  const open = !!viewer;
  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetPortal>
        <SheetOverlay className="bg-foreground/40" />
        <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-[560px] border-l border-border bg-surface shadow-xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="h-11 px-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="text-[13px] font-semibold">{viewer?.title ?? "Document"}</div>
              <span className="text-[11px] text-muted-foreground">Preview</span>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn label="Download" onClick={() => toast.success("Download queued")}><Download className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn label="Close" onClick={onClose}><X className="h-4 w-4" /></IconBtn>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-background p-5">
            <div className="mx-auto max-w-[420px] aspect-[1/1.4] rounded-md border border-border bg-surface shadow-sm grid place-items-center text-muted-foreground">
              <div className="text-center px-5">
                <FileText className="h-10 w-10 mx-auto opacity-50" />
                <div className="mt-2 text-[13px] font-semibold text-foreground">No document uploaded</div>
                <div className="mt-1 text-[12px]">
                  Once uploaded, the {viewer?.kind === "id" ? "identity document" : "document"} renders here with zoom, page navigation and download.
                </div>
              </div>
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

/* ---------- Approval status drawer ---------- */

function ApprovalStatusDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const items = [
    { label: "Identity", state: "pending" as const, hint: "Awaiting document upload" },
    { label: "Social", state: "pending" as const, hint: "0 of 6 handles verified" },
    { label: "Company", state: "pending" as const, hint: "Legal entity not submitted" },
    { label: "Bank", state: "pending" as const, hint: "Payout destination not set" },
    { label: "Tax", state: "pending" as const, hint: "Withholding form not signed" },
  ];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-foreground/40" />
        <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-[440px] border-l border-border bg-surface shadow-xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="h-11 px-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <div className="text-[13px] font-semibold">Approval status</div>
            </div>
            <IconBtn label="Close" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></IconBtn>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="rounded-md border border-border bg-surface-muted/40 p-3">
              <div className="text-[11.5px] uppercase tracking-wide font-medium text-muted-foreground">Overall</div>
              <div className="mt-1 flex items-center gap-2">
                <StatusPill tone="warn">In progress</StatusPill>
                <div className="text-[12px] text-muted-foreground">0 of 5 steps complete</div>
              </div>
              <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "0%" }} />
              </div>
            </div>
            <ul className="divide-y divide-border rounded-md border border-border bg-surface">
              {items.map((it) => (
                <li key={it.label} className="px-3 py-2.5 flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${it.state === "pending" ? "bg-warning" : "bg-success"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium text-foreground">{it.label}</div>
                    <div className="text-[11px] text-muted-foreground">{it.hint}</div>
                  </div>
                  <StatusPill tone="warn">Pending</StatusPill>
                </li>
              ))}
            </ul>
            <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-3 text-[12px] text-muted-foreground">
              Reviewers see this exact status when your submission enters the queue. Approvals typically clear within 24–72 hours.
            </div>
          </div>
          <div className="h-12 px-4 flex items-center justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => toast.success("Reviewer pinged")}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
            >
              <Clock className="h-3.5 w-3.5" />
              Ping reviewer
            </button>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

/* Retain imports for CheckCircle2 in future extension without lint noise */
void CheckCircle2;
