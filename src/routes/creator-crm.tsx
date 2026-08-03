import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-crm")({
  head: () => ({ meta: [
    { title: "Creator CRM — Creator Dashboard" },
    { name: "description", content: "Brands, contacts, partners, agencies and campaign history." },
    { property: "og:title", content: "Creator CRM" },
    { property: "og:description", content: "Brands, contacts, partners, agencies and campaign history." },
  ]}),
  component: () => <StubPage title="Creator CRM" subtitle="Brands, contacts, partners, agencies and campaign history." icon={Contact}
    sections={["Brands", "Contacts", "Partners", "Agencies", "History", ]} />,
});
