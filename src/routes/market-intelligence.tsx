import { createFileRoute } from "@tanstack/react-router";
import { LineChart } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/market-intelligence")({
  head: () => ({ meta: [
    { title: "Market Intelligence — Creator Dashboard" },
    { name: "description", content: "Competitor, category, trend and brand tracking." },
    { property: "og:title", content: "Market Intelligence" },
    { property: "og:description", content: "Competitor, category, trend and brand tracking." },
  ]}),
  component: () => <StubPage title="Market Intelligence" subtitle="Competitor, category, trend and brand tracking." icon={LineChart}
    sections={["Competitors", "Categories", "Trends", "Brands", ]} />,
});
