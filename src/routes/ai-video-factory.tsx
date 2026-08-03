import { createFileRoute } from "@tanstack/react-router";
import { FileVideo } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-video-factory")({
  head: () => ({ meta: [
    { title: "AI Video Factory — Creator Dashboard" },
    { name: "description", content: "Text to video, avatar video, voiceover, shorts and promo." },
    { property: "og:title", content: "AI Video Factory" },
    { property: "og:description", content: "Text to video, avatar video, voiceover, shorts and promo." },
  ]}),
  component: () => <StubPage title="AI Video Factory" subtitle="Text to video, avatar video, voiceover, shorts and promo." icon={FileVideo}
    sections={["Text→Video", "Avatar", "Voice", "Short", "Promo", ]} />,
});
