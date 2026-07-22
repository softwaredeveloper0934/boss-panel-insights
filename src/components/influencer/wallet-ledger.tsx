import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpRight,
  Banknote,
  Building2,
  Check,
  CircleDot,
  CreditCard,
  Download,
  Filter,
  Landmark,
  Loader2,
  History,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
  Wallet as WalletIcon,
  X,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { EmptySurface } from "@/components/influencer/wall-page";

const TABS = [
  { key: "ledger", label: "Transactions Ledger", icon: WalletIcon },
  { key: "methods", label: "Payout Methods", icon: CreditCard },
] as const;

type Tab = (typeof TABS)[number]["key"];

const COLUMNS = ["Date", "Reference", "Type", "Description", "Method", "Currency", "Amount", "Balance", "Status"];

export function WalletLedger() {
  const [tab, setTab] = useState<Tab>("ledger");
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="border-b border-border bg-surface-muted/40">
          <div className="flex items-center px-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={[
                    "shrink-0 px-3 h-10 inline-flex items-center gap-1.5 text-[12.5px] font-medium border-b-2 -mb-px",
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          {tab === "ledger" ? <LedgerPanel onOpenDetail={() => setDetailOpen(true)} /> : <MethodsPanel />}
        </div>
      </div>

      <TransactionDetailDrawer open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}

/* ------------------------------- Ledger ------------------------------- */

function LedgerPanel({ onOpenDetail }: { onOpenDetail: () => void }) {
  const chips = ["Date range", "Type", "Direction", "Method", "Currency", "Status", "Amount"];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-[240px] h-8 px-2.5 rounded-md border border-border bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search by reference, description, method…"
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        {chips.map((c) => (
          <button
            key={c}
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
          >
            <Filter className="h-3.5 w-3.5" />
            {c}
          </button>
        ))}
        <button className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted ml-auto">
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
          <div className="text-[12.5px] font-semibold">Wallet transactions</div>
          <button
            onClick={onOpenDetail}
            className="h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[11.5px] inline-flex items-center gap-1.5"
          >
            Open sample detail
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
                <th className="w-8 py-2 pl-4"><input type="checkbox" className="h-3.5 w-3.5" /></th>
                {COLUMNS.map((c) => (
                  <th key={c} className="py-2 px-3 font-medium text-[11.5px] uppercase tracking-wide whitespace-nowrap">
                    {c}
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={COLUMNS.length + 2}>
                  <EmptySurface
                    title="No wallet activity"
                    description="Credits from commission, debits from payouts, holds and reversals will appear as searchable rows here."
                    primaryAction="Request Payout"
                    scope="wallet"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Transaction detail -------------------------- */

function TransactionDetailDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-background border-l border-border shadow-2xl flex flex-col outline-none">
          <DialogContent asChild>
            <div className="flex flex-col h-full">
              <div className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3">
                <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">
                  <ArrowDownToLine className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">Transaction detail</div>
                  <div className="text-[11.5px] text-muted-foreground">Reference · —</div>
                </div>
                <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="text-[11.5px] uppercase tracking-wide text-muted-foreground">Amount</div>
                  <div className="mt-1 text-[22px] font-semibold tabular-nums">—</div>
                  <div className="mt-1 text-[11.5px] text-muted-foreground">Currency & FX will show once wired</div>
                </div>

                <dl className="rounded-md border border-border bg-surface divide-y divide-border">
                  {[
                    ["Type", "—"],
                    ["Direction", "—"],
                    ["Method", "—"],
                    ["Status", "—"],
                    ["Initiated", "—"],
                    ["Settled", "—"],
                    ["Fee", "—"],
                    ["Net", "—"],
                    ["Related entity", "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2 text-[12.5px]">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="text-[12.5px] font-semibold mb-2">Timeline</div>
                  <ol className="relative pl-4 space-y-2">
                    <span className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
                    {["Created", "Approved", "Sent to processor", "Settled"].map((s) => (
                      <li key={s} className="relative">
                        <span className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-muted-foreground/40" />
                        <div className="text-[12px]">{s}</div>
                        <div className="text-[11px] text-muted-foreground">—</div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="border-t border-border bg-surface p-3 flex items-center justify-end gap-2">
                <button onClick={onClose} className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">
                  Close
                </button>
                <button onClick={() => toast.message("Download receipt")} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] inline-flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Receipt
                </button>
              </div>
            </div>
          </DialogContent>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/* -------------------------- Payout methods -------------------------- */

type MethodKey = "bank" | "upi" | "paypal" | "wise" | "payoneer" | "card";
type MethodStatus = "not_configured" | "pending" | "verified" | "failed";

type AuditEntry = {
  id: string;
  at: string;
  method: MethodKey;
  methodLabel: string;
  actor: string;
  action:
    | "status_changed"
    | "primary_set"
    | "primary_replaced"
    | "verification_submitted"
    | "verification_failed";
  fromStatus?: MethodStatus;
  toStatus?: MethodStatus;
  note?: string;
};


type MethodTemplate = {
  key: MethodKey;
  label: string;
  hint: string;
  icon: React.ReactNode;
  requirements: string[];
};

const METHOD_TEMPLATES: MethodTemplate[] = [
  {
    key: "bank",
    label: "Bank account",
    hint: "Wire / ACH / SEPA / NEFT",
    icon: <Landmark className="h-4 w-4" />,
    requirements: [
      "Account holder name matches KYC",
      "Bank account or IBAN number",
      "Routing / IFSC / SWIFT code",
      "Proof of account (voided cheque or statement)",
      "Micro-deposit verification confirmed",
    ],
  },
  {
    key: "upi",
    label: "UPI",
    hint: "India — VPA linked payouts",
    icon: <Smartphone className="h-4 w-4" />,
    requirements: [
      "Verified VPA handle (name@bank)",
      "PAN linked to VPA",
      "One-time ₹1 name-match verification",
    ],
  },
  {
    key: "paypal",
    label: "PayPal",
    hint: "Global email-based transfer",
    icon: <Building2 className="h-4 w-4" />,
    requirements: [
      "Verified PayPal email",
      "Business or Premier account type",
      "Currency preference set",
    ],
  },
  {
    key: "wise",
    label: "Wise",
    hint: "Multi-currency borderless",
    icon: <ArrowUpRight className="h-4 w-4" />,
    requirements: [
      "Wise account ID",
      "Recipient currency & country",
      "Wise identity verified",
    ],
  },
  {
    key: "payoneer",
    label: "Payoneer",
    hint: "Marketplace-friendly",
    icon: <Banknote className="h-4 w-4" />,
    requirements: [
      "Payoneer customer ID",
      "Approved receiving account",
      "Tax form (W-8/W-9) submitted",
    ],
  },
  {
    key: "card",
    label: "Card / debit rail",
    hint: "Instant push where supported",
    icon: <CreditCard className="h-4 w-4" />,
    requirements: [
      "Debit card number & expiry",
      "Cardholder name matches KYC",
      "Issuer supports push-to-card",
    ],
  },
];

function StatusChip({ status }: { status: MethodStatus }) {
  if (status === "verified") {
    return (
      <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400">
        <ShieldCheck className="h-3 w-3" /> Verified
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Pending verification
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400">
        <XCircle className="h-3 w-3" /> Verification failed
      </span>
    );
  }
  return (
    <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium bg-muted text-muted-foreground border border-border">
      <CircleDot className="h-3 w-3" /> Not configured
    </span>
  );
}

function MethodsPanel() {
  const [statuses, setStatuses] = useState<Record<MethodKey, MethodStatus>>(() =>
    METHOD_TEMPLATES.reduce((acc, t) => ({ ...acc, [t.key]: "not_configured" as MethodStatus }), {} as Record<MethodKey, MethodStatus>),
  );
  const [primary, setPrimary] = useState<MethodKey | null>(null);
  const [verifyFor, setVerifyFor] = useState<MethodTemplate | null>(null);
  const [confirmPrimary, setConfirmPrimary] = useState<MethodTemplate | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [auditOpen, setAuditOpen] = useState(false);

  function addAudit(entry: Omit<AuditEntry, "id" | "at">) {
    setAudit((a) => [
      { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString() },
      ...a,
    ]);
  }

  const verifiedCount = useMemo(
    () => Object.values(statuses).filter((s) => s === "verified").length,
    [statuses],
  );


  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold">Payout methods</div>
          <p className="text-[12px] text-muted-foreground mt-0.5 max-w-2xl">
            Add and verify the destinations that receive settled commission. The primary method is used for automatic payouts.
          </p>
          <div className="mt-1.5 text-[11.5px] text-muted-foreground">
            {verifiedCount} verified · {primary ? `Primary: ${METHOD_TEMPLATES.find((t) => t.key === primary)?.label}` : "No primary set"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAuditOpen(true)}
            className="h-8 px-2.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] inline-flex items-center gap-1.5 relative"
          >
            <History className="h-3.5 w-3.5" /> Audit trail
            {audit.length ? (
              <span className="ml-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold tabular-nums grid place-items-center">
                {audit.length}
              </span>
            ) : null}
          </button>
          <button
            onClick={() => toast.message("Add payout method")}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] inline-flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add method
          </button>
        </div>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {METHOD_TEMPLATES.map((t) => {
          const status = statuses[t.key];
          const isPrimary = primary === t.key;
          const canBePrimary = status === "verified";
          return (
            <article key={t.key} className="rounded-md border border-border bg-surface p-3">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">{t.icon}</div>
                  <div>
                    <div className="text-[12.5px] font-semibold flex items-center gap-1.5">
                      {t.label}
                      {isPrimary ? (
                        <span className="h-4 px-1 inline-flex items-center gap-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                          <Star className="h-2.5 w-2.5 fill-current" /> Primary
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{t.hint}</div>
                  </div>
                </div>
                <button className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </header>
              <div className="mt-3 flex items-center gap-1.5">
                <StatusChip status={status} />
              </div>
              <footer className="mt-3 flex items-center justify-between text-[11.5px]">
                <button
                  disabled={!canBePrimary || isPrimary}
                  onClick={() => setConfirmPrimary(t)}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Star className="h-3 w-3" /> {isPrimary ? "Primary" : "Set primary"}
                </button>
                <button
                  onClick={() => setVerifyFor(t)}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {status === "verified" ? (
                    <>
                      <ShieldCheck className="h-3 w-3" /> Review
                    </>
                  ) : status === "failed" ? (
                    <>
                      <AlertTriangle className="h-3 w-3" /> Retry
                    </>
                  ) : status === "pending" ? (
                    <>
                      <Loader2 className="h-3 w-3" /> Continue
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3" /> Connect & verify
                    </>
                  )}
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-4 text-[12px] text-muted-foreground flex items-center gap-2">
        <Trash2 className="h-3.5 w-3.5" /> Removing a primary method requires a replacement to be set first.
      </div>

      <VerificationDrawer
        method={verifyFor}
        status={verifyFor ? statuses[verifyFor.key] : "not_configured"}
        onClose={() => setVerifyFor(null)}
        onSubmit={(next) => {
          if (!verifyFor) return;
          const prev = statuses[verifyFor.key];
          setStatuses((s) => ({ ...s, [verifyFor.key]: next }));
          addAudit({
            method: verifyFor.key,
            methodLabel: verifyFor.label,
            actor: "You",
            action:
              next === "failed"
                ? "verification_failed"
                : next === "verified"
                  ? "status_changed"
                  : "verification_submitted",
            fromStatus: prev,
            toStatus: next,
            note:
              next === "verified"
                ? "All requirements checklist items confirmed"
                : next === "failed"
                  ? "Simulated compliance rejection"
                  : "Submitted for automated review",
          });
          toast.success(
            next === "verified"
              ? `${verifyFor.label} verified`
              : next === "pending"
                ? `${verifyFor.label} submitted for verification`
                : `${verifyFor.label} verification failed`,
          );
          setVerifyFor(null);
        }}
      />

      <PrimaryConfirmDialog
        method={confirmPrimary}
        currentPrimaryLabel={primary ? METHOD_TEMPLATES.find((t) => t.key === primary)?.label ?? null : null}
        onCancel={() => setConfirmPrimary(null)}
        onConfirm={() => {
          if (!confirmPrimary) return;
          const previousPrimaryLabel = primary
            ? METHOD_TEMPLATES.find((t) => t.key === primary)?.label ?? null
            : null;
          setPrimary(confirmPrimary.key);
          addAudit({
            method: confirmPrimary.key,
            methodLabel: confirmPrimary.label,
            actor: "You",
            action: previousPrimaryLabel ? "primary_replaced" : "primary_set",
            note: previousPrimaryLabel
              ? `Replaced previous primary: ${previousPrimaryLabel}`
              : "First primary payout method configured",
          });
          toast.success(`${confirmPrimary.label} is now the primary payout method`);
          setConfirmPrimary(null);
        }}
      />

      <AuditTrailDrawer
        open={auditOpen}
        entries={audit}
        onClose={() => setAuditOpen(false)}
      />
    </div>
  );
}


/* ------------------------- Verification drawer ------------------------- */

function VerificationDrawer({
  method,
  status,
  onClose,
  onSubmit,
}: {
  method: MethodTemplate | null;
  status: MethodStatus;
  onClose: () => void;
  onSubmit: (next: MethodStatus) => void;
}) {
  const open = !!method;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allChecked = method ? method.requirements.every((r) => checked[r]) : false;

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-background border-l border-border shadow-2xl flex flex-col outline-none">
          <DialogContent asChild>
            <div className="flex flex-col h-full">
              <div className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3">
                <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">
                  {method?.icon ?? <ShieldCheck className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">
                    Verify {method?.label ?? "payout method"}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">{method?.hint}</div>
                </div>
                <StatusChip status={status} />
                <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="text-[12.5px] font-semibold">Required fields checklist</div>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">
                    Complete every requirement before submitting for verification. Missing items block payout eligibility.
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {method?.requirements.map((r) => {
                      const done = !!checked[r];
                      return (
                        <li key={r}>
                          <label className="flex items-start gap-2 text-[12.5px] cursor-pointer select-none">
                            <button
                              type="button"
                              onClick={() => setChecked((c) => ({ ...c, [r]: !c[r] }))}
                              className={[
                                "mt-0.5 h-4 w-4 rounded border grid place-items-center shrink-0",
                                done
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-border",
                              ].join(" ")}
                              aria-pressed={done}
                              aria-label={r}
                            >
                              {done ? <Check className="h-3 w-3" /> : null}
                            </button>
                            <span className={done ? "" : "text-muted-foreground"}>{r}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="rounded-md border border-border bg-surface p-4">
                  <div className="text-[12.5px] font-semibold mb-2">Verification steps</div>
                  <ol className="relative pl-4 space-y-2 text-[12px]">
                    <span className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
                    {["Submit details", "Automated compliance checks", "Micro-deposit / OTP match", "Manual review (if flagged)", "Enabled for payouts"].map((s) => (
                      <li key={s} className="relative">
                        <span className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-muted-foreground/40" />
                        <div>{s}</div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-3 text-[11.5px] text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Verification typically completes within 1–2 business days. You'll be notified once the method is enabled for payouts.
                </div>
              </div>

              <div className="border-t border-border bg-surface p-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSubmit("failed")}
                  className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] text-muted-foreground"
                >
                  Simulate failure
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={onClose} className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">
                    Close
                  </button>
                  <button
                    disabled={!allChecked}
                    onClick={() => onSubmit("verified")}
                    className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Submit for verification
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/* ------------------------ Primary confirm modal ------------------------ */

function PrimaryConfirmDialog({
  method,
  currentPrimaryLabel,
  onCancel,
  onConfirm,
}: {
  method: MethodTemplate | null;
  currentPrimaryLabel: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const open = !!method;
  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onCancel() : null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[15px]">
            <Star className="h-4 w-4 fill-current text-primary" />
            Set as primary payout method?
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            All future automatic payouts will be sent to <strong className="text-foreground">{method?.label}</strong>.
            {currentPrimaryLabel ? (
              <>
                {" "}This replaces the current primary method (<strong className="text-foreground">{currentPrimaryLabel}</strong>).
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <ul className="rounded-md border border-border bg-surface divide-y divide-border text-[12.5px]">
          <li className="flex items-center justify-between px-3 py-2">
            <span className="text-muted-foreground">Method</span>
            <span className="font-medium">{method?.label}</span>
          </li>
          <li className="flex items-center justify-between px-3 py-2">
            <span className="text-muted-foreground">Status</span>
            <StatusChip status="verified" />
          </li>
          <li className="flex items-center justify-between px-3 py-2">
            <span className="text-muted-foreground">Effective</span>
            <span className="font-medium">Immediately</span>
          </li>
        </ul>

        <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-3 text-[11.5px] text-muted-foreground flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          Any pending payout requests already in flight will continue to their originally selected destination.
        </div>

        <DialogFooter>
          <button onClick={onCancel} className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] inline-flex items-center gap-1.5"
          >
            <Star className="h-3.5 w-3.5 fill-current" /> Confirm primary
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- Audit trail drawer ------------------------- */

function actionLabel(a: AuditEntry["action"]): string {
  switch (a) {
    case "status_changed":
      return "Status changed";
    case "primary_set":
      return "Primary set";
    case "primary_replaced":
      return "Primary replaced";
    case "verification_submitted":
      return "Verification submitted";
    case "verification_failed":
      return "Verification failed";
  }
}

function statusText(s?: MethodStatus): string {
  if (!s) return "—";
  if (s === "not_configured") return "Not configured";
  if (s === "pending") return "Pending";
  if (s === "verified") return "Verified";
  return "Failed";
}

function AuditTrailDrawer({
  open,
  entries,
  onClose,
}: {
  open: boolean;
  entries: AuditEntry[];
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-background border-l border-border shadow-2xl flex flex-col outline-none">
          <DialogContent asChild>
            <div className="flex flex-col h-full">
              <div className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3">
                <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">
                  <History className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">Payout methods audit trail</div>
                  <div className="text-[11.5px] text-muted-foreground">
                    Who verified what, when it changed, and the previous status
                  </div>
                </div>
                <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {entries.length === 0 ? (
                  <EmptySurface
                    title="No changes yet"
                    description="Verifications, primary switches and failed attempts on every payout method will be recorded here."
                    scope="payout methods audit"
                  />
                ) : (
                  <ol className="p-3 space-y-2">
                    {entries.map((e) => {
                      const isFailure = e.action === "verification_failed";
                      const isPrimary = e.action === "primary_set" || e.action === "primary_replaced";
                      return (
                        <li
                          key={e.id}
                          className={[
                            "rounded-md border p-3 text-[12px] bg-surface",
                            isFailure ? "border-red-500/30" : "border-border",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2">
                            {isFailure ? (
                              <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400">
                                <XCircle className="h-3 w-3" /> {actionLabel(e.action)}
                              </span>
                            ) : isPrimary ? (
                              <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-primary/10 text-primary border-primary/20">
                                <Star className="h-3 w-3 fill-current" /> {actionLabel(e.action)}
                              </span>
                            ) : (
                              <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-muted text-muted-foreground border-border">
                                <ShieldCheck className="h-3 w-3" /> {actionLabel(e.action)}
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
                              {new Date(e.at).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="mt-1.5 font-medium truncate">{e.methodLabel}</div>
                          <dl className="mt-1.5 grid grid-cols-[92px_1fr] gap-y-1 text-[11.5px]">
                            <dt className="text-muted-foreground">Actor</dt>
                            <dd className="font-medium">{e.actor}</dd>
                            {e.fromStatus || e.toStatus ? (
                              <>
                                <dt className="text-muted-foreground">Previous</dt>
                                <dd>{statusText(e.fromStatus)}</dd>
                                <dt className="text-muted-foreground">New</dt>
                                <dd className="font-medium">{statusText(e.toStatus)}</dd>
                              </>
                            ) : null}
                            {e.note ? (
                              <>
                                <dt className="text-muted-foreground">Note</dt>
                                <dd className="text-muted-foreground">{e.note}</dd>
                              </>
                            ) : null}
                          </dl>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>

              <div className="border-t border-border bg-surface p-3 flex items-center justify-between gap-2">
                <div className="text-[11.5px] text-muted-foreground">
                  {entries.length} event{entries.length === 1 ? "" : "s"} recorded this session
                </div>
                <button onClick={onClose} className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
