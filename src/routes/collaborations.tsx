import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { collaborationsConfig } from "@/lib/module-records";

import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/collaborations")({
  head: () => ({
    meta: [
      { title: "Collaborations — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["collaborations"].description },
    ],
  }),
  component: CollaborationsPage,
});

function CollaborationsPage() {
  return (
    <RecordsPage wall={WALL_BY_SLUG["collaborations"]} config={collaborationsConfig}>
      
    </RecordsPage>
  );
}
