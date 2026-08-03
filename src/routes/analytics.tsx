import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { AnalyticsDeepView } from "@/components/influencer/analytics-deep-view";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["analytics"].description },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const wall = WALL_BY_SLUG["analytics"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>
      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main>
          <AnalyticsDeepView />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
