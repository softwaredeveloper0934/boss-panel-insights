import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/influencer-store")({
  head: () => ({ meta: [
    { title: "Influencer Store — Creator Dashboard" },
    { name: "description", content: "Sell services, packages, promotions and contact links." },
    { property: "og:title", content: "Influencer Store" },
    { property: "og:description", content: "Sell services, packages, promotions and contact links." },
  ]}),
  component: () => <StubPage title="Influencer Store" subtitle="Sell services, packages, promotions and contact links." icon={Store}
    sections={["Services", "Packages", "Promotions", "Profile", "Contact", ]} />,
});
