import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  BadgeCheck,
  Eye,
  Filter,
  Inbox,
  LinkIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  KpiStrip,
  PageHeader,
  RightPanel,
} from "@/components/influencer/wall-page";

export const Route = createFileRoute("/social-accounts")({
  head: () => ({
    meta: [
      { title: "Social Accounts — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["social-accounts"].description },
    ],
  }),
  component: SocialAccountsPage,
});

type Platform = {
  key: string;
  label: string;
  code: string;
  audienceUnit: string;
  perfMetric: string;
};

const PLATFORMS: Platform[] = [
  { key: "all", label: "All Platforms", code: "★", audienceUnit: "Followers", perfMetric: "Engagement" },
  { key: "youtube", label: "YouTube", code: "YT", audienceUnit: "Subscribers", perfMetric: "Watch time" },
  { key: "instagram", label: "Instagram", code: "IG", audienceUnit: "Followers", perfMetric: "Engagement" },
  { key: "facebook", label: "Facebook", code: "FB", audienceUnit: "Page likes", perfMetric: "Reach" },
  { key: "linkedin", label: "LinkedIn", code: "IN", audienceUnit: "Followers", perfMetric: "Impressions" },
  { key: "tiktok", label: "TikTok", code: "TT", audienceUnit: "Followers", perfMetric: "Views" },
  { key: "x", label: "X", code: "X", audienceUnit: "Followers", perfMetric: "Impressions" },
  { key: "telegram", label: "Telegram", code: "TG", audienceUnit: "Members", perfMetric: "Views" },
  { key: "whatsapp", label: "WhatsApp Channel", code: "WA", audienceUnit: "Subscribers", perfMetric: "Reads" },
  { key: "pinterest", label: "Pinterest", code: "PN", audienceUnit: "Followers", perfMetric: "Saves" },
  { key: "threads", label: "Threads", code: "TH", audienceUnit: "Followers", perfMetric: "Reposts" },
  { key: "website", label: "Website", code: "WB", audienceUnit: "Monthly visitors", perfMetric: "Conversions" },
];

const COLUMNS = ["Creator", "Handle", "Audience", "Engagement", "Verified", "Sync", "Health", "Status"];

function SocialAccountsPage() {
  const wall = WALL_BY_SLUG["social-accounts"];
  const [active, setActive] = useState(0);
  const platform = PLATFORMS[active];

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
          {PLATFORMS.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setActive(i)}
                className={[
                  "shrink-0 h-10 px-3 inline-flex items-center gap-2 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <span className="h-5 w-5 grid place-items-center rounded bg-muted text-[9.5px] font-semibold text-muted-foreground">
                  {p.code}
                </span>
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0 space-y-6">
          <PlatformOverview platform={platform} />
          <PerformanceStrip platform={platform} />
          <AccountsTable platform={platform} />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}

/* ---------- Platform overview ---------- */

function PlatformOverview({ platform }: { platform: Platform }) {
  const isAll = platform.key === "all";
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-md bg-muted border border-border grid place-items-center text-[12px] font-semibold text-foreground">
            {platform.code}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-foreground truncate">{platform.label}</h2>
              {!isAll ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-muted text-[10.5px] font-medium text-muted-foreground">
                  <BadgeCheck className="h-3 w-3" /> Ready
                </span>
              ) : null}
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5 max-w-xl">
              {isAll
                ? "Aggregated view across every connected platform."
                : `Manage every ${platform.label} handle connected by your creators — verify ownership, sync audience metrics and monitor performance.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh metrics
          </button>
          <button type="button" className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            Re-verify all
          </button>
          <button type="button" className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium">
            <Plus className="h-3.5 w-3.5" />
            Connect account
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <VerifyStat tone="good" icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Verified handles" value="—" hint="Ownership confirmed" />
        <VerifyStat tone="warn" icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Pending verification" value="—" hint="Awaiting proof" />
        <VerifyStat tone="bad" icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Failed verification" value="—" hint="Requires action" />
        <VerifyStat tone="neutral" icon={<Activity className="h-3.5 w-3.5" />} label="Sync issues" value="—" hint="Last 24h" />
      </div>
    </div>
  );
}

function VerifyStat({
  tone,
  icon,
  label,
  value,
  hint,
}: {
  tone: "good" | "warn" | "bad" | "neutral";
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  const toneCls =
    tone === "good"
      ? "text-success"
      : tone === "warn"
        ? "text-warning"
        : tone === "bad"
          ? "text-destructive"
          : "text-muted-foreground";
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className={`flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide ${toneCls}`}>
        {icon}
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1.5 text-[20px] font-semibold text-foreground tabular-nums leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

/* ---------- Performance strip ---------- */

function PerformanceStrip({ platform }: { platform: Platform }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <PerfCard icon={<Users className="h-3.5 w-3.5" />} label={platform.audienceUnit} />
      <PerfCard icon={<TrendingUp className="h-3.5 w-3.5" />} label={`Avg. ${platform.perfMetric.toLowerCase()}`} />
      <PerfCard icon={<Eye className="h-3.5 w-3.5" />} label="Impressions (30d)" />
      <PerfCard icon={<LinkIcon className="h-3.5 w-3.5" />} label="Clicks to site" />
    </div>
  );
}

function PerfCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-foreground">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 text-[22px] font-semibold text-foreground tabular-nums leading-none">—</div>
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
      <div className="mt-1 text-[11px] text-muted-foreground">No data</div>
    </div>
  );
}

/* ---------- Accounts table ---------- */

function AccountsTable({ platform }: { platform: Platform }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-[240px] h-8 px-2.5 rounded-md border border-border bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${platform.label} handles…`}
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        {["Verified", "Country", "Audience", "Sync status", "Owner"].map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground"
          >
            <Filter className="h-3.5 w-3.5" />
            {c}
          </button>
        ))}
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
          <div className="text-[12.5px] font-semibold text-foreground">
            {platform.label} accounts
          </div>
          <div className="text-[11.5px] text-muted-foreground">0 records · Page 1 of 1</div>
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
                    <div className="text-[14px] font-semibold text-foreground">
                      No {platform.label} accounts connected
                    </div>
                    <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
                      Creators can connect their {platform.label} handle from the onboarding flow. Once connected, audience, engagement and verification status appear here.
                    </p>
                    <button type="button" className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium">
                      <Plus className="h-3.5 w-3.5" />
                      Connect account
                    </button>
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
            <button type="button" className="hover:text-foreground" disabled>Re-verify</button>
            <button type="button" className="hover:text-foreground" disabled>Refresh</button>
            <button type="button" className="hover:text-foreground" disabled>Disconnect</button>
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

// keep MoreHorizontal referenced to satisfy tree-shaking friendly import
void MoreHorizontal;
