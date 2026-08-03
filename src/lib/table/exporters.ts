/**
 * CSV + XLSX exporters for premium DataTable views.
 * Uses locale-aware formatting from the caller (formatters are pre-applied).
 */
import * as XLSX from "xlsx";

export interface ExportColumn<T> {
  key: string;
  header: string;
  /** Row-to-cell value (already locale-formatted for display). */
  value: (row: T) => string | number | null | undefined;
}

function toRows<T>(cols: ExportColumn<T>[], data: T[]) {
  return data.map((row) => {
    const out: Record<string, string | number | null | undefined> = {};
    for (const c of cols) out[c.header] = c.value(row);
    return out;
  });
}

/** Trigger a browser download. */
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportCsv<T>(
  cols: ExportColumn<T>[],
  data: T[],
  filename = "export.csv",
) {
  const headers = cols.map((c) => csvEscape(c.header)).join(",");
  const body = data
    .map((row) => cols.map((c) => csvEscape(c.value(row))).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + headers + "\r\n" + body], {
    type: "text/csv;charset=utf-8;",
  });
  download(blob, filename);
}

export function exportXlsx<T>(
  cols: ExportColumn<T>[],
  data: T[],
  filename = "export.xlsx",
  sheetName = "Sheet1",
) {
  const ws = XLSX.utils.json_to_sheet(toRows(cols, data), {
    header: cols.map((c) => c.header),
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  download(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
}

export function timestampedFilename(base: string, ext: "csv" | "xlsx") {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${base}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.${ext}`;
}
