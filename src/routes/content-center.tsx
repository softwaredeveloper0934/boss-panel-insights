import { createFileRoute } from "@tanstack/react-router";
import { FileVideo } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/content-center")({
  head: () => ({ meta: [
    { title: "Content Center — Creator Dashboard" },
    { name: "description", content: "Ready-made posts, scripts, captions, hashtags and CTAs across every channel." },
    { property: "og:title", content: "Content Center" },
    { property: "og:description", content: "Ready-made posts, scripts, captions, hashtags and CTAs across every channel." },
  ]}),
  component: () => <StubPage title="Content Center" subtitle="Ready-made posts, scripts, captions, hashtags and CTAs across every channel." icon={FileVideo}
    sections={["Posts", "Reels", "Shorts", "Stories", "Scripts", "Captions", "Hashtags", "CTAs", ]} />,
});
