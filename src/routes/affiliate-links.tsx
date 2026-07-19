import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/affiliate-links")({
  head: () => ({
    meta: [
      { title: "Affiliate Links — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["affiliate-links"].description },
    ],
  }),
  component: AffiliateLinksPage,
});

function AffiliateLinksPage() {
  return <WallPage wall={WALL_BY_SLUG["affiliate-links"]} />;
}
