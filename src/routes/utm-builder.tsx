import { createFileRoute } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/utm-builder")({
  head: () => ({ meta: [
    { title: "UTM Builder — Influencer Dashboard" },
    { name: "description", content: "Build and manage UTM-tagged tracking links." },
  ]}),
  component: () => <StubPage title="UTM Builder" subtitle="Generate, save and audit UTM-tagged tracking links across every campaign." icon={Link2}
    sections={["Builder", "Saved Links", "Presets", "Audit"]} />,
});
