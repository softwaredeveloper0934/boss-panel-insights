/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables & string;
export type Row<T extends TableName> = Tables[T]["Row"];

export type AnyRow = Record<string, any> & { id: string };

/** Untyped view of the generated client so one hook can serve every table. */
const db = supabase as unknown as { from: (table: string) => any };

/**
 * Generic CRUD hook over a Lovable Cloud table. Real data only — no mocks.
 */
export function useRecords(table: TableName, orderBy = "created_at") {
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await db.from(table).select("*").order(orderBy, { ascending: false });
    if (error) {
      toast.error(`Failed to load ${table.replace(/_/g, " ")}: ${error.message}`);
      return;
    }
    setRows((data ?? []) as AnyRow[]);
  }, [table, orderBy]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const create = useCallback(
    async (input: Record<string, unknown>) => {
      const { data, error } = await db.from(table).insert(input).select("*").single();
      if (error) {
        toast.error(`Create failed: ${error.message}`);
        return null;
      }
      const row = data as AnyRow;
      setRows((prev) => [row, ...prev]);
      toast.success("Record saved");
      return row;
    },
    [table],
  );

  const update = useCallback(
    async (id: string, patch: Record<string, unknown>) => {
      const { data, error } = await db.from(table).update(patch).eq("id", id).select("*").single();
      if (error) {
        toast.error(`Update failed: ${error.message}`);
        return null;
      }
      const row = data as AnyRow;
      setRows((prev) => prev.map((r) => (r.id === id ? row : r)));
      toast.success("Record updated");
      return row;
    },
    [table],
  );

  const remove = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return false;
      const { error } = await db.from(table).delete().in("id", ids);
      if (error) {
        toast.error(`Delete failed: ${error.message}`);
        return false;
      }
      setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
      toast.success(`${ids.length} record${ids.length === 1 ? "" : "s"} deleted`);
      return true;
    },
    [table],
  );

  const setField = useCallback(
    async (ids: string[], field: string, value: unknown) => {
      if (ids.length === 0) return false;
      const { data, error } = await db
        .from(table)
        .update({ [field]: value })
        .in("id", ids)
        .select("*");
      if (error) {
        toast.error(`Update failed: ${error.message}`);
        return false;
      }
      const byId = new Map(((data ?? []) as AnyRow[]).map((r) => [r.id, r]));
      setRows((prev) => prev.map((r) => byId.get(r.id) ?? r));
      toast.success(`${ids.length} record${ids.length === 1 ? "" : "s"} updated`);
      return true;
    },
    [table],
  );

  return { rows, loading, refresh, create, update, remove, setField };
}

/* ---------- small helpers shared by record surfaces ---------- */

export const asNumber = (v: unknown) => (typeof v === "number" ? v : Number(v ?? 0) || 0);

export const sumBy = (rows: AnyRow[], field: string) =>
  rows.reduce((a, r) => a + asNumber(r[field]), 0);

export const countWhere = (rows: AnyRow[], field: string, value: unknown) =>
  rows.filter((r) => r[field] === value).length;

export const distinct = (rows: AnyRow[], field: string) =>
  new Set(rows.map((r) => r[field]).filter((v) => v !== null && v !== undefined && v !== "")).size;

export const money = (v: number) => `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export const num = (v: number) => v.toLocaleString("en-US");
