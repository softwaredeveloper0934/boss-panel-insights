import { useRecords, countWhere, money, num } from "@/lib/use-records";
import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { AnalyticsDeepView } from "@/components/influencer/analytics-deep-view";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["analytics"].description },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const wall = WALL_BY_SLUG["analytics"];
  const inf = useRecords("influencers");
  const camps = useRecords("campaigns");
  const apps = useRecords("applications");
  const ledger = useRecords("wallet_transactions");
  const top = (rows: typeof inf.rows, key: string) => {
    const m = new Map<string, number>();
    for (const r of rows) if (r[key]) m.set(String(r[key]), (m.get(String(r[key])) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  };
  const now = new Date();
  const mtd = ledger.rows
    .filter((r) => r["direction"] === "credit" && new Date(String(r["created_at"])).getMonth() === now.getMonth())
    .reduce((a, r) => a + Number(r["amount"] ?? 0), 0);
  const kpiValues = {
    "Revenue (MTD)": money(mtd),
    Campaigns: num(camps.rows.length),
    Leads: num(apps.rows.length),
    Conversion: apps.rows.length ? `${((countWhere(apps.rows, "stage", "approved") / apps.rows.length) * 100).toFixed(1)}%` : "0%",
    "Top Country": top(inf.rows, "country"),
    "Top Platform": top(inf.rows, "platform"),
  };
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} loading={inf.loading} values={kpiValues} />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main>
          <AnalyticsDeepView />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
