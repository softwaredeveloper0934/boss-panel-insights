import { createFileRoute } from "@tanstack/react-router";
import { IdCard } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/verification")({
  head: () => ({ meta: [
    { title: "Verification — Influencer Dashboard" },
    { name: "description", content: "Blue, gold and elite verification for creators." },
    { property: "og:title", content: "Verification" },
    { property: "og:description", content: "Blue, gold and elite verification for creators." },
  ]}),
  component: () => <StubPage title="Verification Center" subtitle="Get verified — Blue, Gold and Elite tiers for trusted creators." icon={IdCard}
    sections={["Blue Tick", "Gold Tick", "Elite", "Identity", "Profile"]} />,
});
