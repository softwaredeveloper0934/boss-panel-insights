/**
 * Column layout + density persistence for the enterprise data table.
 * Handles visibility, order, width, pinning, personal layouts and team layouts.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ColumnPin = "left" | "right" | null;
export type TableDensity = "comfortable" | "compact" | "ultra";

export const DENSITY_ROW_HEIGHT: Record<TableDensity, number> = {
  comfortable: 48,
  compact: 38,
  ultra: 30,
};

export const DENSITY_LABEL: Record<TableDensity, string> = {
  comfortable: "Comfortable",
  compact: "Compact",
  ultra: "Ultra compact",
};

export type ColumnDef<T> = {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  /** Cannot be hidden (e.g. the primary identity column). */
  required?: boolean;
  defaultPin?: ColumnPin;
  render?: (row: T) => ReactNode;
};

export type ColumnState = {
  key: string;
  visible: boolean;
  width: number;
  pin: ColumnPin;
};

export type TableLayoutState = {
  order: string[];
  columns: Record<string, ColumnState>;
  density: TableDensity;
};

const PERSONAL_PREFIX = "influencer-manager.table-layout.";
const TEAM_PREFIX = "influencer-manager.table-layout.team.";

export function defaultLayout<T>(defs: ColumnDef<T>[]): TableLayoutState {
  const columns: Record<string, ColumnState> = {};
  for (const d of defs) {
    columns[d.key] = {
      key: d.key,
      visible: true,
      width: d.width ?? 160,
      pin: d.defaultPin ?? null,
    };
  }
  return { order: defs.map((d) => d.key), columns, density: "comfortable" };
}

function read(key: string): TableLayoutState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TableLayoutState;
    if (!parsed || !Array.isArray(parsed.order) || !parsed.columns) return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(key: string, value: TableLayoutState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

/** Merge a stored layout with the current column definitions. */
function reconcile<T>(stored: TableLayoutState | null, defs: ColumnDef<T>[]): TableLayoutState {
  const base = defaultLayout(defs);
  if (!stored) return base;
  const known = new Set(defs.map((d) => d.key));
  const order = [
    ...stored.order.filter((k) => known.has(k)),
    ...base.order.filter((k) => !stored.order.includes(k)),
  ];
  const columns: Record<string, ColumnState> = {};
  for (const key of order) {
    const def = defs.find((d) => d.key === key)!;
    const s = stored.columns[key];
    columns[key] = {
      key,
      visible: def.required ? true : (s?.visible ?? true),
      width: Math.max(def.minWidth ?? 80, s?.width ?? def.width ?? 160),
      pin: s?.pin ?? def.defaultPin ?? null,
    };
  }
  return { order, columns, density: stored.density ?? "comfortable" };
}

export function useTableLayout<T>(tableKey: string, defs: ColumnDef<T>[]) {
  const [layout, setLayout] = useState<TableLayoutState>(() => defaultLayout(defs));
  const [hydrated, setHydrated] = useState(false);

  // Read persisted layout after hydration so SSR markup stays stable.
  useEffect(() => {
    setLayout(reconcile(read(PERSONAL_PREFIX + tableKey), defs));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  const commit = useCallback(
    (next: TableLayoutState) => {
      setLayout(next);
      write(PERSONAL_PREFIX + tableKey, next);
    },
    [tableKey],
  );

  const setVisible = useCallback(
    (key: string, visible: boolean) => {
      commit({
        ...layout,
        columns: { ...layout.columns, [key]: { ...layout.columns[key]!, visible } },
      });
    },
    [commit, layout],
  );

  const setPin = useCallback(
    (key: string, pin: ColumnPin) => {
      commit({
        ...layout,
        columns: { ...layout.columns, [key]: { ...layout.columns[key]!, pin } },
      });
    },
    [commit, layout],
  );

  const setWidth = useCallback(
    (key: string, width: number) => {
      const def = defs.find((d) => d.key === key);
      const min = def?.minWidth ?? 80;
      commit({
        ...layout,
        columns: {
          ...layout.columns,
          [key]: { ...layout.columns[key]!, width: Math.max(min, Math.round(width)) },
        },
      });
    },
    [commit, defs, layout],
  );

  const move = useCallback(
    (key: string, toIndex: number) => {
      const order = layout.order.filter((k) => k !== key);
      const clamped = Math.max(0, Math.min(order.length, toIndex));
      order.splice(clamped, 0, key);
      commit({ ...layout, order });
    },
    [commit, layout],
  );

  const setDensity = useCallback(
    (density: TableDensity) => commit({ ...layout, density }),
    [commit, layout],
  );

  const autoWidth = useCallback(() => {
    const columns: Record<string, ColumnState> = {};
    for (const key of layout.order) {
      const def = defs.find((d) => d.key === key)!;
      const headerWidth = Math.max(def.minWidth ?? 90, def.header.length * 8 + 56);
      columns[key] = { ...layout.columns[key]!, width: headerWidth };
    }
    commit({ ...layout, columns });
  }, [commit, defs, layout]);

  const reset = useCallback(() => commit(defaultLayout(defs)), [commit, defs]);

  const savePersonal = useCallback(() => {
    write(PERSONAL_PREFIX + tableKey, layout);
  }, [layout, tableKey]);

  const saveTeam = useCallback(() => {
    write(TEAM_PREFIX + tableKey, layout);
  }, [layout, tableKey]);

  const applyTeam = useCallback(() => {
    const team = read(TEAM_PREFIX + tableKey);
    if (!team) return false;
    commit(reconcile(team, defs));
    return true;
  }, [commit, defs, tableKey]);

  const hasTeamLayout = useCallback(() => read(TEAM_PREFIX + tableKey) !== null, [tableKey]);

  const visibleColumns = useMemo(() => {
    const pinnedLeft = layout.order.filter((k) => layout.columns[k]?.pin === "left");
    const middle = layout.order.filter((k) => !layout.columns[k]?.pin);
    const pinnedRight = layout.order.filter((k) => layout.columns[k]?.pin === "right");
    return [...pinnedLeft, ...middle, ...pinnedRight]
      .filter((k) => layout.columns[k]?.visible)
      .map((k) => {
        const def = defs.find((d) => d.key === k)!;
        return { def, state: layout.columns[k]! };
      });
  }, [defs, layout]);

  return {
    layout,
    hydrated,
    visibleColumns,
    setVisible,
    setPin,
    setWidth,
    move,
    setDensity,
    autoWidth,
    reset,
    savePersonal,
    saveTeam,
    applyTeam,
    hasTeamLayout,
  };
}

export type TableLayoutApi<T> = ReturnType<typeof useTableLayout<T>>;
