import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/media-assets")({
  head: () => ({
    meta: [
      { title: "Media Assets — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["media-assets"].description },
    ],
  }),
  component: MediaAssetsPage,
});

function MediaAssetsPage() {
  return <WallPage wall={WALL_BY_SLUG["media-assets"]} />;
}
