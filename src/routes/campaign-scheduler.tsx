import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/campaign-scheduler")({
  head: () => ({ meta: [
    { title: "Campaign Scheduler — Influencer Dashboard" },
    { name: "description", content: "Plan, schedule and auto-publish campaigns across every channel." },
  ]}),
  component: () => <StubPage title="Campaign Scheduler" subtitle="Plan, schedule and auto-publish campaigns across every channel." icon={CalendarClock}
    sections={["Calendar", "Queue", "Drafts", "Published", "Auto-Pilot"]} />,
});
