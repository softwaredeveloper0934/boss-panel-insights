import { useMemo, useState, type DragEvent, type FormEvent } from "react";
import {
  Archive,
  CheckCircle2,
  Copy,
  History,
  MoreHorizontal,
  Pause,
  PlayCircle,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

type AuditEntry = {
  id: string;
  ts: number;
  actor: string;
  action: string;
  target: string;
  status: "ok" | "failed";
  error?: string;
};


type Status = "draft" | "scheduled" | "active" | "in-review" | "completed" | "archived";

type CampaignCard = {
  id: string;
  name: string;
  brand: string;
  budget: string;
  creators: number;
  status: Status;
};

const COLUMNS: { key: Status; label: string; tone: "neutral" | "info" | "warn" | "good" | "bad" }[] = [
  { key: "draft", label: "Draft", tone: "neutral" },
  { key: "scheduled", label: "Scheduled", tone: "info" },
  { key: "active", label: "Active", tone: "warn" },
  { key: "in-review", label: "In review", tone: "warn" },
  { key: "completed", label: "Completed", tone: "good" },
  { key: "archived", label: "Archived", tone: "bad" },
];

export function CampaignKanban() {
  const [cards, setCards] = useState<CampaignCard[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [showAudit, setShowAudit] = useState(true);
  const [createFor, setCreateFor] = useState<Status | null>(null);

  const grouped = useMemo(() => {
    const m: Record<Status, CampaignCard[]> = {
      draft: [], scheduled: [], active: [], "in-review": [], completed: [], archived: [],
    };
    for (const c of cards) m[c.status].push(c);
    return m;
  }, [cards]);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const selectedCount = selectedIds.length;

  const logAudit = (entry: Omit<AuditEntry, "id" | "ts">) => {
    setAudit((prev) => [{ id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: Date.now(), ...entry }, ...prev].slice(0, 50));
  };

  // Session-local persistence. Actions apply immediately and are recorded in the audit log.
  const persist = (action: string, target: string, apply: () => void) => {
    apply();
    logAudit({ actor: "you", action, target, status: "ok" });
  };

  const move = (id: string, status: Status) => {
    const from = cards.find((c) => c.id === id);
    if (!from || from.status === status) return;
    persist(`Move to ${status}`, from.name, () => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    });
  };

  const bulk = (action: "pause" | "activate" | "archive" | "duplicate" | "delete") => {
    if (selectedCount === 0) return;
    const targets = cards.filter((c) => selected[c.id]);
    const label = action.charAt(0).toUpperCase() + action.slice(1);
    persist(`Bulk ${label} (${targets.length})`, targets.map((c) => c.name).join(", ").slice(0, 80), () => {
      if (action === "delete") {
        setCards((prev) => prev.filter((c) => !selected[c.id]));
      } else if (action === "duplicate") {
        const clones = targets.map((c, i) => ({ ...c, id: `${c.id}-copy-${Date.now()}-${i}`, name: `${c.name} (copy)` }));
        setCards((prev) => [...prev, ...clones]);
      } else if (action === "archive") {
        setCards((prev) => prev.map((c) => (selected[c.id] ? { ...c, status: "archived" as Status } : c)));
      } else if (action === "pause") {
        setCards((prev) => prev.map((c) => (selected[c.id] ? { ...c, status: "in-review" as Status } : c)));
      } else if (action === "activate") {
        setCards((prev) => prev.map((c) => (selected[c.id] ? { ...c, status: "active" as Status } : c)));
      }
      toast.success(`${label} applied to ${targets.length} campaign${targets.length === 1 ? "" : "s"}`);
      setSelected({});
    });
  };

  const createCampaign = (input: { name: string; brand: string; budget: string; creators: number; status: Status }) => {
    const c: CampaignCard = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...input,
    };
    persist("Create campaign", c.name, () => setCards((prev) => [...prev, c]));
    toast.success(`Campaign "${c.name}" created`);
  };


  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border bg-surface px-3 py-2 flex items-center gap-2 text-[12px] text-foreground">
        <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">
          Kanban changes are held in this session and recorded in the audit log below.
        </span>
      </div>



      <div className="rounded-md border border-border bg-surface p-2 flex flex-wrap items-center gap-2">
        <div className="text-[12.5px] font-semibold text-foreground px-1">Kanban board</div>
        <span className="text-[11.5px] text-muted-foreground">
          · Drag any card between columns to change status
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowAudit((v) => !v)}
            className="h-7 px-2.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px] font-medium inline-flex items-center gap-1"
          >
            <History className="h-3.5 w-3.5" />
            {showAudit ? "Hide" : "Show"} audit log
            {audit.length > 0 ? <span className="ml-1 text-muted-foreground tabular-nums">({audit.length})</span> : null}
          </button>
          <button
            type="button"
            onClick={() => setCreateFor("draft")}
            className="h-7 px-2.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-[11.5px] font-medium inline-flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New campaign
          </button>
          {cards.length > 0 ? (
            <button
              type="button"
              onClick={() => { setCards([]); setSelected({}); logAudit({ actor: "you", action: "Clear board", target: `${cards.length} campaigns`, status: "ok" }); }}
              className="h-7 px-2.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px] font-medium"
            >
              Clear board
            </button>
          ) : null}
        </div>
      </div>


      {selectedCount > 0 ? (
        <div className="sticky top-0 z-10 rounded-md border border-primary/40 bg-primary/5 p-2 flex flex-wrap items-center gap-2 shadow-sm">
          <span className="text-[12px] font-semibold text-foreground px-1">
            {selectedCount} selected
          </span>
          <BulkBtn onClick={() => bulk("activate")} icon={<PlayCircle className="h-3.5 w-3.5" />}>Activate</BulkBtn>
          <BulkBtn onClick={() => bulk("pause")} icon={<Pause className="h-3.5 w-3.5" />}>Move to review</BulkBtn>
          <BulkBtn onClick={() => bulk("duplicate")} icon={<Copy className="h-3.5 w-3.5" />}>Duplicate</BulkBtn>
          <BulkBtn onClick={() => bulk("archive")} icon={<Archive className="h-3.5 w-3.5" />}>Archive</BulkBtn>
          <BulkBtn onClick={() => bulk("delete")} icon={<Trash2 className="h-3.5 w-3.5" />} destructive>Delete</BulkBtn>
          <button
            type="button"
            onClick={() => setSelected({})}
            className="ml-auto h-7 w-7 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <div className="grid grid-cols-6 gap-3 min-w-[1080px]">
          {COLUMNS.map((col) => {
            const items = grouped[col.key];
            const isOver = dragOver === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
                onDragLeave={() => setDragOver((prev) => (prev === col.key ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  if (id) move(id, col.key);
                  setDragOver(null);
                }}
                className={[
                  "rounded-md border bg-background flex flex-col transition-colors",
                  isOver ? "border-primary bg-primary/5" : "border-border",
                ].join(" ")}
              >
                <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ToneDot tone={col.tone} />
                    <span className="text-[12px] font-semibold text-foreground">{col.label}</span>
                  </div>
                  <span className="text-[10.5px] text-muted-foreground tabular-nums">{items.length}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[220px]">
                  {items.length === 0 ? (
                    <div className="h-[180px] grid place-items-center text-center text-[11.5px] text-muted-foreground border border-dashed border-border rounded">
                      Drop campaigns here
                    </div>
                  ) : (
                    items.map((c) => (
                      <KanbanCard
                        key={c.id}
                        card={c}
                        selected={!!selected[c.id]}
                        onToggle={() => setSelected((s) => ({ ...s, [c.id]: !s[c.id] }))}
                      />
                    ))
                  )}
                </div>
                <div className="px-2 py-1.5 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCreateFor(col.key)}
                    className="w-full h-7 rounded text-[11.5px] text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add campaign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {createFor ? (
        <NewCampaignDialog
          status={createFor}
          onClose={() => setCreateFor(null)}
          onCreate={(input) => { createCampaign(input); setCreateFor(null); }}
        />
      ) : null}

      {showAudit ? (
        <div className="rounded-md border border-border bg-surface overflow-hidden">
          <div className="h-9 px-3 border-b border-border flex items-center gap-1.5 text-[12px] font-semibold">
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            Audit log
            <span className="ml-auto text-[11px] font-normal text-muted-foreground">
              Session-local · last {audit.length} of 50
            </span>
          </div>
          {audit.length === 0 ? (
            <div className="p-6 text-center text-[12px] text-muted-foreground">
              No actions yet. Drag a card or run a bulk action to record an entry.
            </div>
          ) : (
            <ul className="divide-y divide-border max-h-64 overflow-y-auto">
              {audit.map((a) => (
                <li key={a.id} className="px-3 py-2 flex items-start gap-2 text-[12px]">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${a.status === "ok" ? "bg-success" : "bg-destructive"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground">
                      <span className="font-medium">{a.actor}</span> · {a.action}
                      {a.target ? <span className="text-muted-foreground"> — {a.target}</span> : null}
                    </div>
                    {a.error ? <div className="text-[11px] text-destructive">{a.error}</div> : null}
                  </div>
                  <span className="text-[10.5px] text-muted-foreground tabular-nums shrink-0">
                    {new Date(a.ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}


function KanbanCard({
  card,
  selected,
  onToggle,
}: {
  card: CampaignCard;
  selected: boolean;
  onToggle: () => void;
}) {
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", card.id);
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={[
        "group rounded-md border bg-surface p-2.5 shadow-sm cursor-grab active:cursor-grabbing transition-colors",
        selected ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-foreground/20",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 h-3.5 w-3.5 rounded border-border"
          aria-label={`Select ${card.name}`}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-semibold text-foreground truncate">{card.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">{card.brand}</div>
        </div>
        <button
          type="button"
          className="h-6 w-6 grid place-items-center rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted"
          aria-label="More"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground">
        <span className="tabular-nums">{card.budget}</span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {card.creators} creators
        </span>
      </div>
    </div>
  );
}

function BulkBtn({
  children,
  icon,
  onClick,
  destructive,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md border text-[11.5px] font-medium transition-colors",
        destructive
          ? "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
          : "border-border bg-surface text-foreground hover:bg-muted",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

function ToneDot({ tone }: { tone: "neutral" | "info" | "warn" | "good" | "bad" }) {
  const cls =
    tone === "good"
      ? "bg-success"
      : tone === "warn"
        ? "bg-warning"
        : tone === "bad"
          ? "bg-destructive"
          : tone === "info"
            ? "bg-primary"
            : "bg-muted-foreground/50";
  return <span className={`h-1.5 w-1.5 rounded-full ${cls}`} />;
}

function NewCampaignDialog({
  status,
  onClose,
  onCreate,
}: {
  status: Status;
  onClose: () => void;
  onCreate: (input: { name: string; brand: string; budget: string; creators: number; status: Status }) => void;
}) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [creators, setCreators] = useState("0");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;
    onCreate({
      name: name.trim(),
      brand: brand.trim(),
      budget: budget.trim() || "—",
      creators: Math.max(0, parseInt(creators, 10) || 0),
      status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-lg border border-border bg-background text-foreground shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 h-11 border-b border-border">
          <div className="text-[13px] font-semibold">New campaign</div>
          <button type="button" onClick={onClose} aria-label="Close" className="h-6 w-6 grid place-items-center rounded hover:bg-muted">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <Field label="Campaign name" required>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q3 Launch" className="input" />
          </Field>
          <Field label="Brand / client" required>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Acme" className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Budget">
              <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$0" className="input" />
            </Field>
            <Field label="Creators">
              <input type="number" min={0} value={creators} onChange={(e) => setCreators(e.target.value)} className="input" />
            </Field>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Will be added to the <span className="font-medium text-foreground">{status}</span> column.
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-surface">
          <button type="button" onClick={onClose} className="h-8 px-3 rounded border border-border bg-surface hover:bg-muted text-[12.5px]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !brand.trim()}
            className="h-8 px-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-[12.5px] font-medium disabled:opacity-50"
          >
            Create campaign
          </button>
        </div>
        <style>{`.input{width:100%;height:32px;padding:0 10px;border-radius:6px;border:1px solid hsl(var(--border));background:hsl(var(--background));font-size:12.5px;outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11.5px] font-medium text-foreground mb-1">
        {label}{required ? <span className="text-destructive"> *</span> : null}
      </div>
      {children}
    </label>
  );
}
