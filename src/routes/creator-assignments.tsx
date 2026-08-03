import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-assignments")({
  head: () => ({ meta: [
    { title: "Creator Assignments — Creator Dashboard" },
    { name: "description", content: "Assign campaigns, products and briefs to creators with SLAs." },
    { property: "og:title", content: "Creator Assignments" },
    { property: "og:description", content: "Assign campaigns, products and briefs to creators with SLAs." },
  ]}),
  component: () => <StubPage title="Assignments" subtitle="Assign campaigns, products and briefs to creators with SLAs." icon={ListChecks}
    sections={["Open", "In Progress", "Submitted", "Completed"]} />,
});
