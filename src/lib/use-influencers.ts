import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Influencer = Database["public"]["Tables"]["influencers"]["Row"];
export type InfluencerInsert = Database["public"]["Tables"]["influencers"]["Insert"];
export type InfluencerUpdate = Database["public"]["Tables"]["influencers"]["Update"];

export const VERIFICATIONS = ["unverified", "pending", "verified", "rejected"] as const;
export const STATUSES = ["pending", "active", "suspended", "rejected"] as const;

export function useInfluencers() {
  const [rows, setRows] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("influencers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(`Failed to load influencers: ${error.message}`);
      return;
    }
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const create = useCallback(async (input: InfluencerInsert) => {
    const { data, error } = await supabase.from("influencers").insert(input).select("*").single();
    if (error) {
      toast.error(`Create failed: ${error.message}`);
      return null;
    }
    setRows((prev) => [data, ...prev]);
    toast.success(`${data.full_name} added`);
    return data;
  }, []);

  const update = useCallback(async (id: string, patch: InfluencerUpdate) => {
    const { data, error } = await supabase
      .from("influencers")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      toast.error(`Update failed: ${error.message}`);
      return null;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? data : r)));
    toast.success(`${data.full_name} updated`);
    return data;
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from("influencers").delete().eq("id", id);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
      return false;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Influencer deleted");
    return true;
  }, []);

  const removeMany = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return false;
    const { error } = await supabase.from("influencers").delete().in("id", ids);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
      return false;
    }
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    toast.success(`${ids.length} influencer${ids.length === 1 ? "" : "s"} deleted`);
    return true;
  }, []);

  const setStatusMany = useCallback(
    async (ids: string[], status: Influencer["status"], notes?: string) => {
      if (ids.length === 0) return false;
      const patch: InfluencerUpdate = notes ? { status, notes } : { status };
      const { data, error } = await supabase
        .from("influencers")
        .update(patch)
        .in("id", ids)
        .select("*");
      if (error) {
        toast.error(`Update failed: ${error.message}`);
        return false;
      }
      const byId = new Map((data ?? []).map((r) => [r.id, r]));
      setRows((prev) => prev.map((r) => byId.get(r.id) ?? r));
      return true;
    },
    [],
  );

  return { rows, loading, refresh, create, update, remove, removeMany, setStatusMany };
}

export type InfluencerStats = Record<string, string>;

const num = (v: number) => v.toLocaleString("en-US");
const money = (v: number) =>
  `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function useInfluencerStats(rows: Influencer[]): InfluencerStats {
  return useMemo(() => {
    const sum = (pick: (r: Influencer) => number) => rows.reduce((a, r) => a + pick(r), 0);
    const countries = new Set(rows.map((r) => r.country).filter(Boolean));
    const platforms = new Set(rows.map((r) => r.platform).filter(Boolean));
    return {
      "Total Influencers": num(rows.length),
      Verified: num(rows.filter((r) => r.verification === "verified").length),
      "Pending Approval": num(rows.filter((r) => r.status === "pending").length),
      Suspended: num(rows.filter((r) => r.status === "suspended").length),
      Countries: num(countries.size),
      "Platforms Connected": num(platforms.size),
      Active: num(rows.filter((r) => r.status === "active").length),
      Revenue: money(sum((r) => Number(r.revenue))),
      Commission: money(sum((r) => Number(r.commission))),
      Followers: num(sum((r) => Number(r.followers))),
      Rejected: num(rows.filter((r) => r.status === "rejected").length),
      "Avg Engagement": rows.length
        ? `${(sum((r) => Number(r.engagement_rate)) / rows.length).toFixed(2)}%`
        : "0%",
    };
  }, [rows]);
}
