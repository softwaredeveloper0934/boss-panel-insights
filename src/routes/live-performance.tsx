import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/live-performance")({
  head: () => ({ meta: [
    { title: "Live Performance Wall — Creator Dashboard" },
    { name: "description", content: "Real-time clicks, leads, sales, revenue and conversions." },
    { property: "og:title", content: "Live Performance Wall" },
    { property: "og:description", content: "Real-time clicks, leads, sales, revenue and conversions." },
  ]}),
  component: () => <StubPage title="Live Performance Wall" subtitle="Real-time clicks, leads, sales, revenue and conversions." icon={Activity}
    sections={["Clicks", "Leads", "Sales", "Revenue", "Conversions", ]} />,
});
