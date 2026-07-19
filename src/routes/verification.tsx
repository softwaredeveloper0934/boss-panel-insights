import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["verification"].description },
    ],
  }),
  component: () => <WallPage wall={WALL_BY_SLUG["verification"]} />,
});
