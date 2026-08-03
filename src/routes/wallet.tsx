import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { WalletLedger } from "@/components/influencer/wallet-ledger";
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
  const wall = WALL_BY_SLUG["wallet"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>
      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main>
          <WalletLedger />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
