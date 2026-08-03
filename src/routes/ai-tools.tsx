import { createFileRoute } from "@tanstack/react-router";
import { Wand2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({ meta: [
    { title: "AI Tools — Influencer Dashboard" },
    { name: "description", content: "Caption, reel script, blog, SEO, hashtags, translate and rewrite — all AI-powered." },
  ]}),
  component: () => <StubPage title="AI Toolkit" subtitle="Caption, reel script, blog, SEO, hashtags, translate and rewrite — one premium toolkit." icon={Wand2}
    sections={["Caption", "Reel Script", "Blog Writer", "SEO", "Hashtags", "Translate", "Rewrite"]} />,
});
