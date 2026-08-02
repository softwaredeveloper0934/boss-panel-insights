/**
 * Global optimistic-update + undo framework.
 *
 * Every mutating surface in the Influencer Manager routes through `runOptimistic`
 * so that the UI updates instantly, background work is tracked with a progress
 * indicator, failures roll back automatically, and every attempt lands in the
 * shared activity + audit logs (persisted per browser profile).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type ActivityStatus =
  | "pending"
  | "done"
  | "undone"
  | "failed"
  | "rolled-back";

export type ActivityEntry = {
  id: string;
  ts: number;
  label: string;
  entity: string;
  count: number;
  actor: string;
  status: ActivityStatus;
  detail?: string;
  from?: string;
  to?: string;
  error?: string;
};

const AUDIT_KEY = "influencer-manager.audit-log.v1";
const MAX_ENTRIES = 400;

let entries: ActivityEntry[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(AUDIT_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) entries = parsed as ActivityEntry[];
    }
  } catch {
    entries = [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* storage full or unavailable — in-memory log still works */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function makeId() {
  return `act_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function logActivity(
  entry: Omit<ActivityEntry, "id" | "ts" | "actor"> & { actor?: string },
): string {
  hydrate();
  const full: ActivityEntry = {
    id: makeId(),
    ts: Date.now(),
    actor: entry.actor ?? "You",
    ...entry,
  };
  entries = [full, ...entries].slice(0, MAX_ENTRIES);
  emit();
  return full.id;
}

export function updateActivity(id: string, patch: Partial<ActivityEntry>) {
  hydrate();
  entries = entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
  emit();
}

export function clearActivity() {
  entries = [];
  emit();
}

export function getActivity(scope?: string): ActivityEntry[] {
  hydrate();
  if (!scope) return entries;
  return entries.filter((e) => e.entity.toLowerCase() === scope.toLowerCase());
}

/** Subscribe to the shared log; returns an unsubscribe function. */
export function subscribeActivity(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** React binding for the activity/audit log. */
export function useActivityLog(scope?: string) {
  const [, force] = useState(0);
  useEffect(() => {
    const unsubscribe = subscribeActivity(() => force((n) => n + 1));
    return () => {
      unsubscribe();
    };
  }, []);
  return useMemo(() => getActivity(scope), [scope]);
}

export type OptimisticTask = {
  /** Human label, e.g. "Approve influencers". */
  label: string;
  /** Entity name used in logs and copy, e.g. "influencers". */
  entity: string;
  /** Number of affected records (defaults to 1). */
  count?: number;
  detail?: string;
  from?: string;
  to?: string;
  /** Instant, synchronous UI mutation. */
  apply: () => void;
  /** Revert the instant mutation. Used for undo and for failure rollback. */
  rollback: () => void;
  /** Background processing. Resolve to commit, reject to roll back. */
  commit?: () => Promise<unknown>;
  /** Extra work when the user undoes after a successful commit. */
  undo?: () => Promise<unknown> | void;
  /** Undo window in ms (default 8000). Pass 0 to disable undo. */
  undoMs?: number;
  /** Permission gate — when it returns a string the action is refused. */
  guard?: () => string | null;
};

export type OptimisticResult = { ok: boolean; activityId: string | null; error?: string };

/**
 * Run an action optimistically: instant UI update, background commit,
 * undo snackbar, rollback on failure, and a full audit entry.
 */
export async function runOptimistic(task: OptimisticTask): Promise<OptimisticResult> {
  const count = task.count ?? 1;

  const refusal = task.guard?.();
  if (refusal) {
    logActivity({
      label: task.label,
      entity: task.entity,
      count,
      status: "failed",
      detail: refusal,
      error: refusal,
      from: task.from,
      to: task.to,
    });
    toast.error("Action not permitted", { description: refusal });
    return { ok: false, activityId: null, error: refusal };
  }

  const activityId = logActivity({
    label: task.label,
    entity: task.entity,
    count,
    status: "pending",
    detail: task.detail,
    from: task.from,
    to: task.to,
  });

  task.apply();

  const toastId = `optimistic-${activityId}`;
  toast.loading(`${task.label}…`, {
    id: toastId,
    description: `${count} ${task.entity} · processing`,
  });

  try {
    if (task.commit) await task.commit();
    updateActivity(activityId, { status: "done" });

    const undoMs = task.undoMs ?? 8000;
    if (undoMs > 0) {
      toast.success(`${task.label} complete`, {
        id: toastId,
        description: task.detail ?? `${count} ${task.entity} updated`,
        duration: undoMs,
        action: {
          label: "Undo",
          onClick: () => {
            void undoActivity(activityId, task);
          },
        },
      });
    } else {
      toast.success(`${task.label} complete`, {
        id: toastId,
        description: task.detail ?? `${count} ${task.entity} updated`,
      });
    }
    return { ok: true, activityId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected failure";
    task.rollback();
    updateActivity(activityId, { status: "rolled-back", error: message });
    toast.error(`${task.label} failed`, {
      id: toastId,
      description: `${message} — changes were rolled back.`,
      action: {
        label: "Retry",
        onClick: () => {
          void runOptimistic(task);
        },
      },
    });
    return { ok: false, activityId, error: message };
  }
}

async function undoActivity(activityId: string, task: OptimisticTask) {
  try {
    task.rollback();
    await task.undo?.();
    updateActivity(activityId, { status: "undone" });
    toast.success(`${task.label} undone`, {
      description: `${task.count ?? 1} ${task.entity} restored to the previous state.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Undo failed";
    updateActivity(activityId, { status: "failed", error: message });
    toast.error("Undo failed", { description: message });
  }
}

/** Convenience hook so components can fire tasks without importing directly. */
export function useOptimistic() {
  return useCallback((task: OptimisticTask) => runOptimistic(task), []);
}

export function formatActivityTime(ts: number) {
  const d = new Date(ts);
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
