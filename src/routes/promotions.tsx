import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/promotions")({
  head: () => ({ meta: [
    { title: "Promotions — Creator Dashboard" },
    { name: "description", content: "Featured placement, flash sale, discount events and marketplace promotion." },
  ]}),
  component: () => <StubPage title="Promotions" subtitle="Featured placement, flash sale, discount events and marketplace promotion." icon={Flame}
    sections={["Featured Placement","Flash Sale","Discount Events","Marketplace Promotion"]} />,
});
