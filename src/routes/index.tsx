import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Sparkles, TrendingUp, Eye, MousePointerClick, Users, ShoppingBag, Wallet,
  Trophy, Star, ArrowUpRight, Flame, Target, Zap, Award, ChevronRight,
  Play, Megaphone, Package, Activity,
} from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Sparkline } from "@/components/dashboard/Sparkline";
import {
  dashboardAnalyticsQueryOptions,
} from "@/lib/analytics/analytics.functions";
import type { MetricKey } from "@/lib/analytics/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Software Vala Influencer" },
      { name: "description", content: "Your creator command center: campaigns, sales, commission, rank, AI." },
      { property: "og:title", content: "Influencer Dashboard" },
      { property: "og:description", content: "Promote, earn and grow from one command center." },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(dashboardAnalyticsQueryOptions("7d")),
  component: Dashboard,
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="bento-card text-center py-16">
        <h2 className="text-lg font-semibold">Analytics unavailable</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </PageShell>
  ),
});

const KPI_DEFS: Array<{
  key: MetricKey;
  label: string;
  icon: typeof Users;
  tint: string;
}> = [
  { key: "followers",   label: "Followers",   icon: Users,            tint: "text-accent-pink" },
  { key: "reach",       label: "Reach",       icon: TrendingUp,       tint: "text-primary-glow" },
  { key: "views",       label: "Views",       icon: Eye,              tint: "text-accent-emerald" },
  { key: "clicks",      label: "Clicks",      icon: MousePointerClick, tint: "text-accent-amber" },
  { key: "leads",       label: "Leads",       icon: Target,           tint: "text-accent-pink" },
  { key: "sales",       label: "Sales",       icon: ShoppingBag,      tint: "text-primary-glow" },
  { key: "commissions", label: "Commission",  icon: Wallet,           tint: "text-accent-emerald" },
];

function Dashboard() {
  const { data: analytics } = useSuspenseQuery(dashboardAnalyticsQueryOptions("7d"));
  const { metrics, connected } = analytics;
  const commission = metrics.commissions;
  const commissionDeltaPct = commission.deltaPct;

  return (
    <PageShell>
      {/* HERO */}
      <section className="hero-surface relative overflow-hidden p-6 md:p-10">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent-pink/40 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Software Vala Creator Program
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
              Hello, Creator
            </h1>
            <p className="mt-3 text-white/80 max-w-md">
              Promote products, generate sales and grow your personal brand — all from one influencer command center.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/campaigns" className="inline-flex items-center gap-2 rounded-full bg-white text-primary font-semibold px-5 py-2.5 text-sm hover:bg-white/90 transition">
                Join a Campaign <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/ai-chat" className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-5 py-2.5 text-sm font-medium backdrop-blur hover:bg-white/25 transition">
                <Sparkles className="h-4 w-4" /> Ask AI
              </Link>
              <span
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium border " +
                  (connected
                    ? "bg-accent-emerald/15 border-accent-emerald/40 text-accent-emerald"
                    : "bg-white/10 border-white/20 text-white/80")
                }
              >
                <Activity className="h-3 w-3" />
                {connected ? `Live · ${analytics.source}` : "Not connected"}
              </span>
            </div>
          </div>

          <div className="lg:justify-self-end w-full max-w-sm">
            <div className="rounded-2xl bg-black/25 border border-white/15 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="block h-14 w-14 rounded-full bg-gradient-to-br from-accent-pink to-primary-glow" />
                  <span className="absolute -top-1 -right-1 grid place-items-center h-6 w-6 rounded-full bg-accent-amber text-black">
                    <Star className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold truncate">Your Creator Profile</p>
                    <Award className="h-4 w-4 text-accent-amber" />
                  </div>
                  <p className="text-xs text-white/70">
                    {connected ? "Live profile" : "Connect Software Vala login"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["XP", "0"], ["Rank", "—"], ["Streak", "0d"]].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-white/10 border border-white/15 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-white/60">{l}</p>
                    <p className="text-sm font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI GRID */}
      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {KPI_DEFS.map(({ key, label, icon, tint }) => (
          <KpiCard
            key={key}
            label={label}
            icon={icon}
            tint={tint}
            connected={connected}
            snap={metrics[key]}
          />
        ))}
      </section>

      {/* BENTO ROW */}
      <section className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Today's plan */}
        <div className="bento-card lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Today's plan</h3>
            <span className="text-xs text-muted-foreground">
              {connected ? "Live" : "Awaiting data"}
            </span>
          </div>
          <p className="mt-1 text-3xl font-bold tracking-tight">Your day</p>
          <ul className="mt-5 divide-y divide-border">
            {[
              ["Post Reel", "Instagram", "9:00 AM"],
              ["Share Story", "WhatsApp", "12:30 PM"],
              ["Live Demo", "YouTube", "6:00 PM"],
              ["Reply DMs", "All channels", "9:00 PM"],
            ].map(([task, ch, time]) => (
              <li key={task} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary/15 text-primary">
                    <Play className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{task}</p>
                    <p className="text-xs text-muted-foreground">{ch}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle stack */}
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-2xl p-5 border border-border" style={{ background: "linear-gradient(135deg, oklch(0.78 0.16 350 / 0.25), oklch(0.62 0.24 295 / 0.15))" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Your XP</p>
                <p className="mt-1 text-3xl font-bold">0 pts</p>
              </div>
              <Flame className="h-5 w-5 text-accent-pink" />
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-black/30 overflow-hidden">
              <div className="h-full w-[6%] bg-gradient-to-r from-accent-pink to-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Reach Rookie 100 XP to unlock the next rank</p>
          </div>

          <div className="rounded-2xl p-5 border border-border" style={{ background: "linear-gradient(135deg, oklch(0.85 0.17 85 / 0.22), oklch(0.74 0.16 165 / 0.12))" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Reviews</p>
                <p className="mt-1 text-3xl font-bold">—</p>
              </div>
              <Star className="h-5 w-5 text-accent-amber" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Customer reviews appear here after your first sale.</p>
          </div>
        </div>

        {/* Balance — wired to commission metric */}
        <div className="bento-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Balance</h3>
            <span className="text-[11px] text-muted-foreground">{analytics.range}</span>
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(commission.value)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Previous: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(commission.previousValue)}
            {commissionDeltaPct !== null && (
              <span
                className={
                  "ml-2 " +
                  (commissionDeltaPct >= 0 ? "text-accent-emerald" : "text-accent-pink")
                }
              >
                {commissionDeltaPct >= 0 ? "+" : ""}
                {(commissionDeltaPct * 100).toFixed(1)}%
              </span>
            )}
          </p>

          <div className="mt-6 text-primary-glow">
            <Sparkline data={commission.series} height={70} width={240} strokeWidth={2} fill="oklch(0.72 0.22 305 / 0.18)" />
          </div>

          <Link to="/withdrawals" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-glow hover:underline">
            Open wallet <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* WALLS */}
      <section className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary-glow" /> Campaign Wall</h3>
            <Link to="/campaigns" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
          </div>
          <div className="rounded-xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted-foreground">No campaigns yet. Browse Marketplace to join your first.</p>
          </div>
        </div>

        <div className="bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-accent-pink" /> Top Products</h3>
            <Link to="/products" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
          </div>
          <div className="rounded-xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted-foreground">Products from the Marketplace will appear here.</p>
          </div>
        </div>

        <div className="bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-accent-amber" /> Leaderboard</h3>
            <Link to="/leaderboard" className="text-xs text-muted-foreground hover:text-foreground">Full board</Link>
          </div>
          <ul className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((r) => (
              <li key={r} className="flex items-center gap-3 py-2.5">
                <span className="grid place-items-center h-7 w-7 rounded-lg bg-muted text-xs font-semibold">{r}</span>
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent-pink to-primary" />
                <p className="text-sm flex-1">Awaiting creators</p>
                <span className="text-xs text-muted-foreground">— XP</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bento-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-accent-emerald" /> AI Suggestions</h3>
            <Link to="/ai-chat" className="text-xs text-muted-foreground hover:text-foreground">Open AI</Link>
          </div>
          <ul className="space-y-2.5">
            {[
              "Post a Reel about your top product tonight at 8 PM for peak reach.",
              "Audience engagement is highest on Saturday — schedule a story.",
              "Try a 15s testimonial Short — converts 2.4× better than long form.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 rounded-xl bg-muted/40 border border-border p-3">
                <Sparkles className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        {connected
          ? `Source: ${analytics.source} · updated ${new Date(analytics.generatedAt).toLocaleString()}`
          : "Configure SOFTWARE_VALA_API_URL and SOFTWARE_VALA_API_KEY to stream live data. No mock data is shown."}
      </p>
    </PageShell>
  );
}
