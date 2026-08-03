import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Inbox,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Send,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  KpiStrip,
  PageHeader,
  RightPanel,
  SectionTabs,
} from "@/components/influencer/wall-page";
import { useFollowUps, type FollowUp } from "@/lib/use-follow-ups";
import { generateFollowUpReport } from "@/lib/follow-up-report";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG.leads.description },
    ],
  }),
  component: LeadsPage,
});

const SUB_TABS = [
  "All Leads",
  "Pipeline",
  "Follow-up",
  "Meetings",
  "Won",
  "Lost",
  "Analytics",
];

const PIPELINE_STAGES = [
  { key: "new", label: "New", tone: "neutral" as const },
  { key: "contacted", label: "Contacted", tone: "info" as const },
  { key: "qualified", label: "Qualified", tone: "info" as const },
  { key: "meeting", label: "Meeting", tone: "warn" as const },
  { key: "proposal", label: "Proposal", tone: "warn" as const },
  { key: "won", label: "Won", tone: "good" as const },
  { key: "lost", label: "Lost", tone: "bad" as const },
];

const COLUMNS = [
  "Lead",
  "Source Creator",
  "Country",
  "Stage",
  "Owner",
  "Value",
  "Next follow-up",
  "Created",
  "Status",
];

const dayMs = 86_400_000;
const nowFloor = () => {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d.getTime();
};

function LeadsPage() {
  const wall = WALL_BY_SLUG.leads;
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [simulateFailures, setSimulateFailures] = useState(false);
  const fu = useFollowUps();

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />

      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>

      <div className="px-6">
        <SectionTabs
          sections={SUB_TABS.map((label) => ({ label }))}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main className="space-y-4">
          {tab === 1 ? (
            <PipelineView />
          ) : tab === 2 ? (
            <FollowUpView
              api={fu}
              simulateFailures={simulateFailures}
              setSimulateFailures={setSimulateFailures}
            />
          ) : tab === 3 ? (
            <MeetingsView />
          ) : tab === 6 ? (
            <ConversionAnalyticsView followUps={fu.followUps} onRefresh={fu.refresh} loading={fu.loading} />
          ) : (
            <LeadsTableView tabLabel={SUB_TABS[tab]} query={query} setQuery={setQuery} />
          )}
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}


/* ---------- Table ---------- */

function LeadsTableView({
  tabLabel,
  query,
  setQuery,
}: {
  tabLabel: string;
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-[240px] h-8 px-2.5 rounded-md border border-border bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search leads by name, email, creator or ID…"
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        {["Stage", "Source", "Owner", "Country", "Value", "Created"].map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground"
          >
            <Filter className="h-3.5 w-3.5" />
            {c}
          </button>
        ))}
        <button
          type="button"
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground"
        >
          <ListFilter className="h-3.5 w-3.5" />
          More filters
        </button>
        <div className="ml-auto flex items-center gap-1">
          <IconAction title="Refresh"><RefreshCw className="h-3.5 w-3.5" /></IconAction>
          <IconAction title="View"><LayoutGrid className="h-3.5 w-3.5" /></IconAction>
        </div>
        <button
          type="button"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Assign
        </button>
        <button
          type="button"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          New lead
        </button>
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
          <div className="text-[12.5px] font-semibold text-foreground">{tabLabel}</div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <span>0 records</span>
            <span>·</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
                <th className="w-8 py-2 pl-4">
                  <input type="checkbox" aria-label="Select all" className="h-3.5 w-3.5 rounded border-border" />
                </th>
                {COLUMNS.map((c) => (
                  <th key={c} className="py-2 px-3 font-medium text-[11.5px] uppercase tracking-wide">
                    {c}
                  </th>
                ))}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={COLUMNS.length + 2} className="py-0">
                  <div className="py-16 px-6 grid place-items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
                      <Inbox className="h-5 w-5" />
                    </div>
                    <div className="text-[14px] font-semibold text-foreground">No leads yet</div>
                    <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
                      Leads referred by your creators will appear here. Assign owners, schedule follow-ups and track conversion.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 h-10 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>0 selected</span>
            <span>·</span>
            <button type="button" className="hover:text-foreground" disabled>Assign owner</button>
            <button type="button" className="hover:text-foreground" disabled>Move stage</button>
            <button type="button" className="hover:text-foreground" disabled>Message</button>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Previous</button>
            <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Pipeline ---------- */

function PipelineView() {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-surface-muted">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-foreground">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          Sales pipeline
          <span className="text-[11.5px] font-normal text-muted-foreground">· Kanban by stage</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px]">
          <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Compact</button>
          <button type="button" className="h-7 px-2 rounded border border-border bg-surface text-foreground font-medium">Detailed</button>
        </div>
      </div>
      <div className="overflow-x-auto p-3">
        <div className="grid grid-cols-7 gap-3 min-w-[980px]">
          {PIPELINE_STAGES.map((s) => (
            <div key={s.key} className="rounded-md border border-border bg-background flex flex-col">
              <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <StageDot tone={s.tone} />
                  <span className="text-[12px] font-semibold text-foreground">{s.label}</span>
                </div>
                <span className="text-[10.5px] text-muted-foreground tabular-nums">0</span>
              </div>
              <div className="p-2 min-h-[180px] text-[11.5px] text-muted-foreground grid place-items-center">
                No leads
              </div>
              <div className="px-2 py-1.5 border-t border-border text-[10.5px] text-muted-foreground flex items-center justify-between">
                <span>Value —</span>
                <button type="button" className="hover:text-foreground">+ Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageDot({ tone }: { tone: "good" | "warn" | "bad" | "info" | "neutral" }) {
  const cls =
    tone === "good"
      ? "bg-success"
      : tone === "warn"
        ? "bg-warning"
        : tone === "bad"
          ? "bg-destructive"
          : tone === "info"
            ? "bg-primary"
            : "bg-muted-foreground/50";
  return <span className={`h-1.5 w-1.5 rounded-full ${cls}`} />;
}

/* ---------- Follow-up ---------- */

function bucketOf(dueAt: number): "Overdue" | "Today" | "Tomorrow" | "This week" | "Later" {
  const start = nowFloor();
  const diff = dueAt - start;
  if (diff < 0) return "Overdue";
  if (diff < dayMs) return "Today";
  if (diff < 2 * dayMs) return "Tomorrow";
  if (diff < 7 * dayMs) return "This week";
  return "Later";
}

const BUCKETS = ["Overdue", "Today", "Tomorrow", "This week", "Later"] as const;
type Bucket = (typeof BUCKETS)[number];

function FollowUpView({
  api,
  simulateFailures,
  setSimulateFailures,
}: {
  api: ReturnType<typeof useFollowUps>;
  simulateFailures: boolean;
  setSimulateFailures: (v: boolean) => void;
}) {
  const { followUps, loading, scheduleMany, send, reschedule, remove, clearAll } = api;
  const [every, setEvery] = useState<number>(3);
  const [count, setCount] = useState<number>(3);
  const [busy, setBusy] = useState(false);

  const grouped = useMemo(() => {
    const g: Record<Bucket, FollowUp[]> = {
      Overdue: [], Today: [], Tomorrow: [], "This week": [], Later: [],
    };
    for (const f of followUps) g[bucketOf(f.dueAt)].push(f);
    for (const key of BUCKETS) g[key].sort((a, b) => a.dueAt - b.dueAt);
    return g;
  }, [followUps]);

  const schedule = async () => {
    if (count < 1) return;
    setBusy(true);
    const start = nowFloor();
    const inputs = Array.from({ length: count }).map((_, i) => ({
      leadName: `Lead ${String(followUps.length + i + 1).padStart(3, "0")}`,
      channel: (["Email", "SMS", "Call"] as const)[i % 3],
      dueAt: start + every * dayMs * (i + 1),
    }));
    await scheduleMany(inputs);
    setBusy(false);
  };

  return (
    <div className="grid gap-3">
      <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 flex items-center gap-2 text-[12px] text-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
        Reminders persist to the backend and are shared across sessions.
        <label className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={simulateFailures} onChange={(e) => setSimulateFailures(e.target.checked)} className="h-3 w-3 rounded border-border" />
          Simulate send failures
        </label>
      </div>

      <div className="rounded-md border border-border bg-surface p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <div className="text-[13px] font-semibold text-foreground">Schedule follow-up reminders</div>
          <div className="text-[12px] text-muted-foreground">Create a cadence and persist reminders with real due dates.</div>
        </div>
        <label className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
          Count
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} className="h-8 w-16 px-2 rounded border border-border bg-background text-[12px]" />
        </label>
        <label className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
          Every
          <select value={every} onChange={(e) => setEvery(Number(e.target.value))} className="h-8 px-2 rounded border border-border bg-background text-[12px]">
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
          </select>
        </label>
        <button type="button" disabled={busy} onClick={schedule} className="h-8 px-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium inline-flex items-center gap-1.5 disabled:opacity-50">
          <CalendarDays className="h-3.5 w-3.5" />
          {busy ? "Scheduling…" : "Schedule"}
        </button>
        {followUps.length > 0 ? (
          <button type="button" onClick={clearAll} className="h-8 px-2.5 rounded border border-border bg-surface hover:bg-muted text-[12px]">
            Clear all
          </button>
        ) : null}
      </div>

      {loading && followUps.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-6 text-center text-[12px] text-muted-foreground">
          Loading follow-ups…
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-5">
          {BUCKETS.map((b) => {
            const items = grouped[b];
            const tone = b === "Overdue" ? "text-destructive" : b === "Today" ? "text-warning" : "text-muted-foreground";
            return (
              <div key={b} className="rounded-md border border-border bg-surface flex flex-col">
                <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                  <span className={`text-[11.5px] font-semibold uppercase tracking-wide ${tone}`}>{b}</span>
                  <span className="text-[10.5px] text-muted-foreground tabular-nums">{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <div className="p-3 text-[11.5px] text-muted-foreground min-h-[110px] grid place-items-center text-center">
                    No follow-ups
                  </div>
                ) : (
                  <div className="p-2 space-y-1.5">
                    {items.map((f) => (
                      <FollowUpCard
                        key={f.id}
                        f={f}
                        onSend={() => send(f.id, simulateFailures)}
                        onRetry={() => send(f.id, simulateFailures)}
                        onReschedule={(d) => reschedule(f.id, d)}
                        onRemove={() => remove(f.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FollowUpCard({
  f,
  onSend,
  onRetry,
  onReschedule,
  onRemove,
}: {
  f: FollowUp;
  onSend: () => void;
  onRetry: () => void;
  onReschedule: (days: number) => void;
  onRemove: () => void;
}) {
  const due = new Date(f.dueAt);
  const dueStr = due.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " + due.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const statusTone = f.status === "failed" ? "text-destructive" : f.status === "sent" ? "text-success" : "text-muted-foreground";
  return (
    <div className="rounded border border-border bg-background p-2">
      <div className="flex items-start gap-1.5">
        <Bell className="h-3 w-3 text-muted-foreground mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="text-[11.5px] font-medium text-foreground truncate">{f.leadName}</div>
          <div className="text-[10.5px] text-muted-foreground truncate">{f.channel} · {dueStr}</div>
        </div>
        <button type="button" onClick={onRemove} aria-label="Remove" className="h-5 w-5 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className={`mt-1 text-[10px] uppercase tracking-wide ${statusTone}`}>
        {f.status}{f.attempts > 0 ? ` · attempt ${f.attempts}` : ""}
      </div>
      {f.lastError ? (
        <div className="mt-1 text-[10px] text-destructive truncate" title={f.lastError}>{f.lastError}</div>
      ) : null}
      <div className="mt-1.5 flex items-center gap-1">
        {f.status === "failed" ? (
          <button type="button" onClick={onRetry} className="h-6 px-1.5 inline-flex items-center gap-1 rounded border border-border bg-surface hover:bg-muted text-[10.5px]">
            <RotateCw className="h-2.5 w-2.5" /> Retry
          </button>
        ) : f.status === "scheduled" ? (
          <button type="button" onClick={onSend} className="h-6 px-1.5 inline-flex items-center gap-1 rounded border border-border bg-surface hover:bg-muted text-[10.5px]">
            <Send className="h-2.5 w-2.5" /> Send now
          </button>
        ) : null}
        <select
          onChange={(e) => { const v = Number(e.target.value); if (v) { onReschedule(v); e.currentTarget.value = ""; } }}
          className="h-6 px-1 rounded border border-border bg-surface hover:bg-muted text-[10.5px]"
          defaultValue=""
          aria-label="Reschedule"
        >
          <option value="" disabled>Reschedule…</option>
          <option value={1}>+1 day</option>
          <option value={3}>+3 days</option>
          <option value={7}>+7 days</option>
          <option value={14}>+14 days</option>
        </select>
      </div>
    </div>
  );
}


function MeetingsView() {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-surface-muted">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-foreground">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          Booked meetings
        </div>
        <button type="button" className="h-7 px-2.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]">
          + Book meeting
        </button>
      </div>
      <div className="py-16 px-6 grid place-items-center text-center">
        <div className="h-12 w-12 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
          <Clock className="h-5 w-5" />
        </div>
        <div className="text-[14px] font-semibold text-foreground">No meetings scheduled</div>
        <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
          Meetings booked with leads will appear here with reminders, notes and outcomes.
        </p>
      </div>
    </div>
  );
}

/* ---------- Conversion Analytics ---------- */

function ConversionAnalyticsView({
  followUps,
  onRefresh,
  loading,
}: {
  followUps: FollowUp[];
  onRefresh: () => Promise<void>;
  loading: boolean;
}) {
  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await onRefresh();
      generateFollowUpReport(followUps);
      toast.success("PDF report downloaded");
    } catch (e) {
      toast.error(`Report failed: ${(e as Error).message}`);
    } finally {
      setDownloading(false);
    }
  };
  const stats = useMemo(() => {
    const total = followUps.length;
    const sent = followUps.filter((f) => f.status === "sent").length;
    const failed = followUps.filter((f) => f.status === "failed").length;
    const scheduled = followUps.filter((f) => f.status === "scheduled").length;
    const overdue = followUps.filter((f) => f.status === "scheduled" && f.dueAt < Date.now()).length;
    const rate = total ? Math.round((sent / total) * 100) : 0;
    const upcoming7 = followUps.filter((f) => f.dueAt >= Date.now() && f.dueAt < Date.now() + 7 * dayMs).length;
    return { total, sent, failed, scheduled, overdue, rate, upcoming7 };
  }, [followUps]);

  // Group sent follow-ups by day for a real 14-day chart from follow-up dates
  const chart = useMemo(() => {
    const start = nowFloor() - 13 * dayMs;
    const days: { label: string; scheduled: number; sent: number; failed: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start + i * dayMs);
      const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      days.push({ label, scheduled: 0, sent: 0, failed: 0 });
    }
    for (const f of followUps) {
      const idx = Math.floor((f.dueAt - start) / dayMs);
      if (idx < 0 || idx > 13) continue;
      days[idx][f.status] += 1;
    }
    return days;
  }, [followUps]);
  const chartMax = Math.max(1, ...chart.map((d) => d.scheduled + d.sent + d.failed));

  return (
    <div className="space-y-4">
      <VerificationLockCard />

      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2">
        <div className="text-[12.5px] text-foreground">
          <span className="font-semibold">Follow-up performance</span>
          <span className="text-muted-foreground"> · {followUps.length} record{followUps.length === 1 ? "" : "s"} from backend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onRefresh()}
            disabled={loading}
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading || loading}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {downloading ? "Preparing…" : "Download PDF report"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <MiniStat icon={<Users className="h-3.5 w-3.5" />} label="Total reminders" value={stats.total} />
        <MiniStat icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Sent" value={stats.sent} />
        <MiniStat icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Failed" value={stats.failed} tone={stats.failed ? "bad" : "neutral"} />
        <MiniStat icon={<Clock className="h-3.5 w-3.5" />} label="Overdue" value={stats.overdue} tone={stats.overdue ? "warn" : "neutral"} />
        <MiniStat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Delivery rate" value={`${stats.rate}%`} />
        <MiniStat icon={<CalendarDays className="h-3.5 w-3.5" />} label="Next 7 days" value={stats.upcoming7} />
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="h-9 px-3 flex items-center gap-1.5 border-b border-border text-[12px] font-semibold">
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
          Follow-up volume · last 14 days
          <span className="ml-auto text-[11px] font-normal text-muted-foreground">Real dates from scheduled reminders</span>
        </div>
        <div className="p-4">
          {stats.total === 0 ? (
            <div className="py-8 text-center text-[12px] text-muted-foreground">
              Schedule a reminder in the Follow-up tab to populate this chart.
            </div>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {chart.map((d, i) => {
                const totalDay = d.scheduled + d.sent + d.failed;
                const h = (totalDay / chartMax) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.label} · ${totalDay}`}>
                    <div className="w-full flex flex-col justify-end" style={{ height: `${h}%`, minHeight: totalDay ? 4 : 0 }}>
                      {d.failed ? <div className="bg-destructive/70" style={{ height: `${(d.failed / totalDay) * 100}%` }} /> : null}
                      {d.sent ? <div className="bg-success/70" style={{ height: `${(d.sent / totalDay) * 100}%` }} /> : null}
                      {d.scheduled ? <div className="bg-primary/50" style={{ height: `${(d.scheduled / totalDay) * 100}%` }} /> : null}
                    </div>
                    <div className="text-[9px] text-muted-foreground rotate-45 origin-left translate-y-1 whitespace-nowrap">{d.label}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-6 flex items-center gap-3 text-[10.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary/50" />Scheduled</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success/70" />Sent</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-destructive/70" />Failed</span>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="h-9 px-3 flex items-center gap-1.5 border-b border-border text-[12px] font-semibold">
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
          Conversion funnel
        </div>
        <div className="p-4 space-y-2">
          {PIPELINE_STAGES.map((s, i) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-24 text-[11.5px] text-muted-foreground">{s.label}</div>
              <div className="flex-1 h-4 rounded bg-muted overflow-hidden">
                <div className="h-full bg-primary/20 border-r border-primary/40" style={{ width: `${100 - i * 14}%` }} />
              </div>
              <div className="w-14 text-right text-[11.5px] text-muted-foreground tabular-nums">—</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Leads by source creator" icon={<Users className="h-3.5 w-3.5" />} />
        <ChartCard title="Conversion by country" icon={<Activity className="h-3.5 w-3.5" />} />
      </div>

      <div className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[12.5px] font-semibold text-foreground">Pipeline & source analytics populate when lead data is connected</div>
          <p className="text-[12px] text-muted-foreground mt-0.5">Follow-up metrics above are live from your reminders in this session.</p>
        </div>
        <button type="button" className="shrink-0 h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium">
          <Send className="h-3.5 w-3.5" />
          Share analytics
        </button>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value = "—", tone = "neutral" }: { icon: React.ReactNode; label: string; value?: string | number; tone?: "neutral" | "warn" | "bad" }) {
  const toneClass = tone === "bad" ? "text-destructive" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-foreground">{icon}</span>
        {label}
      </div>
      <div className={`mt-1.5 text-[22px] font-semibold tabular-nums leading-none ${toneClass}`}>{value}</div>
    </div>
  );
}


function ChartCard({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="h-9 px-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </div>
        <button type="button" className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-4">
        <div className="h-44 rounded border border-dashed border-border bg-surface-muted/40 grid place-items-center text-[12px] text-muted-foreground">
          No data to display
        </div>
      </div>
    </div>
  );
}

function IconAction({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

/* ---------- Verification lock (Analytics gate) ---------- */

const VERIFICATION_CHECKS = [
  { key: "kyc", label: "Identity (KYC)", desc: "Government-issued ID + selfie match" },
  { key: "email", label: "Email address", desc: "Confirm ownership via verification link" },
  { key: "phone", label: "Phone number", desc: "One-time SMS code" },
  { key: "social", label: "Social profiles", desc: "Link at least one connected platform" },
  { key: "sanctions", label: "Sanctions screening", desc: "AML / PEP watch-list clearance" },
] as const;

function VerificationLockCard() {
  return (
    <div className="rounded-md border border-warning/40 bg-warning/5 overflow-hidden">
      <div className="px-4 py-3 flex items-start gap-3 border-b border-warning/30">
        <div className="h-8 w-8 rounded-md bg-warning/15 text-warning grid place-items-center shrink-0">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-foreground">Full analytics are locked</div>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Complete workspace verification to unlock lead-source attribution, conversion by country, and pipeline forecasting. Follow-up performance below stays available while checks are pending.
          </p>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full border border-warning/40 bg-warning/10 text-warning text-[10.5px] font-semibold uppercase tracking-wide">
          0 / {VERIFICATION_CHECKS.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {VERIFICATION_CHECKS.map((c) => (
          <li key={c.key} className="px-4 py-2.5 flex items-center gap-3">
            <span className="h-4 w-4 rounded-full border border-border grid place-items-center text-muted-foreground shrink-0">
              <Clock className="h-2.5 w-2.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium text-foreground">{c.label}</div>
              <div className="text-[11.5px] text-muted-foreground truncate">{c.desc}</div>
            </div>
            <span className="text-[10.5px] text-muted-foreground uppercase tracking-wide">Pending</span>
            <button
              type="button"
              onClick={() => toast(`${c.label} verification will start once your backend provider is connected.`)}
              className="h-7 px-2.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
            >
              Start
            </button>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2.5 border-t border-border bg-surface flex items-center gap-2 text-[11.5px] text-muted-foreground">
        <span>Verification results come from your backend. No status is shown until real checks complete.</span>
      </div>
    </div>
  );
}
