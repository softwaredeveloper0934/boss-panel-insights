import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/command-center")({
  head: () => ({ meta: [
    { title: "Personal Command Center — Creator Dashboard" },
    { name: "description", content: "Daily briefing, tasks, revenue, campaigns and AI recommendations." },
    { property: "og:title", content: "Personal Command Center" },
    { property: "og:description", content: "Daily briefing, tasks, revenue, campaigns and AI recommendations." },
  ]}),
  component: () => <StubPage title="Personal Command Center" subtitle="Daily briefing, tasks, revenue, campaigns and AI recommendations." icon={LayoutDashboard}
    sections={["Briefing", "Tasks", "Revenue", "Campaigns", "Opportunities", "AI", ]} />,
});
