import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/brand-safety")({
  head: () => ({ meta: [
    { title: "Brand Safety Score — Creator Dashboard" },
    { name: "description", content: "Trust, compliance, policy and reputation score." },
    { property: "og:title", content: "Brand Safety Score" },
    { property: "og:description", content: "Trust, compliance, policy and reputation score." },
  ]}),
  component: () => <StubPage title="Brand Safety Score" subtitle="Trust, compliance, policy and reputation score." icon={ShieldCheck}
    sections={["Trust", "Compliance", "Policy", "Reputation", ]} />,
});
