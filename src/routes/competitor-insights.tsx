import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/competitor-insights")({
  head: () => ({ meta: [
    { title: "Competitor Insights — Creator Dashboard" },
    { name: "description", content: "Track top influencers, campaigns, content types and categories." },
    { property: "og:title", content: "Competitor Insights" },
    { property: "og:description", content: "Track top influencers, campaigns, content types and categories." },
  ]}),
  component: () => <StubPage title="Competitor Insights" subtitle="Track top influencers, campaigns, content types and categories." icon={Eye}
    sections={["Top Influencers", "Top Campaigns", "Content Types", "Categories", ]} />,
});
