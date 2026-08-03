import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creators")({
  head: () => ({ meta: [
    { title: "Creators — Creator Dashboard" },
    { name: "description", content: "All managed creators with tier, status, owner and live performance." },
    { property: "og:title", content: "Creators" },
    { property: "og:description", content: "All managed creators with tier, status, owner and live performance." },
  ]}),
  component: () => <StubPage title="Creator Roster" subtitle="All managed creators with tier, status, owner and live performance." icon={Users}
    sections={["All Creators", "Active", "Paused", "Top Performers", "Archived"]} />,
});
