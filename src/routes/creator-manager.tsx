import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-manager")({
  head: () => ({ meta: [
    { title: "Creator Manager — Creator Dashboard" },
    { name: "description", content: "Run your creator roster: assignments, approvals, payouts and performance." },
    { property: "og:title", content: "Creator Manager" },
    { property: "og:description", content: "Run your creator roster: assignments, approvals, payouts and performance." },
  ]}),
  component: () => <StubPage title="Manager Console" subtitle="Run your creator roster: assignments, approvals, payouts and performance." icon={UsersRound}
    sections={["Overview", "Roster", "Assignments", "Approvals", "Payouts", "Reports"]} />,
});
