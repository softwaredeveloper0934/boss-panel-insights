import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Download,
  Filter,
  Inbox,
  LayoutGrid,
  ListFilter,
  Plus,
  RefreshCw,
  Rows3,
  Rows2,
  Search,
  Sliders,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { WallConfig } from "@/lib/influencer-walls";
import { SavedViews } from "@/components/influencer/saved-views";
import { DataTable, type SortState } from "@/components/enterprise/data-table";
import { ColumnManager, useColumnManager } from "@/components/enterprise/column-manager";
import {
  DENSITY_LABEL,
  useTableLayout,
  type ColumnDef,
  type TableDensity,
} from "@/components/enterprise/table-layout";

type WallRow = Record<string, unknown>;

const DENSITY_CYCLE: TableDensity[] = ["comfortable", "compact", "ultra"];

function columnKey(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Shared table engine for every workspace wall: real virtualized DataTable,
 * persisted column layout and a reachable column manager.
 */
export function useWallTable(tableKey: string, columns: string[]) {
  const defs = useMemo<ColumnDef<WallRow>[]>(
    () =>
      columns.map((label, i) => ({
        key: columnKey(label) || `col-${i}`,
        header: label,
        width: i === 0 ? 220 : 150,
        required: i === 0,
        align: /revenue|commission|followers|amount|value|payout|rate|engagement|count|total/i.test(
          label,
        )
          ? "right"
          : "left",
        render: (row) => (row[columnKey(label)] as React.ReactNode) ?? "—",
      })),
    [columns],
  );
  const layout = useTableLayout<WallRow>(tableKey, defs);
  const manager = useColumnManager();
  return { defs, layout, manager };
}

export type WallTableApi = ReturnType<typeof useWallTable>;

/* ----------------------------- shared helpers ----------------------------- */

function useConnectToast(scope: string) {
  return (label: string) =>
    toast.message(label, {
      description: `Available once the ${scope} data source is connected.`,
    });
}

/** Horizontal scroller with left/right fade edges when overflow exists. */
function EdgeScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setEdges({
        left: el.scrollLeft > 2,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className="flex items-center overflow-x-auto no-scrollbar scroll-smooth">
        {children}
      </div>
      {edges.left ? (
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-surface to-transparent" />
      ) : null}
      {edges.right ? (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-surface to-transparent" />
      ) : null}
    </div>
  );
}

/* ------------------------------ main WallPage ----------------------------- */

export function WallPage({ wall }: { wall: WallConfig }) {
  const [active, setActive] = useState(0);
  const table = useWallTable(`wall.${wall.shortTitle ?? wall.title}`, wall.tableColumns ?? []);

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-3 sm:px-6 lg:px-8">
        <KpiStrip wall={wall} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <SectionTabs sections={wall.sections} active={active} onChange={setActive} />
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <main className="min-w-0 space-y-6">
          <FilterBar
            scope={wall.shortTitle ?? wall.title}
            table={wall.tableColumns ? table : undefined}
          />
          <ContentSurface wall={wall} table={table} />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}

/* --------------------------------- Header --------------------------------- */

export function PageHeader({ wall }: { wall: WallConfig }) {
  const notify = useConnectToast(wall.shortTitle ?? wall.title);
  return (
    <div className="border-b border-border bg-surface/60">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-5 pt-6 sm:px-6 sm:pt-7 lg:px-8">
        <div className="flex items-center gap-1.5 text-[12px] leading-5 text-muted-foreground mb-2.5">
          <span>Boss Panel</span>
          <ChevronRight className="h-3 w-3" />
          <span>Influencer Manager</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{wall.shortTitle ?? wall.title}</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[34px]">
              {wall.title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {wall.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {wall.secondaryActions?.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => notify(a)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 text-[13px] font-medium leading-5 text-foreground transition-colors hover:bg-muted active:bg-muted/80 cursor-pointer"
              >
                {a}
              </button>
            ))}
            {wall.primaryAction ? (
              <button
                type="button"
                onClick={() => notify(wall.primaryAction!)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-medium leading-5 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:bg-primary cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {wall.primaryAction}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- KPI Strip ------------------------------- */

export function KpiStrip({ wall }: { wall: WallConfig }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {wall.kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-md border border-border bg-surface p-3 shadow-(--shadow-card) transition-colors hover:border-border-strong"
        >
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground truncate">
            {k.label}
          </div>
          <div className="mt-1.5 text-[20px] font-semibold text-foreground tabular-nums leading-none">
            —
          </div>
          <div className="mt-1.5 text-[11px] text-muted-foreground">No data yet</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Section Tabs ------------------------------ */

export function SectionTabs({
  sections,
  active,
  onChange,
}: {
  sections: WallConfig["sections"];
  active: number;
  onChange: (i: number) => void;
}) {
  if (sections.length === 0) return null;
  return (
    <div className="mt-4 border-b border-border">
      <EdgeScroller>
        {sections.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onChange(i)}
              className={[
                "shrink-0 px-3 h-9 inline-flex items-center text-[12.5px] font-medium border-b-2 -mb-px transition-all cursor-pointer",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border-strong",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </EdgeScroller>
    </div>
  );
}

/* ------------------------------- Filter bar ------------------------------- */

export function FilterBar({
  extraChips,
  scope = "workspace",
  table,
}: { extraChips?: string[]; scope?: string; table?: WallTableApi } = {}) {
  const [query, setQuery] = useState("");
  const [localDensity, setLocalDensity] = useState<TableDensity>("comfortable");
  const density = table ? table.layout.layout.density : localDensity;
  const setDensity = (d: TableDensity) => {
    if (table) table.layout.setDensity(d);
    else setLocalDensity(d);
  };
  const notify = useConnectToast(scope);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
      <div className="flex items-center gap-1.5 flex-1 min-w-[220px] h-8 px-2.5 rounded-md border border-border bg-background focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30 transition-colors">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Filter records…"
          className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear"
            className="h-5 w-5 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>
      <FilterChip label="Country" scope={scope} />
      <FilterChip label="Platform" scope={scope} />
      <FilterChip label="Status" scope={scope} />
      {extraChips?.map((c) => (
        <FilterChip key={c} label={c} scope={scope} />
      ))}
      <button
        type="button"
        onClick={() => notify("More filters")}
        className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground transition-colors cursor-pointer"
      >
        <ListFilter className="h-3.5 w-3.5" />
        More filters
      </button>
      <SavedViews
        scopeKey={scope}
        getCurrentFilters={() => ({ query })}
        onApply={(f) => {
          if (f && typeof (f as { query?: unknown }).query === "string") {
            setQuery((f as { query: string }).query);
          }
        }}
      />
      <div className="ml-auto flex items-center gap-1">
        <IconAction title="Refresh" onClick={() => notify("Refresh")}>
          <RefreshCw className="h-3.5 w-3.5" />
        </IconAction>
        <IconAction title="Toggle view" onClick={() => notify("View mode")}>
          <LayoutGrid className="h-3.5 w-3.5" />
        </IconAction>
        <IconAction
          title={`Row density: ${DENSITY_LABEL[density]}`}
          onClick={() => {
            const next =
              DENSITY_CYCLE[(DENSITY_CYCLE.indexOf(density) + 1) % DENSITY_CYCLE.length]!;
            setDensity(next);
            toast.success(`Row density set to ${DENSITY_LABEL[next]}`);
          }}
        >
          {density === "comfortable" ? (
            <Rows3 className="h-3.5 w-3.5" />
          ) : (
            <Rows2 className="h-3.5 w-3.5" />
          )}
        </IconAction>
        <IconAction title="Import" onClick={() => notify("Import")}>
          <Upload className="h-3.5 w-3.5" />
        </IconAction>
        <IconAction title="Export" onClick={() => notify("Export")}>
          <Download className="h-3.5 w-3.5" />
        </IconAction>
        <IconAction
          title="Column settings"
          onClick={() => {
            if (table) table.manager.setOpen(true);
            else notify("Column settings");
          }}
        >
          <Sliders className="h-3.5 w-3.5" />
        </IconAction>
        {table ? (
          <ColumnManager
            open={table.manager.open}
            onOpenChange={table.manager.setOpen}
            defs={table.defs}
            api={table.layout}
          />
        ) : null}
      </div>
    </div>
  );
}

export function FilterChip({ label, scope = "workspace" }: { label: string; scope?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed text-[12px] transition-colors cursor-pointer",
          open
            ? "border-primary text-foreground bg-muted"
            : "border-border text-foreground bg-background hover:bg-muted",
        ].join(" ")}
      >
        <Filter className="h-3.5 w-3.5" />
        {label}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open ? (
        <div className="absolute z-30 mt-1.5 left-0 w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-(--shadow-popover)">
          <div className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
            {label}
          </div>
          <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">
            No {label.toLowerCase()} options yet.
            <div className="mt-0.5 text-[11px]">Connect {scope} data to populate.</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function IconAction({
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
      aria-label={title}
      onClick={onClick}
      className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ------------------------------ Content surface --------------------------- */

function ContentSurface({ wall, table }: { wall: WallConfig; table?: WallTableApi }) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      {wall.tableColumns ? (
        <TableSkeleton
          title={wall.tableTitle ?? wall.title}
          columns={wall.tableColumns}
          emptyTitle={wall.emptyTitle ?? `No ${(wall.shortTitle ?? wall.title).toLowerCase()} yet`}
          emptyDescription={
            wall.emptyDescription ??
            "Records will appear here once data is connected from the Boss Panel."
          }
          primaryAction={wall.primaryAction}
          scope={wall.shortTitle ?? wall.title}
          table={table}
        />
      ) : (
        <EmptySurface
          title={wall.emptyTitle ?? "Nothing to display yet"}
          description={
            wall.emptyDescription ??
            "This workspace will populate once the Boss Panel data sources are connected."
          }
          primaryAction={wall.primaryAction}
          scope={wall.shortTitle ?? wall.title}
        />
      )}
    </div>
  );
}

/**
 * Live workspace table surface. Mounts the virtualized enterprise DataTable
 * (sticky header + pinned columns + density + column manager + selection +
 * sorting + pagination) instead of a static placeholder.
 */
export function TableSkeleton({
  title,
  columns,
  emptyTitle,
  emptyDescription,
  primaryAction,
  scope = "workspace",
  table,
}: {
  title: string;
  columns: string[];
  emptyTitle: string;
  emptyDescription: string;
  primaryAction?: string;
  scope?: string;
  table?: WallTableApi;
}) {
  const notify = useConnectToast(scope);
  const own = useWallTable(`wall.${scope}.${title}`, columns);
  const api = table ?? own;
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const rows: WallRow[] = [];
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  return (
    <>
      <DataTable<WallRow>
        tableKey={`wall.${scope}.${title}`}
        title={title}
        defs={api.defs}
        layout={api.layout}
        rows={rows}
        rowKey={(r) => String(r["id"] ?? "")}
        totalCount={rows.length}
        sort={sort}
        onSortChange={setSort}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        emptyAction={
          primaryAction ? (
            <button
              type="button"
              onClick={() => notify(primaryAction)}
              className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {primaryAction}
            </button>
          ) : undefined
        }
        height={420}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="tabular-nums">{selectedIds.size} selected</span>
              <span aria-hidden>·</span>
              <button
                type="button"
                onClick={() => api.manager.setOpen(true)}
                className="hover:text-foreground cursor-pointer"
              >
                Columns &amp; layout
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  aria-label="Rows per page"
                  className="h-7 px-1.5 rounded border border-border bg-surface text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {[25, 50, 100, 250].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span className="tabular-nums">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="h-7 w-7 grid place-items-center rounded border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="h-7 w-7 grid place-items-center rounded border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        }
      />
      {table ? null : (
        <ColumnManager
          open={own.manager.open}
          onOpenChange={own.manager.setOpen}
          defs={own.defs}
          api={own.layout}
        />
      )}
    </>
  );
}

export function EmptySurface({
  title,
  description,
  primaryAction,
  scope = "workspace",
}: {
  title: string;
  description: string;
  primaryAction?: string;
  scope?: string;
}) {
  const notify = useConnectToast(scope);
  return (
    <div className="grid place-items-center px-6 py-14 text-center sm:py-16">
      {/* Illustrative empty-state artwork (pure CSS/SVG, no external asset). */}
      <div className="relative mb-4 h-24 w-40" aria-hidden>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/12 via-primary/5 to-transparent" />
        <div className="absolute left-4 top-4 h-3 w-24 rounded-full bg-muted" />
        <div className="absolute left-4 top-10 h-3 w-32 rounded-full bg-muted/70" />
        <div className="absolute left-4 top-16 h-3 w-16 rounded-full bg-muted/50" />
        <div className="absolute -right-1 bottom-2 grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-muted-foreground shadow-(--shadow-card)">
          <Inbox className="h-5 w-5" />
        </div>
      </div>
      <div className="text-[14px] font-semibold text-foreground">{title}</div>
      <p className="mt-1 max-w-md text-[12.5px] leading-5 text-muted-foreground">{description}</p>
      <ul className="mt-3 grid gap-1 text-[11.5px] text-muted-foreground">
        <li>1 · Connect the {scope.toLowerCase()} data source from the Boss Panel</li>
        <li>2 · Configure columns, density and saved views for your team</li>
        <li>3 · Invite reviewers so approvals land in this workspace</li>
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {primaryAction ? (
          <button
            type="button"
            onClick={() => notify(primaryAction)}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            {primaryAction}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => notify("Import records")}
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground cursor-pointer transition-colors"
        >
          <Upload className="h-3.5 w-3.5" />
          Import records
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Right panel ------------------------------ */

export function RightPanel({ wall }: { wall: WallConfig }) {
  const notify = useConnectToast(wall.shortTitle ?? wall.title);
  const actions = useMemo(
    () =>
      [...(wall.secondaryActions ?? []), wall.primaryAction].filter((a): a is string => Boolean(a)),
    [wall.secondaryActions, wall.primaryAction],
  );

  return (
    <aside className="space-y-4">
      <PanelCard title="Quick actions">
        {actions.length ? (
          <ul className="text-[12.5px] divide-y divide-border">
            {actions.map((a) => (
              <li key={a}>
                <button
                  type="button"
                  onClick={() => notify(a)}
                  className="w-full py-2 flex items-center justify-between gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  <span className="truncate">{a}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 text-center text-[12.5px] text-muted-foreground">
            No actions defined.
          </div>
        )}
      </PanelCard>

      <PanelCard title="Activity timeline">
        <div className="py-6 text-center text-[12.5px] text-muted-foreground">No activity yet.</div>
      </PanelCard>

      <PanelCard title="Notifications">
        <div className="py-6 text-center text-[12.5px] text-muted-foreground">
          You&apos;re all caught up.
        </div>
      </PanelCard>

      <PanelCard title="Audit log">
        <div className="py-6 text-center text-[12.5px] text-muted-foreground">
          No audit events recorded.
        </div>
      </PanelCard>
    </aside>
  );
}

export function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="h-9 px-3 flex items-center justify-between border-b border-border">
        <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-wide truncate">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
      </header>
      {open ? <div className="px-3">{children}</div> : null}
    </section>
  );
}
