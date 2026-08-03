import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/opportunity-engine")({
  head: () => ({ meta: [
    { title: "Opportunity Engine — Creator Dashboard" },
    { name: "description", content: "Trending niches, products, campaigns and markets." },
    { property: "og:title", content: "Opportunity Engine" },
    { property: "og:description", content: "Trending niches, products, campaigns and markets." },
  ]}),
  component: () => <StubPage title="Opportunity Engine" subtitle="Trending niches, products, campaigns and markets." icon={Flame}
    sections={["Niches", "Products", "Campaigns", "Markets", ]} />,
});
