import { createFileRoute } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/payouts")({
  head: () => ({ meta: [
    { title: "Payouts — Creator Dashboard" },
    { name: "description", content: "Withdraw, history, pending, approved, rejected, bank accounts and payment methods." },
  ]}),
  component: () => <StubPage title="Payouts" subtitle="Withdraw earnings — history, pending, approved, rejected, bank accounts and payment methods." icon={Banknote}
    sections={["Withdraw","History","Pending","Approved","Rejected","Bank Accounts","Payment Methods"]} />,
});
