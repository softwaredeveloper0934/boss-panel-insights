import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { verificationConfig } from "@/lib/module-records";
import { KycWizard } from "@/components/influencer/kyc-wizard";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["verification"].description },
    ],
  }),
  component: VerificationPage,
});

function VerificationPage() {
  return (
    <RecordsPage wall={WALL_BY_SLUG["verification"]} config={verificationConfig}>
      <KycWizard />
    </RecordsPage>
  );
}
