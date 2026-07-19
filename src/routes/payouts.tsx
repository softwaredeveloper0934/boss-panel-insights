import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/payouts")({
  head: () => ({
    meta: [
      { title: "Payouts — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["payouts"].description },
    ],
  }),
  component: PayoutsPage,
});

function PayoutsPage() {
  return <WallPage wall={WALL_BY_SLUG["payouts"]} />;
}
