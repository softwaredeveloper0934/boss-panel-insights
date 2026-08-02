import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  GripVertical,
  PinOff,
  RotateCcw,
  Save,
  Sliders,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  DENSITY_LABEL,
  type ColumnDef,
  type TableDensity,
  type TableLayoutApi,
} from "./table-layout";

const DENSITIES: TableDensity[] = ["comfortable", "compact", "ultra"];

/**
 * Full column manager: show/hide, drag reorder, resize, pin left/right,
 * auto width, reset, personal + team layouts and density.
 * Keyboard accessible (Alt+Arrow reorders, Space toggles) and mobile friendly
 * (right drawer on desktop, bottom sheet on small screens).
 */
export function ColumnManager<T>({
  open,
  onOpenChange,
  defs,
  api,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defs: ColumnDef<T>[];
  api: TableLayoutApi<T>;
}) {
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const hiddenCount = useMemo(
    () => api.layout.order.filter((k) => !api.layout.columns[k]?.visible).length,
    [api.layout],
  );

  if (!open) return null;

  const drop = (targetKey: string) => {
    if (!dragKey || dragKey === targetKey) return;
    api.move(dragKey, api.layout.order.indexOf(targetKey));
    setDragKey(null);
    setOverKey(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex sm:justify-end">
      <button
        type="button"
        aria-label="Close column manager"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-background/60 backdrop-blur-[1px] cursor-default"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Column manager"
        className="relative z-10 mt-auto w-full max-h-[88vh] rounded-t-xl border border-border bg-surface shadow-lg outline-none sm:mt-0 sm:h-full sm:max-h-none sm:w-[380px] sm:rounded-none sm:rounded-l-xl flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-right duration-200"
      >
        <header className="h-11 shrink-0 px-3 flex items-center justify-between border-b border-border">
          <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-foreground">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            Columns &amp; layout
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="px-3 py-2.5 border-b border-border">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Row density
          </div>
          <div
            role="radiogroup"
            aria-label="Row density"
            className="grid grid-cols-3 gap-1 rounded-md border border-border bg-background p-1"
          >
            {DENSITIES.map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={api.layout.density === d}
                onClick={() => api.setDensity(d)}
                className={[
                  "h-7 rounded text-[11.5px] font-medium transition-colors cursor-pointer",
                  api.layout.density === d
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {DENSITY_LABEL[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 text-[11.5px] text-muted-foreground border-b border-border">
          <span>
            {api.layout.order.length - hiddenCount} shown · {hiddenCount} hidden
          </span>
          <span className="text-[11px]">Alt + ↑/↓ to reorder</span>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-border">
          {api.layout.order.map((key, index) => {
            const def = defs.find((d) => d.key === key);
            const state = api.layout.columns[key];
            if (!def || !state) return null;
            return (
              <li
                key={key}
                draggable
                onDragStart={() => setDragKey(key)}
                onDragEnd={() => {
                  setDragKey(null);
                  setOverKey(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverKey(key);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  drop(key);
                }}
                onKeyDown={(e) => {
                  if (e.altKey && e.key === "ArrowUp") {
                    e.preventDefault();
                    api.move(key, Math.max(0, index - 1));
                  } else if (e.altKey && e.key === "ArrowDown") {
                    e.preventDefault();
                    api.move(key, Math.min(api.layout.order.length - 1, index + 1));
                  } else if (e.key === " " && !def.required) {
                    e.preventDefault();
                    api.setVisible(key, !state.visible);
                  }
                }}
                tabIndex={0}
                aria-label={`${def.header} column`}
                className={[
                  "px-2.5 py-2 flex flex-col gap-1.5 outline-none focus-visible:bg-muted/70",
                  overKey === key && dragKey && dragKey !== key
                    ? "border-t-2 border-t-primary"
                    : "",
                  dragKey === key ? "opacity-50" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <label className="flex flex-1 items-center gap-2 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.visible}
                      disabled={def.required}
                      onChange={(e) => api.setVisible(key, e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)] cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="truncate text-[12.5px] text-foreground">
                      {def.header}
                      {def.required ? (
                        <span className="ml-1 text-[10.5px] text-muted-foreground">required</span>
                      ) : null}
                    </span>
                  </label>
                  <div className="flex items-center gap-0.5">
                    <PinBtn
                      active={state.pin === "left"}
                      title="Pin left"
                      onClick={() => api.setPin(key, state.pin === "left" ? null : "left")}
                    >
                      <ArrowLeftToLine className="h-3.5 w-3.5" />
                    </PinBtn>
                    <PinBtn
                      active={state.pin === "right"}
                      title="Pin right"
                      onClick={() => api.setPin(key, state.pin === "right" ? null : "right")}
                    >
                      <ArrowRightToLine className="h-3.5 w-3.5" />
                    </PinBtn>
                    {state.pin ? (
                      <PinBtn active={false} title="Unpin" onClick={() => api.setPin(key, null)}>
                        <PinOff className="h-3.5 w-3.5" />
                      </PinBtn>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <label className="flex flex-1 items-center gap-2 text-[11px] text-muted-foreground">
                    Width
                    <input
                      type="range"
                      min={def.minWidth ?? 80}
                      max={520}
                      step={4}
                      value={state.width}
                      onChange={(e) => api.setWidth(key, Number(e.target.value))}
                      aria-label={`${def.header} width`}
                      className="flex-1 accent-[color:var(--color-primary)] cursor-pointer"
                    />
                  </label>
                  <span className="w-12 text-right text-[11px] tabular-nums text-muted-foreground">
                    {state.width}px
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <footer className="shrink-0 border-t border-border p-2.5 grid grid-cols-2 gap-1.5">
          <FooterBtn
            onClick={() => {
              api.autoWidth();
              toast.success("Columns auto-sized");
            }}
          >
            Auto width
          </FooterBtn>
          <FooterBtn
            onClick={() => {
              api.reset();
              toast.success("Layout reset to default");
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset layout
          </FooterBtn>
          <FooterBtn
            onClick={() => {
              api.savePersonal();
              toast.success("Personal layout saved");
            }}
          >
            <Save className="h-3.5 w-3.5" />
            Save personal
          </FooterBtn>
          <FooterBtn
            onClick={() => {
              api.saveTeam();
              toast.success("Team layout saved", {
                description: "Everyone on this workspace profile can apply it.",
              });
            }}
          >
            <Users className="h-3.5 w-3.5" />
            Save team
          </FooterBtn>
          <FooterBtn
            className="col-span-2"
            onClick={() => {
              const ok = api.applyTeam();
              if (ok) toast.success("Team layout applied");
              else toast.message("No team layout saved yet");
            }}
          >
            Apply team layout
          </FooterBtn>
        </footer>
      </div>
    </div>
  );
}

function PinBtn({
  children,
  active,
  title,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      className={[
        "h-6 w-6 grid place-items-center rounded cursor-pointer transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function FooterBtn({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted text-[12px] font-medium text-foreground transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

/** Small hook that owns the open state of a ColumnManager instance. */
export function useColumnManager() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { open, setOpen, toggle };
}
