import { createFileRoute } from "@tanstack/react-router";
import { Dna } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-dna")({
  head: () => ({ meta: [
    { title: "Creator DNA — Creator Dashboard" },
    { name: "description", content: "Content, growth, audience and marketing style score." },
    { property: "og:title", content: "Creator DNA" },
    { property: "og:description", content: "Content, growth, audience and marketing style score." },
  ]}),
  component: () => <StubPage title="Creator DNA" subtitle="Content, growth, audience and marketing style score." icon={Dna}
    sections={["Content", "Growth", "Audience", "Marketing", ]} />,
});
