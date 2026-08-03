import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-erp")({
  head: () => ({ meta: [
    { title: "Creator ERP — Creator Dashboard" },
    { name: "description", content: "Tasks, projects, CRM, finance, invoices, expenses and team." },
    { property: "og:title", content: "Creator ERP" },
    { property: "og:description", content: "Tasks, projects, CRM, finance, invoices, expenses and team." },
  ]}),
  component: () => <StubPage title="Creator ERP" subtitle="Tasks, projects, CRM, finance, invoices, expenses and team." icon={Briefcase}
    sections={["Tasks", "Projects", "CRM", "Finance", "Invoices", "Expenses", "Team", ]} />,
});
