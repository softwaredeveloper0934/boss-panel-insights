import { createFileRoute } from "@tanstack/react-router";
import { RefreshCcw } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-subscriptions")({
  head: () => ({ meta: [
    { title: "Creator Subscriptions — Creator Dashboard" },
    { name: "description", content: "Monthly memberships, premium content and VIP access." },
    { property: "og:title", content: "Creator Subscriptions" },
    { property: "og:description", content: "Monthly memberships, premium content and VIP access." },
  ]}),
  component: () => <StubPage title="Creator Subscriptions" subtitle="Monthly memberships, premium content and VIP access." icon={RefreshCcw}
    sections={["Monthly", "Premium", "VIP", "Exclusive", ]} />,
});
