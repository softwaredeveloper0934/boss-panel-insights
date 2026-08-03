/**
 * Per-user table preferences: column visibility + order, and saved
 * filter/sort presets. Backed by localStorage today; swap the storage
 * adapter to sync to Software Vala when the backend is ready.
 */
import type { DataQuery, SortDir } from "@/components/data/DataTable";

const NS = "sv.table";

export interface ColumnPref {
  order: string[]; // ordered column keys
  hidden: string[]; // hidden column keys
}

export interface SavedPreset {
  id: string;
  name: string;
  createdAt: string;
  query: {
    search: string;
    filters: Record<string, string | undefined>;
    sort: { key: string; dir: SortDir } | null;
    pageSize: number;
  };
  columns?: ColumnPref;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export const tablePrefs = {
  loadColumns(tableId: string): ColumnPref | null {
    return read<ColumnPref | null>(`${NS}.${tableId}.columns`, null);
  },
  saveColumns(tableId: string, pref: ColumnPref) {
    write(`${NS}.${tableId}.columns`, pref);
  },
  loadPresets(tableId: string): SavedPreset[] {
    return read<SavedPreset[]>(`${NS}.${tableId}.presets`, []);
  },
  savePresets(tableId: string, presets: SavedPreset[]) {
    write(`${NS}.${tableId}.presets`, presets);
  },
  presetFromQuery(name: string, q: DataQuery, columns?: ColumnPref): SavedPreset {
    return {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      name,
      createdAt: new Date().toISOString(),
      query: {
        search: q.search,
        filters: q.filters,
        sort: q.sort,
        pageSize: q.pageSize,
      },
      columns,
    };
  },
};
