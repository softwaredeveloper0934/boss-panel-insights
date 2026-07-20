import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { NotificationsInbox } from "@/components/influencer/notifications-inbox";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["notifications"].description },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const wall = WALL_BY_SLUG["notifications"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>
      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main>
          <NotificationsInbox />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
