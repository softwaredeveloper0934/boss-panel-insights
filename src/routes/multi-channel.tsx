import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/multi-channel")({
  head: () => ({ meta: [
    { title: "Multi-Channel Command Center — Creator Dashboard" },
    { name: "description", content: "Single-view analytics across every connected social channel." },
    { property: "og:title", content: "Multi-Channel Command Center" },
    { property: "og:description", content: "Single-view analytics across every connected social channel." },
  ]}),
  component: () => <StubPage title="Multi-Channel Command Center" subtitle="Single-view analytics across every connected social channel." icon={LayoutDashboard}
    sections={["All", "Instagram", "Facebook", "YouTube", "TikTok", "LinkedIn", "X", "Telegram", "WhatsApp", ]} />,
});
