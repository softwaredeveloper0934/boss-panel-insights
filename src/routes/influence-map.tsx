import { createFileRoute } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/influence-map")({
  head: () => ({ meta: [
    { title: "Influence Map — Creator Dashboard" },
    { name: "description", content: "Country, global, audience heatmap and top markets." },
    { property: "og:title", content: "Influence Map" },
    { property: "og:description", content: "Country, global, audience heatmap and top markets." },
  ]}),
  component: () => <StubPage title="Influence Map" subtitle="Country, global, audience heatmap and top markets." icon={Map}
    sections={["Country", "Global", "Heatmap", "Cities", "Markets", ]} />,
});
