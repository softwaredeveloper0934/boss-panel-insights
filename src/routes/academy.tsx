import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/academy")({
  head: () => ({ meta: [
    { title: "Academy — Influencer Dashboard" },
    { name: "description", content: "Influencer, marketing, sales and content training with certificates." },
    { property: "og:title", content: "Academy" },
    { property: "og:description", content: "Influencer, marketing, sales and content training with certificates." },
  ]}),
  component: () => <StubPage title="Influencer Academy" subtitle="Training, certifications and learning paths from Rookie to Legend." icon={GraduationCap}
    sections={["Beginner", "Intermediate", "Advanced", "Expert", "Master", "Certificates", "Progress"]} />,
});
