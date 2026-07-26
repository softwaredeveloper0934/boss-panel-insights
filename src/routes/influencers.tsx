import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Inbox,
  LayoutGrid,
  ListFilter,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Tag,
  Upload,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  KpiStrip,
  PageHeader,
  RightPanel,
  SectionTabs,
} from "@/components/influencer/wall-page";
import { InfluencerDetailDrawer } from "@/components/influencer/influencer-detail-drawer";
import { StickyBulkBar } from "@/components/influencer/sticky-bulk-bar";

export const Route = createFileRoute("/influencers")({
  head: () => ({
    meta: [
      { title: "Influencers — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG.influencers.description },
    ],
  }),
  component: InfluencersPage,
});

const COLUMNS = [
  { key: "profile", label: "Profile", w: "min-w-[220px]" },
  { key: "country", label: "Country", w: "min-w-[120px]" },
  { key: "languages", label: "Languages", w: "min-w-[120px]" },
  { key: "categories", label: "Categories", w: "min-w-[140px]" },
  { key: "followers", label: "Followers", w: "min-w-[100px] text-right" },
  { key: "engagement", label: "Engagement", w: "min-w-[110px] text-right" },
  { key: "revenue", label: "Revenue", w: "min-w-[110px] text-right" },
  { key: "commission", label: "Commission", w: "min-w-[110px] text-right" },
  { key: "health", label: "Health", w: "min-w-[90px]" },
  { key: "risk", label: "Risk", w: "min-w-[90px]" },
  { key: "verification", label: "Verification", w: "min-w-[120px]" },
  { key: "status", label: "Status", w: "min-w-[100px]" },
];

const FILTER_CHIPS = [
  "Country",
  "Platform",
  "Category",
  "Tier",
  "Languages",
  "Followers",
  "Engagement",
  "Health score",
  "Risk score",
  "Verification",
  "Status",
];

function InfluencersPage() {
  const wall = WALL_BY_SLUG.influencers;
  const [active, setActive] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("profile");

  // Reserved for future bulk-actions wiring.
  const _ignored = useMemo(() => ({ query, sortKey }), [query, sortKey]);
  void _ignored;

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />

      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>

      <div className="px-6">
        <SectionTabs sections={wall.sections} active={active} onChange={setActive} />
      </div>

      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-[260px] h-8 px-2.5 rounded-md border border-border bg-background">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search by name, handle, email, ID or country…"
                className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTER_CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground transition-colors"
                >
                  <Filter className="h-3.5 w-3.5" />
                  {c}
                </button>
              ))}
              <button
                type="button"
                className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground transition-colors"
              >
                <ListFilter className="h-3.5 w-3.5" />
                Saved views
              </button>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <IconAction title="Refresh"><RefreshCw className="h-3.5 w-3.5" /></IconAction>
              <IconAction title="View"><LayoutGrid className="h-3.5 w-3.5" /></IconAction>
              <IconAction title="Density"><Sliders className="h-3.5 w-3.5" /></IconAction>
              <IconAction title="Import"><Upload className="h-3.5 w-3.5" /></IconAction>
              <IconAction title="Export"><Download className="h-3.5 w-3.5" /></IconAction>
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
              <div className="text-[12.5px] font-semibold text-foreground">
                {wall.tableTitle ?? "Directory"}
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <span>0 records</span>
                <span>·</span>
                <span>Page 1 of 1</span>
                <button
                  type="button"
                  className="ml-2 h-7 w-7 grid place-items-center rounded-md hover:bg-muted"
                  aria-label="Row actions"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
                    <th className="w-8 py-2 pl-4">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)]"
                      />
                    </th>
                    {COLUMNS.map((c) => (
                      <th
                        key={c.key}
                        className={`py-2 px-3 font-medium text-[11.5px] uppercase tracking-wide ${c.w}`}
                      >
                        <button
                          type="button"
                          onClick={() => setSortKey(c.key)}
                          className={`inline-flex items-center gap-1 ${sortKey === c.key ? "text-foreground" : ""}`}
                        >
                          {c.label}
                        </button>
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
                          No influencers yet
                        </div>
                        <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
                          Records will appear here once data is connected from
                          the Boss Panel. You can preview the influencer detail
                          drawer to see the layout that will be used.
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Preview detail drawer
                          </button>
                          <button
                            type="button"
                            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Influencer
                          </button>
                        </div>
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
                <button type="button" className="hover:text-foreground" disabled>
                  Bulk message
                </button>
                <button type="button" className="hover:text-foreground" disabled>
                  Bulk assign
                </button>
                <button type="button" className="hover:text-foreground" disabled>
                  Bulk export
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Rows per page</span>
                <select className="h-7 px-1.5 rounded border border-border bg-surface text-foreground">
                  {[25, 50, 100, 250].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
                <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">
                  Previous
                </button>
                <button type="button" className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">
                  Next
                </button>
              </div>
            </div>
          </div>

          <SegmentTipCard onPreview={() => setDrawerOpen(true)} />
        </main>

        <RightPanel wall={wall} />
      </div>

      <InfluencerDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
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

function SegmentTipCard({ onPreview }: { onPreview: () => void }) {
  return (
    <section className="rounded-md border border-dashed border-border bg-surface-muted px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold text-foreground">
          Built for one million plus records
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Virtualised table, saved views, multi-column sort, server-side filters
          and bulk operations will activate when the Boss Panel data source is
          connected.
        </p>
      </div>
      <button
        type="button"
        onClick={onPreview}
        className="shrink-0 h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
      >
        Preview profile
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}
