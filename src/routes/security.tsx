import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/security")({
  head: () => ({ meta: [
    { title: "Security — Influencer Dashboard" },
    { name: "description", content: "2FA, login devices, sessions, activity log and password." },
  ]}),
  component: () => <StubPage title="Security" subtitle="Two-factor authentication, login devices, sessions, activity log and passwords." icon={ShieldCheck}
    sections={["2FA", "Login Devices", "Sessions", "Activity Log", "Password"]} />,
});
