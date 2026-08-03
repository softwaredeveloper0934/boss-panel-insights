import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/hall-of-fame")({
  head: () => ({ meta: [
    { title: "Hall of Fame — Creator Dashboard" },
    { name: "description", content: "Top influencers, earners, campaigns and growth leaders." },
    { property: "og:title", content: "Hall of Fame" },
    { property: "og:description", content: "Top influencers, earners, campaigns and growth leaders." },
  ]}),
  component: () => <StubPage title="Hall of Fame" subtitle="Top influencers, earners, campaigns and growth leaders." icon={Crown}
    sections={["Top Influencers", "Top Earners", "Top Campaigns", "Top Growth", ]} />,
});
