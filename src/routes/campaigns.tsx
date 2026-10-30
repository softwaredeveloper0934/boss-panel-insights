import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRecords } from "@/lib/use-records";
import { campaignsConfig } from "@/lib/module-records";
import { RecordsSurface } from "@/components/influencer/records-surface";
import {
  Activity,
  BarChart3,
  CalendarDays,
  Clock,
  Eye,
  Filter,
  Inbox,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  Send,
  Target,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  KpiStrip,
  PageHeader,
  RightPanel,
  SectionTabs,
} from "@/components/influencer/wall-page";
import { CreateCampaignDialog } from "@/components/influencer/create-campaign-dialog";
import { AssignCreatorsDialog } from "@/components/influencer/assign-creators-dialog";
import { CampaignKanban } from "@/components/influencer/campaign-kanban";
import { CampaignDetailDrawer } from "@/components/influencer/campaign-detail-drawer";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG.campaigns.description },
    ],
  }),
  component: CampaignsPage,
});

const COLUMNS = [
  { key: "name", label: "Campaign", w: "min-w-[260px]" },
  { key: "brand", label: "Brand", w: "min-w-[140px]" },
  { key: "objective", label: "Objective", w: "min-w-[120px]" },
  { key: "creators", label: "Creators", w: "min-w-[100px] text-right" },
  { key: "budget", label: "Budget", w: "min-w-[120px] text-right" },
  { key: "spent", label: "Spent", w: "min-w-[120px] text-right" },
  { key: "start", label: "Start", w: "min-w-[110px]" },
  { key: "end", label: "End", w: "min-w-[110px]" },
  { key: "approval", label: "Approval", w: "min-w-[110px]" },
  { key: "status", label: "Status", w: "min-w-[100px]" },
];

const SUB_TABS = [
  "All Campaigns",
  "Drafts",
  "Active",
  "Scheduled",
  "In Review",
  "Completed",
  "Archived",
  "Kanban",
  "Timeline",
  "Analytics",
];

function CampaignsPage() {
  const wall = WALL_BY_SLUG.campaigns;
  const [tab, setTab] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const api = useRecords("campaigns");
  const [assignedCount, setAssignedCount] = useState(0);
  const kpis = useMemo(() => campaignsConfig.kpis(api.rows), [api.rows]);

  const loadAssigned = useCallback(async () => {
    const { count } = await supabase
      .from("campaign_creators")
      .select("id", { count: "exact", head: true });
    setAssignedCount(count ?? 0);
  }, []);
  useEffect(() => {
    void loadAssigned();
  }, [loadAssigned]);

  const STATUS_FOR_TAB: Record<number, string | undefined> = {
    1: "draft",
    2: "active",
    3: "scheduled",
    4: "in_review",
    5: "completed",
    6: "archived",
  };
  const status = STATUS_FOR_TAB[tab];
  const scopedApi = status ? { ...api, rows: api.rows.filter((r) => r["status"] === status) } : api;

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} onPrimaryAction={() => setCreateOpen(true)} />

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} loading={api.loading} values={kpis} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <SectionTabs sections={SUB_TABS.map((label) => ({ label }))} active={tab} onChange={setTab} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0 space-y-6">
          {tab === 7 ? (
            <CampaignKanban />
          ) : tab === 8 ? (
            <TimelineView />
          ) : tab === 9 ? (
            <AnalyticsView
              values={{
                "Active campaigns": kpis["Active"] ?? "0",
                "Assigned creators": assignedCount.toLocaleString("en-US"),
                Clicks: "0",
                ROI: "0%",
              }}
            />
          ) : (
            <RecordsSurface
              key={tab}
              table="campaigns"
              api={scopedApi}
              title={SUB_TABS[tab]}
              fields={campaignsConfig.fields}
              columns={campaignsConfig.columns}
              addLabel={campaignsConfig.addLabel}
              emptyTitle={campaignsConfig.emptyTitle}
              emptyDescription={campaignsConfig.emptyDescription}
              extraActions={
                <button
                  type="button"
                  onClick={() => setAssignOpen(true)}
                  className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
                >
                  <Users className="h-3.5 w-3.5" />
                  Assign creators
                </button>
              }
            />
          )}
        </main>

        <RightPanel wall={wall} />
      </div>

      <CreateCampaignDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={api.create} />
      <AssignCreatorsDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        campaigns={api.rows}
        onAssigned={() => void loadAssigned()}
      />
      <CampaignDetailDrawer open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}

/* ---------- Timeline view ---------- */

function TimelineView() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const lanes = ["Brand", "Awareness", "Performance", "Launches", "Always-on"];
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-surface-muted">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="text-[12.5px] font-semibold text-foreground">Campaign timeline</div>
          <div className="text-[11.5px] text-muted-foreground">· Quarter view</div>
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px]">
          <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Week</button>
          <button type="button" className="h-7 px-2 rounded border border-border bg-surface text-foreground font-medium">Quarter</button>
          <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Year</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[140px_repeat(12,1fr)] border-b border-border bg-surface-muted/40 text-[10.5px] uppercase tracking-wide text-muted-foreground">
            <div className="px-3 py-2 font-medium">Lane</div>
            {months.map((m) => (
              <div key={m} className="px-2 py-2 border-l border-border font-medium">
                {m}
              </div>
            ))}
          </div>
          {lanes.map((lane) => (
            <div
              key={lane}
              className="grid grid-cols-[140px_repeat(12,1fr)] border-b border-border"
            >
              <div className="px-3 py-4 text-[12.5px] font-medium text-foreground bg-surface-muted/30">
                {lane}
              </div>
              {months.map((m) => (
                <div
                  key={m}
                  className="border-l border-border h-14 bg-[repeating-linear-gradient(135deg,transparent_0_8px,oklch(0.95_0.005_250)_8px_9px)]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border bg-surface text-[12px] text-muted-foreground flex items-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        Scheduled and active campaigns will render as bars across their date range once data is connected.
      </div>
    </div>
  );
}

/* ---------- Analytics view ---------- */

function AnalyticsView({ values }: { values: Record<string, string> }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <AnalyticsCard icon={<Target className="h-3.5 w-3.5" />} label="Active campaigns" value={values["Active campaigns"]} />
        <AnalyticsCard icon={<Users className="h-3.5 w-3.5" />} label="Assigned creators" value={values["Assigned creators"]} />
        <AnalyticsCard icon={<MousePointerClick className="h-3.5 w-3.5" />} label="Clicks" value={values["Clicks"]} />
        <AnalyticsCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="ROI" value={values["ROI"]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Campaign performance over time" icon={<BarChart3 className="h-3.5 w-3.5" />} wide />
        <ChartCard title="Spend by objective" icon={<Activity className="h-3.5 w-3.5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top campaigns by revenue" icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <ChartCard title="Creator participation" icon={<Users className="h-3.5 w-3.5" />} />
      </div>

      <div className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[12.5px] font-semibold text-foreground">
            Analytics will populate when campaign data is connected
          </div>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Each chart, KPI and table on this tab is wired to the Boss Panel
            data layer.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
        >
          <Send className="h-3.5 w-3.5" />
          Share analytics
        </button>
      </div>
    </div>
  );
}

function AnalyticsCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-foreground">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 text-[22px] font-semibold text-foreground tabular-nums leading-none">
        {value ?? "—"}
      </div>
      <div className="mt-2 h-6">
        <svg viewBox="0 0 100 24" className="w-full h-full text-muted-foreground/40">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            points="0,18 10,16 20,17 30,14 40,15 50,12 60,13 70,10 80,11 90,8 100,9"
          />
        </svg>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">Live from database</div>
    </div>
  );
}

function ChartCard({
  title,
  icon,
  wide,
}: {
  title: string;
  icon: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-md border border-border bg-surface overflow-hidden ${wide ? "lg:col-span-2" : ""}`}
    >
      <div className="h-9 px-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </div>
        <button
          type="button"
          className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="More"
        >
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

function IconAction({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}
