import { createFileRoute } from "@tanstack/react-router";
import { QrCode } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/qr")({
  head: () => ({ meta: [
    { title: "QR Center — Influencer Dashboard" },
    { name: "description", content: "Campaign, product and referral QR codes with analytics." },
    { property: "og:title", content: "QR Center" },
    { property: "og:description", content: "Campaign, product and referral QR codes with analytics." },
  ]}),
  component: () => <StubPage title="QR Center" subtitle="Generate campaign, product and referral QR codes — download and track them." icon={QrCode}
    sections={["Campaign QR", "Product QR", "Referral QR", "Downloads", "Analytics"]} />,
});
