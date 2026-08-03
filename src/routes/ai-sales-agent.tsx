import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-sales-agent")({
  head: () => ({ meta: [
    { title: "AI Sales Agent — Creator Dashboard" },
    { name: "description", content: "Handle leads, inquiries, suggest products and track conversions." },
    { property: "og:title", content: "AI Sales Agent" },
    { property: "og:description", content: "Handle leads, inquiries, suggest products and track conversions." },
  ]}),
  component: () => <StubPage title="AI Sales Agent" subtitle="Handle leads, inquiries, suggest products and track conversions." icon={Bot}
    sections={["Leads", "Inquiries", "Suggestions", "Conversions", ]} />,
});
