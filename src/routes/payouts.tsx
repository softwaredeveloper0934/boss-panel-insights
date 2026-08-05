import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
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
  const wall = WALL_BY_SLUG["payouts"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main>
          <EarningsBreakdown />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
