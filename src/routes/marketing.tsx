import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/marketing")({
  head: () => ({ meta: [
    { title: "Marketing — Creator Dashboard" },
    { name: "description", content: "Campaigns, affiliate links, referral links, QR, email, social and AI marketing." },
  ]}),
  component: () => <StubPage title="Marketing" subtitle="Campaigns, affiliate, referral, QR, email, social and AI marketing — all in one place." icon={Megaphone}
    sections={["Campaigns","Affiliate Links","Referral Links","QR Generator","Email Campaigns","Social Campaigns","AI Marketing"]} />,
});
