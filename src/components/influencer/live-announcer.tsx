import { useEffect, useState } from "react";
import { useActivityLog } from "@/lib/optimistic";

const STATUS_TEXT: Record<string, string> = {
  pending: "in progress",
  done: "completed",
  undone: "undone",
  failed: "failed",
  "rolled-back": "failed and was rolled back",
};

/**
 * Single global aria-live region. Every optimistic action, bulk update and
 * rollback is announced to screen readers exactly once, so async table and
 * drawer updates are perceivable without visual focus.
 */
export function LiveAnnouncer() {
  const activity = useActivityLog();
  const latest = activity[0];
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!latest) return;
    const status = STATUS_TEXT[latest.status] ?? latest.status;
    setMessage(
      `${latest.label} ${status}. ${latest.count} ${latest.entity}.${
        latest.error ? ` ${latest.error}` : ""
      }`,
    );
  }, [latest?.id, latest?.status, latest?.error, latest?.label, latest?.count, latest?.entity]);

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only pointer-events-none absolute h-px w-px overflow-hidden"
      >
        {message}
      </div>
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only pointer-events-none absolute h-px w-px overflow-hidden"
      >
        {latest && (latest.status === "failed" || latest.status === "rolled-back")
          ? message
          : ""}
      </div>
    </>
  );
}
