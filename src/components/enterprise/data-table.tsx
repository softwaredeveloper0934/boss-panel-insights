import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Inbox,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { ColumnManager } from "./column-manager";
import { DENSITY_ROW_HEIGHT, type ColumnDef, type TableLayoutApi } from "./table-layout";

const SELECT_W = 40;
const ACTION_W = 56;
const OVERSCAN = 8;

export type SortState = { key: string; dir: "asc" | "desc" } | null;

export type DataTableProps<T> = {
  /** Stable key used for scroll restoration. */
  tableKey: string;
  title?: string;
  defs: ColumnDef<T>[];
  layout: TableLayoutApi<T>;
  rows: T[];
  rowKey: (row: T) => string;
  /** Total server-side count when known (server pagination ready). */
  totalCount?: number;
  loading?: boolean;
  loadingMore?: boolean;
  error?: string | null;
  onRetry?: () => void;
  hasMore?: boolean;
  /** Called when the viewport approaches the end of the loaded window. */
  onLoadMore?: () => void;
  sort?: SortState;
  /** Server-side sorting hook. */
  onSortChange?: (sort: SortState) => void;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  /** Header slot rendered to the right of the title. */
  headerExtra?: React.ReactNode;
  /** Footer slot (pagination controls live here). */
  footer?: React.ReactNode;
  /** Scroll viewport height in px. */
  height?: number;
};

/**
 * Windowed, virtualized enterprise data table.
 *
 * - renders only the visible row window (lazy rendering, large-dataset safe)
 * - sticky header, sticky selection/first column, sticky action column
 * - infinite scrolling with a load-more edge trigger
 * - skeleton / empty / error states
 * - scroll position preserved per `tableKey`
 * - server-side pagination, filtering and sorting are driven by props
 */
export function DataTable<T>({
  tableKey,
  title,
  defs,
  layout,
  rows,
  rowKey,
  totalCount,
  loading = false,
  loadingMore = false,
  error = null,
  onRetry,
  hasMore = false,
  onLoadMore,
  sort = null,
  onSortChange,
  selectedIds,
  onSelectionChange,
  onRowClick,
  rowActions,
  emptyTitle = "No records yet",
  emptyDescription = "Records appear here once data is available.",
  emptyAction,
  headerExtra,
  footer,
  height = 520,
}: DataTableProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const rowHeight = DENSITY_ROW_HEIGHT[layout.layout.density];
  const cols = layout.visibleColumns;

  const offsets = useMemo(() => {
    let left = SELECT_W;
    const lefts: Record<string, number> = {};
    for (const c of cols) {
      if (c.state.pin === "left") {
        lefts[c.def.key] = left;
        left += c.state.width;
      }
    }
    let right = ACTION_W;
    const rights: Record<string, number> = {};
    for (let i = cols.length - 1; i >= 0; i--) {
      const c = cols[i]!;
      if (c.state.pin === "right") {
        rights[c.def.key] = right;
        right += c.state.width;
      }
    }
    return { lefts, rights };
  }, [cols]);

  const totalWidth = useMemo(
    () => SELECT_W + ACTION_W + cols.reduce((sum, c) => sum + c.state.width, 0),
    [cols],
  );

  // Restore scroll position for this table.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof window === "undefined") return;
    const saved = window.sessionStorage.getItem(`dt-scroll.${tableKey}`);
    if (saved) {
      const top = Number(saved);
      if (Number.isFinite(top)) {
        el.scrollTop = top;
        setScrollTop(top);
      }
    }
  }, [tableKey]);

  const frame = useRef<number | null>(null);
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (frame.current != null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const top = el.scrollTop;
      setScrollTop(top);
      try {
        window.sessionStorage.setItem(`dt-scroll.${tableKey}`, String(top));
      } catch {
        /* ignore */
      }
      if (
        hasMore &&
        !loadingMore &&
        !loading &&
        onLoadMore &&
        top + el.clientHeight >= el.scrollHeight - rowHeight * 6
      ) {
        onLoadMore();
      }
    });
  }, [hasMore, loading, loadingMore, onLoadMore, rowHeight, tableKey]);

  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  /** Visible width of the scroller, so pinned states stay centred on screen. */
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setViewportWidth(el.clientWidth));
    ro.observe(el);
    setViewportWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const viewportRows = Math.ceil(height / rowHeight);

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const end = Math.min(rows.length, start + viewportRows + OVERSCAN * 2);
  const windowRows = rows.slice(start, end);

  const allSelected =
    rows.length > 0 && selectedIds != null && rows.every((r) => selectedIds.has(rowKey(r)));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) onSelectionChange(new Set());
    else onSelectionChange(new Set(rows.map(rowKey)));
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const cycleSort = (key: string) => {
    if (!onSortChange) return;
    if (!sort || sort.key !== key) onSortChange({ key, dir: "asc" });
    else if (sort.dir === "asc") onSortChange({ key, dir: "desc" });
    else onSortChange(null);
  };

  const countLabel =
    typeof totalCount === "number"
      ? `${totalCount.toLocaleString()} record${totalCount === 1 ? "" : "s"}`
      : `${rows.length.toLocaleString()} loaded`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 h-10 border-b border-border bg-surface-muted">
        <div className="text-[12.5px] font-semibold text-foreground truncate">
          {title ?? "Records"}
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          {headerExtra}
          <span className="tabular-nums">{countLabel}</span>
          {rows.length > 0 ? (
            <>
              <span aria-hidden>·</span>
              <span className="tabular-nums">
                showing {start + 1}–{Math.min(end, rows.length)}
              </span>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setColumnsOpen(true)}
            aria-label="Columns and layout"
            title="Columns and layout"
            className="ml-1 h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              aria-label="Reload table"
              title="Reload table"
              className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          ) : null}
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        style={{ height }}
        className="relative overflow-auto overscroll-contain scroll-smooth"
        role="grid"
        aria-rowcount={totalCount ?? rows.length}
        aria-busy={loading}
      >
        <div style={{ width: totalWidth, minWidth: "100%" }}>
          {/* sticky header */}
          <div
            role="row"
            className="sticky top-0 z-30 flex h-9 items-stretch border-b border-border bg-surface-muted text-[11.5px] uppercase tracking-wide text-muted-foreground"
          >
            <div
              className="sticky left-0 z-40 flex items-center justify-center bg-surface-muted border-r border-border"
              style={{ width: SELECT_W, minWidth: SELECT_W }}
            >
              <input
                type="checkbox"
                aria-label="Select all loaded rows"
                checked={allSelected}
                onChange={toggleAll}
                disabled={rows.length === 0 || !onSelectionChange}
                className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)] cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            {cols.map((c) => {
              const pinned = c.state.pin;
              return (
                <div
                  key={c.def.key}
                  role="columnheader"
                  aria-sort={
                    sort?.key === c.def.key
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  style={{
                    width: c.state.width,
                    minWidth: c.state.width,
                    left: pinned === "left" ? offsets.lefts[c.def.key] : undefined,
                    right: pinned === "right" ? offsets.rights[c.def.key] : undefined,
                  }}
                  className={[
                    "group relative flex items-center px-3 font-medium",
                    pinned ? "sticky z-40 bg-surface-muted" : "",
                    pinned === "left" ? "border-r border-border" : "",
                    pinned === "right" ? "border-l border-border" : "",
                    c.def.align === "right" ? "justify-end" : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => (c.def.sortable === false ? undefined : cycleSort(c.def.key))}
                    className={[
                      "inline-flex items-center gap-1 truncate",
                      c.def.sortable === false
                        ? "cursor-default"
                        : "cursor-pointer hover:text-foreground",
                      sort?.key === c.def.key ? "text-foreground" : "",
                    ].join(" ")}
                  >
                    <span className="truncate">{c.def.header}</span>
                    {c.def.sortable === false ? null : sort?.key === c.def.key ? (
                      sort.dir === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 opacity-0 group-hover:opacity-60" />
                    )}
                  </button>
                  <ResizeHandle
                    onResize={(delta) => layout.setWidth(c.def.key, c.state.width + delta)}
                    onAuto={() => layout.autoWidth()}
                    label={c.def.header}
                  />
                </div>
              );
            })}
            <div
              className="sticky right-0 z-40 flex items-center justify-center bg-surface-muted border-l border-border"
              style={{ width: ACTION_W, minWidth: ACTION_W }}
            >
              <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
            </div>
          </div>

          {/* Non-row states stay pinned to the viewport, never scrolled out
              sideways by wide column sets. */}
          {error || loading || rows.length === 0 ? (
            <div
              className="sticky left-0 max-w-full"
              style={{ width: viewportWidth ?? "100%" }}
            >

              {error ? (
                <ErrorState message={error} onRetry={onRetry} />
              ) : loading ? (
                <SkeletonRows
                  rows={Math.max(6, viewportRows)}
                  cols={cols.length}
                  height={rowHeight}
                />
              ) : (
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  action={emptyAction}
                />
              )}
            </div>
          ) : (

            <div style={{ height: rows.length * rowHeight }} className="relative">
              <div
                style={{ transform: `translateY(${start * rowHeight}px)` }}
                className="absolute inset-x-0 top-0"
              >
                {windowRows.map((row, i) => {
                  const id = rowKey(row);
                  return (
                    <TableRow
                      key={id}
                      id={id}
                      index={start + i}
                      height={rowHeight}
                      cols={cols}
                      offsets={offsets}
                      row={row}
                      selected={selectedIds?.has(id) ?? false}
                      onToggle={toggleRow}
                      onClick={onRowClick}
                      actions={rowActions}
                      selectable={Boolean(onSelectionChange)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {loadingMore ? (
            <div className="flex items-center justify-center gap-2 py-3 text-[12px] text-muted-foreground border-t border-border">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading more…
            </div>
          ) : hasMore && rows.length > 0 ? (
            <div className="flex items-center justify-center py-3 border-t border-border">
              <button
                type="button"
                onClick={onLoadMore}
                className="h-7 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px] text-foreground cursor-pointer"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {footer}

      <ColumnManager open={columnsOpen} onOpenChange={setColumnsOpen} defs={defs} api={layout} />
    </div>
  );
}

type Cols<T> = { def: ColumnDef<T>; state: { width: number; pin: "left" | "right" | null } }[];

const TableRow = memo(function TableRow<T>({
  id,
  index,
  height,
  cols,
  offsets,
  row,
  selected,
  onToggle,
  onClick,
  actions,
  selectable,
}: {
  id: string;
  index: number;
  height: number;
  cols: Cols<T>;
  offsets: { lefts: Record<string, number>; rights: Record<string, number> };
  row: T;
  selected: boolean;
  onToggle: (id: string) => void;
  onClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  selectable: boolean;
}) {
  return (
    <div
      role="row"
      aria-rowindex={index + 1}
      aria-selected={selected}
      tabIndex={0}
      onClick={() => onClick?.(row)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.(row);
        if (e.key === " " && selectable) {
          e.preventDefault();
          onToggle(id);
        }
      }}
      style={{ height }}
      className={[
        "group flex items-stretch border-b border-border text-[12.5px] outline-none transition-colors",
        selected ? "bg-primary/[0.06]" : "bg-surface hover:bg-muted/50",
        "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
    >
      <div
        className={[
          "sticky left-0 z-20 flex items-center justify-center border-r border-border",
          selected
            ? "bg-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-surface))]"
            : "bg-surface group-hover:bg-muted/50",
        ].join(" ")}
        style={{ width: SELECT_W, minWidth: SELECT_W }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          aria-label={`Select row ${index + 1}`}
          checked={selected}
          disabled={!selectable}
          onChange={() => onToggle(id)}
          className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)] cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      {cols.map((c) => {
        const pinned = c.state.pin;
        return (
          <div
            key={c.def.key}
            role="gridcell"
            style={{
              width: c.state.width,
              minWidth: c.state.width,
              left: pinned === "left" ? offsets.lefts[c.def.key] : undefined,
              right: pinned === "right" ? offsets.rights[c.def.key] : undefined,
            }}
            className={[
              "flex items-center px-3 min-w-0",
              pinned
                ? selected
                  ? "sticky z-20 bg-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-surface))]"
                  : "sticky z-20 bg-surface group-hover:bg-muted/50"
                : "",
              pinned === "left" ? "border-r border-border" : "",
              pinned === "right" ? "border-l border-border" : "",
              c.def.align === "right" ? "justify-end tabular-nums" : "",
              c.def.align === "center" ? "justify-center" : "",
            ].join(" ")}
          >
            <div className="truncate w-full">
              {c.def.render
                ? c.def.render(row)
                : String((row as Record<string, unknown>)[c.def.key] ?? "—")}
            </div>
          </div>
        );
      })}
      <div
        className={[
          "sticky right-0 z-20 flex items-center justify-center border-l border-border",
          selected
            ? "bg-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-surface))]"
            : "bg-surface group-hover:bg-muted/50",
        ].join(" ")}
        style={{ width: ACTION_W, minWidth: ACTION_W }}
        onClick={(e) => e.stopPropagation()}
      >
        {actions ? actions(row) : null}
      </div>
    </div>
  );
}) as <T>(props: {
  id: string;
  index: number;
  height: number;
  cols: Cols<T>;
  offsets: { lefts: Record<string, number>; rights: Record<string, number> };
  row: T;
  selected: boolean;
  onToggle: (id: string) => void;
  onClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  selectable: boolean;
}) => React.ReactElement;

function ResizeHandle({
  onResize,
  onAuto,
  label,
}: {
  onResize: (delta: number) => void;
  onAuto: () => void;
  label: string;
}) {
  const startX = useRef(0);
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      tabIndex={0}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startX.current = e.clientX;
        const target = e.currentTarget;
        target.setPointerCapture(e.pointerId);
        const move = (ev: PointerEvent) => {
          const delta = ev.clientX - startX.current;
          if (Math.abs(delta) >= 4) {
            startX.current = ev.clientX;
            onResize(delta);
          }
        };
        const up = () => {
          target.removeEventListener("pointermove", move);
          target.removeEventListener("pointerup", up);
        };
        target.addEventListener("pointermove", move);
        target.addEventListener("pointerup", up);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onAuto();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onResize(-12);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onResize(12);
        }
      }}
      className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize touch-none hover:bg-primary/40 focus-visible:bg-primary/60 outline-none"
    />
  );
}

function SkeletonRows({ rows, cols, height }: { rows: number; cols: number; height: number }) {
  return (
    <div aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{ height }}
          className="flex items-center gap-3 border-b border-border px-4"
        >
          <div className="h-3.5 w-3.5 rounded bg-muted animate-pulse" />
          {Array.from({ length: Math.max(3, Math.min(cols, 8)) }).map((__, j) => (
            <div
              key={j}
              className="h-2.5 rounded bg-muted animate-pulse"
              style={{ width: `${60 + ((i + j) % 4) * 30}px`, animationDelay: `${(j % 4) * 80}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-16 px-6 grid place-items-center text-center">
      <div className="h-12 w-12 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="text-[14px] font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">{description}</p>
      {action ? <div className="mt-4 flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="py-16 px-6 grid place-items-center text-center">
      <div className="h-12 w-12 rounded-full bg-destructive/10 grid place-items-center text-destructive mb-3">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="text-[14px] font-semibold text-foreground">Could not load records</div>
      <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      ) : null}
    </div>
  );
}
