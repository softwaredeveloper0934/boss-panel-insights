import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-avatar")({
  head: () => ({ meta: [
    { title: "AI Avatar Center — Creator Dashboard" },
    { name: "description", content: "AI voice, presenter, video avatar and content generation." },
    { property: "og:title", content: "AI Avatar Center" },
    { property: "og:description", content: "AI voice, presenter, video avatar and content generation." },
  ]}),
  component: () => <StubPage title="AI Avatar Center" subtitle="AI voice, presenter, video avatar and content generation." icon={Bot}
    sections={["Voice", "Presenter", "Video Avatar", "Generation", ]} />,
});
