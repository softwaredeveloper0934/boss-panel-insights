import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Megaphone, Sparkles, UserPlus } from "lucide-react";

/**
 * Module banner — pixel-matched to the Creator's Launchpad hero surface:
 * gradient hero, soft blurred orbs, pill badge, oversized display heading,
 * pill CTAs and a glass stat rail. No data, no mock records.
 */
export function ModuleBanner() {
  return (
    <section className="hero-surface relative overflow-hidden p-6 md:p-10">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent-pink/40 blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Software Vala — Boss Panel Module
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
            Influencer Manager
          </h1>
          <p className="mt-3 max-w-md text-primary-foreground/80">
            Onboard creators, run campaigns, verify documents and settle payouts —
            every influencer operation from a single control surface.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-card/90"
            >
              <Megaphone className="h-4 w-4" /> Launch Campaign
            </Link>
            <Link
              to="/applications"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              <UserPlus className="h-4 w-4" /> Review Applications
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:justify-self-end lg:w-full">
          {[
            { label: "Creator Lifecycle", to: "/influencers" },
            { label: "Verification", to: "/verification" },
            { label: "Payouts", to: "/payouts" },
            { label: "Analytics", to: "/analytics" },
            { label: "Reports", to: "/reports" },
            { label: "Compliance", to: "/compliance" },
          ].map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold leading-snug">{s.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
              </div>
              <div className="mt-3 h-1 w-8 rounded-full bg-white/40" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
