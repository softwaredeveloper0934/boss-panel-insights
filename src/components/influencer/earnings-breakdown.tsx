import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Award,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  Filter,
  Gift,
  Landmark,
  Percent,
  Printer,
  Receipt,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Wallet as WalletIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const TABS = [
  { key: "overview", label: "Overview", icon: TrendingUp },
  { key: "commission", label: "Commission", icon: Percent },
  { key: "incentives", label: "Incentives & Bonuses", icon: Award },
  { key: "pending-paid", label: "Pending vs Paid", icon: Clock },
  { key: "requests", label: "Payout Requests", icon: Banknote },
  { key: "invoices", label: "Invoices", icon: Receipt },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function EarningsBreakdown() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <div className="space-y-4">
      <EarningsHero onRequest={() => setRequestOpen(true)} onInvoice={() => setInvoiceOpen(true)} />

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="border-b border-border bg-surface-muted/40 overflow-x-auto no-scrollbar">
          <div className="flex items-center px-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    "shrink-0 px-3 h-10 inline-flex items-center gap-1.5 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
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
          {tab === "overview" ? <OverviewPanel /> : null}
          {tab === "commission" ? <CommissionPanel /> : null}
          {tab === "incentives" ? <IncentivesPanel /> : null}
          {tab === "pending-paid" ? <PendingPaidPanel /> : null}
          {tab === "requests" ? <PayoutRequestsPanel onNew={() => setRequestOpen(true)} /> : null}
          {tab === "invoices" ? <InvoicesPanel onPreview={() => setInvoiceOpen(true)} /> : null}
        </div>
      </div>

      <InvoicePreviewDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} />
      <PayoutRequestDialog open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
}

/* ---------- Hero ---------- */

function EarningsHero({ onRequest, onInvoice }: { onRequest: () => void; onInvoice: () => void }) {
  return (
    <section className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
        <div className="p-5 border-b md:border-b-0 md:border-r border-border">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            <WalletIcon className="h-3.5 w-3.5" />
            Available balance
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[30px] font-semibold text-foreground tabular-nums leading-none">—</span>
            <span className="text-[13px] text-muted-foreground">across 0 currencies</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11.5px]">
            <MiniStat label="On hold" value="—" tone="warn" />
            <MiniStat label="Reserved" value="—" tone="neutral" />
            <MiniStat label="Cleared this cycle" value="—" tone="good" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRequest}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              Request payout
            </button>
            <button
              type="button"
              onClick={onInvoice}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
            >
              <Receipt className="h-3.5 w-3.5" />
              Preview invoice
            </button>
            <button
              type="button"
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Export ledger
            </button>
          </div>
        </div>

        <div className="p-5 bg-surface-muted/40">
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
            Earnings composition · trailing 90 days
          </div>
          <div className="mt-3 space-y-2.5">
            <CompositionBar label="Commission" pct={0} tone="primary" />
            <CompositionBar label="Incentives" pct={0} tone="success" />
            <CompositionBar label="Bonuses" pct={0} tone="warn" />
            <CompositionBar label="Adjustments" pct={0} tone="muted" />
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground">
            Composition renders once ledger entries are attributed by source.
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
}) {
  const cls =
    tone === "good"
      ? "text-success"
      : tone === "warn"
        ? "text-warning"
        : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-surface-muted/40 px-2.5 py-2">
      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-[15px] font-semibold tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}

function CompositionBar({
  label,
  pct,
  tone,
}: {
  label: string;
  pct: number;
  tone: "primary" | "success" | "warn" | "muted";
}) {
  const bg =
    tone === "primary"
      ? "bg-primary"
      : tone === "success"
        ? "bg-success"
        : tone === "warn"
          ? "bg-warning"
          : "bg-muted-foreground/40";
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${bg}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------- Panels ---------- */

function OverviewPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard title="Earnings by source" icon={<TrendingUp className="h-3.5 w-3.5" />}>
        <RowList
          rows={[
            { label: "Referral links", value: "—", hint: "Personal URLs" },
            { label: "Affiliate links", value: "—", hint: "Partner links" },
            { label: "Coupons", value: "—", hint: "Discount codes" },
            { label: "Campaign fixed fee", value: "—", hint: "Delivered briefs" },
            { label: "Marketplace", value: "—", hint: "Featured placements" },
          ]}
        />
      </BreakdownCard>

      <BreakdownCard title="Payout status" icon={<Clock className="h-3.5 w-3.5" />}>
        <RowList
          rows={[
            { label: "Pending review", value: "—", hint: "Awaiting approval" },
            { label: "Approved", value: "—", hint: "Cleared to pay" },
            { label: "Scheduled", value: "—", hint: "In next batch" },
            { label: "Paid (MTD)", value: "—", hint: "This month" },
            { label: "Failed / returned", value: "—", hint: "Needs retry" },
          ]}
        />
      </BreakdownCard>

      <BreakdownCard title="Monthly trend" icon={<Calendar className="h-3.5 w-3.5" />}>
        <TrendLine />
      </BreakdownCard>

      <BreakdownCard title="Currency split" icon={<Landmark className="h-3.5 w-3.5" />}>
        <RowList
          rows={[
            { label: "INR", value: "—" },
            { label: "USD", value: "—" },
            { label: "EUR", value: "—" },
            { label: "GBP", value: "—" },
          ]}
        />
      </BreakdownCard>
    </div>
  );
}

function CommissionPanel() {
  return (
    <div className="space-y-3">
      <LedgerTable
        title="Commission ledger"
        columns={["Date", "Source", "Reference", "Gross", "Rate", "Commission", "Currency", "Status"]}
        emptyTitle="No commission entries yet"
        emptyBody="Sales attributed to your referral or affiliate links will accrue commission here."
      />
    </div>
  );
}

function IncentivesPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <LedgerTable
        title="Bonuses & incentives"
        columns={["Awarded", "Program", "Trigger", "Amount", "Currency", "Cleared on", "Status"]}
        emptyTitle="No incentives issued"
        emptyBody="Milestone bonuses, tier upgrades and campaign incentives will list here as they are awarded."
      />

      <aside className="rounded-md border border-border bg-surface p-3 space-y-3">
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-warning" />
          Active programs
        </div>
        {[
          { icon: <Award className="h-3.5 w-3.5" />, label: "Tier progression", body: "Higher tier unlocks a higher default commission rate." },
          { icon: <Gift className="h-3.5 w-3.5" />, label: "Campaign bonuses", body: "One-time bonuses on qualifying campaign deliverables." },
          { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Volume incentives", body: "Cumulative-volume brackets applied at cycle close." },
        ].map((p) => (
          <div key={p.label} className="rounded-md border border-border bg-surface-muted/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
              <span className="text-muted-foreground">{p.icon}</span>
              {p.label}
            </div>
            <div className="mt-0.5 text-[11.5px] text-muted-foreground">{p.body}</div>
          </div>
        ))}
      </aside>
    </div>
  );
}

function PendingPaidPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PillCard tone="warn" icon={<Clock className="h-3.5 w-3.5" />} label="Pending review" value="—" hint="Awaiting approver" />
        <PillCard tone="neutral" icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Approved" value="—" hint="Not yet released" />
        <PillCard tone="primary" icon={<Send className="h-3.5 w-3.5" />} label="Scheduled" value="—" hint="Next batch" />
        <PillCard tone="good" icon={<Banknote className="h-3.5 w-3.5" />} label="Paid" value="—" hint="Trailing 30 days" />
      </div>

      <LedgerTable
        title="Pending vs paid ledger"
        columns={["Date", "Source", "Reference", "Amount", "Currency", "Method", "Status", "Settled"]}
        emptyTitle="No transactions to reconcile"
        emptyBody="Each earned amount moves from Pending → Approved → Scheduled → Paid and is tracked here."
      />
    </div>
  );
}

function PayoutRequestsPanel({ onNew }: { onNew: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-muted/40 p-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-[220px] h-8 px-2.5 rounded-md border border-border bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search requests by ID, method or status…"
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        {["Method", "Status", "Currency", "Date"].map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
          >
            <Filter className="h-3.5 w-3.5" />
            {c}
          </button>
        ))}
        <button
          type="button"
          onClick={onNew}
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
          New payout request
        </button>
      </div>

      <LedgerTable
        title="Payout requests"
        columns={["Requested", "Amount", "Currency", "Method", "Destination", "Approver", "Settled", "Status"]}
        emptyTitle="No payout requests yet"
        emptyBody="Requests you submit will appear here with approver, settlement and audit trail."
      />
    </div>
  );
}

function InvoicesPanel({ onPreview }: { onPreview: () => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-dashed border-border bg-surface-muted/40 px-3 py-2 flex items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          Invoices auto-generate at each payout cycle. Preview the layout below.
        </div>
        <button
          type="button"
          onClick={onPreview}
          className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
        >
          <Receipt className="h-3.5 w-3.5" />
          Preview invoice
        </button>
      </div>

      <LedgerTable
        title="Invoices"
        columns={["Number", "Issued", "Period", "Amount", "Currency", "Tax", "Status"]}
        emptyTitle="No invoices generated"
        emptyBody="Invoices are stamped when a payout batch settles and are downloadable as PDF."
      />
    </div>
  );
}

/* ---------- Building blocks ---------- */

function BreakdownCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="h-9 px-3 flex items-center gap-1.5 border-b border-border">
        <span className="text-muted-foreground">{icon}</span>
        <h4 className="text-[11.5px] font-semibold uppercase tracking-wide text-foreground">{title}</h4>
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

function RowList({ rows }: { rows: { label: string; value: string; hint?: string }[] }) {
  return (
    <ul className="divide-y divide-border -my-2">
      {rows.map((r) => (
        <li key={r.label} className="py-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[12.5px] text-foreground truncate">{r.label}</div>
            {r.hint ? <div className="text-[11px] text-muted-foreground truncate">{r.hint}</div> : null}
          </div>
          <div className="text-[13px] font-semibold text-foreground tabular-nums">{r.value}</div>
        </li>
      ))}
    </ul>
  );
}

function TrendLine() {
  return (
    <div>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-24 text-primary">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeDasharray="2 3"
          strokeWidth="1.2"
          points="0,22 10,20 20,21 30,18 40,17 50,15 60,16 70,13 80,14 90,11 100,12"
        />
      </svg>
      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="mt-1 text-[11.5px] text-muted-foreground">Line renders when monthly totals are available.</div>
    </div>
  );
}

function PillCard({
  tone,
  icon,
  label,
  value,
  hint,
}: {
  tone: "good" | "warn" | "primary" | "neutral";
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  const cls =
    tone === "good"
      ? "border-success/30 bg-success/5"
      : tone === "warn"
        ? "border-warning/30 bg-warning/5"
        : tone === "primary"
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-surface";
  return (
    <div className={`rounded-md border ${cls} p-3`}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <span className="text-foreground">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-[20px] font-semibold text-foreground tabular-nums leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function LedgerTable({
  title,
  columns,
  emptyTitle,
  emptyBody,
}: {
  title: string;
  columns: string[];
  emptyTitle: string;
  emptyBody: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-surface-muted">
        <div className="text-[12.5px] font-semibold text-foreground">{title}</div>
        <div className="text-[11.5px] text-muted-foreground">0 records</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
              {columns.map((c) => (
                <th key={c} className="py-2 px-3 font-medium text-[11px] uppercase tracking-wide whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="text-[13px] font-semibold text-foreground">{emptyTitle}</div>
                <div className="mt-1 text-[12px] text-muted-foreground max-w-md mx-auto">{emptyBody}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Invoice preview modal ---------- */

export function InvoicePreviewDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-foreground/40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(720px,calc(100vw-2rem))] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface shadow-xl overflow-hidden flex flex-col">
          <div className="h-11 px-4 flex items-center justify-between border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <div className="text-[13px] font-semibold text-foreground">Invoice preview</div>
              <span className="text-[11px] text-muted-foreground">Template — not a real invoice</span>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn label="Copy invoice number" onClick={() => toast.success("Copied placeholder invoice number")}>
                <Copy className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Print" onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Download PDF" onClick={() => toast.success("PDF export queued")}>
                <Download className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Close" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-background p-6">
            <div className="mx-auto max-w-[640px] rounded-md border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Invoice</div>
                  <div className="text-[22px] font-semibold text-foreground">INV-—</div>
                  <div className="text-[11.5px] text-muted-foreground mt-1">Issued —  ·  Due —</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-foreground">Software Vala</div>
                  <div className="text-[11.5px] text-muted-foreground">Boss Panel · Influencer Manager</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-b border-border">
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Billed to</div>
                  <div className="mt-1 text-[13px] font-medium text-foreground">Creator name</div>
                  <div className="text-[11.5px] text-muted-foreground">Legal entity · Country</div>
                  <div className="text-[11.5px] text-muted-foreground">Tax ID —</div>
                </div>
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Payout to</div>
                  <div className="mt-1 text-[13px] font-medium text-foreground">Method —</div>
                  <div className="text-[11.5px] text-muted-foreground">Account —</div>
                  <div className="text-[11.5px] text-muted-foreground">Currency —</div>
                </div>
              </div>

              <table className="w-full text-[12.5px] mt-1">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 font-medium text-[11px] uppercase tracking-wide">Description</th>
                    <th className="py-2 font-medium text-[11px] uppercase tracking-wide text-right">Qty</th>
                    <th className="py-2 font-medium text-[11px] uppercase tracking-wide text-right">Rate</th>
                    <th className="py-2 font-medium text-[11px] uppercase tracking-wide text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {["Commission — referrals", "Commission — affiliate", "Campaign incentives", "Adjustments"].map((row) => (
                    <tr key={row} className="border-b border-border/60">
                      <td className="py-2 text-foreground">{row}</td>
                      <td className="py-2 text-right text-muted-foreground tabular-nums">—</td>
                      <td className="py-2 text-right text-muted-foreground tabular-nums">—</td>
                      <td className="py-2 text-right text-foreground tabular-nums">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 ml-auto w-full max-w-[240px] text-[12.5px] space-y-1">
                <Row label="Subtotal" value="—" />
                <Row label="Tax" value="—" />
                <Row label="Adjustments" value="—" />
                <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-foreground">Total</span>
                  <span className="text-[15px] font-semibold text-foreground tabular-nums">—</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border text-[11px] text-muted-foreground">
                This preview illustrates the invoice layout. Real values populate at each settled payout cycle.
              </div>
            </div>
          </div>

          <div className="h-12 px-4 flex items-center justify-end gap-2 border-t border-border bg-surface">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => toast.success("Invoice PDF queued")}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground tabular-nums">{value}</span>
    </div>
  );
}

/* ---------- Payout request modal ---------- */

function PayoutRequestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [method, setMethod] = useState("bank");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-foreground/40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface shadow-xl overflow-hidden">
          <div className="h-11 px-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
              <div className="text-[13px] font-semibold">Request payout</div>
            </div>
            <IconBtn label="Close" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </IconBtn>
          </div>
          <div className="p-4 space-y-4">
            <FieldRow label="Amount">
              <input
                type="text"
                placeholder="0.00"
                className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px] outline-none focus:border-ring"
              />
            </FieldRow>
            <FieldRow label="Currency">
              <select className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-[13px]">
                <option>Select currency</option>
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </FieldRow>
            <FieldRow label="Method">
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
                      "h-8 rounded-md border text-[12px] font-medium",
                      method === m.k
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {m.l}
                  </button>
                ))}
              </div>
            </FieldRow>
            <FieldRow label="Notes">
              <textarea
                rows={2}
                placeholder="Reference or memo…"
                className="w-full px-2.5 py-2 rounded-md border border-border bg-background text-[13px] outline-none focus:border-ring"
              />
            </FieldRow>
            <div className="rounded-md border border-dashed border-border bg-surface-muted/50 px-3 py-2 text-[11.5px] text-muted-foreground">
              Payouts are released once eligibility checks pass. Approvals and settlement appear in the requests tab.
            </div>
          </div>
          <div className="h-12 px-4 flex items-center justify-end gap-2 border-t border-border bg-surface">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                toast.success("Payout request drafted");
              }}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              Submit request
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
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
