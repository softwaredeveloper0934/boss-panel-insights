import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [
    { title: "Achievements — Influencer Dashboard" },
    { name: "description", content: "Badges, trophies, certificates, XP and streaks." },
    { property: "og:title", content: "Achievements" },
    { property: "og:description", content: "Badges, trophies, certificates, XP and streaks." },
  ]}),
  component: () => <StubPage title="Achievements" subtitle="Badges, certificates, trophies, XP, streaks and the Hall of Fame." icon={Award}
    sections={["Badges", "Certificates", "Trophies", "Rewards", "XP", "Streaks", "Hall of Fame", "Trophy Room"]} />,
});
