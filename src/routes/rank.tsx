import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/rank")({
  head: () => ({ meta: [
    { title: "Rank & XP — Creator Dashboard" },
    { name: "description", content: "Rank tier, XP score and progression factors." },
    { property: "og:title", content: "Rank & XP" },
    { property: "og:description", content: "Rank tier, XP score and progression factors." },
  ]}),
  component: () => <StubPage title="Rank & XP" subtitle="Rank tier, XP score and progression factors." icon={Trophy}
    sections={["Rank", "XP", "Tier", "Factors", "History", ]} />,
});
