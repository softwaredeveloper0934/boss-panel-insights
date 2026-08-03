import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/withdrawals")({
  head: () => ({ meta: [
    { title: "Withdrawals — Influencer Dashboard" },
    { name: "description", content: "Wallet, payout requests, bank, UPI and tax." },
    { property: "og:title", content: "Withdrawals" },
    { property: "og:description", content: "Wallet, payout requests, bank, UPI and tax." },
  ]}),
  component: () => <StubPage title="Withdrawal Center" subtitle="Wallet, payout requests, bank account, UPI, payment history and tax information." icon={Wallet}
    sections={["Wallet", "Payout Requests", "Bank Account", "UPI", "Payment History", "Tax"]} />,
});
