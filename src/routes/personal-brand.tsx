import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/personal-brand")({
  head: () => ({ meta: [
    { title: "Personal Brand Center — Creator Dashboard" },
    { name: "description", content: "Brand score, growth, visibility, authority and analytics." },
    { property: "og:title", content: "Personal Brand Center" },
    { property: "og:description", content: "Brand score, growth, visibility, authority and analytics." },
  ]}),
  component: () => <StubPage title="Personal Brand Center" subtitle="Brand score, growth, visibility, authority and analytics." icon={Sparkles}
    sections={["Score", "Growth", "Visibility", "Authority", "Analytics", ]} />,
});
