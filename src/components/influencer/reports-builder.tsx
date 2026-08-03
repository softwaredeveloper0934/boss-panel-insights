import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  Columns3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  GripVertical,
  Hash,
  Layers,
  Play,
  Plus,
  Save,
  Sigma,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EmptySurface } from "@/components/influencer/wall-page";

/* ------------------------------- Field catalog -------------------------------
   Schema definitions only (field names the backend will expose). These are not
   records or sample data — no values, no rows, no users. */

type FieldKind = "metric" | "dimension";

type Field = { id: string; label: string; kind: FieldKind; group: string };

const CATALOG: Field[] = [
  // Metrics
  { id: "reach", label: "Reach", kind: "metric", group: "Performance" },
  { id: "impressions", label: "Impressions", kind: "metric", group: "Performance" },
  { id: "engagement", label: "Engagement", kind: "metric", group: "Performance" },
  { id: "engagement_rate", label: "Engagement rate", kind: "metric", group: "Performance" },
  { id: "clicks", label: "Clicks", kind: "metric", group: "Performance" },
  { id: "leads", label: "Leads", kind: "metric", group: "Conversion" },
  { id: "sales", label: "Sales", kind: "metric", group: "Conversion" },
  { id: "revenue", label: "Revenue", kind: "metric", group: "Revenue" },
  { id: "commission", label: "Commission", kind: "metric", group: "Revenue" },
  { id: "payouts_pending", label: "Pending payouts", kind: "metric", group: "Revenue" },
  { id: "payouts_paid", label: "Paid payouts", kind: "metric", group: "Revenue" },
  { id: "followers_growth", label: "Follower growth", kind: "metric", group: "Growth" },
  // Dimensions
  { id: "influencer", label: "Influencer", kind: "dimension", group: "Entities" },
  { id: "campaign", label: "Campaign", kind: "dimension", group: "Entities" },
  { id: "brand", label: "Brand", kind: "dimension", group: "Entities" },
  { id: "platform", label: "Platform", kind: "dimension", group: "Channel" },
  { id: "content_type", label: "Content type", kind: "dimension", group: "Channel" },
  { id: "country", label: "Country", kind: "dimension", group: "Audience" },
  { id: "language", label: "Language", kind: "dimension", group: "Audience" },
  { id: "device", label: "Device", kind: "dimension", group: "Audience" },
  { id: "age_band", label: "Age band", kind: "dimension", group: "Audience" },
  { id: "date", label: "Date", kind: "dimension", group: "Time" },
  { id: "week", label: "Week", kind: "dimension", group: "Time" },
  { id: "month", label: "Month", kind: "dimension", group: "Time" },
  { id: "status", label: "Status", kind: "dimension", group: "Lifecycle" },
  { id: "verification", label: "Verification", kind: "dimension", group: "Lifecycle" },
];

const TEMPLATES = [
  { key: "performance", label: "Performance report", metrics: ["reach", "impressions", "engagement"], dimensions: ["campaign", "platform"] },
  { key: "campaign", label: "Campaign report", metrics: ["impressions", "clicks", "sales"], dimensions: ["campaign", "month"] },
  { key: "revenue", label: "Revenue report", metrics: ["revenue", "commission"], dimensions: ["brand", "month"] },
  { key: "commission", label: "Commission report", metrics: ["commission", "payouts_pending", "payouts_paid"], dimensions: ["influencer"] },
  { key: "audience", label: "Audience report", metrics: ["reach", "engagement_rate"], dimensions: ["country", "device", "age_band"] },
  { key: "growth", label: "Growth report", metrics: ["followers_growth"], dimensions: ["platform", "week"] },
] as const;

const VISUALS = [
  { key: "table", label: "Table", icon: Columns3 },
  { key: "bar", label: "Bar", icon: BarChart3 },
  { key: "line", label: "Line", icon: Layers },
] as const;

type Visual = (typeof VISUALS)[number]["key"];

const byId = (id: string) => CATALOG.find((f) => f.id === id);

export function ReportsBuilder() {
  const [metrics, setMetrics] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [visual, setVisual] = useState<Visual>("table");
  const [search, setSearch] = useState("");
  const [ran, setRan] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [dragOver, setDragOver] = useState<FieldKind | null>(null);

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? CATALOG.filter((f) => f.label.toLowerCase().includes(q)) : CATALOG;
    const map = new Map<string, Field[]>();
    for (const f of list) {
      const key = `${f.kind === "metric" ? "Metrics" : "Dimensions"} · ${f.group}`;
      map.set(key, [...(map.get(key) ?? []), f]);
    }
    return [...map.entries()];
  }, [search]);

  const add = (id: string) => {
    const f = byId(id);
    if (!f) return;
    const target = f.kind === "metric" ? metrics : dimensions;
    if (target.includes(id)) {
      toast.message(`${f.label} is already in the report`);
      return;
    }
    if (f.kind === "metric") setMetrics((m) => [...m, id]);
    else setDimensions((d) => [...d, id]);
    setRan(false);
  };

  const drop = (kind: FieldKind) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/field-id");
    const f = byId(id);
    if (!f) return;
    if (f.kind !== kind) {
      toast.error(`${f.label} is a ${f.kind} — drop it in the ${f.kind === "metric" ? "Metrics" : "Dimensions"} zone`);
      return;
    }
    add(id);
  };

  const reorder = (kind: FieldKind, from: number, to: number) => {
    const setter = kind === "metric" ? setMetrics : setDimensions;
    setter((prev) => {
      if (from === to || from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setRan(false);
  };

  const remove = (kind: FieldKind, id: string) => {
    if (kind === "metric") setMetrics((m) => m.filter((x) => x !== id));
    else setDimensions((d) => d.filter((x) => x !== id));
    setRan(false);
  };

  const applyTemplate = (t: (typeof TEMPLATES)[number]) => {
    setMetrics([...t.metrics]);
    setDimensions([...t.dimensions]);
    setRan(false);
    toast.success(`${t.label} template loaded`);
  };

  const canRun = metrics.length > 0 && dimensions.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr] min-w-0">
      {/* Field palette */}
      <aside className="rounded-md border border-border bg-surface overflow-hidden self-start">
        <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center justify-between">
          <span className="text-[12.5px] font-semibold">Fields</span>
          <span className="text-[11px] text-muted-foreground">drag →</span>
        </div>
        <div className="p-2 border-b border-border">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields…"
            className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring"
          />
        </div>
        <div className="max-h-[520px] overflow-y-auto p-2 space-y-3">
          {groups.length === 0 ? (
            <p className="px-1 py-6 text-center text-[12px] text-muted-foreground">No fields match.</p>
          ) : (
            groups.map(([group, fields]) => (
              <div key={group}>
                <div className="px-1 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {group}
                </div>
                <div className="grid gap-1">
                  {fields.map((f) => (
                    <button
                      key={f.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/field-id", f.id);
                        e.dataTransfer.effectAllowed = "copy";
                      }}
                      onDoubleClick={() => add(f.id)}
                      onClick={() => add(f.id)}
                      className="group w-full h-8 px-2 rounded-md border border-border bg-background hover:bg-muted flex items-center gap-2 text-[12px] cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                      {f.kind === "metric" ? (
                        <Sigma className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="flex-1 text-left truncate">{f.label}</span>
                      <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Canvas */}
      <section className="space-y-3 min-w-0">
        {/* Templates + toolbar */}
        <div className="rounded-md border border-border bg-surface p-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted-foreground pl-1">Templates</span>
          {TEMPLATES.map((t) => (
            <button
              key={t.key}
              onClick={() => applyTemplate(t)}
              className="h-8 px-2.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-md border border-border bg-surface p-2 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
            {VISUALS.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.key}
                  onClick={() => setVisual(v.key)}
                  className={[
                    "h-7 px-2.5 rounded inline-flex items-center gap-1.5 text-[12px]",
                    visual === v.key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" /> {v.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1" />
          <button
            onClick={() => {
              setRan(true);
              toast.message("Preview requested — awaiting data source");
            }}
            disabled={!canRun}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3.5 w-3.5" /> Run preview
          </button>
          <button
            onClick={() => setSaveOpen(true)}
            disabled={!canRun}
            className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px] inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> Save report
          </button>
          <button
            onClick={() => setExportOpen(true)}
            disabled={!canRun}
            className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px] inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button
            onClick={() => setScheduleOpen(true)}
            disabled={!canRun}
            className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px] inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <CalendarClock className="h-3.5 w-3.5" /> Schedule
          </button>
        </div>

        {/* Drop zones */}
        <div className="grid gap-3 md:grid-cols-2">
          <DropZone
            title="Metrics"
            hint="Drop measures to aggregate"
            icon={<Sigma className="h-3.5 w-3.5 text-primary" />}
            ids={metrics}
            kind="metric"
            active={dragOver === "metric"}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver("metric");
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={drop("metric")}
            onRemove={(id) => remove("metric", id)}
            onReorder={(from, to) => reorder("metric", from, to)}
            onClear={() => {
              setMetrics([]);
              setRan(false);
            }}
          />
          <DropZone
            title="Dimensions"
            hint="Drop attributes to group by"
            icon={<Hash className="h-3.5 w-3.5 text-muted-foreground" />}
            ids={dimensions}
            kind="dimension"
            active={dragOver === "dimension"}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver("dimension");
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={drop("dimension")}
            onRemove={(id) => remove("dimension", id)}
            onReorder={(from, to) => reorder("dimension", from, to)}
            onClear={() => {
              setDimensions([]);
              setRan(false);
            }}
          />
        </div>

        {/* Preview */}
        <div className="rounded-md border border-border bg-surface overflow-hidden">
          <div className="h-10 px-4 border-b border-border bg-surface-muted flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12.5px] font-semibold">
              <Eye className="h-3.5 w-3.5" /> Preview
              <span className="text-[11px] font-normal text-muted-foreground">
                {dimensions.length} dimensions · {metrics.length} metrics · {visual}
              </span>
            </div>
          </div>

          {!canRun ? (
            <EmptySurface
              title="Compose a report to preview it"
              description="Drag at least one dimension and one metric into the canvas above. Templates give you a starting composition you can refine."
            />
          ) : !ran ? (
            <EmptySurface
              title="Composition ready"
              description="Run the preview to render this report with the configured metrics and dimensions."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-background/40">
                    {dimensions.map((id) => (
                      <th key={id} className="text-left font-semibold px-4 py-2 whitespace-nowrap">
                        {byId(id)?.label}
                      </th>
                    ))}
                    {metrics.map((id) => (
                      <th key={id} className="text-right font-semibold px-4 py-2 whitespace-nowrap">
                        {byId(id)?.label}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
              <EmptySurface
                title="No results for this composition"
                description="Column layout is confirmed. Rows appear once the reporting data source is connected."
              />
            </div>
          )}
        </div>
      </section>

      {saveOpen ? (
        <Modal title="Save report" onClose={() => setSaveOpen(false)}>
          <Field label="Report name">
            <input placeholder="e.g. Q3 campaign performance" className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring" />
          </Field>
          <Field label="Description">
            <textarea rows={3} placeholder="What this report answers…" className="w-full px-2.5 py-2 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring" />
          </Field>
          <ModalFooter
            confirm="Save"
            onConfirm={() => {
              setSaveOpen(false);
              toast.success("Report definition saved");
            }}
            onClose={() => setSaveOpen(false)}
          />
        </Modal>
      ) : null}

      {exportOpen ? (
        <Modal title="Export report" onClose={() => setExportOpen(false)}>
          <div className="grid gap-2">
            {[
              { key: "csv", label: "CSV", icon: FileSpreadsheet },
              { key: "xlsx", label: "Excel (XLSX)", icon: FileSpreadsheet },
              { key: "pdf", label: "PDF", icon: FileText },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => {
                    setExportOpen(false);
                    toast.message(`${f.label} export queued`);
                  }}
                  className="h-9 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12.5px] inline-flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" /> {f.label}
                </button>
              );
            })}
          </div>
        </Modal>
      ) : null}

      {scheduleOpen ? (
        <Modal title="Schedule report" onClose={() => setScheduleOpen(false)}>
          <Field label="Frequency">
            <select className="w-full h-8 px-2 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </Field>
          <Field label="Delivery time">
            <input type="time" className="w-full h-8 px-2 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring" />
          </Field>
          <Field label="Recipients">
            <input placeholder="Comma-separated email addresses" className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring" />
          </Field>
          <Field label="Format">
            <select className="w-full h-8 px-2 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring">
              <option>PDF</option>
              <option>CSV</option>
              <option>XLSX</option>
            </select>
          </Field>
          <ModalFooter
            confirm="Create schedule"
            onConfirm={() => {
              setScheduleOpen(false);
              toast.success("Schedule created");
            }}
            onClose={() => setScheduleOpen(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
}

/* --------------------------------- Drop zone -------------------------------- */

function DropZone({
  title,
  hint,
  icon,
  ids,
  kind,
  active,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
  onReorder,
  onClear,
}: {
  title: string;
  hint: string;
  icon: React.ReactNode;
  ids: string[];
  kind: FieldKind;
  active: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onClear: () => void;
}) {
  const [from, setFrom] = useState<number | null>(null);
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        "rounded-md border bg-surface transition-colors",
        active ? "border-primary bg-muted/40" : "border-border",
      ].join(" ")}
    >
      <div className="h-10 px-3 border-b border-border bg-surface-muted flex items-center gap-2">
        {icon}
        <span className="text-[12.5px] font-semibold">{title}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">{ids.length}</span>
        <div className="flex-1" />
        {ids.length > 0 ? (
          <button onClick={onClear} className="text-[11.5px] text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        ) : null}
      </div>
      <div className="p-2 min-h-[104px] grid gap-1.5 content-start">
        {ids.length === 0 ? (
          <div className="h-[88px] grid place-items-center rounded-md border border-dashed border-border text-[12px] text-muted-foreground text-center px-3">
            {hint}
          </div>
        ) : (
          ids.map((id, i) => (
            <div
              key={id}
              draggable
              onDragStart={() => setFrom(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                if (from !== null) {
                  e.stopPropagation();
                  onReorder(from, i);
                  setFrom(null);
                }
              }}
              className="h-8 px-2 rounded-md border border-border bg-background flex items-center gap-2 text-[12px] cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="flex-1 truncate">{byId(id)?.label}</span>
              <span className="text-[10.5px] text-muted-foreground">{kind === "metric" ? "SUM" : "GROUP"}</span>
              <button
                onClick={() => onRemove(id)}
                aria-label={`Remove ${byId(id)?.label}`}
                className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-destructive hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ----------------------------------- Modal ---------------------------------- */

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-border bg-surface shadow-lg overflow-hidden"
      >
        <div className="h-11 px-4 border-b border-border flex items-center justify-between">
          <span className="text-[13px] font-semibold">{title}</span>
          <button onClick={onClose} aria-label="Close" className="h-7 w-7 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 grid gap-3">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[11.5px] font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ModalFooter({ confirm, onConfirm, onClose }: { confirm: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      <button onClick={onClose} className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px]">
        Cancel
      </button>
      <button onClick={onConfirm} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px]">
        {confirm}
      </button>
    </div>
  );
}
