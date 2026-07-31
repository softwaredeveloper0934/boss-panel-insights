import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { ReportsBuilder } from "@/components/influencer/reports-builder";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["reports"].description },
      { property: "og:title", content: "Reports — Influencer Manager" },
      { property: "og:description", content: WALL_BY_SLUG["reports"].description },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const wall = WALL_BY_SLUG["reports"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>
      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0">
          <ReportsBuilder />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
