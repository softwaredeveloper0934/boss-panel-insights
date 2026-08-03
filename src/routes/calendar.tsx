import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [
    { title: "Content Calendar — Influencer Dashboard" },
    { name: "description", content: "Plan daily, weekly and monthly content across channels." },
    { property: "og:title", content: "Content Calendar" },
    { property: "og:description", content: "Plan daily, weekly and monthly content across channels." },
  ]}),
  component: () => <StubPage title="Content Calendar" subtitle="Plan, schedule and approve content across every channel." icon={Calendar}
    sections={["Daily", "Weekly", "Monthly", "Campaign", "Schedule", "Drafts", "Approved"]} />,
});
