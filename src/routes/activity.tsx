import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [
    { title: "Activity — Influencer Dashboard" },
    { name: "description", content: "Recent activity, shares, downloads, campaign actions and AMS events." },
  ]}),
  component: () => <StubPage title="Activity Timeline" subtitle="Recent activities, shares, downloads, campaign actions and AMS events." icon={Activity}
    sections={["All", "Recent Activities", "Recent Shares", "Recent Downloads", "Campaign Actions", "AMS Activities"]} />,
});
