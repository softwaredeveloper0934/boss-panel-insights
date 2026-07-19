import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
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
  return <WallPage wall={WALL_BY_SLUG["content-library"]} />;
}
