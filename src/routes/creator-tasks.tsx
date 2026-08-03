import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-tasks")({
  head: () => ({ meta: [
    { title: "Creator Tasks — Creator Dashboard" },
    { name: "description", content: "Track deliverables, deadlines, reminders and escalations." },
    { property: "og:title", content: "Creator Tasks" },
    { property: "og:description", content: "Track deliverables, deadlines, reminders and escalations." },
  ]}),
  component: () => <StubPage title="Tasks & Deadlines" subtitle="Track deliverables, deadlines, reminders and escalations." icon={ClipboardCheck}
    sections={["Today", "This Week", "Overdue", "Done"]} />,
});
