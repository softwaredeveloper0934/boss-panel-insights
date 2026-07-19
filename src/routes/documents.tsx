import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["documents"].description },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return <WallPage wall={WALL_BY_SLUG["documents"]} />;
}
