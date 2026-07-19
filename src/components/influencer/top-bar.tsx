import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Building2,
  Check,
  Command,
  FileText,
  HelpCircle,
  Keyboard,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Megaphone,
  Plus,
  Search,
  Settings2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { WALLS } from "@/lib/influencer-walls";

type Notification = {
  id: string;
  title: string;
  body: string;
  ts: number;
  read: boolean;
};

const SEED_NOTIFICATIONS: Notification[] = [];

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState<null | "workspaces" | "create" | "notif" | "help" | "avatar">(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  // Global Cmd/Ctrl+K shortcut for search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const go = (to: string) => {
    setOpenMenu(null);
    setSearchOpen(false);
    navigate({ to });
  };

  const quickCreate = (label: string, to: string) => {
    setOpenMenu(null);
    toast.success(`${label} — opening workspace`);
    navigate({ to });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-topbar-border bg-topbar text-topbar-foreground">
      {/* Row 1 — brand, search, global actions */}
      <div className="flex h-12 items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 pr-3 mr-1 border-r border-topbar-border">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-[11px] font-semibold tracking-tight">
            SV
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold">Influencer Manager</div>
            <div className="text-[10px] text-topbar-muted">Software Vala — Boss Panel</div>
          </div>
        </Link>

        {/* All workspaces */}
        <Menu
          open={openMenu === "workspaces"}
          onOpenChange={(o) => setOpenMenu(o ? "workspaces" : null)}
          trigger={
            <button
              type="button"
              className="hidden md:flex items-center gap-1.5 px-2 h-8 rounded-md text-[12px] text-topbar-muted hover:bg-topbar-active hover:text-topbar-foreground transition-colors"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              All workspaces
            </button>
          }
        >
          <WorkspacesMenu onPick={go} currentPath={pathname} />
        </Menu>

        {/* Search trigger */}
        <div className="flex-1 max-w-2xl mx-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="group w-full flex items-center gap-2 h-8 px-3 rounded-md bg-topbar-active/60 hover:bg-topbar-active border border-topbar-border text-[12px] text-topbar-muted"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search influencers, campaigns, payouts, documents…</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-topbar-border text-[10px] font-mono">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Menu
            open={openMenu === "create"}
            onOpenChange={(o) => setOpenMenu(o ? "create" : null)}
            trigger={<IconBtn aria="Quick create"><Plus className="h-4 w-4" /></IconBtn>}
          >
            <MenuHeader label="Quick create" />
            <MenuItem icon={<Megaphone className="h-3.5 w-3.5" />} label="New campaign" hint="Campaigns" onClick={() => quickCreate("New campaign", "/campaigns")} />
            <MenuItem icon={<UserPlus className="h-3.5 w-3.5" />} label="Invite creator" hint="Influencers" onClick={() => quickCreate("Invite creator", "/influencers")} />
            <MenuItem icon={<FileText className="h-3.5 w-3.5" />} label="New application" hint="Applications" onClick={() => quickCreate("New application", "/applications")} />
            <MenuItem icon={<Bell className="h-3.5 w-3.5" />} label="Schedule follow-up" hint="Leads" onClick={() => quickCreate("Schedule follow-up", "/leads")} />
          </Menu>

          <Menu
            open={openMenu === "notif"}
            onOpenChange={(o) => setOpenMenu(o ? "notif" : null)}
            trigger={<IconBtn aria="Notifications" badge={unread > 0}><Bell className="h-4 w-4" /></IconBtn>}
            width={340}
          >
            <NotificationsPanel
              items={notifications}
              onMarkAll={() => {
                setNotifications((n) => n.map((x) => ({ ...x, read: true })));
                toast.success("All notifications marked as read");
              }}
              onClear={() => {
                setNotifications([]);
                toast("Notifications cleared");
              }}
              onOpen={(id) => {
                setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));
              }}
            />
          </Menu>

          <Menu
            open={openMenu === "help"}
            onOpenChange={(o) => setOpenMenu(o ? "help" : null)}
            trigger={<IconBtn aria="Help"><HelpCircle className="h-4 w-4" /></IconBtn>}
          >
            <MenuHeader label="Help & resources" />
            <MenuItem icon={<BookOpen className="h-3.5 w-3.5" />} label="Documentation" onClick={() => { setOpenMenu(null); window.open("https://docs.lovable.dev", "_blank", "noopener,noreferrer"); }} />
            <MenuItem icon={<Keyboard className="h-3.5 w-3.5" />} label="Keyboard shortcuts" hint="⌘K" onClick={() => { setOpenMenu(null); setSearchOpen(true); }} />
            <MenuItem icon={<LifeBuoy className="h-3.5 w-3.5" />} label="Contact support" onClick={() => quickCreate("Support ticket", "/support")} />
          </Menu>

          <IconBtn aria="Settings" onClick={() => go("/settings")}>
            <Settings2 className="h-4 w-4" />
          </IconBtn>

          <Menu
            open={openMenu === "avatar"}
            onOpenChange={(o) => setOpenMenu(o ? "avatar" : null)}
            trigger={
              <button
                type="button"
                aria-label="Account"
                className="ml-1 h-7 w-7 rounded-full bg-topbar-active grid place-items-center text-[11px] font-semibold border border-topbar-border hover:brightness-110 cursor-pointer"
              >
                SV
              </button>
            }
          >
            <div className="px-3 py-2 border-b border-border">
              <div className="text-[12.5px] font-semibold text-foreground">Software Vala</div>
              <div className="text-[11px] text-muted-foreground">boss@softwarevala.com</div>
            </div>
            <MenuItem icon={<User className="h-3.5 w-3.5" />} label="Profile" onClick={() => go("/settings")} />
            <MenuItem icon={<Building2 className="h-3.5 w-3.5" />} label="Workspace settings" onClick={() => go("/settings")} />
            <MenuItem icon={<LogOut className="h-3.5 w-3.5" />} label="Sign out" onClick={() => { setOpenMenu(null); toast.success("Signed out (session-local)"); }} />
          </Menu>
        </div>
      </div>

      {/* Row 2 — wall tabs */}
      <nav className="border-t border-topbar-border relative">
        <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth">
          {WALLS.map((w) => {
            const active = w.to === "/" ? pathname === "/" : pathname.startsWith(w.to);
            return (
              <Link
                key={w.slug}
                to={w.to}
                className={[
                  "shrink-0 px-3.5 h-10 inline-flex items-center text-[12.5px] font-medium border-b-2 transition-colors whitespace-nowrap",
                  active
                    ? "border-primary-foreground text-topbar-foreground"
                    : "border-transparent text-topbar-muted hover:text-topbar-foreground hover:bg-topbar-active/50",
                ].join(" ")}
              >
                {w.shortTitle ?? w.title}
              </Link>
            );
          })}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-topbar to-transparent" />
      </nav>


      {searchOpen ? <SearchPalette onClose={() => setSearchOpen(false)} onPick={go} /> : null}
    </header>
  );
}

/* ------------------------------- primitives ------------------------------- */

function IconBtn({
  children,
  aria,
  badge,
  onClick,
}: {
  children: React.ReactNode;
  aria: string;
  badge?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={aria}
      onClick={onClick}
      className="relative h-8 w-8 grid place-items-center rounded-md text-topbar-muted hover:text-topbar-foreground hover:bg-topbar-active transition-colors cursor-pointer"
    >
      {children}
      {badge ? <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" /> : null}
    </button>
  );
}

function Menu({
  open,
  onOpenChange,
  trigger,
  children,
  width = 240,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open ? (
        <div
          style={{ width }}
          className="absolute right-0 mt-1.5 rounded-md border border-border bg-background text-foreground shadow-lg py-1 z-50"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function MenuHeader({ label }: { label: string }) {
  return <div className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>;
}

function MenuItem({
  icon,
  label,
  hint,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-foreground hover:bg-muted cursor-pointer text-left"
    >
      {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      <span className="flex-1">{label}</span>
      {hint ? <span className="text-[10.5px] text-muted-foreground">{hint}</span> : null}
    </button>
  );
}

/* ------------------------------ workspaces menu ------------------------------ */

function WorkspacesMenu({ onPick, currentPath }: { onPick: (to: string) => void; currentPath: string }) {
  const groups = useMemo(() => {
    const g: Record<string, typeof WALLS> = {};
    for (const w of WALLS) (g[w.group] ||= []).push(w);
    return g;
  }, []);
  const groupLabel: Record<string, string> = {
    overview: "Overview",
    lifecycle: "Lifecycle",
    growth: "Growth",
    money: "Money",
    operations: "Operations",
    system: "System",
  };
  return (
    <div className="max-h-[70vh] w-[240px] overflow-y-auto">
      {Object.entries(groups).map(([g, items]) => (
        <div key={g}>
          <MenuHeader label={groupLabel[g] ?? g} />
          {items.map((w) => {
            const active = w.to === "/" ? currentPath === "/" : currentPath.startsWith(w.to);
            return (
              <button
                key={w.slug}
                type="button"
                onClick={() => onPick(w.to)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-foreground hover:bg-muted cursor-pointer text-left"
              >
                <span className="flex-1 truncate">{w.shortTitle ?? w.title}</span>
                {active ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- notifications ------------------------------- */

function NotificationsPanel({
  items,
  onMarkAll,
  onClear,
  onOpen,
}: {
  items: Notification[];
  onMarkAll: () => void;
  onClear: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="text-[12.5px] font-semibold">Notifications</div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onMarkAll} className="text-[11px] text-primary hover:underline cursor-pointer">
            Mark all read
          </button>
          <button type="button" onClick={onClear} className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer">
            Clear
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-3 py-6 text-center text-[12px] text-muted-foreground">You're all caught up.</div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onOpen(n.id)}
              className="w-full text-left px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted flex items-start gap-2 cursor-pointer"
            >
              <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? "bg-muted-foreground/40" : "bg-primary"}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium text-foreground truncate">{n.title}</div>
                <div className="text-[11.5px] text-muted-foreground line-clamp-2">{n.body}</div>
                <div className="text-[10.5px] text-muted-foreground mt-0.5">{timeAgo(n.ts)}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/* --------------------------------- search --------------------------------- */

function SearchPalette({ onClose, onPick }: { onClose: () => void; onPick: (to: string) => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = WALLS.map((w) => ({ to: w.to, label: w.shortTitle ?? w.title, hint: w.description }));
    if (!needle) return base.slice(0, 12);
    return base.filter((r) => r.label.toLowerCase().includes(needle) || r.hint.toLowerCase().includes(needle)).slice(0, 20);
  }, [q]);

  useEffect(() => setIdx(0), [q]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-lg border border-border bg-background text-foreground shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 px-3 h-11 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
              if (e.key === "Enter" && results[idx]) { e.preventDefault(); onPick(results[idx].to); }
            }}
            placeholder="Jump to a workspace, influencer, campaign…"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground"
          />
          <button type="button" onClick={onClose} aria-label="Close" className="h-6 w-6 grid place-items-center rounded hover:bg-muted cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12.5px] text-muted-foreground">No matches.</div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.to}
                type="button"
                onMouseEnter={() => setIdx(i)}
                onClick={() => onPick(r.to)}
                className={`w-full text-left px-3 py-2 flex items-start gap-2 cursor-pointer ${i === idx ? "bg-muted" : ""}`}
              >
                <LayoutGrid className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium truncate">{r.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{r.hint}</div>
                </div>
                <span className="text-[10.5px] text-muted-foreground">{r.to}</span>
              </button>
            ))
          )}
        </div>
        <div className="px-3 py-2 border-t border-border text-[10.5px] text-muted-foreground flex items-center gap-3">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
