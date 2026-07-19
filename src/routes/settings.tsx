import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["settings"].description },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <WallPage wall={WALL_BY_SLUG["settings"]} />;
}
