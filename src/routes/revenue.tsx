import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/revenue")({
  head: () => ({ meta: [
    { title: "Revenue — Creator Dashboard" },
    { name: "description", content: "Revenue dashboard with monthly, yearly, product-wise, country-wise, tax, invoices and statements." },
  ]}),
  component: () => <StubPage title="Revenue" subtitle="Revenue dashboard — monthly, yearly, product-wise, country-wise, tax, invoices and statements." icon={TrendingUp}
    sections={["Dashboard","Monthly","Yearly","Product Wise","Country Wise","Tax","Invoices","Statements"]} />,
});
