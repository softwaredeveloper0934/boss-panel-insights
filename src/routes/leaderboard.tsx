import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [
    { title: "Leaderboard — Influencer Dashboard" },
    { name: "description", content: "Global, country, monthly and campaign rankings." },
    { property: "og:title", content: "Leaderboard" },
    { property: "og:description", content: "Global, country, monthly and campaign rankings." },
  ]}),
  component: () => <StubPage title="Leaderboard" subtitle="Climb global, country, monthly and campaign-specific rankings." icon={Trophy}
    sections={["Global", "Country", "Monthly", "Quarterly", "Yearly", "Campaign", "Sales", "Revenue"]} />,
});
