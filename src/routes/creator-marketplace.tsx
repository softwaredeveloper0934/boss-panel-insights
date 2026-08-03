import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-marketplace")({
  head: () => ({ meta: [
    { title: "Creator Marketplace — Creator Dashboard" },
    { name: "description", content: "Sell services, promotions, reviews, consultation and packages." },
    { property: "og:title", content: "Creator Marketplace" },
    { property: "og:description", content: "Sell services, promotions, reviews, consultation and packages." },
  ]}),
  component: () => <StubPage title="Creator Marketplace" subtitle="Sell services, promotions, reviews, consultation and packages." icon={ShoppingBag}
    sections={["Services", "Promotions", "Reviews", "Consultation", "Packages", ]} />,
});
