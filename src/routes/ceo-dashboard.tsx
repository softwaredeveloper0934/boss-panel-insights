import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ceo-dashboard")({
  head: () => ({ meta: [
    { title: "Personal CEO Dashboard — Creator Dashboard" },
    { name: "description", content: "Top-level command view for the creator-as-CEO." },
    { property: "og:title", content: "Personal CEO Dashboard" },
    { property: "og:description", content: "Top-level command view for the creator-as-CEO." },
  ]}),
  component: () => <StubPage title="Personal CEO Dashboard" subtitle="Top-level command view for the creator-as-CEO." icon={Briefcase}
    sections={["Overview", "Revenue", "Growth", "Brand", "Team", ]} />,
});
