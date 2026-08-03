import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-social-manager")({
  head: () => ({ meta: [
    { title: "AI Social Manager — Creator Dashboard" },
    { name: "description", content: "Auto-create posts, reels, stories and schedule across channels." },
    { property: "og:title", content: "AI Social Manager" },
    { property: "og:description", content: "Auto-create posts, reels, stories and schedule across channels." },
  ]}),
  component: () => <StubPage title="AI Social Manager" subtitle="Auto-create posts, reels, stories and schedule across channels." icon={Sparkles}
    sections={["Posts", "Reels", "Stories", "Shorts", "Schedule", ]} />,
});
