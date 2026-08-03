import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [
    { title: "Inbox — Influencer Dashboard" },
    { name: "description", content: "Messages from brands, campaigns, support and internal teams." },
    { property: "og:title", content: "Inbox" },
    { property: "og:description", content: "Messages from brands, campaigns, support and internal teams." },
  ]}),
  component: () => <StubPage title="Inbox Center" subtitle="One inbox for brand, campaign, support and internal messages." icon={Inbox}
    sections={["All", "Brands", "Campaigns", "Support", "Internal"]} />,
});
