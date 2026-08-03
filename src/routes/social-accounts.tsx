import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/social-accounts")({
  head: () => ({ meta: [
    { title: "Social Accounts — Influencer Dashboard" },
    { name: "description", content: "Connect Instagram, YouTube, LinkedIn, TikTok, X, Telegram and WhatsApp." },
    { property: "og:title", content: "Social Accounts" },
    { property: "og:description", content: "Connect Instagram, YouTube, LinkedIn, TikTok, X, Telegram and WhatsApp." },
  ]}),
  component: () => <StubPage title="Social Account Center" subtitle="Connect every channel and monitor health from one screen." icon={BadgeCheck}
    sections={["Instagram", "Facebook", "LinkedIn", "YouTube", "TikTok", "X", "Telegram", "WhatsApp"]} />,
});
