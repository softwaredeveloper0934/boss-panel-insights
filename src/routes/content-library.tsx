import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { contentConfig } from "@/lib/module-records";
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
  return (
    <RecordsPage wall={WALL_BY_SLUG["content-library"]} config={contentConfig}>
      <ContentCalendar />
    </RecordsPage>
  );
}
