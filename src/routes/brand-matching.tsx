import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/brand-matching")({
  head: () => ({ meta: [
    { title: "Brand Matching AI — Creator Dashboard" },
    { name: "description", content: "Find best products, campaigns, categories and audience fit." },
    { property: "og:title", content: "Brand Matching AI" },
    { property: "og:description", content: "Find best products, campaigns, categories and audience fit." },
  ]}),
  component: () => <StubPage title="Brand Matching AI" subtitle="Find best products, campaigns, categories and audience fit." icon={Sparkles}
    sections={["Products", "Campaigns", "Categories", "Audience", ]} />,
});
