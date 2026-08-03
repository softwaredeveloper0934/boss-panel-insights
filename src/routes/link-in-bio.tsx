import { createFileRoute } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/link-in-bio")({
  head: () => ({ meta: [
    { title: "Link in Bio — Influencer Dashboard" },
    { name: "description", content: "Build a premium link-in-bio page for every social profile." },
  ]}),
  component: () => <StubPage title="Link in Bio Builder" subtitle="Curate a premium link-in-bio page for every social platform — once." icon={LinkIcon}
    sections={["Pages", "Themes", "Blocks", "Analytics", "Custom Domain"]} />,
});
