import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/enterprise-chat")({
  head: () => ({ meta: [
    { title: "Enterprise Chat — Influencer Dashboard" },
    { name: "description", content: "Integrated enterprise chat across Support, Marketing, Creator Team, Accounts, Boss, AI and AMS." },
  ]}),
  component: () => <StubPage title="Enterprise Chat" subtitle="Unified chat across Support, Marketing, Creator Team, Accounts, Leadership, AI and AMS." icon={MessagesSquare}
    sections={["All", "Support", "Marketing", "Creator Team", "Accounts", "Boss", "AI", "AMS Chat"]} />,
});
