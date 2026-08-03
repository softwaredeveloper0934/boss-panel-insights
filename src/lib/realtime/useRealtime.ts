/**
 * Lightweight realtime bridge.
 *
 * Today: subscribes to a BroadcastChannel (same-tab + cross-tab) so any
 * mutation elsewhere in the app can call `emitRealtime(channel)` and every
 * open list view will refresh.
 *
 * Tomorrow: swap the internals for Supabase Realtime / websockets — the
 * component API stays identical.
 */
import { useEffect, useRef, useState } from "react";

type Listener = () => void;

const MEM_BUS = new Map<string, Set<Listener>>();

export function emitRealtime(channel: string) {
  MEM_BUS.get(channel)?.forEach((l) => {
    try { l(); } catch { /* ignore */ }
  });
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const bc = new BroadcastChannel(`sv.rt.${channel}`);
      bc.postMessage({ t: Date.now() });
      bc.close();
    } catch { /* ignore */ }
  }
}

export interface RealtimeState {
  connected: boolean;
  lastEventAt: number | null;
}

export function useRealtime(
  channel: string | undefined,
  onEvent: () => void,
  enabled = true,
): RealtimeState {
  const [state, setState] = useState<RealtimeState>({ connected: false, lastEventAt: null });
  const cb = useRef(onEvent);
  cb.current = onEvent;

  useEffect(() => {
    if (!channel || !enabled) return;
    const listener: Listener = () => {
      setState({ connected: true, lastEventAt: Date.now() });
      cb.current();
    };
    // Same-tab bus
    let set = MEM_BUS.get(channel);
    if (!set) { set = new Set(); MEM_BUS.set(channel, set); }
    set.add(listener);

    // Cross-tab bus
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(`sv.rt.${channel}`);
        bc.onmessage = () => listener();
      } catch { /* ignore */ }
    }
    setState((s) => ({ ...s, connected: true }));

    return () => {
      set?.delete(listener);
      bc?.close();
      setState({ connected: false, lastEventAt: null });
    };
  }, [channel, enabled]);

  return state;
}
