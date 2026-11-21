import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { walletConfig } from "@/lib/module-records";
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
  return (
    <RecordsPage wall={WALL_BY_SLUG["wallet"]} config={walletConfig}>
      <WalletLedger />
    </RecordsPage>
  );
}
