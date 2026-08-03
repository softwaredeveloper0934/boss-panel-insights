import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/trophy-room")({
  head: () => ({ meta: [
    { title: "Trophy Room — Creator Dashboard" },
    { name: "description", content: "Showcase collected, rare, legendary and founder trophies." },
    { property: "og:title", content: "Trophy Room" },
    { property: "og:description", content: "Showcase collected, rare, legendary and founder trophies." },
  ]}),
  component: () => <StubPage title="Trophy Room" subtitle="Showcase collected, rare, legendary and founder trophies." icon={Trophy}
    sections={["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Legend", "Founder", ]} />,
});
