import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { primary, groups, type NavItem } from "@/lib/nav/navigation";
import { useAuthz } from "@/lib/rbac/AuthzProvider";
import { permissionForPath } from "@/lib/rbac/module-access";

const COLLAPSE_KEY = "sv:sidebar:collapsed";

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

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { can } = useAuthz();
  const [query, setQuery] = useState("");

  // RBAC — only surface modules the current user is allowed to open.
  const allowed = (to: string) => {
    const perm = permissionForPath(to);
    return !perm || can(perm);
  };
  const visiblePrimary = useMemo(() => primary.filter((i) => allowed(i.to)), [can]);
  const visibleGroups = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: g.items.filter((i) => allowed(i.to)) }))
        .filter((g) => g.items.length > 0),
    [can],
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return visibleGroups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query, visibleGroups]);

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
      <div className={cn("flex h-16 items-center gap-2 border-b border-border px-3 shrink-0", collapsed && "justify-center px-0")}>
        <Link to="/" className="flex items-center gap-2 min-w-0" onClick={onCloseMobile}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            SV
          </span>
          {!collapsed && <span className="truncate text-sm font-semibold tracking-tight">Software Vala</span>}
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
          {visiblePrimary.map((item) => (
            <ItemLink key={item.to} item={item} />
          ))}
        </div>

        {(filtered ?? visibleGroups).map((group) => {
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
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
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

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onCloseMobile} aria-label="Close menu overlay" />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-border bg-background shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
