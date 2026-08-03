import { createFileRoute } from "@tanstack/react-router";
import { Gauge } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-performance")({
  head: () => ({ meta: [
    { title: "Creator Performance — Creator Dashboard" },
    { name: "description", content: "Scorecards, targets, growth and quality ratings per creator." },
    { property: "og:title", content: "Creator Performance" },
    { property: "og:description", content: "Scorecards, targets, growth and quality ratings per creator." },
  ]}),
  component: () => <StubPage title="Performance Review" subtitle="Scorecards, targets, growth and quality ratings per creator." icon={Gauge}
    sections={["Scorecards", "Targets", "Growth", "Quality", "Reviews"]} />,
});
