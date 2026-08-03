/**
 * Premium list-page shell.
 * Hero + KPI strip + section tabs + DataTable, sharing the same spacing
 * and typography scale as StubPage. Use for any module that needs a
 * unified filter / sort / pagination experience.
 */
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Activity, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/PageShell";
import { RequirePermission } from "@/components/auth/RequirePermission";
import type { Permission } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils";
import type { KpiTile } from "@/components/layout/StubPage";

export interface ListPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  sections?: string[];
  kpis?: KpiTile[];
  ctaLabel?: string;
  ctaTo?: string;
  permission?: Permission | Permission[];
  /** The DataTable instance — owns filters, sort, pagination. */
  children: ReactNode;
  /** Optional active section change handler. */
  onSectionChange?: (index: number, label: string) => void;
}

export function ListPage({
  title, subtitle, icon: Icon, sections, kpis,
  ctaLabel = "Connect Software Vala", ctaTo = "/settings",
  permission, children, onSectionChange,
}: ListPageProps) {
  const [active, setActive] = useState(0);

  const body = (
    <PageShell>
      {/* HERO */}
      <section className="hero-surface relative overflow-hidden p-5 sm:p-7 lg:p-9">
        <div className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -start-10 h-64 w-64 rounded-full bg-accent-pink/40 blur-3xl" />

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
                {k.unit && <span className="ms-1 text-xs font-normal text-muted-foreground">{k.unit}</span>}
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
                onClick={() => { setActive(i); onSectionChange?.(i, s); }}
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

      {/* DATA TABLE */}
      <section>{children}</section>

      <p className="text-center text-[11px] text-muted-foreground inline-flex w-full items-center justify-center gap-2">
        <Sparkles className="h-3 w-3" />
        Production-ready · awaiting Software Vala API · no mock data
      </p>
    </PageShell>
  );

  if (permission) return <RequirePermission permission={permission}>{body}</RequirePermission>;
  return body;
}
