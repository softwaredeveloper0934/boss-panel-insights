import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/streaks")({
  head: () => ({ meta: [
    { title: "Streaks — Creator Dashboard" },
    { name: "description", content: "Login, content, campaign, sales and lead streaks." },
    { property: "og:title", content: "Streaks" },
    { property: "og:description", content: "Login, content, campaign, sales and lead streaks." },
  ]}),
  component: () => <StubPage title="Streaks" subtitle="Login, content, campaign, sales and lead streaks." icon={Flame}
    sections={["Login", "Content", "Campaign", "Sales", "Leads", ]} />,
});
