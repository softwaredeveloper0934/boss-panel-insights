import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — Influencer Dashboard" },
    { name: "description", content: "System, campaign, commission, achievement, AMS, chat and announcements." },
  ]}),
  component: () => <StubPage title="Notification Center" subtitle="All updates across system, campaigns, commissions, achievements, AMS, chat and announcements." icon={Bell}
    sections={["All", "System", "Campaign", "Commission", "Achievement", "AMS", "Chat", "Announcements"]} />,
});
