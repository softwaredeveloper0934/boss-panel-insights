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
  MoreHorizontal,
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
      <div
        ref={ref}
        className="flex items-center overflow-x-auto no-scrollbar scroll-smooth"
      >
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

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-3 sm:px-6 lg:px-8">
        <KpiStrip wall={wall} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <SectionTabs
          sections={wall.sections}
          active={active}
          onChange={setActive}
        />
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <main className="space-y-6">
          <FilterBar scope={wall.shortTitle ?? wall.title} />
          <ContentSurface wall={wall} />
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
        <span className="text-foreground font-medium">
          {wall.shortTitle ?? wall.title}
        </span>
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
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted active:bg-muted/80 text-[12.5px] font-medium text-foreground transition-colors cursor-pointer"
            >
              {a}
            </button>
          ))}
          {wall.primaryAction ? (
            <button
              type="button"
              onClick={() => notify(wall.primaryAction!)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 active:bg-primary text-primary-foreground text-[12.5px] font-medium shadow-sm cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {wall.primaryAction}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- KPI Strip ------------------------------- */

export function KpiStrip({ wall }: { wall: WallConfig }) {
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
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
          <div className="mt-1.5 text-[11px] text-muted-foreground">
            No data yet
          </div>
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
}: { extraChips?: string[]; scope?: string } = {}) {
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
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
          title={`Density: ${density}`}
          onClick={() => {
            const next = density === "comfortable" ? "compact" : "comfortable";
            setDensity(next);
            toast.success(`Row density set to ${next}`);
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
        <IconAction title="Column settings" onClick={() => notify("Column settings")}>
          <Sliders className="h-3.5 w-3.5" />
        </IconAction>
      </div>
    </div>
  );
}

export function FilterChip({
  label,
  scope = "workspace",
}: {
  label: string;
  scope?: string;
}) {
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
            <div className="mt-0.5 text-[11px]">
              Connect {scope} data to populate.
            </div>
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

function ContentSurface({ wall }: { wall: WallConfig }) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      {wall.tableColumns ? (
        <TableSkeleton
          title={wall.tableTitle ?? wall.title}
          columns={wall.tableColumns}
          emptyTitle={
            wall.emptyTitle ??
            `No ${(wall.shortTitle ?? wall.title).toLowerCase()} yet`
          }
          emptyDescription={
            wall.emptyDescription ??
            "Records will appear here once data is connected from the Boss Panel."
          }
          primaryAction={wall.primaryAction}
          scope={wall.shortTitle ?? wall.title}
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

export function TableSkeleton({
  title,
  columns,
  emptyTitle,
  emptyDescription,
  primaryAction,
  scope = "workspace",
}: {
  title: string;
  columns: string[];
  emptyTitle: string;
  emptyDescription: string;
  primaryAction?: string;
  scope?: string;
}) {
  const notify = useConnectToast(scope);
  const [pageSize, setPageSize] = useState(25);
  return (
    <>
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
        <div className="text-[12.5px] font-semibold text-foreground truncate">
          {title}
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          <span>0 records</span>
          <span aria-hidden>·</span>
          <span>Page 1 of 1</span>
          <button
            type="button"
            onClick={() => notify("Table options")}
            aria-label="Table options"
            className="ml-2 h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
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
                  className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)] cursor-pointer"
                />
              </th>
              {columns.map((c) => (
                <th
                  key={c}
                  className="py-2 px-3 font-medium text-[11.5px] uppercase tracking-wide whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length + 2} className="py-0">
                <EmptySurface
                  title={emptyTitle}
                  description={emptyDescription}
                  primaryAction={primaryAction}
                  scope={scope}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>0 selected</span>
          <span aria-hidden>·</span>
          <button
            type="button"
            disabled
            className="opacity-50 cursor-not-allowed"
            title="Select rows to enable bulk actions"
          >
            Bulk actions
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="flex items-center gap-1.5">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-7 px-1.5 rounded border border-border bg-surface text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {[25, 50, 100, 250].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled
            aria-label="Previous page"
            className="h-7 w-7 grid place-items-center rounded border border-border bg-surface text-muted-foreground opacity-50 cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled
            aria-label="Next page"
            className="h-7 w-7 grid place-items-center rounded border border-border bg-surface text-muted-foreground opacity-50 cursor-not-allowed"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
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
    <div className="py-16 px-6 grid place-items-center text-center">
      <div className="h-12 w-12 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="text-[14px] font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">
        {description}
      </p>
      {primaryAction ? (
        <button
          type="button"
          onClick={() => notify(primaryAction)}
          className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium cursor-pointer transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {primaryAction}
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------- Right panel ------------------------------ */

export function RightPanel({ wall }: { wall: WallConfig }) {
  const notify = useConnectToast(wall.shortTitle ?? wall.title);
  const actions = useMemo(
    () =>
      [...(wall.secondaryActions ?? []), wall.primaryAction].filter(
        (a): a is string => Boolean(a),
      ),
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
        <div className="py-6 text-center text-[12.5px] text-muted-foreground">
          No activity yet.
        </div>
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

export function PanelCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "" : "-rotate-90"}`}
          />
        </button>
      </header>
      {open ? <div className="px-3">{children}</div> : null}
    </section>
  );
}
