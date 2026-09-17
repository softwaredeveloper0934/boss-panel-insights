import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Ban,
  Download,
  Filter,
  Inbox,
  LayoutGrid,
  ListFilter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Trash2,
  Upload,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import { KpiStrip, PageHeader, RightPanel, SectionTabs } from "@/components/influencer/wall-page";
import { InfluencerFormDialog } from "@/components/influencer/influencer-form-dialog";
import { StickyBulkBar } from "@/components/influencer/sticky-bulk-bar";
import { useBulkDialogs } from "@/components/influencer/bulk-dialogs";
import {
  useInfluencerStats,
  useInfluencers,
  type Influencer,
} from "@/lib/use-influencers";

export const Route = createFileRoute("/influencers")({
  head: () => ({
    meta: [
      { title: "Influencers — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG.influencers.description },
      { property: "og:title", content: "Influencer Directory" },
      {
        property: "og:description",
        content: "Create, review and manage every creator record in one directory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const FILTER_CHIPS = ["Country", "Platform", "Category", "Tier", "Verification", "Status"];

const nf = (v: number | string) => Number(v).toLocaleString("en-US");
const money = (v: number | string) =>
  `$${Number(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function InfluencersPage() {
  const wall = WALL_BY_SLUG.influencers;
  const { rows, loading, refresh, create, update, remove, removeMany, setStatusMany } =
    useInfluencers();
  const stats = useInfluencerStats(rows);

  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("profile");
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Influencer | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const { requestConfirm, requestExport, dialogs } = useBulkDialogs();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? rows.filter((r) =>
          [r.full_name, r.handle, r.email, r.country, r.platform, r.id]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q)),
        )
      : rows;
    const sorted = [...list].sort((a, b) => {
      switch (sortKey) {
        case "followers":
          return Number(b.followers) - Number(a.followers);
        case "revenue":
          return Number(b.revenue) - Number(a.revenue);
        case "commission":
          return Number(b.commission) - Number(a.commission);
        case "engagement":
          return Number(b.engagement_rate) - Number(a.engagement_rate);
        case "country":
          return (a.country ?? "").localeCompare(b.country ?? "");
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return a.full_name.localeCompare(b.full_name);
      }
    });
    return sorted.slice(0, pageSize);
  }, [rows, query, sortKey, pageSize]);

  const allShownSelected = filtered.length > 0 && filtered.every((r) => selected.includes(r.id));

  function toggleRow(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(record: Influencer) {
    setEditing(record);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} onPrimaryAction={openCreate} />

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} loading={loading} values={stats} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <SectionTabs sections={wall.sections} active={active} onChange={setActive} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0 space-y-6">
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
                  onClick={() => setSortKey(c.toLowerCase())}
                  className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground transition-colors"
                >
                  <Filter className="h-3.5 w-3.5" />
                  {c}
                </button>
              ))}
              <button
                type="button"
                onClick={() => toast.message("Saved views")}
                className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground transition-colors"
              >
                <ListFilter className="h-3.5 w-3.5" />
                Saved views
              </button>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <IconAction title="Refresh" onClick={() => void refresh()}>
                <RefreshCw className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction title="View" onClick={() => toast.message("Layout options")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction title="Density" onClick={() => toast.message("Density options")}>
                <Sliders className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction title="Import" onClick={() => toast.message("Import influencers")}>
                <Upload className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction
                title="Export"
                onClick={() =>
                  requestExport({
                    count: rows.length,
                    entity: "influencers",
                    onExport: () => undefined,
                  })
                }
              >
                <Download className="h-3.5 w-3.5" />
              </IconAction>
              <button
                type="button"
                onClick={openCreate}
                className="ml-1 h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Influencer
              </button>
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
              <div className="text-[12.5px] font-semibold text-foreground">
                {wall.tableTitle ?? "Directory"}
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <span>{nf(rows.length)} records</span>
                <span>·</span>
                <span>Showing {nf(filtered.length)}</span>
              </div>
            </div>

            <div className="overflow-x-auto overscroll-x-contain">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
                    <th className="w-8 py-2 pl-4">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        checked={allShownSelected}
                        onChange={(e) =>
                          setSelected(e.target.checked ? filtered.map((r) => r.id) : [])
                        }
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
                    <th className="w-20" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={COLUMNS.length + 2} className="py-16 text-center text-muted-foreground">
                        Loading influencers…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={COLUMNS.length + 2} className="py-0">
                        <div className="w-full max-w-full py-16 px-6 grid place-items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
                            <Inbox className="h-5 w-5" />
                          </div>
                          <div className="text-[14px] font-semibold text-foreground">
                            {rows.length === 0 ? "No influencers yet" : "No matching influencers"}
                          </div>
                          <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
                            {rows.length === 0
                              ? "Add your first creator record and it will be stored in the module database."
                              : "Adjust your search to see more records."}
                          </p>
                          <button
                            type="button"
                            onClick={openCreate}
                            className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Influencer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40">
                        <td className="py-2 pl-4">
                          <input
                            type="checkbox"
                            aria-label={`Select ${r.full_name}`}
                            checked={selected.includes(r.id)}
                            onChange={() => toggleRow(r.id)}
                            className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-foreground">{r.full_name}</div>
                          <div className="text-[11.5px] text-muted-foreground">
                            @{r.handle}
                            {r.platform ? ` · ${r.platform}` : ""}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{r.country ?? "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {r.languages.length ? r.languages.join(", ") : "—"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {r.categories.length ? r.categories.join(", ") : "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{nf(r.followers)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {Number(r.engagement_rate).toFixed(2)}%
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{money(r.revenue)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{money(r.commission)}</td>
                        <td className="px-3 py-2 tabular-nums">{r.health_score}</td>
                        <td className="px-3 py-2 tabular-nums">{r.risk_score}</td>
                        <td className="px-3 py-2 capitalize text-muted-foreground">
                          {r.verification}
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[11px] capitalize">
                            {r.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(r)}
                              aria-label={`Edit ${r.full_name}`}
                              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${r.full_name}`}
                              onClick={() =>
                                requestConfirm({
                                  title: "Delete influencer",
                                  description: `${r.full_name} will be permanently removed from the database.`,
                                  confirmLabel: "Delete",
                                  tone: "danger",
                                  onConfirm: () => {
                                    void remove(r.id);
                                    setSelected((prev) => prev.filter((x) => x !== r.id));
                                  },
                                })
                              }
                              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 h-10 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>{selected.length} selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-7 px-1.5 rounded border border-border bg-surface text-foreground"
                >
                  {[25, 50, 100, 250].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </main>

        <RightPanel wall={wall} loading={loading} />
      </div>

      <InfluencerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editing}
        onSubmit={async (values) =>
          editing ? await update(editing.id, values) : await create(values)
        }
      />

      <StickyBulkBar
        count={selected.length}
        entity="influencers"
        onClear={() => setSelected([])}
        actions={[
          {
            key: "approve",
            label: "Approve",
            tone: "primary",
            icon: <UserCheck className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Approve influencers",
                description: `${selected.length} selected influencer${selected.length === 1 ? "" : "s"} will be set to Active.`,
                confirmLabel: "Approve",
                tone: "primary",
                withNote: true,
                noteLabel: "Approval note (optional)",
                onConfirm: (note) => {
                  const ids = selected;
                  void setStatusMany(ids, "active", note).then((ok) => {
                    if (ok) {
                      toast.success(`${ids.length} approved`);
                      setSelected([]);
                    }
                  });
                },
              }),
          },
          {
            key: "reject",
            label: "Reject",
            tone: "danger",
            icon: <UserX className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Reject influencers",
                description: `${selected.length} selected influencer${selected.length === 1 ? "" : "s"} will be marked as Rejected.`,
                confirmLabel: "Reject",
                tone: "danger",
                withNote: true,
                noteLabel: "Rejection reason",
                onConfirm: (note) => {
                  const ids = selected;
                  void setStatusMany(ids, "rejected", note).then((ok) => {
                    if (ok) {
                      toast.success(`${ids.length} rejected`);
                      setSelected([]);
                    }
                  });
                },
              }),
          },
          {
            key: "suspend",
            label: "Suspend",
            tone: "danger",
            icon: <Ban className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Suspend influencers",
                description: `${selected.length} selected influencer${selected.length === 1 ? "" : "s"} will lose panel access until reactivated.`,
                confirmLabel: "Suspend",
                tone: "danger",
                withNote: true,
                noteLabel: "Suspension reason",
                onConfirm: (note) => {
                  const ids = selected;
                  void setStatusMany(ids, "suspended", note).then((ok) => {
                    if (ok) {
                      toast.success(`${ids.length} suspended`);
                      setSelected([]);
                    }
                  });
                },
              }),
          },
          {
            key: "delete",
            label: "Delete",
            tone: "danger",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Delete influencers",
                description: `${selected.length} selected influencer${selected.length === 1 ? "" : "s"} will be permanently removed.`,
                confirmLabel: "Delete",
                tone: "danger",
                onConfirm: () => {
                  const ids = selected;
                  void removeMany(ids).then((ok) => {
                    if (ok) setSelected([]);
                  });
                },
              }),
          },
          {
            key: "export",
            label: "Export",
            icon: <Download className="h-3.5 w-3.5" />,
            onClick: () =>
              requestExport({
                count: selected.length,
                entity: "influencers",
                onExport: () => setSelected([]),
              }),
          },
        ]}
      />

      {dialogs}
    </div>
  );
}

function IconAction({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}
