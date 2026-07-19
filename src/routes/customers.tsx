import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["customers"].description },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  return <WallPage wall={WALL_BY_SLUG["customers"]} />;
}
