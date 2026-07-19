import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["reviews"].description },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return <WallPage wall={WALL_BY_SLUG["reviews"]} />;
}
