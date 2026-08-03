import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/press-kit")({
  head: () => ({ meta: [
    { title: "Press Kit Center — Creator Dashboard" },
    { name: "description", content: "Bio, achievements, awards, media coverage and downloads." },
    { property: "og:title", content: "Press Kit Center" },
    { property: "og:description", content: "Bio, achievements, awards, media coverage and downloads." },
  ]}),
  component: () => <StubPage title="Press Kit Center" subtitle="Bio, achievements, awards, media coverage and downloads." icon={Newspaper}
    sections={["Bio", "Achievements", "Awards", "Coverage", "Downloads", ]} />,
});
