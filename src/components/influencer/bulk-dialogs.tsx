import { useCallback, useState } from "react";
import { AlertTriangle, Check, Download, FileSpreadsheet, FileText, X } from "lucide-react";
import { toast } from "sonner";

/* --------------------------------- Shell ---------------------------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-border bg-surface shadow-lg overflow-hidden"
      >
        <div className="h-11 px-4 border-b border-border flex items-center justify-between">
          <span className="text-[13px] font-semibold">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-7 w-7 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 grid gap-3">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------ Confirm dialog ----------------------------- */

export type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "primary" | "danger";
  /** Optional reviewer note field (reason for rejection, etc.). */
  withNote?: boolean;
  noteLabel?: string;
  /** Called with the note (empty string when unused). Return a toast message. */
  onConfirm: (note: string) => void;
};

/* --------------------------- Export format picker -------------------------- */

export const EXPORT_FORMATS = [
  { key: "csv", label: "CSV", hint: "Comma-separated, best for spreadsheets", icon: FileSpreadsheet },
  { key: "xlsx", label: "Excel (XLSX)", hint: "Formatted workbook with column types", icon: FileSpreadsheet },
  { key: "pdf", label: "PDF", hint: "Print-ready snapshot of the current view", icon: FileText },
] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number]["key"];

export type ExportRequest = {
  count: number;
  entity: string;
  onExport: (format: ExportFormat, scope: "selected" | "all") => void;
};

/* ---------------------------------- Hook ---------------------------------- */

/**
 * Centralised confirmation + export-format dialogs for bulk toolbars.
 * Render `dialogs` once per page and call `requestConfirm` / `requestExport`
 * from bulk actions. Toast feedback is emitted on resolution.
 */
export function useBulkDialogs() {
  const [confirmReq, setConfirmReq] = useState<ConfirmRequest | null>(null);
  const [exportReq, setExportReq] = useState<ExportRequest | null>(null);
  const [note, setNote] = useState("");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [scope, setScope] = useState<"selected" | "all">("selected");

  const requestConfirm = useCallback((req: ConfirmRequest) => {
    setNote("");
    setConfirmReq(req);
  }, []);

  const requestExport = useCallback((req: ExportRequest) => {
    setFormat("csv");
    setScope("selected");
    setExportReq(req);
  }, []);

  const dialogs = (
    <>
      {confirmReq ? (
        <Modal title={confirmReq.title} onClose={() => setConfirmReq(null)}>
          <div className="flex items-start gap-3">
            <span
              className={[
                "h-8 w-8 shrink-0 grid place-items-center rounded-full",
                confirmReq.tone === "danger"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary",
              ].join(" ")}
            >
              {confirmReq.tone === "danger" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </span>
            <p className="text-[12.5px] text-muted-foreground">{confirmReq.description}</p>
          </div>
          {confirmReq.withNote ? (
            <label className="grid gap-1">
              <span className="text-[11.5px] font-medium text-muted-foreground">
                {confirmReq.noteLabel ?? "Note (optional)"}
              </span>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Visible in the activity timeline"
                className="w-full px-2.5 py-2 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-ring"
              />
            </label>
          ) : null}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setConfirmReq(null)}
              className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                confirmReq.onConfirm(note.trim());
                setConfirmReq(null);
              }}
              className={[
                "h-8 px-3 rounded-md text-[12px] cursor-pointer",
                confirmReq.tone === "danger"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              ].join(" ")}
            >
              {confirmReq.confirmLabel}
            </button>
          </div>
        </Modal>
      ) : null}

      {exportReq ? (
        <Modal title="Export" onClose={() => setExportReq(null)}>
          <div className="grid gap-1.5">
            <span className="text-[11.5px] font-medium text-muted-foreground">File format</span>
            {EXPORT_FORMATS.map((f) => {
              const Icon = f.icon;
              const active = format === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFormat(f.key)}
                  className={[
                    "w-full px-3 py-2 rounded-md border text-left flex items-start gap-2.5 cursor-pointer transition-colors",
                    active
                      ? "border-primary bg-muted"
                      : "border-border bg-background hover:bg-muted/60",
                  ].join(" ")}
                >
                  <Icon
                    className={`h-4 w-4 mt-0.5 ${active ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-medium">{f.label}</span>
                    <span className="block text-[11.5px] text-muted-foreground">{f.hint}</span>
                  </span>
                  <span className="ml-auto h-4 w-4 grid place-items-center">
                    {active ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-1.5">
            <span className="text-[11.5px] font-medium text-muted-foreground">Rows</span>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
              {(
                [
                  { key: "selected", label: `Selected (${exportReq.count})` },
                  { key: "all", label: `All ${exportReq.entity}` },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setScope(s.key)}
                  className={[
                    "flex-1 h-7 rounded text-[12px] cursor-pointer",
                    scope === s.key
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setExportReq(null)}
              className="h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-[12px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const req = exportReq;
                setExportReq(null);
                req.onExport(format, scope);
                const label = EXPORT_FORMATS.find((f) => f.key === format)?.label ?? format;
                toast.success(
                  `${label} export queued`,
                  {
                    description:
                      scope === "selected"
                        ? `${req.count} selected ${req.entity} will be prepared for download.`
                        : `All ${req.entity} matching the current filters will be prepared.`,
                  },
                );
              }}
              className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12px] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );

  return { requestConfirm, requestExport, dialogs };
}
