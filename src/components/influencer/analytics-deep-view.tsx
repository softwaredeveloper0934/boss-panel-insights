import { useState } from "react";
import {
  Activity,
  BarChart3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe2,
  Heart,
  Image as ImageIcon,
  LineChart as LineChartIcon,
  Maximize2,
  Monitor,
  PieChart as PieIcon,
  Smartphone,
  Tablet,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { EmptySurface } from "@/components/influencer/wall-page";

const TABS = [
  { key: "reach", label: "Reach", icon: Eye },
  { key: "engagement", label: "Engagement", icon: Heart },
  { key: "audience", label: "Audience", icon: Users },
  { key: "device", label: "Device", icon: Monitor },
  { key: "country", label: "Country", icon: Globe2 },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function AnalyticsDeepView() {
  const [tab, setTab] = useState<Tab>("reach");
  return (
    <div className="space-y-4">
      <FilterBar />

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="border-b border-border bg-surface-muted/40 overflow-x-auto">
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
          {tab === "reach" && <ReachPanel />}
          {tab === "engagement" && <EngagementPanel />}
          {tab === "audience" && <AudiencePanel />}
          {tab === "device" && <DevicePanel />}
          {tab === "country" && <CountryPanel />}
        </div>
      </div>
    </div>
  );
}

function FilterBar() {
  const chips = ["Date range", "Platform", "Creator", "Campaign", "Content type", "Geography"];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
      {chips.map((c) => (
        <button
          key={c}
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
        >
          <Filter className="h-3.5 w-3.5" />
          {c}
        </button>
      ))}
      <button className="ml-auto h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------ Panels ------------------------------ */

function StatCard({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-[18px] font-semibold tabular-nums">—</div>
      {hint ? <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

function ChartCard({
  title,
  icon,
  height = 200,
  scope,
}: {
  title: string;
  icon: React.ReactNode;
  height?: number;
  scope: Tab;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center gap-2 text-[12.5px] font-semibold">
          {icon}
          <span className="flex-1">{title}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-6 px-1.5 inline-flex items-center gap-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Open drill-down"
          >
            <Maximize2 className="h-3 w-3" />
            Drill down
          </button>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full text-left p-3"
        >
          <MiniChart height={height} />
        </button>
      </div>
      <DrillDownDrawer open={open} onOpenChange={setOpen} title={title} scope={scope} />
    </>
  );
}

function DrillDownDrawer({
  open,
  onOpenChange,
  title,
  scope,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  scope: Tab;
}) {
  const scopedFilters: Record<Tab, string[]> = {
    reach: ["Date range", "Platform", "Content type", "Campaign", "Creator"],
    engagement: ["Date range", "Platform", "Content type", "Post", "Reaction type"],
    audience: ["Age band", "Gender", "Interests", "Follower tier", "Language"],
    device: ["Device class", "OS", "Browser", "Screen size"],
    country: ["Country", "Region", "City", "Language", "Timezone"],
  };
  const downloads = [
    { label: "CSV", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
    { label: "XLSX", icon: <FileSpreadsheet className="h-3.5 w-3.5" /> },
    { label: "PDF report", icon: <FileText className="h-3.5 w-3.5" /> },
    { label: "PNG chart", icon: <ImageIcon className="h-3.5 w-3.5" /> },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed right-0 top-0 z-50 h-full w-full sm:max-w-[720px] bg-background border-l border-border shadow-2xl flex flex-col outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        >
          <div className="h-12 px-4 border-b border-border flex items-center gap-2">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{scope}</div>
            <div className="text-[13px] font-semibold truncate">{title}</div>
            <button onClick={() => onOpenChange(false)} className="ml-auto h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-4 py-3 border-b border-border bg-surface-muted/40">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">Filters scoped to {scope}</div>
            <div className="flex flex-wrap gap-1.5">
              {scopedFilters[scope].map((f) => (
                <button key={f} className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[11.5px]">
                  <Filter className="h-3 w-3" />
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="rounded-md border border-border bg-surface overflow-hidden">
              <div className="h-9 px-3 border-b border-border bg-surface-muted flex items-center text-[12px] font-semibold">Full breakdown</div>
              <div className="p-3"><MiniChart height={220} /></div>
            </div>
            <div className="rounded-md border border-border bg-surface">
              <div className="h-9 px-3 border-b border-border bg-surface-muted flex items-center text-[12px] font-semibold">Detail table</div>
              <EmptySurface title="No rows yet" description="Detail rows populate once data is ingested for this window." />
            </div>
          </div>
          <div className="border-t border-border p-3 flex items-center gap-2 bg-surface-muted/40">
            <div className="text-[11.5px] text-muted-foreground mr-auto">Download insights</div>
            {downloads.map((d) => (
              <button
                key={d.label}
                onClick={() => toast.success(`Preparing ${d.label} export…`)}
                className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted text-[12px]"
              >
                {d.icon}
                {d.label}
              </button>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function MiniChart({ height }: { height: number }) {
  // Purely decorative SVG skeleton, no data — production empty state.
  return (
    <div
      className="relative rounded-md bg-surface-muted/40 border border-dashed border-border overflow-hidden"
      style={{ height }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 200 80" preserveAspectRatio="none">
        <path d="M0 65 L20 55 L40 60 L60 40 L80 45 L100 25 L120 35 L140 20 L160 30 L180 15 L200 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center px-6">
        <div>
          <div className="text-[12.5px] font-semibold">No data yet</div>
          <p className="text-[11.5px] text-muted-foreground max-w-xs">
            Connect a platform or wait for the first data window to close.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReachPanel() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard label="Impressions" hint="All content, all platforms" />
        <StatCard label="Unique reach" />
        <StatCard label="Story views" />
        <StatCard label="Profile visits" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard scope="reach" title="Reach over time" icon={<LineChartIcon className="h-3.5 w-3.5" />} />
        <ChartCard scope="reach" title="Reach by platform" icon={<BarChart3 className="h-3.5 w-3.5" />} />
      </div>
    </div>
  );
}

function EngagementPanel() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard label="Engagement rate" />
        <StatCard label="Likes" />
        <StatCard label="Comments" />
        <StatCard label="Shares & saves" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard scope="engagement" title="Engagement rate trend" icon={<Activity className="h-3.5 w-3.5" />} />
        <ChartCard scope="engagement" title="Top performing posts" icon={<BarChart3 className="h-3.5 w-3.5" />} />
      </div>
    </div>
  );
}

function AudiencePanel() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard label="Total followers" />
        <StatCard label="Net new (30d)" />
        <StatCard label="Median age" />
        <StatCard label="Female / Male / Other" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard scope="audience" title="Age distribution" icon={<BarChart3 className="h-3.5 w-3.5" />} />
        <ChartCard scope="audience" title="Gender split" icon={<PieIcon className="h-3.5 w-3.5" />} />
      </div>
    </div>
  );
}

function DevicePanel() {
  const rows = [
    { icon: <Monitor className="h-3.5 w-3.5" />, label: "Desktop" },
    { icon: <Smartphone className="h-3.5 w-3.5" />, label: "Mobile" },
    { icon: <Tablet className="h-3.5 w-3.5" />, label: "Tablet" },
  ];
  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard scope="device" title="Sessions by device" icon={<PieIcon className="h-3.5 w-3.5" />} />
        <div className="rounded-md border border-border bg-surface overflow-hidden">
          <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center text-[12.5px] font-semibold">Device breakdown</div>
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center justify-between px-3 py-2.5 text-[12.5px]">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded bg-muted grid place-items-center text-muted-foreground">{r.icon}</span>
                  {r.label}
                </div>
                <span className="tabular-nums text-muted-foreground">—</span>
              </li>
            ))}
          </ul>
          <EmptySurface title="No sessions yet" description="Device analytics populate as pixel data arrives." />
        </div>
      </div>
    </div>
  );
}

function CountryPanel() {
  return (
    <div className="space-y-3">
      <ChartCard scope="country" title="Reach heatmap" icon={<Globe2 className="h-3.5 w-3.5" />} height={280} />
      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center text-[12.5px] font-semibold">Top countries</div>
        <EmptySurface
          title="No country data yet"
          description="Country and region breakdowns populate as sessions and orders arrive."
        />
      </div>
    </div>
  );
}
