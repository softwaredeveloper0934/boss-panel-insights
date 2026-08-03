import { createFileRoute } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-brand-negotiator")({
  head: () => ({ meta: [
    { title: "AI Brand Negotiator — Creator Dashboard" },
    { name: "description", content: "Campaign, deal and brand matching with rate suggestions." },
    { property: "og:title", content: "AI Brand Negotiator" },
    { property: "og:description", content: "Campaign, deal and brand matching with rate suggestions." },
  ]}),
  component: () => <StubPage title="AI Brand Negotiator" subtitle="Campaign, deal and brand matching with rate suggestions." icon={Handshake}
    sections={["Campaigns", "Deals", "Matching", "Rates", ]} />,
});
