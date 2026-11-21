import { useRecords } from "@/lib/use-records";
import { contentPerformanceKpis } from "@/lib/module-records";
import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["performance"].description },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  const content = useRecords("content_items");
  return <WallPage wall={WALL_BY_SLUG["performance"]} kpiValues={contentPerformanceKpis(content.rows)} />;
}
