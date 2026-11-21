import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { payoutsConfig } from "@/lib/module-records";
import { EarningsBreakdown } from "@/components/influencer/earnings-breakdown";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/payouts")({
  head: () => ({
    meta: [
      { title: "Earnings & Payouts — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["payouts"].description },
    ],
  }),
  component: PayoutsPage,
});

function PayoutsPage() {
  return (
    <RecordsPage wall={WALL_BY_SLUG["payouts"]} config={payoutsConfig}>
      <EarningsBreakdown />
    </RecordsPage>
  );
}
