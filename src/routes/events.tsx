import { createFileRoute } from "@tanstack/react-router";
import { CalendarHeart } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [
    { title: "Event Center — Creator Dashboard" },
    { name: "description", content: "Live events, webinars, meetups, training and award ceremonies." },
    { property: "og:title", content: "Event Center" },
    { property: "og:description", content: "Live events, webinars, meetups, training and award ceremonies." },
  ]}),
  component: () => <StubPage title="Event Center" subtitle="Live events, webinars, meetups, training and award ceremonies." icon={CalendarHeart}
    sections={["Live", "Webinars", "Meetups", "Training", "Awards", ]} />,
});
