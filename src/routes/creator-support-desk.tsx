import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-support-desk")({
  head: () => ({ meta: [
    { title: "Creator Support Desk — Creator Dashboard" },
    { name: "description", content: "Tickets, escalations and SLA tracking for managed creators." },
    { property: "og:title", content: "Creator Support Desk" },
    { property: "og:description", content: "Tickets, escalations and SLA tracking for managed creators." },
  ]}),
  component: () => <StubPage title="Creator Support Desk" subtitle="Tickets, escalations and SLA tracking for managed creators." icon={HeartHandshake}
    sections={["Open Tickets", "Escalations", "SLA", "Resolved"]} />,
});
