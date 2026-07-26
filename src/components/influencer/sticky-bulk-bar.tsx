import type { ReactNode } from "react";
import { X } from "lucide-react";

export type BulkAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "danger";
  onClick: () => void;
  disabled?: boolean;
};

/**
 * Sticky, bottom-anchored bulk action bar. Renders nothing when count === 0.
 * Reusable across Influencers, Applications, Notifications and any multi-select surface.
 */
export function StickyBulkBar({
  count,
  total,
  entity = "records",
  actions,
  onClear,
  onSelectAll,
}: {
  count: number;
  total?: number;
  entity?: string;
  actions: BulkAction[];
  onClear: () => void;
  onSelectAll?: () => void;
}) {
  if (count <= 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div
        role="region"
        aria-label="Bulk actions"
        className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-full border border-border bg-background/95 backdrop-blur px-3 py-2 shadow-lg max-w-[calc(100vw-2rem)]"
      >
        <div className="pl-2 pr-1 flex items-center gap-2 text-[12.5px]">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-primary-foreground px-1.5 text-[11px] font-semibold tabular-nums">
            {count}
          </span>
          <span className="text-foreground font-medium">selected</span>
          {typeof total === "number" ? (
            <span className="text-muted-foreground">
              of {total.toLocaleString()} {entity}
            </span>
          ) : null}
          {onSelectAll ? (
            <button
              type="button"
              onClick={onSelectAll}
              className="ml-1 text-[11.5px] text-primary hover:underline cursor-pointer"
            >
              Select all
            </button>
          ) : null}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <div className="flex flex-wrap items-center gap-1.5">
          {actions.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={a.onClick}
              disabled={a.disabled}
              className={[
                "h-7 px-2.5 inline-flex items-center gap-1.5 rounded-full text-[12px] font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                a.tone === "primary"
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : a.tone === "danger"
                    ? "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                    : "bg-surface text-foreground border-border hover:bg-muted",
              ].join(" ")}
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="h-7 w-7 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
