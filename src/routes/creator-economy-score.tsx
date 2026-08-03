import { createFileRoute } from "@tanstack/react-router";
import { Gauge } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-economy-score")({
  head: () => ({ meta: [
    { title: "Creator Economy Score — Creator Dashboard" },
    { name: "description", content: "Reach, trust, sales, influence and authority composite score." },
    { property: "og:title", content: "Creator Economy Score" },
    { property: "og:description", content: "Reach, trust, sales, influence and authority composite score." },
  ]}),
  component: () => <StubPage title="Creator Economy Score" subtitle="Reach, trust, sales, influence and authority composite score." icon={Gauge}
    sections={["Reach", "Trust", "Sales", "Influence", "Authority", "Overall", ]} />,
});
