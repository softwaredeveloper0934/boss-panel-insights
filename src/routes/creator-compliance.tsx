import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-compliance")({
  head: () => ({ meta: [
    { title: "Creator Compliance — Creator Dashboard" },
    { name: "description", content: "Policy checks, disclosure rules, strikes and brand safety." },
    { property: "og:title", content: "Creator Compliance" },
    { property: "og:description", content: "Policy checks, disclosure rules, strikes and brand safety." },
  ]}),
  component: () => <StubPage title="Compliance" subtitle="Policy checks, disclosure rules, strikes and brand safety." icon={Scale}
    sections={["Policies", "Disclosures", "Strikes", "Audits"]} />,
});
