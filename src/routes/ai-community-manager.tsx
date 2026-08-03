import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-community-manager")({
  head: () => ({ meta: [
    { title: "AI Community Manager — Creator Dashboard" },
    { name: "description", content: "Auto-reply to comments, DMs, FAQs and moderate community." },
    { property: "og:title", content: "AI Community Manager" },
    { property: "og:description", content: "Auto-reply to comments, DMs, FAQs and moderate community." },
  ]}),
  component: () => <StubPage title="AI Community Manager" subtitle="Auto-reply to comments, DMs, FAQs and moderate community." icon={MessagesSquare}
    sections={["Comments", "DMs", "FAQs", "Moderation", ]} />,
});
