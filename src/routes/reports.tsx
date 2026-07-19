import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["reports"].description },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return <WallPage wall={WALL_BY_SLUG["reports"]} />;
}
