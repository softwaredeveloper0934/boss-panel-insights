import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { rewardsConfig } from "@/lib/module-records";

import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["rewards"].description },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <RecordsPage wall={WALL_BY_SLUG["rewards"]} config={rewardsConfig}>
      
    </RecordsPage>
  );
}
