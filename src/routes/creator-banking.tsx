import { createFileRoute } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-banking")({
  head: () => ({ meta: [
    { title: "Creator Banking — Creator Dashboard" },
    { name: "description", content: "Wallet, revenue, expenses, profit, withdrawals and tax reports." },
    { property: "og:title", content: "Creator Banking" },
    { property: "og:description", content: "Wallet, revenue, expenses, profit, withdrawals and tax reports." },
  ]}),
  component: () => <StubPage title="Creator Banking" subtitle="Wallet, revenue, expenses, profit, withdrawals and tax reports." icon={Banknote}
    sections={["Wallet", "Revenue", "Expenses", "Profit", "Withdrawals", "Tax", ]} />,
});
