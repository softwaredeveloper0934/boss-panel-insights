import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({ meta: [
    { title: "Knowledge Base — Influencer Dashboard" },
    { name: "description", content: "Documentation, tutorials, FAQs and video guides." },
  ]}),
  component: () => <StubPage title="Knowledge Base" subtitle="Documentation, tutorials, FAQs and video guides for the entire ecosystem." icon={BookOpen}
    sections={["Documentation", "Tutorials", "FAQs", "Video Guides"]} />,
});
