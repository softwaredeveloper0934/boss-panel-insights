import { createFileRoute } from "@tanstack/react-router";
import { RefreshCcw } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({ meta: [
    { title: "Subscriptions — Creator Dashboard" },
    { name: "description", content: "Plans, active, expired, renewals, billing and usage." },
  ]}),
  component: () => <StubPage title="Subscriptions" subtitle="Plans, active subscriptions, renewals, billing and usage." icon={RefreshCcw}
    sections={["Plans","Active","Expired","Renewals","Billing","Usage"]} />,
});
