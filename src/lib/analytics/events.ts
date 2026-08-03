/**
 * Lightweight client-side analytics event bus.
 *
 * Records product events (mascot enable/disable, celebrate triggers,
 * rate-limit blocks, perf downgrades) into a bounded localStorage ring
 * buffer and mirrors them to `window.__lovableEvents.trackEvent` when
 * available. Emits a DOM `CustomEvent` (`sv:analytics:event`) so any
 * dashboard/telemetry surface can subscribe without coupling.
 */
export interface AnalyticsEvent {
  id: string;
  ts: string;
  name: string;
  props?: Record<string, unknown>;
}

const KEY = "sv.analytics.events";
const MAX = 500;
const CHANNEL = "sv:analytics:event";

type LovableTracker = {
  trackEvent?: (name: string, props?: Record<string, unknown>) => void;
};

function read(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX)));
  } catch {
    /* ignore quota */
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>): AnalyticsEvent {
  const evt: AnalyticsEvent = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random()),
    ts: new Date().toISOString(),
    name,
    props,
  };
  if (typeof window !== "undefined") {
    persist([...read(), evt]);
    try {
      (window.__lovableEvents as LovableTracker | undefined)?.trackEvent?.(name, props);
    } catch {
      /* ignore */
    }
    try {
      window.dispatchEvent(new CustomEvent(CHANNEL, { detail: evt }));
    } catch {
      /* ignore */
    }
  }
  // eslint-disable-next-line no-console
  console.debug("[analytics]", name, props ?? {});
  return evt;
}

export function readAnalyticsEvents(): AnalyticsEvent[] {
  return read();
}
