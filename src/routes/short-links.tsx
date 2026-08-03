import { createFileRoute } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/short-links")({
  head: () => ({ meta: [
    { title: "Short Links — Influencer Dashboard" },
    { name: "description", content: "Create short links and track clicks, countries, devices and conversions." },
    { property: "og:title", content: "Short Links" },
    { property: "og:description", content: "Create short links and track clicks, countries, devices and conversions." },
  ]}),
  component: () => <StubPage title="Short Link Center" subtitle="Branded short links with click, country, device and conversion tracking." icon={Link2}
    sections={["Create", "All Links", "Clicks", "Countries", "Devices", "Conversions"]} />,
});
