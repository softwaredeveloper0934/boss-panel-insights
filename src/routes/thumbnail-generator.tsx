import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/thumbnail-generator")({
  head: () => ({ meta: [
    { title: "Thumbnail Generator — Influencer Dashboard" },
    { name: "description", content: "Generate scroll-stopping thumbnails with AI." },
  ]}),
  component: () => <StubPage title="Thumbnail Generator" subtitle="Generate scroll-stopping thumbnails for YouTube, Reels and Shorts." icon={ImagePlus}
    sections={["YouTube", "Reels", "Shorts", "Templates", "My Thumbnails"]} />,
});
