import { useMemo, useState } from "react";
import { Inbox, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { RecordFormDialog, type FieldDef } from "@/components/influencer/record-form-dialog";
import { useRecords, type AnyRow, type TableName } from "@/lib/use-records";

export type ColumnDef = {
  key: string;
  label: string;
  kind?: "text" | "number" | "money" | "date" | "badge" | "list";
  align?: "left" | "right";
};

type Props = {
  table: TableName;
  title: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  addLabel?: string;
  emptyTitle: string;
  emptyDescription: string;
  searchKeys?: string[];
  /** rendered inside the toolbar, right of the Add button */
  extraActions?: React.ReactNode;
  api?: ReturnType<typeof useRecords>;
};

const fmt = (value: unknown, kind: ColumnDef["kind"]) => {
  if (value === null || value === undefined || value === "") return "—";
  switch (kind) {
    case "number":
      return Number(value).toLocaleString("en-US");
    case "money":
      return `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    case "date":
      return new Date(String(value)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    case "list":
      return Array.isArray(value) ? (value.length ? value.join(", ") : "—") : String(value);
    default:
      return String(value);
  }
};

export function RecordsSurface({
  table,
  title,
  fields,
  columns,
  addLabel = "Add record",
  emptyTitle,
  emptyDescription,
  searchKeys,
  extraActions,
  api,
}: Props) {
  const records = api ?? useRecords(table);
  const { rows, loading, refresh, create, update, remove } = records;
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AnyRow | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const keys = searchKeys ?? columns.map((c) => c.key);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      keys.some((k) => {
        const v = r[k];
        if (Array.isArray(v)) return v.join(" ").toLowerCase().includes(q);
        return String(v ?? "").toLowerCase().includes(q);
      }),
    );
  }, [rows, query, keys]);

  const allChecked = filtered.length > 0 && filtered.every((r) => selected.includes(r.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
        <div className="flex h-8 min-w-[220px] flex-1 items-center gap-1.5 rounded-md border border-border bg-background px-2.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          title="Refresh"
          className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => void remove(selected).then(() => setSelected([]))}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12.5px] font-medium text-destructive hover:bg-muted"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete {selected.length}
          </button>
        )}
        {extraActions}
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-surface">
        <div className="flex h-10 items-center justify-between border-b border-border bg-surface-muted px-4">
          <div className="text-[12.5px] font-semibold text-foreground">{title}</div>
          <div className="text-[11.5px] text-muted-foreground">
            {loading ? "Loading…" : `${filtered.length} record${filtered.length === 1 ? "" : "s"}`}
          </div>
        </div>

        <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
                <th className="w-8 py-2 pl-4">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allChecked}
                    onChange={(e) =>
                      setSelected(e.target.checked ? filtered.map((r) => r.id) : [])
                    }
                    className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)]"
                  />
                </th>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-3 py-2 text-[11.5px] font-medium uppercase tracking-wide ${
                      c.align === "right" ? "text-right" : ""
                    }`}
                  >
                    {c.label}
                  </th>
                ))}
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 pl-4" />
                    {columns.map((c) => (
                      <td key={c.key} className="px-3 py-3">
                        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                    <td />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-0">
                    <div className="sticky left-0 grid w-[calc(100vw-2.5rem)] max-w-full place-items-center px-6 py-14 text-center lg:w-full">
                      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <div className="text-[14px] font-semibold text-foreground">{emptyTitle}</div>
                      <p className="mt-1 max-w-md text-[12.5px] text-muted-foreground">
                        {emptyDescription}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(null);
                          setDialogOpen(true);
                        }}
                        className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[12.5px] font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="h-3.5 w-3.5" /> {addLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="py-2 pl-4">
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selected.includes(r.id)}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id),
                          )
                        }
                        className="h-3.5 w-3.5 rounded border-border accent-[color:var(--color-primary)]"
                      />
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`whitespace-nowrap px-3 py-2 ${
                          c.align === "right" ? "text-right tabular-nums" : ""
                        } ${c.kind === "badge" ? "" : "text-foreground"}`}
                      >
                        {c.kind === "badge" ? (
                          <span className="rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                            {String(r[c.key] ?? "—").replace(/_/g, " ")}
                          </span>
                        ) : (
                          fmt(r[c.key], c.kind)
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => {
                            setEditing(r);
                            setDialogOpen(true);
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => void remove([r.id])}
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecordFormDialog
        open={dialogOpen}
        title={editing ? `Edit ${title}` : addLabel}
        fields={fields}
        record={editing}
        onClose={() => setDialogOpen(false)}
        onSubmit={(values) => (editing ? update(editing.id, values) : create(values))}
      />
    </div>
  );
}
