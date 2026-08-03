import { createFileRoute } from "@tanstack/react-router";
import { DollarSign } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/media-value")({
  head: () => ({ meta: [
    { title: "Media Value Score — Creator Dashboard" },
    { name: "description", content: "Estimated reach, promotion and brand value." },
    { property: "og:title", content: "Media Value Score" },
    { property: "og:description", content: "Estimated reach, promotion and brand value." },
  ]}),
  component: () => <StubPage title="Media Value Score" subtitle="Estimated reach, promotion and brand value." icon={DollarSign}
    sections={["Reach Value", "Promotion Value", "Brand Value", ]} />,
});
