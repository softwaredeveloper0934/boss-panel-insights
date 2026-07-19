import { createFileRoute } from "@tanstack/react-router";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
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
  const wall = WALL_BY_SLUG["verification"];
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>
      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main>
          <KycWizard />
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
