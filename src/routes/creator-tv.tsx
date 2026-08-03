import { createFileRoute } from "@tanstack/react-router";
import { Tv } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-tv")({
  head: () => ({ meta: [
    { title: "Creator TV — Creator Dashboard" },
    { name: "description", content: "Live streams, events, webinars, award shows and broadcasts." },
    { property: "og:title", content: "Creator TV" },
    { property: "og:description", content: "Live streams, events, webinars, award shows and broadcasts." },
  ]}),
  component: () => <StubPage title="Creator TV" subtitle="Live streams, events, webinars, award shows and broadcasts." icon={Tv}
    sections={["Live", "Events", "Webinars", "Awards", "Broadcasts", ]} />,
});
