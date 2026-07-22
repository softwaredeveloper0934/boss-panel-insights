import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  GripVertical,
  History,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EmptySurface } from "@/components/influencer/wall-page";


type ViewMode = "month" | "week";
type Lane = "draft" | "scheduled" | "published";

type HistoryEntry = {
  id: string;
  at: string;
  kind: "move" | "transition" | "conflict";
  title: string;
  fromLane: Lane;
  toLane: Lane;
  fromISO: string;
  toISO: string;
  message?: string;
  undone?: boolean;
};

const LANES: { key: Lane; label: string; tone: string }[] = [
  { key: "draft", label: "Draft", tone: "bg-muted text-muted-foreground border-border" },
  { key: "scheduled", label: "Scheduled", tone: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
  { key: "published", label: "Published", tone: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" },
];


export function ContentCalendar() {
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  function addHistory(entry: Omit<HistoryEntry, "id" | "at">) {
    setHistory((h) => [
      { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString() },
      ...h,
    ]);
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(shift(cursor, view, -1))}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="h-8 px-2.5 rounded-md border border-border bg-background hover:bg-muted text-[12px]"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(shift(cursor, view, 1))}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="ml-2 text-[13px] font-semibold">
            {view === "month" ? monthLabel(cursor) : weekLabel(cursor)}
          </div>
        </div>

        <div className="ml-2 flex items-center rounded-md border border-border bg-background overflow-hidden">
          {(["month", "week"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setView(m)}
              className={[
                "h-8 px-2.5 text-[12px] capitalize",
                view === m ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-[220px] h-8 px-2.5 rounded-md border border-border bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search planned content…"
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        {["Creator", "Platform", "Campaign", "Status"].map((c) => (
          <button key={c} className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]">
            <Filter className="h-3.5 w-3.5" /> {c}
          </button>
        ))}
        <button
          onClick={() => setHistoryOpen(true)}
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted text-[12px] relative"
        >
          <History className="h-3.5 w-3.5" /> History
          {history.length ? (
            <span className="ml-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold tabular-nums grid place-items-center">
              {history.length}
            </span>
          ) : null}
        </button>
        <button
          onClick={() => toast.message("New content item")}
          className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] inline-flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" /> New content
        </button>
      </div>

      <LegendRow />

      {view === "month" ? (
        <MonthGrid cursor={cursor} />
      ) : (
        <WeekGrid cursor={cursor} onHistory={addHistory} />
      )}

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        entries={history}
        onUndo={(id) =>
          setHistory((h) =>
            h.map((e) => (e.id === id ? { ...e, undone: true } : e)),
          )
        }
        onClear={() => setHistory([])}
      />
    </div>
  );
}


function LegendRow() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-muted-foreground">
      <span className="mr-1">Swimlanes:</span>
      {LANES.map((l) => (
        <span
          key={l.key}
          className={["inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium border", l.tone].join(" ")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {l.label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------ Month ------------------------------ */

function MonthGrid({ cursor }: { cursor: Date }) {
  const cells = useMonthCells(cursor);
  const today = new Date();
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border bg-surface-muted text-[11px] uppercase tracking-wide text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-2 py-2 border-r border-border last:border-r-0">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((c, i) => {
          const isToday =
            c.date.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className={[
                "min-h-[110px] border-b border-r border-border last:border-r-0 p-1.5 flex flex-col gap-1",
                c.inMonth ? "" : "bg-surface-muted/40",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[11px] tabular-nums",
                    isToday ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {c.date.getDate()}
                </span>
                <button className="h-5 w-5 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 hover:opacity-100 focus:opacity-100">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1 grid place-items-center">
                <span className="text-[10.5px] text-muted-foreground/60">—</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border">
        <EmptySurface
          title="No content scheduled this month"
          description="Draft, schedule and publish posts across every connected platform. Items appear on their target date and can be dragged between swimlanes."
          primaryAction="New content"
          scope="content calendar"
        />
      </div>
    </div>
  );
}

/* ------------------------------ Week ------------------------------ */

type DragPayload = {
  id: string;
  title: string;
  fromLane: Lane;
  fromISO: string;
  scheduledAt?: string;
};

function WeekGrid({
  cursor,
  onHistory,
}: {
  cursor: Date;
  onHistory: (entry: Omit<HistoryEntry, "id" | "at">) => void;
}) {

  const days = useWeekDays(cursor);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ key: string; message: string } | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function cellKey(laneKey: Lane, d: Date) {
    return `${laneKey}::${d.toISOString().slice(0, 10)}`;
  }

  function evaluateConflict(nextLane: Lane, d: Date, fromLane?: Lane): string | null {
    const cellDate = new Date(d);
    cellDate.setHours(0, 0, 0, 0);
    if (nextLane === "scheduled" && cellDate < today) {
      return "Cannot schedule in the past. Pick today or a future date.";
    }
    if (nextLane === "published" && cellDate > today) {
      return "Cannot mark as published on a future date.";
    }
    if (nextLane === "draft" && fromLane === "published") {
      return "Published items cannot be reverted to draft.";
    }
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 h-9 border-b border-border bg-surface-muted/60 text-[11.5px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <GripVertical className="h-3.5 w-3.5" />
          Drag items between cells to reschedule or transition between swimlanes.
        </div>
        {conflict ? (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            {conflict.message}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-[120px_repeat(7,_minmax(0,_1fr))] border-b border-border bg-surface-muted text-[11.5px]">
        <div className="px-2 py-2 border-r border-border font-semibold uppercase tracking-wide text-muted-foreground">Swimlane</div>
        {days.map((d) => (
          <div key={d.toISOString()} className="px-2 py-2 border-r border-border last:border-r-0">
            <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{dayName(d)}</div>
            <div className="text-[12.5px] font-semibold tabular-nums">{d.getDate()}</div>
          </div>
        ))}
      </div>
      {LANES.map((lane) => (
        <div key={lane.key} className="grid grid-cols-[120px_repeat(7,_minmax(0,_1fr))] border-b border-border last:border-b-0">
          <div className="px-2 py-3 border-r border-border bg-surface-muted/40 flex items-center gap-1.5">
            <span className={["inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium border", lane.tone].join(" ")}>
              {lane.label}
            </span>
          </div>
          {days.map((d) => {
            const key = cellKey(lane.key, d);
            const isOver = dragOverKey === key;
            const hasConflict = conflict?.key === key;
            return (
              <div
                key={d.toISOString()}
                onDragOver={(e) => {
                  if (!e.dataTransfer.types.includes("application/json")) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverKey(key);
                  const msg = evaluateConflict(lane.key, d);
                  setConflict(msg ? { key, message: msg } : null);
                }}
                onDragLeave={() => {
                  if (dragOverKey === key) setDragOverKey(null);
                  if (conflict?.key === key) setConflict(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const raw = e.dataTransfer.getData("application/json");
                  setDragOverKey(null);
                  if (!raw) return;
                  const payload = JSON.parse(raw) as DragPayload;
                  const msg = evaluateConflict(lane.key, d, payload.fromLane);
                  const toISO = d.toISOString().slice(0, 10);
                  if (msg) {
                    onHistory({
                      kind: "conflict",
                      title: payload.title,
                      fromLane: payload.fromLane,
                      toLane: lane.key,
                      fromISO: payload.fromISO,
                      toISO,
                      message: msg,
                    });
                    toast.error(msg);
                    setConflict(null);
                    return;
                  }
                  const dateLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                  const transitioned = payload.fromLane !== lane.key;
                  const entry: Omit<HistoryEntry, "id" | "at"> = {
                    kind: transitioned ? "transition" : "move",
                    title: payload.title,
                    fromLane: payload.fromLane,
                    toLane: lane.key,
                    fromISO: payload.fromISO,
                    toISO,
                  };
                  onHistory(entry);
                  toast.success(
                    transitioned
                      ? `Moved "${payload.title}" → ${lane.label} · ${dateLabel}`
                      : `Rescheduled "${payload.title}" to ${dateLabel}`,
                    {
                      action: {
                        label: "Undo",
                        onClick: () => {
                          onHistory({
                            ...entry,
                            kind: entry.kind,
                            fromLane: entry.toLane,
                            toLane: entry.fromLane,
                            fromISO: entry.toISO,
                            toISO: entry.fromISO,
                            message: "Reverted by user",
                          });
                          toast.message(`Reverted "${payload.title}"`);
                        },
                      },
                    },
                  );
                  setConflict(null);
                }}
                className={[
                  "min-h-[96px] border-r border-border last:border-r-0 p-2 flex items-center justify-center text-[11px] text-muted-foreground transition-colors",
                  isOver && !hasConflict ? "bg-primary/10 outline outline-2 outline-primary/40 -outline-offset-2" : "",
                  isOver && hasConflict ? "bg-red-500/10 outline outline-2 outline-red-500/40 -outline-offset-2" : "",
                ].join(" ")}

              >
                <button
                  type="button"
                  onClick={() => toast.message(`New ${lane.label} on ${d.toDateString()}`)}
                  className="w-full h-full rounded hover:bg-muted/40 flex items-center justify-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> add
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* --------------------------- Item transitions ---------------------------
   Rendered inline inside a cell when an item exists; kept here as a
   reusable component for when data connects. Drag payload uses the shape
   consumed by WeekGrid's drop handlers. */

export function ContentItemChip({
  id,
  title,
  status,
  isoDate,
  onTransition,
}: {
  id: string;
  title: string;
  status: Lane;
  isoDate: string;
  onTransition: (next: Lane) => void;
}) {
  const lane = LANES.find((l) => l.key === status)!;
  return (
    <div
      draggable
      onDragStart={(e) => {
        const payload: DragPayload = { id, title, fromLane: status, fromISO: isoDate };
        e.dataTransfer.setData("application/json", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "move";
      }}
      className={["group rounded border px-1.5 py-1 text-[11px] flex items-center gap-1.5 cursor-grab active:cursor-grabbing", lane.tone].join(" ")}
    >
      <GripVertical className="h-3 w-3 shrink-0 opacity-60" />
      <Sparkles className="h-3 w-3 shrink-0" />
      <span className="truncate flex-1">{title}</span>
      <div className="hidden group-hover:flex items-center gap-0.5">
        {status !== "scheduled" ? (
          <button title="Schedule" onClick={() => onTransition("scheduled")}>
            <Clock className="h-3 w-3" />
          </button>
        ) : null}
        {status !== "published" ? (
          <button title="Publish" onClick={() => onTransition("published")}>
            <Send className="h-3 w-3" />
          </button>
        ) : null}
        <button title="Mark done" onClick={() => onTransition("published")}>
          <CheckCircle2 className="h-3 w-3" />
        </button>
        <button title="More">
          <MoreHorizontal className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ helpers ------------------------------ */

function shift(d: Date, view: ViewMode, dir: number) {
  const n = new Date(d);
  if (view === "month") n.setMonth(n.getMonth() + dir);
  else n.setDate(n.getDate() + dir * 7);
  return n;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function weekLabel(d: Date) {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

function startOfWeek(d: Date) {
  const n = new Date(d);
  const day = (n.getDay() + 6) % 7; // Monday=0
  n.setDate(n.getDate() - day);
  n.setHours(0, 0, 0, 0);
  return n;
}

function useMonthCells(cursor: Date) {
  return useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    const cells: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push({ date: d, inMonth: d.getMonth() === cursor.getMonth() });
    }
    return cells;
  }, [cursor]);
}

function useWeekDays(cursor: Date) {
  return useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);
}

function dayName(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

// suppress unused-import lint
void CalendarDays;

/* ------------------------------ History drawer ------------------------------ */

function HistoryDrawer({
  open,
  onClose,
  entries,
  onUndo,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  entries: HistoryEntry[];
  onUndo: (id: string) => void;
  onClear: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full max-w-[440px] bg-background border-l border-border shadow-2xl flex flex-col">
        <div className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3">
          <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">
            <History className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold">Change history</div>
            <div className="text-[11.5px] text-muted-foreground">
              {entries.length} event{entries.length === 1 ? "" : "s"} · reschedules, transitions & conflicts
            </div>
          </div>
          <button
            onClick={onClear}
            disabled={!entries.length}
            className="h-8 px-2.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <EmptySurface
              title="No changes yet"
              description="Reschedules, swimlane transitions and blocked conflicts will appear here in order."
              scope="content calendar history"
            />
          ) : (
            <ol className="p-3 space-y-2">
              {entries.map((e) => {
                const fromLane = LANES.find((l) => l.key === e.fromLane)!;
                const toLane = LANES.find((l) => l.key === e.toLane)!;
                const isConflict = e.kind === "conflict";
                return (
                  <li
                    key={e.id}
                    className={[
                      "rounded-md border p-3 text-[12px] bg-surface",
                      isConflict ? "border-red-500/30" : "border-border",
                      e.undone ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2">
                      {isConflict ? (
                        <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3" /> Conflict blocked
                        </span>
                      ) : e.kind === "transition" ? (
                        <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-primary/10 text-primary border-primary/20">
                          <Send className="h-3 w-3" /> Transition
                        </span>
                      ) : (
                        <span className="h-5 px-1.5 inline-flex items-center gap-1 rounded text-[10.5px] font-medium border bg-muted text-muted-foreground border-border">
                          <Clock className="h-3 w-3" /> Reschedule
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">
                        {new Date(e.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="mt-1.5 font-medium truncate">{e.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap text-[11.5px] text-muted-foreground">
                      <span className={["inline-flex items-center h-4 px-1.5 rounded border text-[10.5px]", fromLane.tone].join(" ")}>
                        {fromLane.label}
                      </span>
                      <span className="tabular-nums">{e.fromISO}</span>
                      <span>→</span>
                      <span className={["inline-flex items-center h-4 px-1.5 rounded border text-[10.5px]", toLane.tone].join(" ")}>
                        {toLane.label}
                      </span>
                      <span className="tabular-nums">{e.toISO}</span>
                    </div>
                    {e.message ? (
                      <div className="mt-1 text-[11.5px] text-muted-foreground">{e.message}</div>
                    ) : null}
                    {!isConflict && !e.undone ? (
                      <div className="mt-2 flex items-center justify-end">
                        <button
                          onClick={() => onUndo(e.id)}
                          className="h-7 px-2 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] inline-flex items-center gap-1"
                        >
                          <Undo2 className="h-3 w-3" /> Undo
                        </button>
                      </div>
                    ) : e.undone ? (
                      <div className="mt-1 text-[11px] text-muted-foreground italic">Undone</div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}

