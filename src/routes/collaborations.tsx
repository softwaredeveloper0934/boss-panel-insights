import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/collaborations")({
  head: () => ({
    meta: [
      { title: "Collaborations — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["collaborations"].description },
    ],
  }),
  component: () => <WallPage wall={WALL_BY_SLUG["collaborations"]} />,
});
