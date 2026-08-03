import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/referral-links")({
  head: () => ({
    meta: [
      { title: "Referral Links — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["referral-links"].description },
    ],
  }),
  component: ReferralLinksPage,
});

function ReferralLinksPage() {
  return <WallPage wall={WALL_BY_SLUG["referral-links"]} />;
}
