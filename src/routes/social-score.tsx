import { createFileRoute } from "@tanstack/react-router";
import { Gauge } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/social-score")({
  head: () => ({ meta: [
    { title: "Social Score — Creator Dashboard" },
    { name: "description", content: "Instagram, YouTube, LinkedIn, TikTok and overall social score." },
    { property: "og:title", content: "Social Score" },
    { property: "og:description", content: "Instagram, YouTube, LinkedIn, TikTok and overall social score." },
  ]}),
  component: () => <StubPage title="Social Score" subtitle="Instagram, YouTube, LinkedIn, TikTok and overall social score." icon={Gauge}
    sections={["Instagram", "YouTube", "LinkedIn", "TikTok", "Overall", ]} />,
});
