import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  FileSignature,
  Globe2,
  IdCard,
  Plus,
  ShieldAlert,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Users2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  PageHeader,
  KpiStrip,
  SectionTabs,
  FilterBar,
  RightPanel,
  EmptySurface,
  TableSkeleton,
} from "@/components/influencer/wall-page";
import { ApplicationDetailDrawer } from "@/components/influencer/application-detail-drawer";
import { StickyBulkBar } from "@/components/influencer/sticky-bulk-bar";

const wall = WALL_BY_SLUG["applications"];

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Influencer Manager" },
      { name: "description", content: wall.description },
    ],
  }),
  component: ApplicationsPage,
});

const PIPELINE = [
  { id: "submitted", label: "Submitted", tone: "neutral" },
  { id: "identity", label: "Identity", tone: "info" },
  { id: "kyc", label: "KYC", tone: "info" },
  { id: "social", label: "Social", tone: "info" },
  { id: "audience", label: "Audience", tone: "info" },
  { id: "brand", label: "Brand Review", tone: "info" },
  { id: "interview", label: "Interview", tone: "info" },
  { id: "agreement", label: "Agreement", tone: "info" },
  { id: "approved", label: "Approved", tone: "ok" },
  { id: "rejected", label: "Rejected", tone: "bad" },
] as const;

const SECTIONS = [
  "Queue",
  "Pipeline",
  "Identity Verification",
  "KYC",
  "Social Verification",
  "Audience Verification",
  "Brand Review",
  "Interview Notes",
  "Approval Workflow",
  "Agreement",
  "Audit Timeline",
  "Risk Assessment",
];

function ApplicationsPage() {
  const [active, setActive] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />

      <div className="px-6 pb-2">
        <KpiStrip wall={wall} />
      </div>

      <div className="px-6">
        <SectionTabs
          sections={SECTIONS.map((label) => ({ label }))}
          active={active}
          onChange={setActive}
        />
      </div>

      <div className="px-6 pb-10 pt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <main className="space-y-4">
          <FilterBar extraChips={["Stage", "Country", "Risk", "Reviewer", "Source"]} />

          {active === 0 && <QueueView onOpen={() => setDrawer(true)} />}
          {active === 1 && <PipelineView onOpen={() => setDrawer(true)} />}
          {active === 2 && <VerificationView kind="Identity" />}
          {active === 3 && <VerificationView kind="KYC" />}
          {active === 4 && <VerificationView kind="Social" />}
          {active === 5 && <VerificationView kind="Audience" />}
          {active === 6 && <ChecklistView title="Brand Review" items={BRAND_REVIEW} />}
          {active === 7 && <NotesView />}
          {active === 8 && <WorkflowView />}
          {active === 9 && <AgreementView />}
          {active === 10 && <TimelineView />}
          {active === 11 && <RiskAssessmentView />}
        </main>
        <RightPanel wall={wall} />
      </div>

      <ApplicationDetailDrawer open={drawer} onClose={() => setDrawer(false)} />
    </div>
  );
}

/* ---------- Views ---------- */

function QueueView({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
        <div className="text-[12.5px] font-semibold text-foreground">Application Queue</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpen}
            className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px] text-foreground"
          >
            <Eye className="h-3.5 w-3.5" /> Preview application
          </button>
          <span className="text-[11.5px] text-muted-foreground">0 records · Page 1 of 1</span>
        </div>
      </div>
      <TableSkeleton
        title="Queue"
        columns={wall.tableColumns ?? []}
        emptyTitle="No applications yet"
        emptyDescription="New creator applications will land here for triage, KYC and brand review."
        primaryAction={wall.primaryAction}
      />
    </div>
  );
}

function PipelineView({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
        <div className="text-[12.5px] font-semibold text-foreground">Pipeline</div>
        <span className="text-[11.5px] text-muted-foreground">Drag-and-drop ready · 0 cards</span>
      </div>
      <div className="overflow-x-auto p-3">
        <div className="flex gap-3 min-w-max">
          {PIPELINE.map((col) => (
            <div
              key={col.id}
              className="w-[240px] shrink-0 rounded-md border border-border bg-background"
            >
              <header className="h-9 px-3 flex items-center justify-between border-b border-border">
                <div className="inline-flex items-center gap-2">
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      col.tone === "ok"
                        ? "bg-primary"
                        : col.tone === "bad"
                          ? "bg-destructive"
                          : "bg-muted-foreground/60",
                    ].join(" ")}
                  />
                  <span className="text-[12px] font-semibold text-foreground">{col.label}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">0</span>
              </header>
              <div className="p-3 min-h-[140px] text-center">
                <button
                  onClick={onOpen}
                  className="w-full rounded border border-dashed border-border bg-surface hover:bg-muted text-[12px] text-muted-foreground py-6"
                >
                  No applications
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VerificationView({ kind }: { kind: string }) {
  const blocks = VERIFICATION[kind] ?? [];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {blocks.map((b) => (
        <div key={b.label} className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-surface-muted grid place-items-center text-muted-foreground">
                <b.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground">{b.label}</div>
                <p className="text-[12px] text-muted-foreground mt-0.5">{b.description}</p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface-muted text-muted-foreground">
              Not configured
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="h-7 px-2.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px]">
              Configure
            </button>
            <button className="h-7 px-2.5 rounded-md border border-border bg-surface hover:bg-muted text-[12px]">
              View Policy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChecklistView({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-border bg-surface">
      <header className="h-10 px-4 flex items-center border-b border-border bg-surface-muted">
        <h3 className="text-[12.5px] font-semibold text-foreground">{title}</h3>
      </header>
      <ul className="p-3 divide-y divide-border">
        {items.map((it) => (
          <li key={it} className="py-2 flex items-center justify-between text-[12.5px]">
            <span className="inline-flex items-center gap-2 text-foreground">
              <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
              {it}
            </span>
            <span className="text-muted-foreground">Pending</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotesView() {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <h3 className="text-[12.5px] font-semibold text-foreground">Interview Notes</h3>
      <textarea
        placeholder="Add interview observations, talking points and follow-ups…"
        className="mt-3 w-full min-h-[160px] rounded-md border border-border bg-background p-3 text-[13px] outline-none focus:border-primary"
      />
      <div className="mt-3 flex items-center gap-2 justify-end">
        <button className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">
          Cancel
        </button>
        <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px]">
          Save Note
        </button>
      </div>
    </div>
  );
}

function WorkflowView() {
  const stages = [
    "Submitted",
    "Auto Screening",
    "Identity & KYC",
    "Social & Audience",
    "Brand Review",
    "Interview",
    "Agreement",
    "Onboarded",
  ];
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <h3 className="text-[12.5px] font-semibold text-foreground">Approval Workflow</h3>
      <p className="text-[12px] text-muted-foreground mt-1">
        Configure the stages an application must clear before onboarding. Each stage can have approvers, SLAs and automation.
      </p>
      <ol className="mt-4 relative border-l border-border ml-2">
        {stages.map((s, i) => (
          <li key={s} className="ml-4 pb-4">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-surface border border-border" />
            <div className="text-[12.5px] font-medium text-foreground">
              Stage {i + 1} · {s}
            </div>
            <div className="text-[11.5px] text-muted-foreground">No approvers configured</div>
          </li>
        ))}
      </ol>
      <div className="mt-2">
        <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">
          <Plus className="h-3.5 w-3.5" /> Add stage
        </button>
      </div>
    </div>
  );
}

function AgreementView() {
  return (
    <EmptySurface
      title="No agreements generated"
      description="Generate, send and e-sign the influencer agreement once an application reaches the Agreement stage."
      primaryAction="Generate Agreement"
    />
  );
}

function TimelineView() {
  return (
    <EmptySurface
      title="No audit events"
      description="Every reviewer action, stage transition and system event will be recorded here for compliance."
    />
  );
}

function RiskAssessmentView() {
  const signals = [
    { label: "Fake Follower Score", icon: ShieldAlert },
    { label: "Engagement Anomaly", icon: ShieldAlert },
    { label: "Sanctions / PEP Match", icon: ShieldAlert },
    { label: "Brand Safety", icon: ShieldCheck },
    { label: "Content Policy History", icon: ShieldCheck },
    { label: "Geographic Risk", icon: ShieldAlert },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {signals.map((s) => (
        <div key={s.label} className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <div className="text-[12.5px] font-semibold text-foreground">{s.label}</div>
            </div>
            <span className="text-[11px] text-muted-foreground">Not analyzed</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-surface-muted overflow-hidden">
            <div className="h-full w-0 bg-primary" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>0 / 100</span>
            <button className="hover:text-foreground">Run check</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Data ---------- */

const VERIFICATION: Record<
  string,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }> }[]
> = {
  Identity: [
    { label: "Government ID", description: "Passport, national ID or driver's license OCR + tamper check.", icon: IdCard },
    { label: "Selfie + Liveness", description: "Match selfie to ID photo with liveness detection.", icon: ShieldCheck },
    { label: "Address Proof", description: "Utility bill or bank statement within 90 days.", icon: ClipboardList },
    { label: "Sanctions Screening", description: "PEP, sanctions and adverse media screening.", icon: ShieldAlert },
  ],
  KYC: [
    { label: "Tax Identification", description: "PAN / SSN / Tax ID validation against authority.", icon: IdCard },
    { label: "GST / VAT", description: "GSTIN / VAT number verification for invoicing.", icon: FileSignature },
    { label: "Bank Account", description: "Penny-drop and beneficiary name match.", icon: ShieldCheck },
    { label: "Tax Forms", description: "W-8BEN / W-9 / 10F collection and storage.", icon: ClipboardList },
  ],
  Social: [
    { label: "YouTube", description: "Channel ownership via OAuth and analytics handshake.", icon: Globe2 },
    { label: "Instagram", description: "Business account link via Meta Graph API.", icon: Globe2 },
    { label: "TikTok", description: "Creator account verification via TikTok Login Kit.", icon: Globe2 },
    { label: "X / LinkedIn / Others", description: "Handle ownership via DNS, post or OAuth proof.", icon: Globe2 },
  ],
  Audience: [
    { label: "Audience Geography", description: "Top countries and cities of the creator's audience.", icon: Users2 },
    { label: "Audience Demographics", description: "Age, gender, language and interest breakdown.", icon: Users2 },
    { label: "Audience Authenticity", description: "Bot / inactive / suspicious follower share.", icon: ShieldAlert },
    { label: "Brand Affinity", description: "Overlap with Software Vala product categories.", icon: CheckCircle2 },
  ],
};

const BRAND_REVIEW = [
  "Brand voice alignment",
  "Past brand collaborations",
  "Controversy & content history",
  "Content quality samples",
  "Category fit (Software, SaaS, Marketing)",
  "Audience overlap with target ICP",
  "Pricing & deliverables expectation",
  "Exclusivity & non-compete review",
];

/* keep tree-shaker happy */
void XCircle;
