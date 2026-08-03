import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-onboarding")({
  head: () => ({ meta: [
    { title: "Creator Onboarding — Creator Dashboard" },
    { name: "description", content: "Guided onboarding: KYC, contracts, channels and first campaign." },
    { property: "og:title", content: "Creator Onboarding" },
    { property: "og:description", content: "Guided onboarding: KYC, contracts, channels and first campaign." },
  ]}),
  component: () => <StubPage title="Onboarding" subtitle="Guided onboarding: KYC, contracts, channels and first campaign." icon={UserPlus}
    sections={["Pipeline", "KYC", "Contracts", "Channels", "Training"]} />,
});
