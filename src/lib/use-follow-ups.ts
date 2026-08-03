import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type FollowUp = {
  id: string;
  leadName: string;
  channel: "Email" | "SMS" | "Call";
  dueAt: number;
  status: "scheduled" | "sent" | "failed";
  attempts: number;
  lastError?: string;
  createdAt: number;
};

type Row = {
  id: string;
  lead_name: string;
  channel: "Email" | "SMS" | "Call";
  due_at: string;
  status: "scheduled" | "sent" | "failed";
  attempts: number;
  last_error: string | null;
  created_at: string;
};

const toFollowUp = (r: Row): FollowUp => ({
  id: r.id,
  leadName: r.lead_name,
  channel: r.channel,
  dueAt: new Date(r.due_at).getTime(),
  status: r.status,
  attempts: r.attempts,
  lastError: r.last_error ?? undefined,
  createdAt: new Date(r.created_at).getTime(),
});

export function useFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("follow_ups")
      .select("*")
      .order("due_at", { ascending: true });
    if (error) {
      toast.error(`Failed to load follow-ups: ${error.message}`);
      return;
    }
    setFollowUps((data as Row[]).map(toFollowUp));
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const scheduleMany = useCallback(
    async (inputs: { leadName: string; channel: FollowUp["channel"]; dueAt: number }[]) => {
      const payload = inputs.map((i) => ({
        lead_name: i.leadName,
        channel: i.channel,
        due_at: new Date(i.dueAt).toISOString(),
        status: "scheduled" as const,
      }));
      const { data, error } = await supabase.from("follow_ups").insert(payload).select("*");
      if (error) {
        toast.error(`Schedule failed: ${error.message}`);
        return;
      }
      setFollowUps((prev) => [...prev, ...(data as Row[]).map(toFollowUp)]);
      toast.success(`${payload.length} follow-up${payload.length === 1 ? "" : "s"} scheduled`);
    },
    [],
  );

  const updateOne = useCallback(async (id: string, patch: Partial<Row>) => {
    const { data, error } = await supabase
      .from("follow_ups")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      toast.error(`Update failed: ${error.message}`);
      return;
    }
    const fu = toFollowUp(data as Row);
    setFollowUps((prev) => prev.map((f) => (f.id === id ? fu : f)));
    return fu;
  }, []);

  const send = useCallback(
    async (id: string, simulateFailures: boolean) => {
      const willFail = simulateFailures && Math.random() < 0.4;
      const current = followUps.find((f) => f.id === id);
      const attempts = (current?.attempts ?? 0) + 1;
      const patch = willFail
        ? { status: "failed" as const, attempts, last_error: "SMTP relay refused (503)" }
        : { status: "sent" as const, attempts, last_error: null };
      const res = await updateOne(id, patch);
      if (res) willFail ? toast.error("Send failed · retry available") : toast.success("Follow-up sent");
    },
    [followUps, updateOne],
  );

  const reschedule = useCallback(
    async (id: string, days: number) => {
      const d = new Date();
      d.setHours(9, 0, 0, 0);
      const dueAt = d.getTime() + days * 86_400_000;
      const res = await updateOne(id, {
        due_at: new Date(dueAt).toISOString(),
        status: "scheduled",
        last_error: null,
      });
      if (res) toast.success(`Rescheduled in ${days} day${days === 1 ? "" : "s"}`);
    },
    [updateOne],
  );

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from("follow_ups").delete().eq("id", id);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
      return;
    }
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    const ids = followUps.map((f) => f.id);
    if (ids.length === 0) return;
    const { error } = await supabase.from("follow_ups").delete().in("id", ids);
    if (error) {
      toast.error(`Clear failed: ${error.message}`);
      return;
    }
    setFollowUps([]);
    toast.success("All follow-ups cleared");
  }, [followUps]);

  return { followUps, loading, refresh, scheduleMany, send, reschedule, remove, clearAll };
}
