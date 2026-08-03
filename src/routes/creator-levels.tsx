import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-levels")({
  head: () => ({ meta: [
    { title: "Creator Levels — Creator Dashboard" },
    { name: "description", content: "Level progression from rookie to prestige with permanent recognition." },
    { property: "og:title", content: "Creator Levels" },
    { property: "og:description", content: "Level progression from rookie to prestige with permanent recognition." },
  ]}),
  component: () => <StubPage title="Creator Levels" subtitle="Level progression from rookie to prestige with permanent recognition." icon={TrendingUp}
    sections={["Level 1", "Level 10", "Level 25", "Level 50", "Level 100", "Prestige", ]} />,
});
