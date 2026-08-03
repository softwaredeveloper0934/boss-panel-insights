import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [
    { title: "Orders — Creator Dashboard" },
    { name: "description", content: "Order list, invoices, payments, refunds and bulk export." },
  ]}),
  component: () => <StubPage title="Orders" subtitle="All orders, invoices, payments, refunds and bulk export." icon={Receipt}
    sections={["All","Pending","Completed","Cancelled","Refunds","Invoices","Payments","Bulk Export"]} />,
});
