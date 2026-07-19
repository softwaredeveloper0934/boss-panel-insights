import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["notifications"].description },
    ],
  }),
  component: () => <WallPage wall={WALL_BY_SLUG["notifications"]} />,
});
