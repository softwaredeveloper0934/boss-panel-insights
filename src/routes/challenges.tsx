import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/challenges")({
  head: () => ({ meta: [
    { title: "Challenges — Creator Dashboard" },
    { name: "description", content: "Daily, weekly, monthly, event and campaign challenges." },
    { property: "og:title", content: "Challenges" },
    { property: "og:description", content: "Daily, weekly, monthly, event and campaign challenges." },
  ]}),
  component: () => <StubPage title="Challenges" subtitle="Daily, weekly, monthly, event and campaign challenges." icon={Target}
    sections={["Daily", "Weekly", "Monthly", "Event", "Campaign", ]} />,
});
