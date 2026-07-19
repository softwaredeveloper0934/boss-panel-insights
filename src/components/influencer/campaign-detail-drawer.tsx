import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  FileCheck2,
  Film,
  Image as ImageIcon,
  Link2,
  MessageSquare,
  MoreHorizontal,
  MousePointerClick,
  Package,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Sheet, SheetOverlay, SheetPortal } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

const TABS = [
  { key: "overview", label: "Overview", icon: Target },
  { key: "timeline", label: "Timeline", icon: Clock },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "deliverables", label: "Deliverables", icon: Package },
  { key: "approvals", label: "Approvals", icon: FileCheck2 },
  { key: "performance", label: "Performance", icon: BarChart3 },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export function CampaignDetailDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [tab, setTab] = useState<TabKey>("overview");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-foreground/40" />
        <SheetPrimitive.Content className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-[860px] border-l border-border bg-surface shadow-xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:duration-200 data-[state=open]:duration-300 flex flex-col">
          <Header onClose={() => onOpenChange(false)} />
          <Snapshot />
          <TabBar tab={tab} onChange={setTab} />
          <div className="flex-1 overflow-y-auto bg-background">
            {tab === "overview" ? <OverviewTab /> : null}
            {tab === "timeline" ? <TimelineTab /> : null}
            {tab === "calendar" ? <CalendarTab /> : null}
            {tab === "deliverables" ? <DeliverablesTab /> : null}
            {tab === "approvals" ? <ApprovalsTab /> : null}
            {tab === "performance" ? <PerformanceTab /> : null}
          </div>
          <Footer />
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

/* ---------- Header ---------- */

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-5 pt-4 pb-4 border-b border-border bg-surface">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
          Campaign detail · Template preview
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Copy ID"><Copy className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn label="More"><MoreHorizontal className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn label="Close" onClick={onClose}><X className="h-4 w-4" /></IconBtn>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-md bg-muted border border-border grid place-items-center text-muted-foreground">
          <Target className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[18px] font-semibold text-foreground truncate">Campaign name</h2>
            <StatusPill tone="neutral">Draft</StatusPill>
            <StatusPill tone="neutral">Awaiting approval</StatusPill>
          </div>
          <div className="mt-0.5 text-[12.5px] text-muted-foreground">Brand — · Objective —</div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Start —</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> End —</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 0 creators</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Snapshot ---------- */

function Snapshot() {
  const cells = [
    { label: "Budget", value: "—" },
    { label: "Spent", value: "—" },
    { label: "Impressions", value: "—" },
    { label: "Clicks", value: "—" },
    { label: "Conversions", value: "—" },
    { label: "ROI", value: "—" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-border bg-surface-muted">
      {cells.map((c, i) => (
        <div key={c.label} className={`px-3 py-2.5 ${i > 0 ? "border-l border-border" : ""}`}>
          <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{c.label}</div>
          <div className="mt-0.5 text-[15px] font-semibold text-foreground tabular-nums leading-none">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Tabs ---------- */

function TabBar({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="px-3 flex items-center overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "shrink-0 px-3 h-10 inline-flex items-center gap-1.5 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */

function OverviewTab() {
  return (
    <div className="p-5 grid gap-4 lg:grid-cols-2">
      <Card title="Brief">
        <div className="text-[12.5px] text-muted-foreground italic">Campaign brief and content guidelines appear here once authored.</div>
      </Card>
      <Card title="Targeting">
        <Grid>
          <Field label="Audience" value="—" />
          <Field label="Geography" value="—" />
          <Field label="Platforms" value="—" />
          <Field label="Languages" value="—" />
        </Grid>
      </Card>
      <Card title="Budget & pacing">
        <Grid>
          <Field label="Budget" value="—" />
          <Field label="Committed" value="—" />
          <Field label="Spent" value="—" />
          <Field label="Remaining" value="—" />
        </Grid>
      </Card>
      <Card title="Approvals">
        <Grid>
          <Field label="Brand approver" value="—" />
          <Field label="Legal review" value="Pending" />
          <Field label="Finance sign-off" value="Pending" />
          <Field label="Launch gate" value="Pending" />
        </Grid>
      </Card>
    </div>
  );
}

/* ---------- Timeline (vertical) ---------- */

const TIMELINE_STAGES = [
  { icon: <FileCheck2 className="h-3.5 w-3.5" />, title: "Brief drafted", body: "Campaign brief authored and shared internally." },
  { icon: <ShieldCheck className="h-3.5 w-3.5" />, title: "Brand approval", body: "Brand-side approver signs off on brief and budget." },
  { icon: <Users className="h-3.5 w-3.5" />, title: "Creators assigned", body: "Creators are assigned; contracts and NDAs sent." },
  { icon: <Package className="h-3.5 w-3.5" />, title: "Content submitted", body: "Deliverables uploaded to content library for review." },
  { icon: <CheckCircle2 className="h-3.5 w-3.5" />, title: "Approvals complete", body: "All deliverables approved by brand and legal." },
  { icon: <TrendingUp className="h-3.5 w-3.5" />, title: "Live & measuring", body: "Campaign live; performance snapshots update." },
  { icon: <FileCheck2 className="h-3.5 w-3.5" />, title: "Wrap & settlement", body: "Wrap report, invoices and payouts settled." },
];

function TimelineTab() {
  return (
    <div className="p-5">
      <ol className="relative border-l border-border ml-3 space-y-4">
        {TIMELINE_STAGES.map((s, i) => (
          <li key={s.title} className="pl-5 relative">
            <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border border-border bg-surface grid place-items-center text-muted-foreground">
              {s.icon}
            </span>
            <div className="rounded-md border border-border bg-surface p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12.5px] font-semibold text-foreground">
                  {i + 1}. {s.title}
                </div>
                <StatusPill tone="neutral">Pending</StatusPill>
              </div>
              <div className="mt-0.5 text-[11.5px] text-muted-foreground">{s.body}</div>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Scheduled —</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Duration —</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> Owner —</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Calendar (month grid) ---------- */

function CalendarTab() {
  const [monthOffset, setMonthOffset] = useState(0);
  const now = useMemo(() => new Date(), []);
  const cursor = useMemo(() => {
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return d;
  }, [now, monthOffset]);
  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const firstDow = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="p-5">
      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="h-10 px-3 flex items-center justify-between border-b border-border bg-surface-muted">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="text-[12.5px] font-semibold text-foreground">{monthLabel}</div>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn label="Previous month" onClick={() => setMonthOffset((m) => m - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </IconBtn>
            <button
              type="button"
              onClick={() => setMonthOffset(0)}
              className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
            >
              Today
            </button>
            <IconBtn label="Next month" onClick={() => setMonthOffset((m) => m + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b border-border bg-surface-muted/40 text-[10.5px] uppercase tracking-wide text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-2 py-1.5 border-l border-border first:border-l-0 font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const isToday =
              d !== null &&
              cursor.getFullYear() === now.getFullYear() &&
              cursor.getMonth() === now.getMonth() &&
              d === now.getDate();
            return (
              <div key={i} className="min-h-[84px] border-l border-t border-border first:border-l-0 p-1.5">
                {d !== null ? (
                  <>
                    <div className={`text-[11px] tabular-nums ${isToday ? "inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
                      {d}
                    </div>
                    <div className="mt-1 space-y-0.5" />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="px-3 py-2 border-t border-border bg-surface text-[11.5px] text-muted-foreground">
          Deliverables, approvals and go-live dates render as pills on the day cells once the campaign is scheduled.
        </div>
      </div>
    </div>
  );
}

/* ---------- Deliverables ---------- */

const DELIVERABLE_TYPES = [
  { icon: <Film className="h-3.5 w-3.5" />, label: "Video (YouTube)", spec: "60–90s · 1080p · voiceover" },
  { icon: <Film className="h-3.5 w-3.5" />, label: "Reel / Short", spec: "9:16 · 30–45s · captions" },
  { icon: <ImageIcon className="h-3.5 w-3.5" />, label: "Feed post", spec: "4:5 · carousel up to 5" },
  { icon: <ImageIcon className="h-3.5 w-3.5" />, label: "Story frame", spec: "9:16 · swipe-up" },
  { icon: <Link2 className="h-3.5 w-3.5" />, label: "Blog / Newsletter", spec: "500–800 words" },
];

function DeliverablesTab() {
  return (
    <div className="p-5 space-y-4">
      <Card title="Required deliverables">
        <ul className="divide-y divide-border -mx-3">
          {DELIVERABLE_TYPES.map((d) => (
            <li key={d.label} className="px-3 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-7 w-7 grid place-items-center rounded-md bg-muted text-muted-foreground border border-border">{d.icon}</span>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-foreground truncate">{d.label}</div>
                  <div className="text-[11px] text-muted-foreground">{d.spec}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill tone="neutral">0 submitted</StatusPill>
                <button
                  type="button"
                  className="h-7 px-2 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
                >
                  Configure
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Submissions">
        <div className="py-8 text-center text-[12.5px] text-muted-foreground">
          Uploaded content from creators appears here for review, approval or revision requests.
        </div>
      </Card>
    </div>
  );
}

/* ---------- Approvals ---------- */

function ApprovalsTab() {
  const stages = [
    { label: "Brief approval", role: "Campaign owner", state: "pending" as const },
    { label: "Legal & compliance", role: "Legal reviewer", state: "pending" as const },
    { label: "Creative review", role: "Brand approver", state: "pending" as const },
    { label: "Finance sign-off", role: "Finance", state: "pending" as const },
    { label: "Launch gate", role: "Boss Panel admin", state: "pending" as const },
  ];
  return (
    <div className="p-5 space-y-4">
      <Card title="Approval chain">
        <ol className="divide-y divide-border -mx-3">
          {stages.map((s, i) => (
            <li key={s.label} className="px-3 py-2.5 flex items-center gap-3">
              <div className="h-6 w-6 grid place-items-center rounded-full border border-border bg-surface text-[11px] text-muted-foreground">{i + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium text-foreground truncate">{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.role}</div>
              </div>
              <StatusPill tone={s.state === "pending" ? "warn" : "good"}>{s.state === "pending" ? "Pending" : "Approved"}</StatusPill>
              <button type="button" className="h-7 px-2 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] font-medium">
                Review
              </button>
            </li>
          ))}
        </ol>
      </Card>
      <Card title="Comments">
        <div className="py-8 text-center text-[12.5px] text-muted-foreground">
          Approver feedback, revision requests and mentions thread here.
        </div>
      </Card>
    </div>
  );
}

/* ---------- Performance ---------- */

function PerformanceTab() {
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PerfCard icon={<Eye className="h-3.5 w-3.5" />} label="Impressions" />
        <PerfCard icon={<MousePointerClick className="h-3.5 w-3.5" />} label="Clicks" />
        <PerfCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Conversions" />
        <PerfCard icon={<BarChart3 className="h-3.5 w-3.5" />} label="ROI" />
      </div>
      <Card title="Performance over time">
        <div className="h-40 rounded border border-dashed border-border bg-surface-muted/40 grid place-items-center text-[12px] text-muted-foreground">
          Performance chart renders when the campaign is live.
        </div>
      </Card>
      <Card title="Per-creator snapshot">
        <div className="py-8 text-center text-[12.5px] text-muted-foreground">
          Each assigned creator gets an inline snapshot of reach, clicks, conversions and commission earned.
        </div>
      </Card>
    </div>
  );
}

function PerfCard({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <span className="text-foreground">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-[20px] font-semibold text-foreground tabular-nums leading-none">—</div>
      <div className="mt-1 text-[11px] text-muted-foreground">No data</div>
    </div>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <div className="px-5 py-3 border-t border-border bg-surface flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button type="button" className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium">
          <MessageSquare className="h-3.5 w-3.5" />
          Comment
        </button>
        <button type="button" className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium">
          <Users className="h-3.5 w-3.5" />
          Assign creators
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium">
          Save draft
        </button>
        <button type="button" className="h-8 px-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium">
          Send for approval
        </button>
      </div>
    </div>
  );
}

/* ---------- Small primitives ---------- */

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="h-9 px-3 flex items-center border-b border-border">
        <h3 className="text-[11.5px] font-semibold text-foreground uppercase tracking-wide">{title}</h3>
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">{children}</div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10.5px] uppercase tracking-wide font-medium text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[13px] text-foreground truncate">{value}</div>
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
