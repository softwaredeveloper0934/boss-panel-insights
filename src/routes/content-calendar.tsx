import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/content-calendar")({
  head: () => ({ meta: [
    { title: "Content Calendar — Creator Dashboard" },
    { name: "description", content: "Plan daily, weekly and monthly content across every channel." },
    { property: "og:title", content: "Content Calendar" },
    { property: "og:description", content: "Plan daily, weekly and monthly content across every channel." },
  ]}),
  component: () => <StubPage title="Content Calendar" subtitle="Plan daily, weekly and monthly content across every channel." icon={CalendarDays}
    sections={["Daily", "Weekly", "Monthly", "Campaign", "Schedule", ]} />,
});
