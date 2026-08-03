import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-app-store")({
  head: () => ({ meta: [
    { title: "Creator App Store — Creator Dashboard" },
    { name: "description", content: "Sell templates, captions, courses, resources and services." },
    { property: "og:title", content: "Creator App Store" },
    { property: "og:description", content: "Sell templates, captions, courses, resources and services." },
  ]}),
  component: () => <StubPage title="Creator App Store" subtitle="Sell templates, captions, courses, resources and services." icon={Store}
    sections={["Templates", "Captions", "Courses", "Resources", "Services", ]} />,
});
