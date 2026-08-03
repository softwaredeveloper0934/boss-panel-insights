import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/digital-twin")({
  head: () => ({ meta: [
    { title: "Digital Twin — Creator Dashboard" },
    { name: "description", content: "AI version of you — learns style, replies and posting cadence." },
    { property: "og:title", content: "Digital Twin" },
    { property: "og:description", content: "AI version of you — learns style, replies and posting cadence." },
  ]}),
  component: () => <StubPage title="Digital Twin" subtitle="AI version of you — learns style, replies and posting cadence." icon={Bot}
    sections={["Training", "Style", "Replies", "Cadence", ]} />,
});
