import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — Influencer Dashboard" },
    { name: "description", content: "Profile, social, payment, language, security and privacy." },
    { property: "og:title", content: "Settings" },
    { property: "og:description", content: "Profile, social, payment, language, security and privacy." },
  ]}),
  component: () => <StubPage title="Settings" subtitle="Profile, social accounts, payment, language, currency, security and privacy." icon={SettingsIcon}
    sections={["Profile", "Social Accounts", "Payment Accounts", "Language", "Currency", "Security", "Notifications", "Privacy"]} />,
});
