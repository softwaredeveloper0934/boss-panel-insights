import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/growth-dashboard")({
  head: () => ({ meta: [
    { title: "Personal Growth Dashboard — Creator Dashboard" },
    { name: "description", content: "Audience, reach, engagement and conversion growth." },
    { property: "og:title", content: "Personal Growth Dashboard" },
    { property: "og:description", content: "Audience, reach, engagement and conversion growth." },
  ]}),
  component: () => <StubPage title="Personal Growth Dashboard" subtitle="Audience, reach, engagement and conversion growth." icon={TrendingUp}
    sections={["Audience", "Reach", "Engagement", "Conversion", ]} />,
});
