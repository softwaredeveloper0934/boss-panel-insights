/**
 * Audit log for bulk actions and privileged writes.
 *
 * Stores the last 500 entries in localStorage so operators can debug
 * user-driven changes locally. On production, replace `persist()` with a
 * server function call (e.g. `logAuditEvent({ data })`).
 */
export interface AuditEntry {
  id: string;
  ts: string;
  actorId?: string;
  action: string;
  resource: string;
  count?: number;
  ids?: string[];
  meta?: Record<string, unknown>;
}

const KEY = "sv.audit.log";
const MAX = 500;

function read(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch { return []; }
}
function persist(entries: AuditEntry[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX))); } catch { /* ignore */ }
}

export function logAudit(entry: Omit<AuditEntry, "id" | "ts">) {
  const full: AuditEntry = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    ts: new Date().toISOString(),
    ...entry,
  };
  const next = [...read(), full];
  persist(next);
  // eslint-disable-next-line no-console
  console.info("[audit]", full);
  return full;
}

export function readAuditLog(): AuditEntry[] { return read(); }
