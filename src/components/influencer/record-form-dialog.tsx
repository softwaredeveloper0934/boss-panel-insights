import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { AnyRow } from "@/lib/use-records";

export type FieldKind = "text" | "email" | "number" | "date" | "datetime" | "select" | "textarea" | "list";

export type FieldDef = {
  name: string;
  label: string;
  kind?: FieldKind;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  /** optional lookup options resolved at runtime: [value,label] pairs */
  lookup?: { value: string; label: string }[];
};

type Props = {
  open: boolean;
  title: string;
  fields: FieldDef[];
  record?: AnyRow | null;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<unknown>;
};

function initialValues(fields: FieldDef[], record?: AnyRow | null) {
  const v: Record<string, string> = {};
  for (const f of fields) {
    const raw = record?.[f.name];
    if (Array.isArray(raw)) v[f.name] = raw.join(", ");
    else if (raw === null || raw === undefined) v[f.name] = "";
    else if (f.kind === "date" && typeof raw === "string") v[f.name] = raw.slice(0, 10);
    else if (f.kind === "datetime" && typeof raw === "string") v[f.name] = raw.slice(0, 16);
    else v[f.name] = String(raw);
  }
  return v;
}

export function RecordFormDialog({ open, title, fields, record, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields, record));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setValues(initialValues(fields, record));
  }, [open, record, fields]);

  if (!open) return null;

  const set = (name: string, value: string) => setValues((p) => ({ ...p, [name]: value }));

  const submit = async () => {
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        setBusy(false);
        return;
      }
    }
    setBusy(true);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = (values[f.name] ?? "").trim();
      if (f.kind === "list") payload[f.name] = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
      else if (f.kind === "number") payload[f.name] = raw ? Number(raw) : 0;
      else payload[f.name] = raw === "" ? null : raw;
    }
    const result = await onSubmit(payload);
    setBusy(false);
    if (result) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[640px] max-h-[88vh] overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-3">
          <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => {
              const id = `field-${f.name}`;
              const common =
                "w-full h-9 px-2.5 rounded-md border border-border bg-background text-[12.5px] outline-none focus:border-primary";
              return (
                <label
                  key={f.name}
                  htmlFor={id}
                  className={f.kind === "textarea" ? "block sm:col-span-2" : "block"}
                >
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {f.label}
                    {f.required ? " *" : ""}
                  </span>
                  {f.kind === "textarea" ? (
                    <textarea
                      id={id}
                      value={values[f.name] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                      className="min-h-[88px] w-full rounded-md border border-border bg-background p-2.5 text-[12.5px] outline-none focus:border-primary"
                    />
                  ) : f.kind === "select" || f.lookup ? (
                    <select
                      id={id}
                      value={values[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={common}
                    >
                      <option value="">—</option>
                      {(f.lookup ?? (f.options ?? []).map((o) => ({ value: o, label: o }))).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={id}
                      type={
                        f.kind === "number"
                          ? "number"
                          : f.kind === "date"
                            ? "date"
                            : f.kind === "datetime"
                              ? "datetime-local"
                              : f.kind === "email"
                                ? "email"
                                : "text"
                      }
                      value={values[f.name] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={common}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md px-3 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="h-8 rounded-md bg-primary px-3 text-[12.5px] font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
