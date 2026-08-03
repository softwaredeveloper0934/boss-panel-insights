import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/agency-mode")({
  head: () => ({ meta: [
    { title: "Agency Mode — Creator Dashboard" },
    { name: "description", content: "Manage multiple influencers, shared campaigns and revenue." },
    { property: "og:title", content: "Agency Mode" },
    { property: "og:description", content: "Manage multiple influencers, shared campaigns and revenue." },
  ]}),
  component: () => <StubPage title="Agency Mode" subtitle="Manage multiple influencers, shared campaigns and revenue." icon={Building2}
    sections={["Influencers", "Campaigns", "Revenue", "Analytics", ]} />,
});
