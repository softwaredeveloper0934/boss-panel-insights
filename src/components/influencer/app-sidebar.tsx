import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  Coins,
  FileText,
  Gift,
  Handshake,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  MessageSquare,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Star,
  Store,
  Tags,
  Ticket,
  UserPlus,
  Users2,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { WALLS, type WallConfig } from "@/lib/influencer-walls";

const COLLAPSE_KEY = "sv:influencer:sidebar:collapsed";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  applications: ClipboardList,
  influencers: Users2,
  "creator-profiles": UserPlus,
  "social-accounts": Share2,
  brands: Building2,
  collaborations: Handshake,
  campaigns: Megaphone,
  leads: Activity,
  customers: Users2,
  "marketplace-promotions": Store,
  performance: BarChart3,
  achievements: Award,
  "referral-links": Link2,
  "affiliate-links": Tags,
  coupons: Ticket,
  commissions: Coins,
  wallet: Wallet,
  payouts: Wallet,
  rewards: Gift,
  "content-library": Images,
  "media-assets": ImageIcon,
  reviews: Star,
  support: LifeBuoy,
  communication: MessageSquare,
  documents: FileText,
  compliance: ShieldCheck,
  verification: BadgeCheck,
  analytics: PieChart,
  reports: FileText,
  notifications: Bell,
  settings: Settings2,
};

const GROUP_LABEL: Record<WallConfig["group"], string> = {
  overview: "Overview",
  lifecycle: "Creator Lifecycle",
  growth: "Growth & Campaigns",
  money: "Money & Payouts",
  operations: "Operations",
  system: "Insights & System",
};

const GROUP_ORDER: WallConfig["group"][] = [
  "lifecycle",
  "growth",
  "money",
  "operations",
  "system",
];

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });

  return { collapsed, toggleCollapsed, mobileOpen, setMobileOpen };
}

type NavItem = { to: string; label: string; icon: LucideIcon };

const toNavItem = (w: WallConfig): NavItem => ({
  to: w.to,
  label: w.shortTitle ?? w.title,
  icon: ICONS[w.slug] ?? LayoutDashboard,
});

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const primary = useMemo(
    () => WALLS.filter((w) => w.group === "overview").map(toNavItem),
    [],
  );

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((g) => ({
        label: GROUP_LABEL[g],
        items: WALLS.filter((w) => w.group === g).map(toNavItem),
      })).filter((g) => g.items.length > 0),
    [],
  );

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, groups]);

  const groupOpen = (label: string, items: NavItem[]) =>
    openGroups[label] ?? items.some((i) => isActive(i.to));

  const ItemLink = ({ item }: { item: NavItem }) => (
    <Link
      to={item.to}
      onClick={onCloseMobile}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group/item flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-200",
        collapsed && "justify-center px-0",
        isActive(item.to)
          ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  const content = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 items-center gap-2 border-b border-border px-3 shrink-0",
          collapsed && "justify-center px-0",
        )}
      >
        <Link to="/" className="flex items-center gap-2 min-w-0" onClick={onCloseMobile}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            SV
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">
              Influencer Manager
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggleCollapsed}
            className="ml-auto hidden lg:grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto lg:hidden grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={onToggleCollapsed}
          className="mx-auto mt-3 hidden lg:grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {!collapsed && (
        <div className="px-3 pt-3 shrink-0">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a module…"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
        <div className="space-y-0.5">
          {primary.map((item) => (
            <ItemLink key={item.to} item={item} />
          ))}
        </div>

        {(filtered ?? groups).map((group) => {
          const open = filtered ? true : groupOpen(group.label, group.items);
          if (collapsed) {
            return (
              <div key={group.label} className="space-y-0.5 border-t border-border/60 pt-2">
                {group.items.map((item) => (
                  <ItemLink key={item.to + item.label} item={item} />
                ))}
              </div>
            );
          }
          return (
            <div key={group.label}>
              <button
                onClick={() => setOpenGroups((s) => ({ ...s, [group.label]: !open }))}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {group.label}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
                />
              </button>
              {open && (
                <div className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => (
                    <ItemLink key={item.to + item.label} item={item} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-r border-border bg-background/80 backdrop-blur-xl sticky top-0 h-screen transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-[264px]",
        )}
      >
        {content}
      </aside>

      <MobileDrawer open={mobileOpen} onClose={onCloseMobile}>
        {content}
      </MobileDrawer>
    </>
  );
}

/**
 * Mobile off-canvas drawer — matches the reference interaction model:
 * slide-in/out animation, blurred scrim, Escape to close, body scroll lock,
 * focus trap while open and focus restored to the trigger on close.
 */
function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const t = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      restoreRef.current?.focus?.();
    }, 220);
    return () => window.clearTimeout(t);
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // Escape + focus trap
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = (): HTMLElement[] => {
      if (!panel) return [];
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
    };

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Module navigation">
      <button
        className={cn(
          "absolute inset-0 bg-background/70 backdrop-blur-sm",
          closing ? "sv-scrim-out" : "sv-scrim-in",
        )}
        onClick={onClose}
        aria-label="Close menu overlay"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        className={cn(
          "absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-border bg-background shadow-2xl will-change-transform",
          closing ? "sv-drawer-out" : "sv-drawer-in",
        )}
      >
        {children}
      </div>
    </div>
  );
}

