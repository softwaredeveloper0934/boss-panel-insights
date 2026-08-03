import { createFileRoute } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-payouts")({
  head: () => ({ meta: [
    { title: "Creator Payouts — Creator Dashboard" },
    { name: "description", content: "Approve creator commissions, invoices and payout batches." },
    { property: "og:title", content: "Creator Payouts" },
    { property: "og:description", content: "Approve creator commissions, invoices and payout batches." },
  ]}),
  component: () => <StubPage title="Creator Payouts" subtitle="Approve creator commissions, invoices and payout batches." icon={Banknote}
    sections={["Pending", "Approved", "Batches", "Invoices", "History"]} />,
});
