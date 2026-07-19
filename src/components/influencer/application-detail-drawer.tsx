import { useState } from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Globe2,
  Users2,
  ClipboardCheck,
  MessageSquare,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

export type ApplicationStage =
  | "submitted"
  | "identity"
  | "kyc"
  | "social"
  | "audience"
  | "brand-review"
  | "interview"
  | "agreement"
  | "approved"
  | "rejected";

const STAGE_LABEL: Record<ApplicationStage, string> = {
  submitted: "Submitted",
  identity: "Identity Verification",
  kyc: "KYC",
  social: "Social Verification",
  audience: "Audience Verification",
  "brand-review": "Brand Review",
  interview: "Interview",
  agreement: "Agreement",
  approved: "Approved",
  rejected: "Rejected",
};

const TABS = [
  { id: "overview", label: "Overview", icon: ClipboardCheck },
  { id: "identity", label: "Identity & KYC", icon: ShieldCheck },
  { id: "social", label: "Social", icon: Globe2 },
  { id: "audience", label: "Audience", icon: Users2 },
  { id: "interview", label: "Interview", icon: MessageSquare },
  { id: "agreement", label: "Agreement", icon: FileText },
  { id: "risk", label: "Risk", icon: ShieldAlert },
  { id: "timeline", label: "Timeline", icon: History },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ApplicationDetailDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-foreground/30 backdrop-brightness-90"
        onClick={onClose}
        aria-hidden
      />
      <aside className="w-full max-w-[860px] bg-background border-l border-border shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-border bg-surface">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Application · APP-000000
              </div>
              <h2 className="mt-0.5 text-[18px] font-semibold text-foreground truncate">
                Applicant name will appear here
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />—</span>
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />—</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />—</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Submitted —</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Stage strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <ScorePill label="Stage" value="Awaiting review" tone="info" />
            <ScorePill label="Identity" value="Unverified" tone="warn" />
            <ScorePill label="Risk Score" value="—" tone="neutral" />
            <ScorePill label="Brand Fit" value="—" tone="neutral" />
          </div>

          {/* Actions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-[12.5px] font-medium hover:bg-primary/90">
              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface text-[12.5px] font-medium hover:bg-muted">
              Move to Interview
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface text-[12.5px] font-medium hover:bg-muted">
              Request Documents
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface text-[12.5px] font-medium text-destructive hover:bg-muted">
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 border-b border-border bg-surface">
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={[
                    "shrink-0 px-3 h-9 inline-flex items-center gap-1.5 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-background">
          {tab === "overview" && <OverviewPane />}
          {tab === "identity" && <IdentityPane />}
          {tab === "social" && <EmptyPane title="No social accounts linked" description="Connected platforms and verification status will appear here." />}
          {tab === "audience" && <EmptyPane title="No audience data" description="Audience demographics, geography and authenticity checks will appear here once collected." />}
          {tab === "interview" && <EmptyPane title="No interview scheduled" description="Schedule a call or record interview notes here." />}
          {tab === "agreement" && <EmptyPane title="No agreement yet" description="Generate, send and track the influencer agreement and e-signature." />}
          {tab === "risk" && <RiskPane />}
          {tab === "timeline" && <EmptyPane title="No timeline events" description="Stage transitions, reviewer actions and system events will appear here." />}
        </div>
      </aside>
    </div>
  );
}

/* ---------- Panes ---------- */

function OverviewPane() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Applicant Information">
        <Row k="Full Name" v="—" />
        <Row k="Country" v="—" />
        <Row k="Languages" v="—" />
        <Row k="Primary Platform" v="—" />
        <Row k="Niche / Categories" v="—" />
        <Row k="Referred By" v="—" />
      </Card>
      <Card title="Application Workflow">
        {Object.entries(STAGE_LABEL).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-1.5 text-[12.5px]">
            <span className="text-foreground">{v}</span>
            <span className="text-muted-foreground">Pending</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function IdentityPane() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Identity Verification">
        <Row k="Government ID" v="Not submitted" />
        <Row k="Selfie Match" v="Not run" />
        <Row k="Liveness Check" v="Not run" />
        <Row k="Address Proof" v="Not submitted" />
      </Card>
      <Card title="KYC / Tax">
        <Row k="PAN / Tax ID" v="—" />
        <Row k="GST / VAT" v="—" />
        <Row k="Bank Account" v="Not linked" />
        <Row k="W-8 / W-9" v="Not submitted" />
      </Card>
    </div>
  );
}

function RiskPane() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Risk Signals">
        <RiskRow label="Fake Follower Score" status="Not analyzed" />
        <RiskRow label="Engagement Anomaly" status="Not analyzed" />
        <RiskRow label="Sanctions / PEP" status="Not checked" />
        <RiskRow label="Brand Safety" status="Not checked" />
        <RiskRow label="Content Policy Violations" status="None recorded" />
      </Card>
      <Card title="Reviewer Notes">
        <div className="py-6 text-center text-[12.5px] text-muted-foreground">
          No notes yet.
        </div>
      </Card>
    </div>
  );
}

function EmptyPane({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface py-16 px-6 text-center">
      <div className="mx-auto h-10 w-10 rounded-full bg-muted grid place-items-center text-muted-foreground mb-2">
        <FileText className="h-4 w-4" />
      </div>
      <div className="text-[14px] font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-[12.5px] text-muted-foreground max-w-md mx-auto">{description}</p>
    </div>
  );
}

/* ---------- Atoms ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="h-9 px-3 flex items-center border-b border-border">
        <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-wide">{title}</h3>
      </header>
      <div className="px-3 py-2">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[12.5px] border-b border-border last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}

function RiskRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[12.5px] border-b border-border last:border-0">
      <span className="text-foreground inline-flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </span>
      <span className="text-muted-foreground">{status}</span>
    </div>
  );
}

function ScorePill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "info" | "warn" | "ok" | "neutral";
}) {
  const toneClass = {
    info: "border-border bg-surface-muted text-foreground",
    warn: "border-border bg-surface-muted text-foreground",
    ok: "border-border bg-surface-muted text-foreground",
    neutral: "border-border bg-surface-muted text-muted-foreground",
  }[tone];
  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[13px] font-semibold">{value}</div>
    </div>
  );
}
