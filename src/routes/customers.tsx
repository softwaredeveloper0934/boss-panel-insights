import { createFileRoute } from "@tanstack/react-router";
import { Users2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [
    { title: "Customers — Creator Dashboard" },
    { name: "description", content: "Customer list, purchase history, downloads, subscriptions, support and analytics." },
  ]}),
  component: () => <StubPage title="Customers" subtitle="Your buyers across products — purchase history, downloads, subscriptions, support and analytics." icon={Users2}
    sections={["All","Purchase History","Downloads","Subscriptions","Support","Messages","Reviews","Analytics"]} />,
});
