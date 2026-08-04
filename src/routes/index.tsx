import { createFileRoute } from "@tanstack/react-router";
import { ModuleBanner } from "@/components/influencer/module-banner";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Influencer Manager" },
      {
        name: "description",
        content:
          "Global overview of every Influencer, Creator and Partner across all countries and platforms.",
      },
      { property: "og:title", content: "Influencer Operations Dashboard" },
      {
        property: "og:description",
        content: "Creators, campaigns, commissions and payouts in one control surface.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8">
        <ModuleBanner />
      </div>
      <WallPage wall={WALL_BY_SLUG.dashboard} />
    </>
  );
}

