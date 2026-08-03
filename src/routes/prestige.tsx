import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/prestige")({
  head: () => ({ meta: [
    { title: "Prestige System — Creator Dashboard" },
    { name: "description", content: "Permanent recognition for creators who break Level 100." },
    { property: "og:title", content: "Prestige System" },
    { property: "og:description", content: "Permanent recognition for creators who break Level 100." },
  ]}),
  component: () => <StubPage title="Prestige System" subtitle="Permanent recognition for creators who break Level 100." icon={Award}
    sections={["Prestige 1", "Prestige 2", "Prestige 3", "Recognition", ]} />,
});
