import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Public Profile — Influencer Dashboard" },
    { name: "description", content: "Your public creator showcase: achievements, awards, top campaigns." },
    { property: "og:title", content: "Public Profile" },
    { property: "og:description", content: "Your public creator showcase: achievements, awards, top campaigns." },
  ]}),
  component: () => <StubPage title="Public Profile" subtitle="Your shareable creator page — achievements, awards, top campaigns and products." icon={User}
    sections={["About", "Followers", "Achievements", "Awards", "Certificates", "Top Campaigns", "Top Products", "Hall of Fame"]} />,
});
