import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/top-content")({
  head: () => ({ meta: [
    { title: "Top Content Wall — Creator Dashboard" },
    { name: "description", content: "Best performing reels, posts, videos, campaigns and conversions." },
    { property: "og:title", content: "Top Content Wall" },
    { property: "og:description", content: "Best performing reels, posts, videos, campaigns and conversions." },
  ]}),
  component: () => <StubPage title="Top Content Wall" subtitle="Best performing reels, posts, videos, campaigns and conversions." icon={Flame}
    sections={["Best Reel", "Best Post", "Best Video", "Best Campaign", "Best Conversion", ]} />,
});
