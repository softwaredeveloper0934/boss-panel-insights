import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-reports")({
  head: () => ({ meta: [
    { title: "Creator Reports — Creator Dashboard" },
    { name: "description", content: "Roster-wide reporting, exports and executive summaries." },
    { property: "og:title", content: "Creator Reports" },
    { property: "og:description", content: "Roster-wide reporting, exports and executive summaries." },
  ]}),
  component: () => <StubPage title="Manager Reports" subtitle="Roster-wide reporting, exports and executive summaries." icon={BarChart3}
    sections={["Overview", "Revenue", "Engagement", "Exports"]} />,
});
