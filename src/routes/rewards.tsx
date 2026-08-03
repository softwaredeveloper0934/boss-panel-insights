import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["rewards"].description },
    ],
  }),
  component: () => <WallPage wall={WALL_BY_SLUG["rewards"]} />,
});
