import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({ meta: [
    { title: "AI Chat — Influencer Dashboard" },
    { name: "description", content: "Chat with your AI for captions, scripts, plans and CTAs." },
    { property: "og:title", content: "AI Chat" },
    { property: "og:description", content: "Chat with your AI for captions, scripts, plans and CTAs." },
  ]}),
  component: () => <StubPage title="AI Chat" subtitle="Generate captions, hashtags, reel scripts, video scripts, CTAs and campaign plans." icon={Bot}
    sections={["New Chat", "History", "Saved Prompts", "Generate Caption", "Generate Hashtags", "Reel Script", "Video Script", "CTA", "Campaign Plan", "Sales Script"]}
    emptyDescription="AI Chat connects to your existing AI System. No new authentication is required." />,
});
