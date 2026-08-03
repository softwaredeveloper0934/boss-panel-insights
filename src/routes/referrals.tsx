import { createFileRoute } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/referrals")({
  head: () => ({ meta: [
    { title: "Referral Center — Influencer Dashboard" },
    { name: "description", content: "Generate, share and track referral links and QR codes." },
    { property: "og:title", content: "Referral Center" },
    { property: "og:description", content: "Generate, share and track referral links and QR codes." },
  ]}),
  component: () => <StubPage title="Referral Center" subtitle="Create short links, QR codes and tracked campaign URLs." icon={Link2}
    sections={["Referral Links", "QR Codes", "Campaign Links", "Short Links", "Custom Links", "Analytics"]} />,
});
