import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-content-factory")({
  head: () => ({ meta: [
    { title: "AI Content Factory — Creator Dashboard" },
    { name: "description", content: "One input — 100 outputs across reel, short, post, blog, email and channels." },
    { property: "og:title", content: "AI Content Factory" },
    { property: "og:description", content: "One input — 100 outputs across reel, short, post, blog, email and channels." },
  ]}),
  component: () => <StubPage title="AI Content Factory" subtitle="One input — 100 outputs across reel, short, post, blog, email and channels." icon={Sparkles}
    sections={["Input", "Reel", "Short", "Post", "Blog", "Email", "WhatsApp", "LinkedIn", "Telegram", ]} />,
});
