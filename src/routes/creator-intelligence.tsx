import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-intelligence")({
  head: () => ({ meta: [
    { title: "Creator Intelligence — Creator Dashboard" },
    { name: "description", content: "Best posting time, campaign type, audience segment and category." },
    { property: "og:title", content: "Creator Intelligence" },
    { property: "og:description", content: "Best posting time, campaign type, audience segment and category." },
  ]}),
  component: () => <StubPage title="Creator Intelligence" subtitle="Best posting time, campaign type, audience segment and category." icon={Brain}
    sections={["Time", "Campaign", "Audience", "Category", ]} />,
});
