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

function MethodsPanel() {
  const templates = [
    { icon: <Landmark className="h-4 w-4" />, label: "Bank account", hint: "Wire / ACH / SEPA / NEFT" },
    { icon: <Smartphone className="h-4 w-4" />, label: "UPI", hint: "India — VPA linked payouts" },
    { icon: <Building2 className="h-4 w-4" />, label: "PayPal", hint: "Global email-based transfer" },
    { icon: <ArrowUpRight className="h-4 w-4" />, label: "Wise", hint: "Multi-currency borderless" },
    { icon: <Banknote className="h-4 w-4" />, label: "Payoneer", hint: "Marketplace-friendly" },
    { icon: <CreditCard className="h-4 w-4" />, label: "Card / debit rail", hint: "Instant push where supported" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-surface p-4 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold">Payout methods</div>
          <p className="text-[12px] text-muted-foreground mt-0.5 max-w-2xl">
            Add and verify the destinations that receive settled commission. Primary method is used for automatic payouts.
          </p>
        </div>
        <button onClick={() => toast.message("Add payout method")} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] inline-flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add method
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((t) => (
          <article key={t.label} className="rounded-md border border-border bg-surface p-3">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">{t.icon}</div>
                <div>
                  <div className="text-[12.5px] font-semibold">{t.label}</div>
                  <div className="text-[11px] text-muted-foreground">{t.hint}</div>
                </div>
              </div>
              <button className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </header>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="h-5 px-1.5 inline-flex items-center rounded text-[10.5px] font-medium bg-muted text-muted-foreground border border-border">
                Not configured
              </span>
            </div>
            <footer className="mt-3 flex items-center justify-between text-[11.5px]">
              <button className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <Star className="h-3 w-3" /> Set primary
              </button>
              <button onClick={() => toast.message("Connect " + t.label)} className="text-primary hover:underline inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> Connect
              </button>
            </footer>
          </article>
        ))}
      </div>

      <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-4 text-[12px] text-muted-foreground flex items-center gap-2">
        <Trash2 className="h-3.5 w-3.5" /> Removing a primary method requires a replacement to be set first.
      </div>
    </div>
  );
}
