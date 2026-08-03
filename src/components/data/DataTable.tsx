/**
 * Premium reusable data table.
 *
 * Frontend-ready, backend-agnostic:
 *   - controlled `data` + `total` so any pagination strategy works
 *   - `onQueryChange` emits a complete `DataQuery` whenever filters /
 *     sort / page / pageSize / search / selection change — wire this to
 *     your Software Vala API.
 *   - bulk actions are gated by RBAC permissions and support
 *     confirmation + audit logging.
 *   - column visibility + order and saved filter/sort presets persist
 *     per-user when `tableId` is provided.
 *   - CSV / XLSX export honours current column visibility + order.
 *   - `realtime.channel` subscribes to the app-wide realtime bus and
 *     silently re-emits the current query.
 *
 * No mock data. Empty / loading / error states are first-class.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Columns3, FileDown, FileSpreadsheet,
  Filter, Loader2, Pencil, RefreshCw, Save, Search, Settings2, Star,
  Trash2, X, Zap,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthz } from "@/lib/rbac/AuthzProvider";
import type { Permission } from "@/lib/rbac/permissions";
import { useRealtime } from "@/lib/realtime/useRealtime";
import { logAudit } from "@/lib/audit/audit";
import {
  exportCsv, exportXlsx, timestampedFilename, type ExportColumn,
} from "@/lib/table/exporters";
import { tablePrefs, type ColumnPref, type SavedPreset } from "@/lib/table/preferences";

export type SortDir = "asc" | "desc";

export interface DataColumn<T> {
  key: string;
  header: string;
  sortKey?: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
  /** Locale-aware value for CSV/XLSX export. Falls back to `row[key]`. */
  exportValue?: (row: T) => string | number | null | undefined;
  /** Hide this column from the show/hide menu (always visible). */
  alwaysVisible?: boolean;
}

export interface DataFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  permission?: Permission;
  variant?: "default" | "destructive";
  /** Ask for confirmation before running. */
  confirm?: {
    title: string;
    description?: string;
    confirmLabel?: string;
    destructive?: boolean;
  };
  /** Emit an audit log entry after run. */
  audit?: { action: string; resource: string };
  onRun: (rows: T[]) => void | Promise<void>;
}

export interface DataQuery {
  search: string;
  filters: Record<string, string | undefined>;
  sort: { key: string; dir: SortDir } | null;
  page: number;
  pageSize: number;
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  total: number;
  rowKey: (row: T) => string;
  /** Enables persisted column prefs + saved presets. */
  tableId?: string;
  /** Resource label used in audit + export filenames. */
  resource?: string;
  viewPermission?: Permission;
  filters?: DataFilter[];
  bulkActions?: BulkAction<T>[];
  searchPlaceholder?: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  onQueryChange?: (q: DataQuery) => void;
  /** Manual + realtime-triggered refresh. */
  onRefresh?: () => void;
  /** Realtime subscription — refresh silently on any bus event. */
  realtime?: { channel: string; enabled?: boolean };
  /** Enable CSV/XLSX export buttons. */
  exportable?: boolean;
  toolbar?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns, data, total, rowKey, tableId, resource = "records",
  viewPermission, filters = [], bulkActions = [],
  searchPlaceholder = "Search…",
  defaultPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  isLoading = false, error = null,
  emptyTitle = "No records yet",
  emptyDescription = "Connect your Software Vala backend to populate this table.",
  onQueryChange, onRefresh, realtime,
  exportable = true, toolbar, className,
}: DataTableProps<T>) {
  const { can, user } = useAuthz();
  const allowed = !viewPermission || can(viewPermission);

  // ---- Column visibility + order (persisted per user via tableId) --------
  const initialOrder = useMemo(() => columns.map((c) => c.key), [columns]);
  const [columnPref, setColumnPref] = useState<ColumnPref>(() => {
    const stored = tableId ? tablePrefs.loadColumns(tableId) : null;
    if (stored) {
      const known = new Set(initialOrder);
      const order = [
        ...stored.order.filter((k) => known.has(k)),
        ...initialOrder.filter((k) => !stored.order.includes(k)),
      ];
      return { order, hidden: stored.hidden.filter((k) => known.has(k)) };
    }
    return { order: initialOrder, hidden: [] };
  });
  useEffect(() => {
    if (tableId) tablePrefs.saveColumns(tableId, columnPref);
  }, [tableId, columnPref]);

  const orderedColumns = useMemo(() => {
    const byKey = new Map(columns.map((c) => [c.key, c]));
    return columnPref.order
      .map((k) => byKey.get(k))
      .filter((c): c is DataColumn<T> => !!c);
  }, [columns, columnPref.order]);
  const visibleColumns = useMemo(
    () => orderedColumns.filter((c) => c.alwaysVisible || !columnPref.hidden.includes(c.key)),
    [orderedColumns, columnPref.hidden],
  );

  const toggleVisible = (key: string) => {
    setColumnPref((p) => ({
      ...p,
      hidden: p.hidden.includes(key) ? p.hidden.filter((k) => k !== key) : [...p.hidden, key],
    }));
  };
  const moveColumn = (key: string, dir: -1 | 1) => {
    setColumnPref((p) => {
      const idx = p.order.indexOf(key);
      if (idx < 0) return p;
      const next = [...p.order];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return p;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...p, order: next };
    });
  };
  const resetColumns = () =>
    setColumnPref({ order: initialOrder, hidden: [] });

  // ---- Query state --------------------------------------------------------
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string | undefined>>({});
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const currentQuery: DataQuery = { search, filters: filterValues, sort, page, pageSize };

  useEffect(() => {
    if (!allowed) return;
    onQueryChange?.(currentQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, JSON.stringify(filterValues), JSON.stringify(sort), page, pageSize, allowed]);

  // ---- Saved presets ------------------------------------------------------
  const [presets, setPresets] = useState<SavedPreset[]>(() =>
    tableId ? tablePrefs.loadPresets(tableId) : [],
  );
  useEffect(() => {
    if (tableId) tablePrefs.savePresets(tableId, presets);
  }, [tableId, presets]);

  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [managerOpen, setManagerOpen] = useState(false);

  const applyPreset = (p: SavedPreset) => {
    setSearch(p.query.search);
    setFilterValues(p.query.filters);
    setSort(p.query.sort);
    setPageSize(p.query.pageSize);
    setPage(1);
    if (p.columns) setColumnPref(p.columns);
  };
  const savePreset = () => {
    if (!presetName.trim()) return;
    const p = tablePrefs.presetFromQuery(presetName.trim(), currentQuery, columnPref);
    setPresets((prev) => [...prev, p]);
    setPresetName("");
    setPresetDialogOpen(false);
  };
  const deletePreset = (id: string) =>
    setPresets((prev) => prev.filter((p) => p.id !== id));
  const renamePreset = (id: string, name: string) =>
    setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  const movePreset = (id: string, dir: -1 | 1) =>
    setPresets((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx < 0) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });


  // ---- Realtime -----------------------------------------------------------
  const rt = useRealtime(
    realtime?.channel,
    () => onRefresh?.() ?? onQueryChange?.(currentQuery),
    realtime?.enabled ?? true,
  );

  // ---- Selection ----------------------------------------------------------
  const visibleActions = useMemo(
    () => bulkActions.filter((a) => !a.permission || can(a.permission)),
    [bulkActions, can],
  );
  const allSelected = data.length > 0 && data.every((r) => selected.has(rowKey(r)));
  const someSelected = !allSelected && data.some((r) => selected.has(rowKey(r)));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) data.forEach((r) => next.delete(rowKey(r)));
    else data.forEach((r) => next.add(rowKey(r)));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSort = (col: DataColumn<T>) => {
    if (!col.sortable) return;
    const key = col.sortKey ?? col.key;
    setSort((prev) =>
      !prev || prev.key !== key
        ? { key, dir: "asc" }
        : prev.dir === "asc" ? { key, dir: "desc" } : null,
    );
    setPage(1);
  };

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;
  const clearFilters = () => { setFilterValues({}); setPage(1); };

  const selectedRows = data.filter((r) => selected.has(rowKey(r)));

  // ---- Bulk action confirm flow ------------------------------------------
  const [pendingAction, setPendingAction] = useState<BulkAction<T> | null>(null);
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

  const runAction = async (a: BulkAction<T>, rows: T[]) => {
    try {
      setBusyActionId(a.id);
      await a.onRun(rows);
      if (a.audit) {
        logAudit({
          actorId: user?.id,
          action: a.audit.action,
          resource: a.audit.resource,
          count: rows.length,
          ids: rows.map(rowKey),
        });
      }
    } finally {
      setBusyActionId(null);
      setPendingAction(null);
    }
  };
  const invokeAction = (a: BulkAction<T>) => {
    if (a.confirm) setPendingAction(a);
    else runAction(a, selectedRows);
  };

  // ---- Export -------------------------------------------------------------
  const exportColumns: ExportColumn<T>[] = useMemo(
    () => visibleColumns.map((c) => ({
      key: c.key,
      header: c.header,
      value: (row) =>
        c.exportValue
          ? c.exportValue(row)
          : ((row as Record<string, unknown>)[c.key] as string | number | null | undefined),
    })),
    [visibleColumns],
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [exportKeys, setExportKeys] = useState<string[] | null>(null);
  const effectiveExportKeys = exportKeys ?? visibleColumns.map((c) => c.key);
  const exportColumnsSelected: ExportColumn<T>[] = useMemo(
    () => exportColumns.filter((c) => effectiveExportKeys.includes(c.key)),
    [exportColumns, effectiveExportKeys],
  );
  const doExport = (fmt: "csv" | "xlsx") => {
    const name = timestampedFilename(resource, fmt);
    if (fmt === "csv") exportCsv(exportColumnsSelected, data, name);
    else exportXlsx(exportColumnsSelected, data, name, resource);
    logAudit({
      actorId: user?.id,
      action: `export.${fmt}`,
      resource,
      count: data.length,
      meta: { filters: filterValues, search, sort, columns: effectiveExportKeys },
    });
    setExportOpen(false);
  };

  if (!allowed) {
    return (
      <div className="bento-card py-16 text-center">
        <p className="text-sm text-muted-foreground">
          You don't have permission to view this list.
        </p>
      </div>
    );
  }

  return (

    <div className={cn("bento-card !p-0 overflow-hidden", className)}>
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 border-b border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="pl-9 h-9"
          />
        </div>

        {filters.map((f) => (
          <Select
            key={f.key}
            value={filterValues[f.key] ?? "__all__"}
            onValueChange={(v) => {
              setFilterValues((prev) => ({ ...prev, [f.key]: v === "__all__" ? undefined : v }));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-auto min-w-[140px]">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All {f.label}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1.5">
            <X className="h-3.5 w-3.5" /> Clear
            <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
          </Button>
        )}

        <div className="ms-auto flex items-center gap-2 flex-wrap">
          {realtime && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] tabular-nums",
                rt.connected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                  : "border-border text-muted-foreground",
              )}
              title={
                rt.connected
                  ? `Live sync active on “${realtime.channel}”. ` +
                    (rt.lastEventAt
                      ? `Last update ${new Date(rt.lastEventAt).toLocaleTimeString()}. `
                      : "No events received yet in this session. ") +
                    "Rows refresh automatically when the backend broadcasts a change."
                  : "Live sync idle — reconnecting on next event."
              }
            >
              <Zap className="h-3 w-3" />
              {rt.connected ? "Live" : "Idle"}
              {rt.lastEventAt && (
                <span className="hidden md:inline text-muted-foreground/80">
                  · {new Date(rt.lastEventAt).toLocaleTimeString()}
                </span>
              )}
            </span>
          )}

          {onRefresh && (
            <Button
              size="sm"
              variant="ghost"
              className="h-9 gap-1.5"
              onClick={onRefresh}
              title="Manual refresh — re-run the current search, filters and sort against the source. Use if realtime sync is idle or a change did not appear automatically."
              aria-label="Refresh"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
            </Button>
          )}


          {/* Presets */}
          {tableId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-9 gap-1.5">
                  <Star className="h-3.5 w-3.5" /> Views
                  {presets.length > 0 && <Badge variant="secondary" className="ml-1">{presets.length}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Saved views</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {presets.length === 0 && (
                  <div className="px-2 py-3 text-xs text-muted-foreground">
                    No saved views yet. Save the current filters and sort as a reusable preset.
                  </div>
                )}
                {presets.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    className="flex items-center justify-between gap-2"
                    onSelect={(e) => { e.preventDefault(); applyPreset(p); }}
                  >
                    <span className="truncate">{p.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deletePreset(p.id); }}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete view"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setPresetDialogOpen(true); }}>
                  <Save className="h-3.5 w-3.5 me-2" /> Save current as view
                </DropdownMenuItem>
                {presets.length > 0 && (
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setManagerOpen(true); }}>
                    <Settings2 className="h-3.5 w-3.5 me-2" /> Manage views…
                  </DropdownMenuItem>
                )}

              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column show/hide + order */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 gap-1.5">
                <Columns3 className="h-3.5 w-3.5" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Show / order columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {orderedColumns.map((c, idx) => (
                <div key={c.key} className="flex items-center gap-2 px-2 py-1.5">
                  <Checkbox
                    checked={!columnPref.hidden.includes(c.key)}
                    disabled={c.alwaysVisible}
                    onCheckedChange={() => toggleVisible(c.key)}
                  />
                  <span className="text-sm flex-1 truncate">{c.header}</span>
                  <button
                    onClick={() => moveColumn(c.key, -1)}
                    disabled={idx === 0}
                    className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveColumn(c.key, 1)}
                    disabled={idx === orderedColumns.length - 1}
                    className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); resetColumns(); }}>
                <Settings2 className="h-3.5 w-3.5 me-2" /> Reset to default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          {exportable && (
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-1.5"
              disabled={data.length === 0}
              onClick={() => {
                setExportKeys(visibleColumns.map((c) => c.key));
                setExportOpen(true);
              }}
            >
              <FileDown className="h-3.5 w-3.5" /> Export
            </Button>
          )}


          {/* Bulk actions */}
          {selected.size > 0 && visibleActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-9 gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  {selected.size} selected
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Bulk actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleActions.map((a) => (
                  <DropdownMenuItem
                    key={a.id}
                    disabled={busyActionId === a.id}
                    className={a.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
                    onSelect={(e) => { e.preventDefault(); invokeAction(a); }}
                  >
                    {a.icon}
                    <span className={a.icon ? "ms-2" : ""}>{a.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {toolbar}
        </div>
      </div>

      {/* TABLE */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-background/60 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {visibleActions.length > 0 && (
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {visibleColumns.map((c) => {
                const isSorted = sort?.key === (c.sortKey ?? c.key);
                return (
                  <TableHead
                    key={c.key}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.sortable && "cursor-pointer select-none hover:text-foreground",
                      c.headerClassName,
                    )}
                    onClick={() => handleSort(c)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {c.header}
                      {c.sortable && (
                        isSorted ? (
                          sort!.dir === "asc"
                            ? <ArrowUp className="h-3 w-3" />
                            : <ArrowDown className="h-3 w-3" />
                        ) : <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (visibleActions.length > 0 ? 1 : 0)}
                  className="py-16 text-center text-sm text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (visibleActions.length > 0 ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <p className="text-sm font-medium">{emptyTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{emptyDescription}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const id = rowKey(row);
                const isSel = selected.has(id);
                return (
                  <TableRow key={id} data-state={isSel ? "selected" : undefined}>
                    {visibleActions.length > 0 && (
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={isSel}
                          onCheckedChange={() => toggleOne(id)}
                          aria-label="Select row"
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={cn(
                          c.align === "right" && "text-right",
                          c.align === "center" && "text-center",
                          c.className,
                        )}
                      >
                        {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as ReactNode ?? "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {total === 0 ? "0 results" : (
            <>
              <span className="font-medium text-foreground">
                {(Math.min(page, Math.max(1, Math.ceil(total / pageSize))) - 1) * pageSize + 1}–
                {Math.min(Math.min(page, Math.max(1, Math.ceil(total / pageSize))) * pageSize, total)}
              </span>{" "}
              of <span className="font-medium text-foreground">{total.toLocaleString()}</span>
            </>
          )}
        </div>

        <div className="ms-auto flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-muted-foreground">Rows</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-8 w-[72px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(() => {
            const pageCount = Math.max(1, Math.ceil(total / pageSize));
            const safePage = Math.min(page, pageCount);
            return (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage <= 1} onClick={() => setPage(1)}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-xs text-muted-foreground tabular-nums">
                  {safePage} / {pageCount}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage >= pageCount} onClick={() => setPage(pageCount)}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* CONFIRM DIALOG (bulk action) */}
      <Dialog open={!!pendingAction} onOpenChange={(o) => !o && setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pendingAction?.confirm?.title}</DialogTitle>
            {pendingAction?.confirm?.description && (
              <DialogDescription>{pendingAction.confirm.description}</DialogDescription>
            )}
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will apply to <span className="font-semibold text-foreground">{selectedRows.length}</span>{" "}
            {resource}.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingAction(null)}>Cancel</Button>
            <Button
              variant={pendingAction?.confirm?.destructive ? "destructive" : "default"}
              disabled={busyActionId === pendingAction?.id}
              onClick={() => pendingAction && runAction(pendingAction, selectedRows)}
            >
              {pendingAction?.confirm?.confirmLabel ?? "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SAVE PRESET DIALOG */}
      <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save current view</DialogTitle>
            <DialogDescription>
              Capture current search, filters, sort, page size and columns as a reusable preset.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="View name (e.g. High-value USA leads)"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && savePreset()}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPresetDialogOpen(false)}>Cancel</Button>
            <Button disabled={!presetName.trim()} onClick={savePreset}>Save view</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MANAGE VIEWS DIALOG */}
      <Dialog open={managerOpen} onOpenChange={setManagerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage saved views</DialogTitle>
            <DialogDescription>
              Rename, reorder or delete your saved filter and sorting presets for this module.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto space-y-1.5">
            {presets.length === 0 && (
              <p className="text-xs text-muted-foreground py-6 text-center">No saved views yet.</p>
            )}
            {presets.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-2 rounded-md border border-border p-2">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <Input
                  value={p.name}
                  onChange={(e) => renamePreset(p.id, e.target.value)}
                  className="h-8 flex-1"
                />
                <button
                  onClick={() => movePreset(p.id, -1)}
                  disabled={idx === 0}
                  className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                  aria-label="Move up"
                ><ArrowUp className="h-4 w-4" /></button>
                <button
                  onClick={() => movePreset(p.id, 1)}
                  disabled={idx === presets.length - 1}
                  className="text-muted-foreground disabled:opacity-30 hover:text-foreground"
                  aria-label="Move down"
                ><ArrowDown className="h-4 w-4" /></button>
                <button
                  onClick={() => deletePreset(p.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete view"
                ><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setManagerOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EXPORT CONFIG DIALOG */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configure export</DialogTitle>
            <DialogDescription>
              Pick fields to include. Values use your active locale and currency
              formatting — the preview below matches what your CSV / XLSX will contain.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
                <span>Fields ({effectiveExportKeys.length}/{exportColumns.length})</span>
                <button
                  onClick={() => setExportKeys(exportColumns.map((c) => c.key))}
                  className="hover:text-foreground"
                >All</button>
              </div>
              {exportColumns.map((c) => {
                const on = effectiveExportKeys.includes(c.key);
                return (
                  <label key={c.key} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-muted/50 cursor-pointer">
                    <Checkbox
                      checked={on}
                      onCheckedChange={() =>
                        setExportKeys((prev) => {
                          const base = prev ?? visibleColumns.map((v) => v.key);
                          return on ? base.filter((k) => k !== c.key) : [...base, c.key];
                        })
                      }
                    />
                    <span className="text-sm truncate">{c.header}</span>
                  </label>
                );
              })}
            </div>

            <div className="border border-border rounded-md overflow-hidden">
              <div className="bg-muted/40 px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                Preview · first {Math.min(5, data.length)} of {data.length.toLocaleString()} rows
              </div>
              <div className="overflow-x-auto max-h-[45vh]">
                <table className="w-full text-xs">
                  <thead className="bg-muted/20">
                    <tr>
                      {exportColumnsSelected.map((c) => (
                        <th key={c.key} className="text-left font-semibold px-2.5 py-1.5 whitespace-nowrap">
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {exportColumnsSelected.map((c) => (
                          <td key={c.key} className="px-2.5 py-1.5 whitespace-nowrap tabular-nums">
                            {String(c.value(row) ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr><td className="px-2.5 py-4 text-muted-foreground" colSpan={exportColumnsSelected.length || 1}>
                        No rows to export.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setExportOpen(false)}>Cancel</Button>
            <Button
              variant="outline"
              disabled={exportColumnsSelected.length === 0 || data.length === 0}
              onClick={() => doExport("csv")}
            ><FileDown className="h-3.5 w-3.5 me-1.5" /> Export CSV</Button>
            <Button
              disabled={exportColumnsSelected.length === 0 || data.length === 0}
              onClick={() => doExport("xlsx")}
            ><FileSpreadsheet className="h-3.5 w-3.5 me-1.5" /> Export XLSX</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

}

// Re-export types some routes import from this module
export type { ColumnPref, SavedPreset };
// Silence unused import warning for DropdownMenuCheckboxItem in case it's tree-shaken.
void DropdownMenuCheckboxItem;
