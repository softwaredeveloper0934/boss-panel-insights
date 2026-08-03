import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/loyalty")({
  head: () => ({ meta: [
    { title: "Loyalty Program — Creator Dashboard" },
    { name: "description", content: "Creator points, reward points, redeem and exclusive benefits." },
    { property: "og:title", content: "Loyalty Program" },
    { property: "og:description", content: "Creator points, reward points, redeem and exclusive benefits." },
  ]}),
  component: () => <StubPage title="Loyalty Program" subtitle="Creator points, reward points, redeem and exclusive benefits." icon={Gift}
    sections={["Points", "Rewards", "Redeem", "Benefits", ]} />,
});
