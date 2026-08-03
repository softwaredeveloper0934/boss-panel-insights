import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/marketplace-promotions")({
  head: () => ({
    meta: [
      { title: "Marketplace Promotions — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["marketplace-promotions"].description },
    ],
  }),
  component: MarketplacePromotionsPage,
});

function MarketplacePromotionsPage() {
  return <WallPage wall={WALL_BY_SLUG["marketplace-promotions"]} />;
}
