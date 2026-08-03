import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["support"].description },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return <WallPage wall={WALL_BY_SLUG["support"]} />;
}
