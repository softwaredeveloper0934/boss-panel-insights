/**
 * Real client-side export pipeline: CSV, XLSX (minimal OOXML written with an
 * inline store-only zip writer) and PDF (jsPDF + autotable).
 * No server round-trip and no simulated downloads.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportColumn = { key: string; header: string };
export type ExportRow = Record<string, unknown>;

function cell(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function toCsv(columns: ExportColumn[], rows: ExportRow[]): string {
  const escape = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const head = columns.map((c) => escape(c.header)).join(",");
  const body = rows.map((r) => columns.map((c) => escape(cell(r[c.key]))).join(",")).join("\n");
  return rows.length ? `${head}\n${body}\n` : `${head}\n`;
}

/* --------------------------------- zip core -------------------------------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

type ZipEntry = { name: string; data: Uint8Array };

/** Store-only (uncompressed) zip archive — valid for OOXML consumers. */
function zip(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  const u16 = (n: number) => [n & 0xff, (n >>> 8) & 0xff];
  const u32 = (n: number) => [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const local = Uint8Array.from([
      ...u32(0x04034b50),
      ...u16(20),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(crc),
      ...u32(entry.data.length),
      ...u32(entry.data.length),
      ...u16(nameBytes.length),
      ...u16(0),
      ...nameBytes,
    ]);
    chunks.push(local, entry.data);
    central.push(
      Uint8Array.from([
        ...u32(0x02014b50),
        ...u16(20),
        ...u16(20),
        ...u16(0),
        ...u16(0),
        ...u16(0),
        ...u16(0),
        ...u32(crc),
        ...u32(entry.data.length),
        ...u32(entry.data.length),
        ...u16(nameBytes.length),
        ...u16(0),
        ...u16(0),
        ...u16(0),
        ...u16(0),
        ...u32(0),
        ...u32(offset),
        ...nameBytes,
      ]),
    );
    offset += local.length + entry.data.length;
  }

  const centralSize = central.reduce((n, c) => n + c.length, 0);
  const end = Uint8Array.from([
    ...u32(0x06054b50),
    ...u16(0),
    ...u16(0),
    ...u16(entries.length),
    ...u16(entries.length),
    ...u32(centralSize),
    ...u32(offset),
    ...u16(0),
  ]);

  return new Blob([...chunks, ...central, end] as unknown as BlobPart[], {
    type: "application/zip",
  });
}

function xmlEscape(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colName(index: number) {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

export function toXlsxBlob(
  columns: ExportColumn[],
  rows: ExportRow[],
  sheetName = "Export",
): Blob {
  const encoder = new TextEncoder();
  const rowXml = (values: string[], rowIndex: number) =>
    `<row r="${rowIndex}">${values
      .map(
        (v, i) =>
          `<c r="${colName(i)}${rowIndex}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(v)}</t></is></c>`,
      )
      .join("")}</row>`;

  const sheetRows = [
    rowXml(
      columns.map((c) => c.header),
      1,
    ),
    ...rows.map((r, i) =>
      rowXml(
        columns.map((c) => cell(r[c.key])),
        i + 2,
      ),
    ),
  ].join("");

  const files: ZipEntry[] = [
    {
      name: "[Content_Types].xml",
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
      ),
    },
    {
      name: "_rels/.rels",
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      ),
    },
    {
      name: "xl/workbook.xml",
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(sheetName).slice(0, 31)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      ),
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
      ),
    },
    {
      name: "xl/worksheets/sheet1.xml",
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`,
      ),
    },
  ];

  const archive = zip(files);
  return new Blob([archive], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export type ExportFileFormat = "csv" | "xlsx" | "pdf";

/** Generate and download a real file for the given rows. Returns the file name. */
export function exportRecords({
  format,
  baseName,
  title,
  columns,
  rows,
}: {
  format: ExportFileFormat;
  baseName: string;
  title?: string;
  columns: ExportColumn[];
  rows: ExportRow[];
}): string {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const safeBase = baseName.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
  const filename = `${safeBase}-${stamp}.${format}`;

  if (format === "csv") {
    downloadBlob(new Blob([toCsv(columns, rows)], { type: "text/csv;charset=utf-8" }), filename);
    return filename;
  }
  if (format === "xlsx") {
    downloadBlob(toXlsxBlob(columns, rows, title ?? baseName), filename);
    return filename;
  }

  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(13);
  doc.text(title ?? baseName, 14, 16);
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString()} · ${rows.length} record(s)`, 14, 22);
  autoTable(doc, {
    startY: 27,
    head: [columns.map((c) => c.header)],
    body: rows.length
      ? rows.map((r) => columns.map((c) => cell(r[c.key])))
      : [[...columns.map(() => "—")]],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [32, 32, 36] },
  });
  doc.save(filename);
  return filename;
}

/** Read a JSON/CSV file the user picked; resolves with its text content. */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`${file.name} could not be read`));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsText(file);
  });
}
