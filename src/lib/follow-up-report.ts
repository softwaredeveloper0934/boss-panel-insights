import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { FollowUp } from "./use-follow-ups";

const dayMs = 86_400_000;

function nowFloor() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function generateFollowUpReport(followUps: FollowUp[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const generatedAt = new Date().toLocaleString();

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Lead Follow-up Performance Report", 40, 32);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Boss Panel · Influencer Manager · Generated ${generatedAt}`, 40, 52);

  // KPIs
  const total = followUps.length;
  const sent = followUps.filter((f) => f.status === "sent").length;
  const failed = followUps.filter((f) => f.status === "failed").length;
  const scheduled = followUps.filter((f) => f.status === "scheduled").length;
  const overdue = followUps.filter((f) => f.status === "scheduled" && f.dueAt < Date.now()).length;
  const rate = total ? Math.round((sent / total) * 100) : 0;
  const upcoming7 = followUps.filter(
    (f) => f.dueAt >= Date.now() && f.dueAt < Date.now() + 7 * dayMs,
  ).length;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Conversion Analytics", 40, 100);

  autoTable(doc, {
    startY: 110,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
    head: [["Metric", "Value"]],
    body: [
      ["Total reminders", String(total)],
      ["Sent", String(sent)],
      ["Failed", String(failed)],
      ["Scheduled (pending)", String(scheduled)],
      ["Overdue", String(overdue)],
      ["Delivery rate", `${rate}%`],
      ["Upcoming (next 7 days)", String(upcoming7)],
    ],
  });

  // 14-day breakdown
  const start = nowFloor() - 13 * dayMs;
  const days: Record<string, { scheduled: number; sent: number; failed: number }> = {};
  const labels: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(start + i * dayMs);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    labels.push(label);
    days[label] = { scheduled: 0, sent: 0, failed: 0 };
  }
  for (const f of followUps) {
    const idx = Math.floor((f.dueAt - start) / dayMs);
    if (idx < 0 || idx > 13) continue;
    days[labels[idx]][f.status] += 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastY = (doc as any).lastAutoTable.finalY + 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Follow-up Volume · Last 14 Days", 40, lastY);

  autoTable(doc, {
    startY: lastY + 10,
    theme: "striped",
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
    head: [["Date", "Scheduled", "Sent", "Failed", "Total"]],
    body: labels.map((l) => {
      const d = days[l];
      return [l, String(d.scheduled), String(d.sent), String(d.failed), String(d.scheduled + d.sent + d.failed)];
    }),
  });

  // Detail table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detailY = (doc as any).lastAutoTable.finalY + 24;
  if (detailY > 720) doc.addPage();
  const yStart = detailY > 720 ? 40 : detailY;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Follow-up Detail", 40, yStart);

  autoTable(doc, {
    startY: yStart + 10,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
    head: [["Lead", "Channel", "Due", "Status", "Attempts", "Last error"]],
    body: followUps.length
      ? [...followUps]
          .sort((a, b) => a.dueAt - b.dueAt)
          .map((f) => [
            f.leadName,
            f.channel,
            new Date(f.dueAt).toLocaleString(),
            f.status,
            String(f.attempts),
            f.lastError ?? "—",
          ])
      : [["—", "—", "—", "—", "—", "No follow-ups on record"]],
  });

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Page ${i} of ${pageCount} · Software Vala Boss Panel`,
      pageW - 40,
      doc.internal.pageSize.getHeight() - 20,
      { align: "right" },
    );
  }

  const filename = `follow-up-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
