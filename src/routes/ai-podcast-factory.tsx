import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-podcast-factory")({
  head: () => ({ meta: [
    { title: "AI Podcast Factory — Creator Dashboard" },
    { name: "description", content: "Script, voice, publishing and distribution." },
    { property: "og:title", content: "AI Podcast Factory" },
    { property: "og:description", content: "Script, voice, publishing and distribution." },
  ]}),
  component: () => <StubPage title="AI Podcast Factory" subtitle="Script, voice, publishing and distribution." icon={Mic}
    sections={["Script", "Voice", "Publishing", "Distribution", ]} />,
});
