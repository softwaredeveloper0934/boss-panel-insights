import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Filter,
  ListFilter,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Calculator,
  Percent,
  Layers,
  ShieldCheck,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  PageHeader,
  KpiStrip,
  RightPanel,
  EmptySurface,
} from "@/components/influencer/wall-page";

const wall = WALL_BY_SLUG["commissions"];

export const Route = createFileRoute("/commissions")({
  head: () => ({
    meta: [
      { title: "Commissions — Influencer Manager" },
      { name: "description", content: wall.description },
    ],
  }),
  component: CommissionsPage,
});

const SECTIONS = [
  "Commission Ledger",
  "Calculation Rules",
  "Pending",
  "Approved",
  "Paid",
  "Adjustments",
  "Disputed",
  "Bulk Payout Eligibility",
  "History",
];

const LEDGER_COLUMNS = [
  "Date",
  "Creator",
  "Source",
  "Reference",
  "Currency",
  "Gross",
  "Rate",
  "Commission",
  "Adjustments",
  "Net",
  "Eligible",
  "Status",
];

const FILTER_CHIPS = [
  "Period",
  "Creator",
  "Campaign",
  "Source",
  "Currency",
  "Status",
  "Eligible only",
  "Disputed",
];

function CommissionsPage() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>

      <div className="px-6">
        <div className="mt-4 border-b border-border overflow-x-auto">
          <div className="flex items-center gap-0">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setActive(i)}
                className={[
                  "shrink-0 h-9 px-3 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                  i === active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main className="space-y-4">
          {active === 1 ? (
            <CalculationRules />
          ) : active === 7 ? (
            <BulkPayoutEligibility selected={selected} setSelected={setSelected} />
          ) : (
            <>
              <LedgerFilterBar />
              <BulkActionBar count={selected} onClear={() => setSelected(0)} />
              <div className="rounded-md border border-border bg-surface overflow-hidden">
                <LedgerTable />
              </div>
            </>
          )}
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}

/* ---------- Filter bar ---------- */

function LedgerFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
      <div className="flex items-center gap-1.5 flex-1 min-w-[240px] h-8 px-2.5 rounded-md border border-border bg-background">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search ledger by creator, order ID, campaign, reference…"
          className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
      </div>
      {FILTER_CHIPS.map((c) => (
        <button
          key={c}
          type="button"
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
        >
          <Filter className="h-3.5 w-3.5" />
          {c}
        </button>
      ))}
      <button className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]">
        <ListFilter className="h-3.5 w-3.5" />
        More
      </button>
      <div className="ml-auto flex items-center gap-1">
        {[RefreshCw, Upload, Download].map((Icon, i) => (
          <button
            key={i}
            className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Bulk action bar ---------- */

function BulkActionBar({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-muted/50 px-3 py-2 text-[12.5px]">
      <span className="text-muted-foreground">
        <span className="font-semibold text-foreground tabular-nums">{count}</span> selected line item{count === 1 ? "" : "s"}
      </span>
      <span className="text-muted-foreground">·</span>
      <BulkBtn icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Approve</BulkBtn>
      <BulkBtn icon={<ShieldCheck className="h-3.5 w-3.5" />}>Mark eligible</BulkBtn>
      <BulkBtn icon={<Banknote className="h-3.5 w-3.5" />} primary>
        Queue for payout batch
      </BulkBtn>
      <BulkBtn icon={<Clock className="h-3.5 w-3.5" />}>Hold</BulkBtn>
      <BulkBtn icon={<Calculator className="h-3.5 w-3.5" />}>Recalculate</BulkBtn>
      <BulkBtn icon={<XCircle className="h-3.5 w-3.5" />}>Reject</BulkBtn>
      <button
        onClick={onClear}
        className="ml-auto h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11.5px]"
      >
        Clear selection
      </button>
    </div>
  );
}

function BulkBtn({
  icon,
  children,
  primary,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md text-[12px] font-medium border",
        primary
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          : "bg-surface text-foreground border-border hover:bg-muted",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------- Ledger table ---------- */

function LedgerTable() {
  return (
    <>
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
        <div className="flex items-center gap-3">
          <div className="text-[12.5px] font-semibold">Commission Ledger — line items</div>
          <span className="text-[11px] text-muted-foreground">
            Every billable event: sale, subscription, renewal, refund, adjustment.
          </span>
        </div>
        <span className="text-[11.5px] text-muted-foreground">0 records · Page 1 of 1</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
              <th className="w-8 py-2 pl-4">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
              </th>
              {LEDGER_COLUMNS.map((c) => (
                <th key={c} className="py-2 px-3 font-medium text-[11.5px] uppercase tracking-wide whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={LEDGER_COLUMNS.length + 2} className="py-0">
                <EmptySurface
                  title="Ledger is empty"
                  description="Commission line items will appear here as creator-attributed sales, subscriptions and renewals flow in from the Boss Panel."
                  primaryAction="New Rule"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 h-10 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
        <div>Totals · Gross — · Commission — · Net —</div>
        <div className="flex items-center gap-1.5">
          <button className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Previous</button>
          <button className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Next</button>
        </div>
      </div>
    </>
  );
}

/* ---------- Calculation rules ---------- */

function CalculationRules() {
  const rules = [
    {
      icon: <Percent className="h-3.5 w-3.5" />,
      title: "Flat percentage",
      body: "Commission = Gross × Rate%. Applied to every eligible sale unless overridden by a tier or campaign rule.",
      tag: "Default",
    },
    {
      icon: <Layers className="h-3.5 w-3.5" />,
      title: "Tiered by volume",
      body: "Brackets by monthly gross sales: 0–1k, 1k–10k, 10k–100k, 100k+. Higher brackets unlock higher rates per line item.",
      tag: "Tiered",
    },
    {
      icon: <Calculator className="h-3.5 w-3.5" />,
      title: "Per-product override",
      body: "Specific SKUs or categories can carry a fixed rate or flat per-unit payout that overrides the default rate.",
      tag: "Override",
    },
    {
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      title: "Campaign override",
      body: "While a campaign is active, its rate replaces the creator's default for any attributed sale within the campaign window.",
      tag: "Override",
    },
    {
      icon: <Clock className="h-3.5 w-3.5" />,
      title: "Hold period",
      body: "Commissions are held N days after the sale to cover refunds and chargebacks before becoming eligible for payout.",
      tag: "Eligibility",
    },
    {
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      title: "Refund & clawback",
      body: "Refunded or charged-back orders generate a negative adjustment line item that nets against future commission.",
      tag: "Adjustment",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-surface px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold">Commission calculation engine</div>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Rules are evaluated in order: campaign override → per-product override → tier → default. The first match wins; adjustments and holds apply after.
          </p>
        </div>
        <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-[12.5px]">
          <Plus className="h-3.5 w-3.5" /> New Rule
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rules.map((r) => (
          <article key={r.title} className="rounded-md border border-border bg-surface p-3">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-6 w-6 grid place-items-center rounded bg-muted text-muted-foreground">
                  {r.icon}
                </span>
                <h4 className="text-[12.5px] font-semibold">{r.title}</h4>
              </div>
              <span className="h-5 px-1.5 inline-flex items-center rounded text-[10.5px] font-medium bg-muted text-muted-foreground border border-border">
                {r.tag}
              </span>
            </header>
            <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">{r.body}</p>
            <footer className="mt-3 flex items-center justify-between text-[11.5px] text-muted-foreground">
              <span>No rules configured</span>
              <button className="text-foreground hover:underline inline-flex items-center gap-1">
                Configure <ChevronRight className="h-3 w-3" />
              </button>
            </footer>
          </article>
        ))}
      </div>

      <div className="rounded-md border border-border bg-surface p-4">
        <div className="text-[12.5px] font-semibold mb-2">Formula reference</div>
        <pre className="text-[12px] leading-relaxed text-muted-foreground bg-surface-muted/60 border border-border rounded p-3 overflow-x-auto">
{`commission = gross
  × resolveRate(creator, campaign, product)
  × (1 - refundsRatio)
  - adjustments

eligibleForPayout =
  status === "approved" &&
  ageInDays >= holdPeriod &&
  !disputed &&
  netAmount >= minPayoutThreshold`}
        </pre>
      </div>
    </div>
  );
}

/* ---------- Bulk payout eligibility ---------- */

function BulkPayoutEligibility({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (n: number) => void;
}) {
  const checks = [
    { label: "Hold period elapsed", hint: "≥ N days since sale" },
    { label: "Status is Approved", hint: "Not pending or disputed" },
    { label: "Not refunded or charged back", hint: "Refund window clear" },
    { label: "KYC verified", hint: "Creator identity & tax" },
    { label: "Payout method on file", hint: "Bank / UPI / PayPal / Wise" },
    { label: "Above minimum threshold", hint: "Wallet ≥ minimum amount" },
    { label: "No active disputes", hint: "No open commission disputes" },
    { label: "Compliance clear", hint: "Sanctions & policy checks" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold">Bulk payout eligibility</div>
            <p className="text-[12px] text-muted-foreground mt-0.5 max-w-2xl">
              Select approved commission line items, run eligibility checks, then queue the eligible items into a payout batch in one action.
            </p>
          </div>
          <button
            disabled
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary/40 text-primary-foreground text-[12.5px] cursor-not-allowed"
            title="Select line items to enable"
          >
            <Banknote className="h-3.5 w-3.5" /> Queue {selected || 0} for payout
          </button>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {checks.map((c) => (
            <div key={c.label} className="rounded-md border border-border bg-surface-muted/40 p-2.5">
              <div className="flex items-center gap-1.5 text-[12px] font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                {c.label}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{c.hint}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
          <div className="text-[12.5px] font-semibold">Eligible commissions queue</div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelected(0)}
              className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11.5px]"
            >
              Clear
            </button>
            <button className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11.5px]">
              Re-run checks
            </button>
          </div>
        </div>
        <EmptySurface
          title="No commissions queued for payout"
          description="Approved line items that pass every eligibility check will be staged here before being released into a payout batch."
          primaryAction="Recalculate"
        />
      </div>
    </div>
  );
}
