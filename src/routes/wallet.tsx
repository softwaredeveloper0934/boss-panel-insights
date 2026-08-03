import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [
    { title: "Wallet — Creator Dashboard" },
    { name: "description", content: "Balance, credits, pending, transactions and history." },
  ]}),
  component: () => <StubPage title="Wallet" subtitle="Balance, credits, pending earnings, transactions and history." icon={Wallet}
    sections={["Balance","Credits","Pending","Transactions","History"]} />,
});
