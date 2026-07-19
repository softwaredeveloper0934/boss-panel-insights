import { createFileRoute } from "@tanstack/react-router";
import { WallPage } from "@/components/influencer/wall-page";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["wallet"].description },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  return <WallPage wall={WALL_BY_SLUG["wallet"]} />;
}
