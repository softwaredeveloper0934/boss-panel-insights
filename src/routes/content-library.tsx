import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { ContentCalendar } from "@/components/influencer/content-calendar";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/content-library")({
  head: () => ({
    meta: [
      { title: "Content Library — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["content-library"].description },
    ],
  }),
  component: ContentLibraryPage,
});

function ContentLibraryPage() {
  const wall = WALL_BY_SLUG["content-library"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main>
          <ContentCalendar />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
