import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Check, ChevronDown, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Named filter presets scoped by pathname. Persisted to localStorage so the
 * UI works end-to-end without a backend; the shape is future-proof for API sync.
 */
export type SavedView = {
  id: string;
  name: string;
  createdAt: number;
  /** Free-form filter snapshot — arbitrary JSON so callers can store anything. */
  filters: Record<string, unknown>;
  pinned?: boolean;
};

const STORAGE_PREFIX = "iv:savedViews:";

function readViews(scopeKey: string): SavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + scopeKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedView[]) : [];
  } catch {
    return [];
  }
}

function writeViews(scopeKey: string, views: SavedView[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_PREFIX + scopeKey, JSON.stringify(views));
}

export function SavedViews({
  scopeKey,
  getCurrentFilters,
  onApply,
  label = "Views",
}: {
  /** Unique key per page/section, e.g. pathname or "/influencers#directory". */
  scopeKey: string;
  /** Callback that returns the current filter snapshot at save time. */
  getCurrentFilters: () => Record<string, unknown>;
  /** Called with a saved snapshot when the user picks a view. */
  onApply: (filters: Record<string, unknown>) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [views, setViews] = useState<SavedView[]>(() => readViews(scopeKey));
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setViews(readViews(scopeKey));
    setActiveId(null);
  }, [scopeKey]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const sorted = useMemo(
    () =>
      [...views].sort((a, b) => {
        if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
        return b.createdAt - a.createdAt;
      }),
    [views],
  );

  const persist = (next: SavedView[]) => {
    setViews(next);
    writeViews(scopeKey, next);
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Give the view a name");
      return;
    }
    const view: SavedView = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: Date.now(),
      filters: getCurrentFilters(),
    };
    persist([view, ...views]);
    setActiveId(view.id);
    setName("");
    setCreating(false);
    toast.success(`View "${trimmed}" saved`);
  };

  const apply = (v: SavedView) => {
    onApply(v.filters);
    setActiveId(v.id);
    setOpen(false);
    toast.success(`Applied view "${v.name}"`);
  };

  const remove = (v: SavedView) => {
    persist(views.filter((x) => x.id !== v.id));
    if (activeId === v.id) setActiveId(null);
    toast.message(`Deleted "${v.name}"`);
  };

  const togglePin = (v: SavedView) => {
    persist(views.map((x) => (x.id === v.id ? { ...x, pinned: !x.pinned } : x)));
  };

  const activeName = views.find((v) => v.id === activeId)?.name;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed text-[12px] transition-colors cursor-pointer",
          activeId
            ? "border-primary text-foreground bg-muted"
            : "border-border text-foreground bg-background hover:bg-muted",
        ].join(" ")}
      >
        <Bookmark className="h-3.5 w-3.5" />
        {activeName ? (
          <span className="max-w-[140px] truncate">{activeName}</span>
        ) : (
          label
        )}
        {views.length > 0 ? (
          <span className="text-[10.5px] text-muted-foreground tabular-nums">
            {views.length}
          </span>
        ) : null}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open ? (
        <div className="absolute z-30 mt-1.5 left-0 w-72 rounded-md border border-border bg-popover text-popover-foreground shadow-(--shadow-popover)">
          <div className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border flex items-center justify-between">
            <span>Saved views</span>
            {!creating ? (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="normal-case tracking-normal text-[11px] font-medium text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Save current
              </button>
            ) : null}
          </div>
          {creating ? (
            <div className="p-2 border-b border-border flex items-center gap-1.5">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") {
                    setCreating(false);
                    setName("");
                  }
                }}
                placeholder="e.g. High-risk this week"
                className="flex-1 h-7 px-2 rounded border border-border bg-background text-[12.5px] outline-none focus:border-ring"
              />
              <button
                type="button"
                onClick={save}
                className="h-7 px-2 rounded bg-primary text-primary-foreground text-[11.5px] cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setName("");
                }}
                className="h-7 px-2 rounded border border-border text-[11.5px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : null}
          <div className="max-h-72 overflow-y-auto py-1">
            {sorted.length === 0 ? (
              <div className="px-3 py-6 text-center text-[12px] text-muted-foreground">
                No views yet.
                <div className="text-[11px] mt-0.5">
                  Save the current filters to reapply them later.
                </div>
              </div>
            ) : (
              sorted.map((v) => (
                <div
                  key={v.id}
                  className={[
                    "flex items-center gap-1 px-2 py-1.5 text-[12.5px]",
                    activeId === v.id ? "bg-muted/60" : "hover:bg-muted",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => apply(v)}
                    className="flex-1 min-w-0 flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span
                      className={[
                        "h-3.5 w-3.5 shrink-0 grid place-items-center",
                        activeId === v.id ? "text-primary" : "text-transparent",
                      ].join(" ")}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate text-foreground">{v.name}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={v.pinned ? "Unpin view" : "Pin view"}
                    onClick={() => togglePin(v)}
                    className={[
                      "h-6 w-6 grid place-items-center rounded hover:bg-background cursor-pointer",
                      v.pinned ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    <Star className={`h-3.5 w-3.5 ${v.pinned ? "fill-current" : ""}`} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete view"
                    onClick={() => remove(v)}
                    className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-destructive hover:bg-background cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="px-3 py-1.5 border-t border-border text-[10.5px] text-muted-foreground">
            Stored locally per page. Wires to API when backend is connected.
          </div>
        </div>
      ) : null}
    </div>
  );
}
