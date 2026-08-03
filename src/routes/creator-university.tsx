import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-university")({
  head: () => ({ meta: [
    { title: "Creator University — Creator Dashboard" },
    { name: "description", content: "Beginner to legend curriculum, paths and certifications." },
    { property: "og:title", content: "Creator University" },
    { property: "og:description", content: "Beginner to legend curriculum, paths and certifications." },
  ]}),
  component: () => <StubPage title="Creator University" subtitle="Beginner to legend curriculum, paths and certifications." icon={GraduationCap}
    sections={["Beginner", "Intermediate", "Advanced", "Expert", "Master", "Legend", ]} />,
});
