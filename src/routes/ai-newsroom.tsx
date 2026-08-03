import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-newsroom")({
  head: () => ({ meta: [
    { title: "AI Newsroom — Creator Dashboard" },
    { name: "description", content: "Industry, brand, campaign and product news." },
    { property: "og:title", content: "AI Newsroom" },
    { property: "og:description", content: "Industry, brand, campaign and product news." },
  ]}),
  component: () => <StubPage title="AI Newsroom" subtitle="Industry, brand, campaign and product news." icon={Newspaper}
    sections={["Industry", "Brand", "Campaign", "Product", ]} />,
});
