import { createFileRoute } from "@tanstack/react-router";
import { Building } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/company-mode")({
  head: () => ({ meta: [
    { title: "Creator Company Mode — Creator Dashboard" },
    { name: "description", content: "Personal brand to agency to creator company." },
    { property: "og:title", content: "Creator Company Mode" },
    { property: "og:description", content: "Personal brand to agency to creator company." },
  ]}),
  component: () => <StubPage title="Creator Company Mode" subtitle="Personal brand to agency to creator company." icon={Building}
    sections={["Brand", "Agency", "Company", "Staff", ]} />,
});
