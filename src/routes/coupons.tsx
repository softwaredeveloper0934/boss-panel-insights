import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["coupons"].description },
    ],
  }),
  component: CouponsPage,
});

function CouponsPage() {
  return <WallPage wall={WALL_BY_SLUG["coupons"]} />;
}
