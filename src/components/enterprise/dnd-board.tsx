import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { History, Keyboard, Lock, MousePointerClick, Undo2 } from "lucide-react";
import { toast } from "sonner";
import {
  formatActivityTime,
  runOptimistic,
  useActivityLog,
  type ActivityEntry,
} from "@/lib/optimistic";

export type BoardColumn = {
  id: string;
  label: string;
  tone?: "neutral" | "info" | "warn" | "good" | "bad";
  /** Columns can refuse inbound cards (permission-aware pipelines). */
  locked?: boolean;
};

export type DndBoardProps<T> = {
  boardKey: string;
  entity: string;
  columns: BoardColumn[];
  cards: T[];
  getId: (card: T) => string;
  getColumnId: (card: T) => string;
  renderCard: (card: T, meta: { dragging: boolean; selected: boolean }) => React.ReactNode;
  /** Persist the move. Reject to trigger rollback. */
  onMove?: (moves: { id: string; from: string; to: string }[]) => Promise<unknown> | void;
  /** Return a reason string to refuse the move. */
  canMove?: (card: T, toColumnId: string) => string | null;
  emptyColumn?: (column: BoardColumn) => React.ReactNode;
  columnFooter?: (column: BoardColumn) => React.ReactNode;
};

const TONE_DOT: Record<NonNullable<BoardColumn["tone"]>, string> = {
  neutral: "bg-muted-foreground/60",
  info: "bg-primary/70",
  warn: "bg-amber-500",
  good: "bg-emerald-500",
  bad: "bg-destructive",
};

/**
 * Production drag & drop pipeline board.
 * Pointer (mouse + touch) dragging, keyboard moves, drag preview, drop
 * indicators, edge auto-scroll, multi-select drag, permission checks,
 * optimistic updates with rollback, undo and an audit/activity history drawer.
 */
export function DndBoard<T>({
  boardKey,
  entity,
  columns,
  cards,
  getId,
  getColumnId,
  renderCard,
  onMove,
  canMove,
  emptyColumn,
  columnFooter,
}: DndBoardProps<T>) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<{ ids: string[]; x: number; y: number } | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Record<string, HTMLElement | null>>({});
  const autoScroll = useRef<number | null>(null);

  const columnOf = useCallback(
    (card: T) => overrides[getId(card)] ?? getColumnId(card),
    [getColumnId, getId, overrides],
  );

  const grouped = useMemo(() => {
    const map: Record<string, T[]> = {};
    for (const col of columns) map[col.id] = [];
    for (const card of cards) {
      const id = columnOf(card);
      (map[id] ??= []).push(card);
    }
    return map;
  }, [cards, columnOf, columns]);

  const cardById = useMemo(() => {
    const map = new Map<string, T>();
    for (const c of cards) map.set(getId(c), c);
    return map;
  }, [cards, getId]);

  const commitMove = useCallback(
    (ids: string[], to: string) => {
      const moving = ids
        .map((id) => cardById.get(id))
        .filter((c): c is T => Boolean(c))
        .filter((c) => columnOf(c) !== to);
      if (moving.length === 0) return;

      const targetColumn = columns.find((c) => c.id === to);
      const refusals: string[] = [];
      if (targetColumn?.locked) refusals.push(`${targetColumn.label} is locked for your role.`);
      for (const card of moving) {
        const reason = canMove?.(card, to);
        if (reason) refusals.push(reason);
      }
      if (refusals.length > 0) {
        toast.error("Move not permitted", { description: refusals[0] });
        return;
      }

      const previous: Record<string, string> = {};
      for (const card of moving) previous[getId(card)] = columnOf(card);
      const fromLabels = [
        ...new Set(
          Object.values(previous).map((id) => columns.find((c) => c.id === id)?.label ?? id),
        ),
      ].join(", ");

      void runOptimistic({
        label: `Move to ${targetColumn?.label ?? to}`,
        entity,
        count: moving.length,
        from: fromLabels,
        to: targetColumn?.label ?? to,
        detail: `${moving.length} card${moving.length === 1 ? "" : "s"} moved on ${boardKey}`,
        apply: () =>
          setOverrides((prev) => {
            const next = { ...prev };
            for (const card of moving) next[getId(card)] = to;
            return next;
          }),
        rollback: () =>
          setOverrides((prev) => {
            const next = { ...prev };
            for (const [id, col] of Object.entries(previous)) next[id] = col;
            return next;
          }),
        commit: async () => {
          await onMove?.(
            moving.map((card) => ({ id: getId(card), from: previous[getId(card)]!, to })),
          );
        },
      });
      setSelected(new Set());
    },
    [boardKey, canMove, cardById, columnOf, columns, entity, getId, onMove],
  );

  /* ------------------------------ pointer drag ----------------------------- */

  const startDrag = (id: string, e: React.PointerEvent) => {
    if (e.button != null && e.button !== 0) return;
    const ids = selected.has(id) ? [...selected] : [id];
    const originX = e.clientX;
    const originY = e.clientY;
    let started = false;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      if (!started && Math.hypot(ev.clientX - originX, ev.clientY - originY) < 5) return;
      started = true;
      setDragging({ ids, x: ev.clientX, y: ev.clientY });
      const hit = Object.entries(columnRefs.current).find(([, el]) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return (
          ev.clientX >= r.left &&
          ev.clientX <= r.right &&
          ev.clientY >= r.top &&
          ev.clientY <= r.bottom
        );
      });
      setOverColumn(hit?.[0] ?? null);
      edgeScroll(ev.clientX);
    };
    const up = (ev: PointerEvent) => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
      stopEdgeScroll();
      if (started && overColumnRef.current) commitMove(ids, overColumnRef.current);
      else if (!started) toggleSelect(id, ev.shiftKey || ev.metaKey || ev.ctrlKey);
      setDragging(null);
      setOverColumn(null);
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", up);
  };

  const overColumnRef = useRef<string | null>(null);
  useEffect(() => {
    overColumnRef.current = overColumn;
  }, [overColumn]);

  const edgeScroll = (clientX: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const speed = clientX < r.left + 80 ? -14 : clientX > r.right - 80 ? 14 : 0;
    if (speed === 0) return stopEdgeScroll();
    if (autoScroll.current != null) return;
    const tick = () => {
      el.scrollLeft += speed;
      autoScroll.current = requestAnimationFrame(tick);
    };
    autoScroll.current = requestAnimationFrame(tick);
  };
  const stopEdgeScroll = () => {
    if (autoScroll.current != null) {
      cancelAnimationFrame(autoScroll.current);
      autoScroll.current = null;
    }
  };
  useEffect(() => stopEdgeScroll, []);

  const toggleSelect = (id: string, additive: boolean) => {
    setSelected((prev) => {
      const next = additive ? new Set(prev) : new Set<string>();
      if (prev.has(id) && additive) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* -------------------------------- keyboard ------------------------------- */

  const keyboardMove = (card: T, dir: -1 | 1) => {
    const current = columns.findIndex((c) => c.id === columnOf(card));
    const target = columns[Math.max(0, Math.min(columns.length - 1, current + dir))];
    if (!target || target.id === columnOf(card)) return;
    commitMove(selected.size > 0 ? [...selected] : [getId(card)], target.id);
  };

  const lastMove = useLastMove(entity);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 h-10 border-b border-border bg-surface-muted">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-foreground">
          Pipeline
          <span className="text-[11px] font-normal text-muted-foreground inline-flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" /> drag
            <Keyboard className="h-3 w-3 ml-1" /> ← / → to move
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {selected.size > 0 ? (
            <span className="text-[11.5px] text-muted-foreground">
              {selected.size} selected
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="ml-1.5 text-primary hover:underline cursor-pointer"
              >
                clear
              </button>
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px] text-foreground cursor-pointer"
          >
            <History className="h-3.5 w-3.5" />
            History
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="overflow-x-auto p-3">
        <div className="flex gap-3 min-w-max items-start">
          {columns.map((col) => {
            const items = grouped[col.id] ?? [];
            const isOver = overColumn === col.id && dragging != null;
            return (
              <section
                key={col.id}
                ref={(el) => {
                  columnRefs.current[col.id] = el;
                }}
                aria-label={col.label}
                className={[
                  "w-[248px] shrink-0 rounded-md border bg-background transition-colors",
                  isOver ? "border-primary ring-2 ring-primary/25" : "border-border",
                ].join(" ")}
              >
                <header className="h-9 px-3 flex items-center justify-between border-b border-border">
                  <div className="inline-flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full ${TONE_DOT[col.tone ?? "neutral"]}`} />
                    <span className="text-[12px] font-semibold text-foreground truncate">
                      {col.label}
                    </span>
                    {col.locked ? (
                      <Lock className="h-3 w-3 text-muted-foreground" aria-label="Locked" />
                    ) : null}
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {items.length}
                  </span>
                </header>

                <div className="p-2 min-h-[140px] space-y-2">
                  {isOver ? (
                    <div className="h-1.5 rounded-full bg-primary/70 animate-pulse" aria-hidden />
                  ) : null}
                  {items.length === 0 ? (
                    <div className="py-8 text-center text-[12px] text-muted-foreground">
                      {emptyColumn?.(col) ?? "No cards"}
                    </div>
                  ) : (
                    items.map((card) => {
                      const id = getId(card);
                      const isDragging = dragging?.ids.includes(id) ?? false;
                      const isSelected = selected.has(id);
                      return (
                        <div
                          key={id}
                          tabIndex={0}
                          role="button"
                          aria-grabbed={grabbed === id}
                          onPointerDown={(e) => startDrag(id, e)}
                          onKeyDown={(e) => {
                            if (e.key === " ") {
                              e.preventDefault();
                              setGrabbed((g) => (g === id ? null : id));
                            } else if (e.key === "ArrowLeft") {
                              e.preventDefault();
                              keyboardMove(card, -1);
                            } else if (e.key === "ArrowRight") {
                              e.preventDefault();
                              keyboardMove(card, 1);
                            } else if (e.key === "Escape") {
                              setGrabbed(null);
                              setSelected(new Set());
                            } else if (e.key === "Enter") {
                              e.preventDefault();
                              toggleSelect(id, e.shiftKey);
                            }
                          }}
                          className={[
                            "rounded-md border bg-surface p-2.5 text-left transition-all touch-none cursor-grab active:cursor-grabbing outline-none",
                            isSelected ? "border-primary ring-1 ring-primary/30" : "border-border",
                            grabbed === id ? "ring-2 ring-primary/50" : "",
                            isDragging ? "opacity-40" : "hover:border-border-strong",
                            "focus-visible:ring-2 focus-visible:ring-ring",
                          ].join(" ")}
                        >
                          {renderCard(card, { dragging: isDragging, selected: isSelected })}
                        </div>
                      );
                    })
                  )}
                </div>
                {columnFooter ? (
                  <footer className="border-t border-border p-2">{columnFooter(col)}</footer>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>

      {lastMove ? (
        <div className="flex items-center justify-between gap-2 px-4 py-1.5 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
          <span className="truncate">
            Last change: {lastMove.label} · {lastMove.count} {lastMove.entity} ·{" "}
            {formatActivityTime(lastMove.ts)} · {lastMove.status}
          </span>
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
          >
            <Undo2 className="h-3 w-3" /> View history
          </button>
        </div>
      ) : null}

      <BoardHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        entity={entity}
      />

      {dragging ? (
        <div
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 rounded-md border border-primary bg-surface px-3 py-2 text-[12px] font-medium text-foreground shadow-lg"
          style={{ left: dragging.x, top: dragging.y }}
        >
          Moving {dragging.ids.length} card{dragging.ids.length === 1 ? "" : "s"}
        </div>
      ) : null}
    </div>
  );
}

function useLastMove(entity: string): ActivityEntry | null {
  const log = useActivityLog(entity);
  return log[0] ?? null;
}

export function BoardHistoryDrawer({
  open,
  onClose,
  entity,
}: {
  open: boolean;
  onClose: () => void;
  entity: string;
}) {
  const log = useActivityLog(entity);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close history"
        onClick={onClose}
        className="absolute inset-0 bg-background/60 cursor-default"
      />
      <aside
        role="dialog"
        aria-label="Change history"
        className="relative z-10 h-full w-full max-w-[420px] border-l border-border bg-surface flex flex-col animate-in slide-in-from-right duration-200"
      >
        <header className="h-11 px-3 flex items-center justify-between border-b border-border">
          <div className="text-[12.5px] font-semibold text-foreground">
            Change history &amp; audit
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 px-2 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            Close
          </button>
        </header>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {log.length === 0 ? (
            <div className="py-12 text-center text-[12.5px] text-muted-foreground">
              No changes recorded yet.
            </div>
          ) : (
            log.map((e) => (
              <div key={e.id} className="px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] font-medium text-foreground truncate">
                    {e.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {formatActivityTime(e.ts)}
                  </span>
                </div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {e.actor} · {e.count} {e.entity} · {e.status}
                  {e.from || e.to ? (
                    <>
                      {" "}
                      · {e.from ?? "—"} → {e.to ?? "—"}
                    </>
                  ) : null}
                </div>
                {e.error ? (
                  <div className="mt-0.5 text-[11.5px] text-destructive">{e.error}</div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
