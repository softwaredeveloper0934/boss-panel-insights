import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  CircleDot,
  Download,
  Filter,
  Inbox,
  Mail,
  MailOpen,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EmptySurface } from "@/components/influencer/wall-page";
import { StickyBulkBar } from "@/components/influencer/sticky-bulk-bar";

const SMART_FILTERS = [
  { key: "all", label: "All", icon: Inbox },
  { key: "unread", label: "Unread", icon: CircleDot },
  { key: "mentions", label: "Mentions", icon: Bell },
  { key: "approvals", label: "Approvals", icon: ShieldCheck },
  { key: "alerts", label: "Alerts", icon: AlertTriangle },
  { key: "system", label: "System", icon: Sparkles },
  { key: "archived", label: "Archived", icon: Archive },
] as const;

type Filter = (typeof SMART_FILTERS)[number]["key"];

export function NotificationsInbox() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      {/* Smart filters rail */}
      <aside className="rounded-md border border-border bg-surface overflow-hidden self-start">
        <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center text-[12.5px] font-semibold">
          Smart filters
        </div>
        <nav className="p-1">
          {SMART_FILTERS.map((f) => {
            const Icon = f.icon;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={[
                  "w-full h-8 px-2 rounded-md flex items-center gap-2 text-[12.5px]",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">{f.label}</span>
                <span className="tabular-nums text-[11px] text-muted-foreground">0</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-2 grid gap-1">
          <button className="w-full h-8 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-2 px-2">
            <BellOff className="h-3.5 w-3.5" /> Mute rules
          </button>
          <button className="w-full h-8 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-2 px-2">
            <Sparkles className="h-3.5 w-3.5" /> Custom views
          </button>
        </div>
      </aside>

      {/* Inbox column */}
      <section className="space-y-3 min-w-0">
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-[220px] h-8 px-2.5 rounded-md border border-border bg-background">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search notifications…"
              className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          {["Priority", "Source", "Date", "Actor"].map((c) => (
            <button key={c} className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]">
              <Filter className="h-3.5 w-3.5" /> {c}
            </button>
          ))}
        </div>

        

        <div className="rounded-md border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
            <div className="flex items-center gap-2 text-[12.5px] font-semibold">
              {SMART_FILTERS.find((f) => f.key === filter)?.label} inbox
              <span className="text-[11px] text-muted-foreground font-normal">0 notifications</span>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn onClick={() => toast.message("Mark all as read")}><CheckCheck className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn onClick={() => toast.message("Archive all")}><Archive className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn onClick={() => toast.message("Preferences")}><MoreHorizontal className="h-3.5 w-3.5" /></IconBtn>
            </div>
          </div>

          <div className="border-b border-border">
            <SampleRow onToggleSelect={() => setSelected((n) => (n === 0 ? 1 : 0))} selected={selected > 0} />
          </div>

          <EmptySurface
            title="You're all caught up"
            description="Approval requests, mentions, campaign updates and system alerts will show here. Use smart filters to slice by kind, or bulk-action rows once they arrive."
          />
        </div>
      </section>

      <StickyBulkBar
        count={selected}
        entity="notifications"
        onClear={() => setSelected(0)}
        actions={[
          {
            key: "approve",
            label: "Approve",
            tone: "primary",
            icon: <ThumbsUp className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Approve requests",
                description: `${selected} selected approval request${selected === 1 ? "" : "s"} will be approved and the requester notified.`,
                confirmLabel: "Approve",
                tone: "primary",
                withNote: true,
                noteLabel: "Approval note (optional)",
                onConfirm: (note) => {
                  toast.success(`Approved ${selected}`, { description: note || "Requests approved." });
                  setSelected(0);
                },
              }),
          },
          {
            key: "reject",
            label: "Reject",
            tone: "danger",
            icon: <ThumbsDown className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Reject requests",
                description: `${selected} selected approval request${selected === 1 ? "" : "s"} will be rejected.`,
                confirmLabel: "Reject",
                tone: "danger",
                withNote: true,
                noteLabel: "Rejection reason",
                onConfirm: (note) => {
                  toast.message(`Rejected ${selected}`, { description: note || "No reason provided." });
                  setSelected(0);
                },
              }),
          },
          { key: "read", label: "Mark read", icon: <MailOpen className="h-3.5 w-3.5" />, onClick: () => toast.message("Marked as read") },
          { key: "unread", label: "Mark unread", icon: <Mail className="h-3.5 w-3.5" />, onClick: () => toast.message("Marked as unread") },
          { key: "archive", label: "Archive", icon: <Archive className="h-3.5 w-3.5" />, onClick: () => toast.message("Archived") },
          { key: "mute", label: "Mute source", icon: <BellOff className="h-3.5 w-3.5" />, onClick: () => toast.message("Source muted") },
          {
            key: "export",
            label: "Export",
            icon: <Download className="h-3.5 w-3.5" />,
            onClick: () =>
              requestExport({
                count: selected,
                entity: "notifications",
                onExport: () => setSelected(0),
              }),
          },
          {
            key: "delete",
            label: "Delete",
            tone: "danger",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: () =>
              requestConfirm({
                title: "Delete notifications",
                description: `${selected} selected notification${selected === 1 ? "" : "s"} will be permanently deleted. This cannot be undone.`,
                confirmLabel: "Delete",
                tone: "danger",
                onConfirm: () => {
                  toast.message(`Deleted ${selected}`);
                  setSelected(0);
                },
              }),
          },
        ]}
      />

      {dialogs}

    </div>
  );
}

/* ------------------------------- Icon button ------------------------------- */


function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

/* --------------------- Sample approval-workflow row ---------------------
   A single illustrative row so the approval quick-actions surface is
   visible. No mock data below — the list stays empty until wired. */

function SampleRow({ onToggleSelect, selected }: { onToggleSelect: () => void; selected: boolean }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        className="mt-1 h-3.5 w-3.5 rounded border-border"
      />
      <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold">Approval workflow preview</span>
          <span className="h-5 px-1.5 inline-flex items-center rounded text-[10.5px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
            Needs approval
          </span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Illustrative preview of the inline approval quick-actions available on every actionable notification. No live requests yet.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <button onClick={() => toast.message("Approved")} className="h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[11.5px] inline-flex items-center gap-1.5">
            <Check className="h-3 w-3" /> Approve
          </button>
          <button onClick={() => toast.message("Rejected")} className="h-7 px-2.5 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] inline-flex items-center gap-1.5">
            <X className="h-3 w-3" /> Reject
          </button>
          <button onClick={() => toast.message("Snoozed")} className="h-7 px-2.5 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px]">
            Snooze
          </button>
          <button className="h-7 px-2 rounded-md text-[11.5px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Open detail <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground shrink-0">now</span>
    </div>
  );
}
