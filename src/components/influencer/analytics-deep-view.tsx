import { useState } from "react";
import {
  Activity,
  BarChart3,
  Download,
  Eye,
  Filter,
  Globe2,
  Heart,
  LineChart as LineChartIcon,
  Monitor,
  PieChart as PieIcon,
  Smartphone,
  Tablet,
  Users,
} from "lucide-react";
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
}: {
  title: string;
  icon: React.ReactNode;
  height?: number;
}) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center gap-2 text-[12.5px] font-semibold">
        {icon}
        {title}
      </div>
      <div className="p-3">
        <MiniChart height={height} />
      </div>
    </div>
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
        <ChartCard title="Reach over time" icon={<LineChartIcon className="h-3.5 w-3.5" />} />
        <ChartCard title="Reach by platform" icon={<BarChart3 className="h-3.5 w-3.5" />} />
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
        <ChartCard title="Engagement rate trend" icon={<Activity className="h-3.5 w-3.5" />} />
        <ChartCard title="Top performing posts" icon={<BarChart3 className="h-3.5 w-3.5" />} />
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
        <ChartCard title="Age distribution" icon={<BarChart3 className="h-3.5 w-3.5" />} />
        <ChartCard title="Gender split" icon={<PieIcon className="h-3.5 w-3.5" />} />
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
        <ChartCard title="Sessions by device" icon={<PieIcon className="h-3.5 w-3.5" />} />
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
      <ChartCard title="Reach heatmap" icon={<Globe2 className="h-3.5 w-3.5" />} height={280} />
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
