import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/licenses")({
  head: () => ({ meta: [
    { title: "Licenses — Creator Dashboard" },
    { name: "description", content: "License types, issuance, expiration, renewals, transfers, validation and analytics." },
  ]}),
  component: () => <StubPage title="Licenses" subtitle="Manage license types, issuance, renewals, transfers, validation and analytics." icon={KeyRound}
    sections={["License Types","Issued","Expired","Renewed","Transfer","Validation","Analytics"]} />,
});
