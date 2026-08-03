import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/award-ceremony")({
  head: () => ({ meta: [
    { title: "Award Ceremony — Creator Dashboard" },
    { name: "description", content: "Monthly, quarterly, annual and founder awards." },
    { property: "og:title", content: "Award Ceremony" },
    { property: "og:description", content: "Monthly, quarterly, annual and founder awards." },
  ]}),
  component: () => <StubPage title="Award Ceremony" subtitle="Monthly, quarterly, annual and founder awards." icon={Trophy}
    sections={["Monthly", "Quarterly", "Annual", "Founder", ]} />,
});
