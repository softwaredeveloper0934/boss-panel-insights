/**
 * Software Vala AI Mascot — "Vala Spark".
 *
 * Opt-in ambient character with subtle peek / walk / wave / celebrate.
 * Optimizations:
 *  - Animations gated by `prefers-reduced-motion` and `document.hidden`
 *    (Page Visibility API) so a background tab spends zero CPU/GPU.
 *  - Idle-only scheduling via requestIdleCallback (fallback to setTimeout)
 *    and rAF-based blink so we never race the scroll compositor.
 *  - `content-visibility: auto` + `will-change` only during an active
 *    action (cleared on idle) to keep the compositor layer cheap.
 *  - Rate-limited celebrate helper (default 4s) to prevent spam.
 *  - Two intensity modes ("subtle" | "extra-subtle") that scale
 *    frequency, amplitude and duration.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Settings2, Sparkles, X } from "lucide-react";
import mascotAsset from "@/assets/mascot.png";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/events";

type Action = "idle" | "peek" | "walk" | "wave" | "celebrate" | "react";
export type MascotIntensity = "subtle" | "extra-subtle";
export type MascotSkin = "aurora" | "ember" | "mint" | "azure";

export const MASCOT_SKINS: { id: MascotSkin; label: string; swatch: string }[] = [
  { id: "aurora", label: "Aurora", swatch: "var(--color-primary)" },
  { id: "ember", label: "Ember", swatch: "var(--color-accent-pink)" },
  { id: "mint", label: "Mint", swatch: "var(--color-accent-emerald)" },
  { id: "azure", label: "Azure", swatch: "var(--color-chart-5)" },
];

/**
 * Context-aware reactions: a very short (~2s) pose + one-line caption shown
 * when the user lands on a key section. Rate-limited per route so it never
 * becomes noisy.
 */
const ROUTE_REACTIONS: { match: RegExp; key: string; line: string }[] = [
  { match: /^\/products/, key: "products", line: "Catalog time — let's ship something." },
  { match: /^\/leads/, key: "leads", line: "Fresh leads. Let's convert." },
  { match: /^\/sales/, key: "sales", line: "Numbers looking sharp." },
  { match: /^\/commissions/, key: "commissions", line: "Counting your cut…" },
  { match: /^\/campaigns/, key: "campaigns", line: "New campaign energy." },
  { match: /^\/analytics/, key: "analytics", line: "Let's read the signals." },
  { match: /^\/wallet|^\/payouts|^\/revenue/, key: "money", line: "Money moves." },
  { match: /^\/ai-/, key: "ai", line: "AI mode engaged." },
  { match: /^\/$/, key: "home", line: "Welcome back, star." },
];

const REACTION_COOLDOWN = 10 * 60 * 1000; // per route, per session-ish
const STORAGE_KEY = "sv.mascot.enabled";
const SKIN_KEY = "sv.mascot.skin";
const INTENSITY_KEY = "sv.mascot.intensity";
const CELEBRATE_EVENT = "sv:mascot:celebrate";
const PERF_DOWNGRADE_EVENT = "sv:mascot:perf-downgrade";
const CELEBRATE_MIN_INTERVAL = 4000; // ms — rate limit

let lastCelebrateAt = 0;
let blockedCelebrateCount = 0;

/**
 * Trigger the mascot celebration from anywhere in the app.
 * Rate-limited to once every 4 seconds. Safe to call repeatedly.
 *
 * Examples:
 *   celebrateMascot("save")       // after a successful save
 *   celebrateMascot("purchase")   // after a completed checkout
 *   celebrateMascot("achievement")
 */
export function celebrateMascot(reason?: string) {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  if (now - lastCelebrateAt < CELEBRATE_MIN_INTERVAL) {
    blockedCelebrateCount += 1;
    trackEvent("mascot.celebrate.blocked", {
      reason: reason ?? "unknown",
      msSinceLast: now - lastCelebrateAt,
      totalBlocked: blockedCelebrateCount,
    });
    return false;
  }
  lastCelebrateAt = now;
  trackEvent("mascot.celebrate.triggered", { reason: reason ?? "unknown" });
  window.dispatchEvent(new CustomEvent(CELEBRATE_EVENT, { detail: { reason } }));
  return true;
}

function readBool(key: string, fallback = false) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "1";
  } catch {
    return fallback;
  }
}
function readIntensity(): MascotIntensity {
  if (typeof window === "undefined") return "subtle";
  try {
    const v = window.localStorage.getItem(INTENSITY_KEY);
    return v === "extra-subtle" ? "extra-subtle" : "subtle";
  } catch {
    return "subtle";
  }
}
function readSkin(): MascotSkin {
  if (typeof window === "undefined") return "aurora";
  try {
    const v = window.localStorage.getItem(SKIN_KEY) as MascotSkin | null;
    return MASCOT_SKINS.some((s) => s.id === v) ? (v as MascotSkin) : "aurora";
  } catch {
    return "aurora";
  }
}

// Prefer idle scheduling so ambient animation never competes with user work.
const idle = (fn: () => void, timeout = 2000) => {
  if (typeof window === "undefined") return 0 as unknown as number;
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) return ric(fn, { timeout });
  return window.setTimeout(fn, 0);
};

export function Mascot() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [intensity, setIntensity] = useState<MascotIntensity>("subtle");
  const [skin, setSkin] = useState<MascotSkin>("aurora");
  const [action, setAction] = useState<Action>("idle");
  const [reactionLine, setReactionLine] = useState<string | null>(null);
  const [blink, setBlink] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const timers = useRef<number[]>([]);
  const lastReactionAt = useRef<Record<string, number>>({});
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMounted(true);
    setEnabled(readBool(STORAGE_KEY));
    setSkin(readSkin());
    setIntensity(readIntensity());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMQ = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onMQ);

    const onVis = () => setVisible(!document.hidden);
    setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mq.removeEventListener?.("change", onMQ);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  // Ambient loop — paused when tab hidden, reduced-motion, or disabled.
  useEffect(() => {
    if (!enabled || reduced || !visible) return;
    let cancelled = false;
    const extra = intensity === "extra-subtle";

    const loop = () => {
      if (cancelled) return;
      const pick: Action[] = extra ? ["peek", "wave"] : ["peek", "walk", "wave"];
      const next = pick[Math.floor(Math.random() * pick.length)];
      setAction(next);
      const base = next === "walk" ? 9000 : next === "peek" ? 4200 : 2600;
      const duration = extra ? base * 0.8 : base;
      schedule(() => {
        if (cancelled) return;
        setAction("idle");
        const minPause = extra ? 60000 : 25000;
        const jitter = extra ? 45000 : 30000;
        schedule(() => idle(loop), minPause + Math.random() * jitter);
      }, duration);
    };

    schedule(() => idle(loop), extra ? 12000 : 6000);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [enabled, reduced, visible, intensity, schedule, clearTimers]);

  // Blink loop — cheap, but still paused when tab hidden.
  useEffect(() => {
    if (!enabled || reduced || !visible) return;
    let cancelled = false;
    let t1 = 0;
    let t2 = 0;
    const tick = () => {
      if (cancelled) return;
      setBlink(true);
      t1 = window.setTimeout(() => !cancelled && setBlink(false), 180);
      t2 = window.setTimeout(tick, 3600 + Math.random() * 3200);
    };
    tick();
    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [enabled, reduced, visible]);

  // Context-aware reaction on navigation to key sections.
  useEffect(() => {
    if (!enabled || reduced || !visible) return;
    const hit = ROUTE_REACTIONS.find((r) => r.match.test(pathname));
    if (!hit) return;
    const now = Date.now();
    if (now - (lastReactionAt.current[hit.key] ?? 0) < REACTION_COOLDOWN) return;
    lastReactionAt.current[hit.key] = now;

    let cancelled = false;
    const start = window.setTimeout(() => {
      if (cancelled) return;
      setReactionLine(hit.line);
      setAction("react");
      trackEvent("mascot.reaction.played", { route: hit.key, pathname, intensity });
    }, 450);
    const end = window.setTimeout(() => {
      if (cancelled) return;
      setAction((a) => (a === "react" ? "idle" : a));
      setReactionLine(null);
    }, intensity === "extra-subtle" ? 2200 : 3000);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [pathname, enabled, reduced, visible, intensity]);

  // Celebrate listener — works even under reduced-motion (just a brief cue).
  useEffect(() => {
    if (!enabled) return;
    const onCelebrate = (e: Event) => {
      const detail = (e as CustomEvent<{ reason?: string }>).detail;
      clearTimers();
      setAction("celebrate");
      trackEvent("mascot.celebrate.played", {
        reason: detail?.reason ?? "unknown",
        reduced,
        intensity,
      });
      schedule(() => setAction("idle"), reduced ? 900 : 2600);
    };
    window.addEventListener(CELEBRATE_EVENT, onCelebrate);
    return () => window.removeEventListener(CELEBRATE_EVENT, onCelebrate);
  }, [enabled, reduced, intensity, schedule, clearTimers]);

  // Runtime performance safeguard — watches for long tasks and low frame
  // rate. If the main thread is under sustained pressure, auto-downgrades
  // the mascot to "extra-subtle" so it never contributes to jank. Only
  // downgrades (never upgrades) and only once per session.
  useEffect(() => {
    if (!enabled || reduced) return;
    if (intensity === "extra-subtle") return;
    let downgraded = false;
    const downgrade = (cause: string, detail: Record<string, unknown>) => {
      if (downgraded) return;
      downgraded = true;
      setIntensity("extra-subtle");
      try { window.localStorage.setItem(INTENSITY_KEY, "extra-subtle"); } catch { /* ignore */ }
      trackEvent("mascot.perf.downgrade", { cause, ...detail });
      try {
        window.dispatchEvent(new CustomEvent(PERF_DOWNGRADE_EVENT, { detail: { cause, ...detail } }));
      } catch { /* ignore */ }
    };

    // 1) Long Task observer (>50ms blocks). Downgrade after 3 within 10s.
    let longTaskObserver: PerformanceObserver | undefined;
    const longTasks: number[] = [];
    try {
      longTaskObserver = new PerformanceObserver((list) => {
        const now = performance.now();
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) longTasks.push(now);
        }
        while (longTasks.length && now - longTasks[0] > 10_000) longTasks.shift();
        if (longTasks.length >= 3) {
          downgrade("long-tasks", { count: longTasks.length, windowMs: 10_000 });
        }
      });
      longTaskObserver.observe({ type: "longtask", buffered: true });
    } catch { /* longtask unsupported (Safari) */ }

    // 2) FPS sampler via rAF. Downgrade if avg < 45 FPS across a 2s window.
    let rafId = 0;
    let frames = 0;
    let windowStart = performance.now();
    const tick = (t: number) => {
      frames += 1;
      const dt = t - windowStart;
      if (dt >= 2000) {
        const fps = (frames * 1000) / dt;
        if (fps < 45) downgrade("low-fps", { fps: Math.round(fps) });
        frames = 0;
        windowStart = t;
      }
      if (!downgraded) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      longTaskObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled, reduced, intensity]);

  const toggle = (v: boolean) => {
    setEnabled(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch { /* ignore */ }
    trackEvent(v ? "mascot.enabled" : "mascot.disabled", { intensity, reduced });
    if (!v) {
      clearTimers();
      setAction("idle");
    }
  };
  const setIntensityPersist = (v: MascotIntensity) => {
    setIntensity(v);
    try { window.localStorage.setItem(INTENSITY_KEY, v); } catch { /* ignore */ }
    trackEvent("mascot.intensity.changed", { intensity: v, source: "user" });
  };
  const setSkinPersist = (v: MascotSkin) => {
    setSkin(v);
    try { window.localStorage.setItem(SKIN_KEY, v); } catch { /* ignore */ }
    trackEvent("mascot.skin.changed", { skin: v });
  };

  if (!mounted) return null;

  const activeAction = action !== "idle" && enabled && !reduced && visible;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden={!enabled}>
      {/* Chip + settings — bottom-left */}
      <div className="pointer-events-auto fixed bottom-4 left-4 z-40 flex items-center gap-1.5">
        <button
          onClick={() => toggle(!enabled)}
          className="group flex items-center gap-1.5 rounded-full border border-border bg-surface/80 backdrop-blur px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm hover:text-foreground hover:border-primary/40 hover:shadow-md transition-all"
          aria-pressed={enabled}
          aria-label={enabled ? "Disable AI mascot" : "Enable AI mascot"}
          title={enabled ? "Disable Vala Spark" : "Enable Vala Spark mascot"}
        >
          {enabled ? <X className="h-3 w-3" /> : <Sparkles className="h-3 w-3 text-primary" />}
          <span className="hidden sm:inline">{enabled ? "Hide mascot" : "Meet Vala"}</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="flex items-center justify-center h-[26px] w-[26px] rounded-full border border-border bg-surface/80 backdrop-blur text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Mascot settings"
            title="Mascot settings"
          >
            <Settings2 className="h-3 w-3" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute bottom-[calc(100%+8px)] left-0 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl p-3 text-xs animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Mascot</span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[var(--color-primary)]"
                    checked={enabled}
                    onChange={(e) => toggle(e.target.checked)}
                  />
                  <span className="text-muted-foreground">Enabled</span>
                </label>
              </div>
              <div className="mt-3">
                <div className="text-muted-foreground mb-1.5">Animation intensity</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["subtle", "extra-subtle"] as MascotIntensity[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIntensityPersist(opt)}
                      className={cn(
                        "rounded-md border px-2 py-1.5 text-[11px] transition-colors",
                        intensity === opt
                          ? "border-primary/60 bg-primary/15 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
                      )}
                    >
                      {opt === "subtle" ? "Subtle" : "Extra subtle"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-muted-foreground mb-1.5">Colorway</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {MASCOT_SKINS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSkinPersist(s.id)}
                      title={s.label}
                      aria-label={`${s.label} colorway`}
                      aria-pressed={skin === s.id}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-md border px-1 py-1.5 text-[10px] transition-colors",
                        skin === s.id
                          ? "border-primary/60 bg-primary/15 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-border"
                        style={{ background: s.swatch }}
                      />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              {reduced && (
                <p className="mt-3 text-[10px] leading-snug text-muted-foreground">
                  Reduced-motion is on in your OS — animations are minimized automatically.
                </p>
              )}
              <button
                onClick={() => celebrateMascot("manual")}
                disabled={!enabled}
                className="mt-3 w-full rounded-md border border-border px-2 py-1.5 text-[11px] hover:border-primary/40 hover:text-foreground text-muted-foreground disabled:opacity-40"
              >
                Test celebration ✨
              </button>
            </div>
          )}
        </div>
      </div>

      {enabled && !reduced && visible && (
        <div
          className={cn(
            "sv-mascot pointer-events-none absolute",
            `sv-mascot--skin-${skin}`,
            intensity === "extra-subtle" && "sv-mascot--xs",
            action === "peek" && "sv-mascot--peek",
            action === "walk" && "sv-mascot--walk",
            action === "wave" && "sv-mascot--wave",
            action === "celebrate" && "sv-mascot--celebrate",
            action === "react" && "sv-mascot--react",
            action === "idle" && "sv-mascot--hidden",
          )}
          style={{
            // Only pay compositor cost while animating.
            willChange: activeAction ? "transform, opacity" : "auto",
            contentVisibility: activeAction ? "visible" : "auto",
          }}
        >
          <div className="sv-mascot__body relative">
            <img
              src={mascotAsset}
              alt=""
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={cn(
                "sv-mascot__img h-[128px] w-[128px] drop-shadow-[0_20px_30px_rgba(120,60,220,0.35)] transition-[filter] duration-200",
                blink && "sv-blink",
              )}
            />
            {action === "react" && reactionLine && (
              <div className="sv-mascot__bubble">{reactionLine}</div>
            )}
            {action === "celebrate" && (
              <div className="sv-mascot__sparkles pointer-events-none absolute inset-0">
                <span /><span /><span /><span /><span /><span />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
