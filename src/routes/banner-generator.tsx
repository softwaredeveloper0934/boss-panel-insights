import { createFileRoute } from "@tanstack/react-router";
import { LayoutTemplate } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/banner-generator")({
  head: () => ({ meta: [
    { title: "Banner Generator — Influencer Dashboard" },
    { name: "description", content: "Create on-brand banners for every channel." },
  ]}),
  component: () => <StubPage title="Banner Generator" subtitle="Create on-brand banners for socials, ads, profiles and email — in seconds." icon={LayoutTemplate}
    sections={["Social", "Ads", "Profile Covers", "Email", "Templates"]} />,
});
