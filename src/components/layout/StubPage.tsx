import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Sparkles, Activity } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/PageShell";
import { RequirePermission } from "@/components/auth/RequirePermission";
import type { Permission } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils";

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface KpiTile {
  label: string;
  value?: string;
  unit?: string;
  icon?: LucideIcon;
  tint?: string;
}

export interface StubPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Section pill nav (first one is shown as active). */
  sections?: string[];
  /** Optional KPI strip rendered under the hero. Values default to em-dash when omitted. */
  kpis?: KpiTile[];
  /** Capability cards rendered as a 3-column grid. */
  features?: FeatureCard[];
  /** Primary CTA label rendered in the hero. */
  ctaLabel?: string;
  /** Primary CTA destination. */
  ctaTo?: string;
  /** Optional preview/screenshot/illustration area. */
  preview?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  /** RBAC — required permission to view this module. Renders 403 panel otherwise. */
  permission?: Permission | Permission[];
}

export function StubPage({
  title,
  subtitle,
  icon: Icon,
  sections,
  kpis,
  features,
  ctaLabel = "Connect Software Vala",
  ctaTo = "/settings",
  preview,
  emptyTitle,
  emptyDescription,
  permission,
}: StubPageProps) {
  const [active, setActive] = useState(0);

  const body = (
    <PageShell>
      {/* HERO */}
      <section className="hero-surface relative overflow-hidden p-5 sm:p-7 lg:p-9">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent-pink/40 blur-3xl" />

        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-start">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[11px] font-medium backdrop-blur">
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{title}</span>
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-1.5 text-sm sm:text-[15px] text-white/80 max-w-2xl">
              {subtitle}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to={ctaTo}
                className="inline-flex items-center gap-2 rounded-full bg-white text-primary font-semibold px-5 py-2.5 text-sm hover:bg-white/90 transition"
              >
                {ctaLabel} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium">
                <Activity className="h-3 w-3" />
                Awaiting live source
              </span>
            </div>
          </div>

          {preview && (
            <div className="lg:justify-self-end w-full max-w-sm">{preview}</div>
          )}
        </div>
      </section>

      {/* KPI STRIP */}
      {kpis && kpis.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <div key={k.label} className="bento-card !p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground truncate">{k.label}</p>
                {k.icon && <k.icon className={cn("h-4 w-4 shrink-0", k.tint ?? "text-primary-glow")} />}
              </div>
              <p className="mt-1 text-xl font-bold truncate">
                {k.value ?? "—"}
                {k.unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{k.unit}</span>}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* SECTION TABS */}
      {sections && sections.length > 0 && (
        <div className="-mx-1 overflow-x-auto">
          <div className="flex min-w-max items-center gap-2 px-1">
            {sections.map((s, i) => (
              <button
                key={s}
                onClick={() => setActive(i)}
                className={cn(
                  "px-3.5 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                  i === active
                    ? "bg-primary/20 border-primary/40 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features && features.length > 0 ? (
          features.map((f) => (
            <div key={f.title} className="bento-card">
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              <div className="mt-4 rounded-lg border border-dashed border-border py-6 text-center text-[11px] text-muted-foreground">
                Awaiting live data
              </div>
            </div>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 bento-card flex flex-col items-center justify-center text-center py-16 sm:py-20 px-6">
            <div className="grid place-items-center h-14 w-14 rounded-2xl bg-primary/15 text-primary mb-5">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">
              {emptyTitle ?? `${title} — connect data`}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {emptyDescription ??
                "This module is wired to your Software Vala backend. Configure the API endpoint to populate live data — no mock data is shown."}
            </p>
          </div>
        )}
      </section>

      <p className="text-center text-[11px] text-muted-foreground inline-flex w-full items-center justify-center gap-2">
        <Sparkles className="h-3 w-3" />
        Production-ready · awaiting Software Vala API · no mock data
      </p>
    </PageShell>
  );

  if (permission) return <RequirePermission permission={permission}>{body}</RequirePermission>;
  return body;
}
