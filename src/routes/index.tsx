import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Influencer Manager" },
      {
        name: "description",
        content:
          "Global overview of every Influencer, Creator and Partner across all countries and platforms.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <WallPage wall={WALL_BY_SLUG.dashboard} />;
}
