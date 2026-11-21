import { useRecords, countWhere, sumBy, num, money } from "@/lib/use-records";
import { createFileRoute } from "@tanstack/react-router";
import { ModuleBanner } from "@/components/influencer/module-banner";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import { useInfluencerStats, useInfluencers } from "@/lib/use-influencers";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Influencer Manager" },
      {
        name: "description",
        content:
          "Global overview of every Influencer, Creator and Partner across all countries and platforms.",
      },
      { property: "og:title", content: "Influencer Operations Dashboard" },
      {
        property: "og:description",
        content: "Creators, campaigns, commissions and payouts in one control surface.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { rows } = useInfluencers();
  const base = useInfluencerStats(rows);
  const campaigns = useRecords("campaigns");
  const apps = useRecords("applications");
  const payouts = useRecords("payouts");
  const content = useRecords("content_items");
  const stats = {
    ...base,
    "Active Campaigns": num(countWhere(campaigns.rows, "status", "active")),
    "Leads Generated": num(apps.rows.length),
    "Sales Generated": num(sumBy(content.rows, "clicks")),
    "Pending Payouts": money(
      payouts.rows.filter((r) => r["status"] !== "paid").reduce((a, r) => a + Number(r["amount"] ?? 0), 0),
    ),
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8">
        <ModuleBanner />
      </div>
      <WallPage wall={WALL_BY_SLUG.dashboard} kpiValues={stats} />
    </>
  );
}


