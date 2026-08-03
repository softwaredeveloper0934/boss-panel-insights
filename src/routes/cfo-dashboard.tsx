import { createFileRoute } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/cfo-dashboard")({
  head: () => ({ meta: [
    { title: "Personal CFO Dashboard — Creator Dashboard" },
    { name: "description", content: "Revenue, expenses, profit, taxes and projections." },
    { property: "og:title", content: "Personal CFO Dashboard" },
    { property: "og:description", content: "Revenue, expenses, profit, taxes and projections." },
  ]}),
  component: () => <StubPage title="Personal CFO Dashboard" subtitle="Revenue, expenses, profit, taxes and projections." icon={Banknote}
    sections={["Revenue", "Expenses", "Profit", "Taxes", "Forecast", ]} />,
});
