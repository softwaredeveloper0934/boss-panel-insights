import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-tiers")({
  head: () => ({ meta: [
    { title: "Creator Tiers — Creator Dashboard" },
    { name: "description", content: "Define tiers, commission slabs and promotion rules." },
    { property: "og:title", content: "Creator Tiers" },
    { property: "og:description", content: "Define tiers, commission slabs and promotion rules." },
  ]}),
  component: () => <StubPage title="Tiers & Levels" subtitle="Define tiers, commission slabs and promotion rules." icon={Layers}
    sections={["Tiers", "Commission Slabs", "Promotion Rules", "Benefits"]} />,
});
