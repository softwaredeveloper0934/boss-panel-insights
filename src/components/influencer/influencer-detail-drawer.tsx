import {
  BadgeCheck,
  Building2,
  Calendar,
  Copy,
  Download,
  FileSpreadsheet,
  Globe2,
  Languages,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

export type InfluencerDetailDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TABS = [
  "Overview",
  "Performance",
  "Analytics",
  "Social Accounts",
  "Campaigns",
  "Commissions",
  "Wallet",
  "Documents",
  "Audit",
] as const;
type Tab = (typeof TABS)[number];

export function InfluencerDetailDrawer({
  open,
  onOpenChange,
}: InfluencerDetailDrawerProps) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetOverlay className="bg-foreground/40" />
        <SheetPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-[640px] border-l border-border bg-surface shadow-xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:duration-200 data-[state=open]:duration-300 flex flex-col"
        >
          <Header onClose={() => onOpenChange(false)} />
          <ScoreStrip />
          <TabBar tab={tab} onChange={setTab} />
          <div className="flex-1 overflow-y-auto bg-background">
            <TabContent tab={tab} />
          </div>
          <Footer />
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

/* ---------- Header ---------- */

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-5 pt-4 pb-4 border-b border-border bg-surface">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
          Influencer profile · Template preview
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Copy ID"><Copy className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn label="More"><MoreHorizontal className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn label="Close" onClick={onClose}><X className="h-4 w-4" /></IconBtn>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-muted border border-border grid place-items-center text-muted-foreground text-[18px] font-semibold">
          —
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-foreground truncate">
              Influencer Name
            </h2>
            <StatusPill tone="neutral">Unverified</StatusPill>
          </div>
          <div className="text-[12.5px] text-muted-foreground mt-0.5">
            @handle · No data
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
            <Meta icon={<MapPin className="h-3 w-3" />}>Country —</Meta>
            <Meta icon={<Globe2 className="h-3 w-3" />}>Timezone —</Meta>
            <Meta icon={<Languages className="h-3 w-3" />}>Languages —</Meta>
            <Meta icon={<Calendar className="h-3 w-3" />}>Joined —</Meta>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      {children}
    </span>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}

/* ---------- Score strip ---------- */

function ScoreStrip() {
  return (
    <div className="grid grid-cols-3 border-b border-border bg-surface-muted">
      <ScoreCell
        icon={<ShieldCheck className="h-3.5 w-3.5" />}
        label="Verification"
        value="—"
        sublabel="KYC pending"
        tone="neutral"
      />
      <ScoreCell
        icon={<Sparkles className="h-3.5 w-3.5" />}
        label="Health score"
        value="—"
        sublabel="Awaiting data"
        tone="neutral"
        divider
      />
      <ScoreCell
        icon={<ShieldAlert className="h-3.5 w-3.5" />}
        label="Risk score"
        value="—"
        sublabel="Not assessed"
        tone="neutral"
        divider
      />
    </div>
  );
}

function ScoreCell({
  icon,
  label,
  value,
  sublabel,
  tone,
  divider,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel: string;
  tone: "good" | "warn" | "bad" | "neutral";
  divider?: boolean;
}) {
  const toneClass =
    tone === "good"
      ? "text-success"
      : tone === "warn"
        ? "text-warning"
        : tone === "bad"
          ? "text-destructive"
          : "text-muted-foreground";
  return (
    <div
      className={`px-4 py-3 ${divider ? "border-l border-border" : ""}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <span className={toneClass}>{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-[20px] font-semibold tabular-nums leading-none text-foreground">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sublabel}</div>
      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full w-0 bg-foreground/20" />
      </div>
    </div>
  );
}

/* ---------- Tabs ---------- */

function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="px-3 flex items-center overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                "shrink-0 px-3 h-9 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "Overview":
      return <Overview />;
    case "Performance":
      return <SimpleEmpty title="Performance" message="Followers growth, engagement, reach and ROI will appear here." />;
    case "Analytics":
      return <AnalyticsTab />;
    case "Social Accounts":
      return <SocialAccounts />;
    case "Campaigns":
      return <SimpleEmpty title="Campaigns" message="Assigned campaigns and deliverables will be listed here." />;
    case "Commissions":
      return <SimpleEmpty title="Commissions" message="Pending, approved and paid commissions per source." />;
    case "Wallet":
      return <SimpleEmpty title="Wallet" message="Balance, transactions and reconciliation per currency." />;
    case "Documents":
      return <SimpleEmpty title="Documents" message="Agreements, NDAs, KYC, invoices and tax documents." />;
    case "Audit":
      return <SimpleEmpty title="Audit log" message="Every change, action and approval is recorded here." />;
  }
}

/* ---------- Analytics tab: ROI + Risk trends ---------- */

// Preview trend series — inline SVG only, never rendered as tabular "data".
// The tab renders a locked state until the influencer is verified; that gate
// is the primary UX guarantee, and toggling verification is preview-only.
const ROI_SERIES = [12, 14, 13, 18, 22, 25, 23, 28, 31, 34, 33, 38];
const RISK_SERIES = [62, 58, 55, 52, 48, 44, 42, 40, 37, 34, 31, 28];
const TREND_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type VerificationCheck = {
  key: "kyc" | "email" | "phone" | "social" | "sanctions";
  label: string;
  description: string;
  status: "verified" | "pending" | "missing" | "unavailable";
};

// Real verification data would come from a backend call, e.g.
//   const { data } = useQuery({ queryKey: ["influencer-verification", id], queryFn: getVerification })
// Until that endpoint is wired, we surface an explicit unavailable state
// instead of silently pretending the influencer is verified.
function useVerificationStatus() {
  const checks: VerificationCheck[] = [
    { key: "kyc", label: "Identity (KYC)", description: "Government ID and liveness check", status: "unavailable" },
    { key: "email", label: "Email", description: "Verified via double opt-in", status: "unavailable" },
    { key: "phone", label: "Phone", description: "Verified via SMS OTP", status: "unavailable" },
    { key: "social", label: "Social ownership", description: "At least one platform verified", status: "unavailable" },
    { key: "sanctions", label: "Sanctions screening", description: "Cleared against watchlists", status: "unavailable" },
  ];
  const allVerified = checks.every((c) => c.status === "verified");
  return { checks, allVerified, backendConnected: false as const };
}

function AnalyticsTab() {
  const { checks, allVerified, backendConnected } = useVerificationStatus();

  if (!allVerified) {
    return (
      <div className="p-5 space-y-4">
        <div className="rounded-md border border-border bg-surface">
          <div className="px-4 py-3 border-b border-border flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-muted-foreground shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-foreground">Analytics locked · verification required</div>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                ROI, risk trends and lifetime revenue unlock only after every check below returns <span className="font-medium text-foreground">verified</span>. This protects sensitive earnings and scoring data.
              </p>
            </div>
          </div>

          <ul className="divide-y divide-border">
            {checks.map((c) => (
              <li key={c.key} className="px-4 py-2.5 flex items-center gap-3">
                <StatusDot status={c.status} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium text-foreground">{c.label}</div>
                  <div className="text-[11.5px] text-muted-foreground">{c.description}</div>
                </div>
                <StatusPill tone={c.status === "verified" ? "good" : c.status === "unavailable" ? "neutral" : "warn"}>
                  {c.status === "unavailable" ? "Not checked" : c.status}
                </StatusPill>
              </li>
            ))}
          </ul>

          {!backendConnected ? (
            <div className="px-4 py-3 border-t border-border bg-surface-muted flex items-start gap-2 text-[12px] text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
              <div>
                <span className="text-foreground font-medium">Verification service not connected.</span> Wire a backend to run these checks against your KYC provider, email/SMS gateway, social OAuth, and sanctions list. Until then, this tab stays locked by design.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 grid gap-4">
      <div className="rounded-md border border-success/30 bg-success/5 px-3 py-2 flex items-center gap-2 text-[12px] text-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Verified profile — analytics visible to admins and account managers only.
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-[12px] text-muted-foreground">Trailing 12 months</div>
        <div className="flex items-center gap-1.5">
          <ExportBtn icon={<Download className="h-3.5 w-3.5" />} onClick={() => toast.success("PDF export queued")}>Export PDF</ExportBtn>
          <ExportBtn icon={<FileSpreadsheet className="h-3.5 w-3.5" />} onClick={() => toast.success("CSV export queued")}>Export CSV</ExportBtn>
        </div>
      </div>

      <TrendCard title="ROI trend" icon={<TrendingUp className="h-3.5 w-3.5" />} series={ROI_SERIES} tone="good" unit="%" summary={{ label: "Last month", value: "38%", delta: "+5 pts" }} />
      <TrendCard title="Risk score trend" icon={<ShieldAlert className="h-3.5 w-3.5" />} series={RISK_SERIES} tone="warn" unit="" summary={{ label: "Current risk", value: "28", delta: "-34 pts" }} />

      <Card title="Signals">
        <Grid>
          <Field label="Lifetime revenue" value="—" />
          <Field label="Attributed conversions" value="—" />
          <Field label="Fraud flags (90d)" value="0" />
          <Field label="Audience integrity" value="—" />
        </Grid>
      </Card>
    </div>
  );
}

function StatusDot({ status }: { status: VerificationCheck["status"] }) {
  const cls =
    status === "verified" ? "bg-success" :
    status === "pending" ? "bg-warning" :
    status === "missing" ? "bg-destructive" :
    "bg-muted-foreground/40";
  return <span className={`h-2 w-2 rounded-full ${cls} shrink-0`} aria-hidden />;
}


function TrendCard({
  title,
  icon,
  series,
  tone,
  unit,
  summary,
}: {
  title: string;
  icon: React.ReactNode;
  series: number[];
  tone: "good" | "warn";
  unit: string;
  summary: { label: string; value: string; delta: string };
}) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = Math.max(1, max - min);
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * 100;
      const y = 30 - ((v - min) / range) * 26 - 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const stroke = tone === "good" ? "text-success" : "text-warning";
  const fill = tone === "good" ? "fill-success/10" : "fill-warning/10";

  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="h-9 px-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className={stroke}>{icon}</span>
          <h3 className="text-[11.5px] font-semibold text-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div className="text-[11px] text-muted-foreground">
          {summary.label}:{" "}
          <span className="text-foreground font-semibold tabular-nums">
            {summary.value}
          </span>{" "}
          <span className={tone === "good" ? "text-success" : "text-warning"}>
            {summary.delta}
          </span>
        </div>
      </header>
      <div className="p-3">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full h-24 ${stroke}`}>
          <polygon
            className={fill}
            points={`0,30 ${points} 100,30`}
            stroke="none"
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            points={points}
          />
        </svg>
        <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
          {TREND_LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="mt-1 text-[10.5px] text-muted-foreground">
          {series.length} points · Min {min}{unit} · Max {max}{unit}
        </div>
      </div>
    </section>
  );
}

function ExportBtn({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[11.5px] font-medium text-foreground"
    >
      {icon}
      {children}
    </button>
  );
}

function Overview() {
  return (
    <div className="p-5 grid gap-4">
      <Card title="Identity">
        <Grid>
          <Field label="Full name" value="—" />
          <Field label="Display name" value="—" />
          <Field label="Email" value="—" icon={<Mail className="h-3 w-3" />} />
          <Field label="Phone" value="—" icon={<Phone className="h-3 w-3" />} />
          <Field label="Country" value="—" />
          <Field label="City" value="—" />
          <Field label="Date of birth" value="—" />
          <Field label="Languages" value="—" />
        </Grid>
      </Card>

      <Card title="Profile">
        <Grid>
          <Field label="Tier" value="—" />
          <Field label="Niche" value="—" />
          <Field label="Categories" value="—" />
          <Field label="Audience size" value="—" />
          <Field label="Avg. engagement" value="—" />
          <Field label="Avg. reach" value="—" />
        </Grid>
        <div className="mt-3">
          <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1">
            Bio
          </div>
          <div className="text-[12.5px] text-muted-foreground italic">
            No bio added.
          </div>
        </div>
      </Card>

      <Card title="Verification & Compliance">
        <Grid>
          <Field label="Identity (KYC)" value="Pending" />
          <Field label="Social verification" value="Pending" />
          <Field label="Audience verification" value="Pending" />
          <Field label="Tax compliance" value="Not submitted" />
          <Field label="Agreement" value="Not signed" />
          <Field label="NDA" value="Not signed" />
        </Grid>
      </Card>

      <Card title="Business">
        <Grid>
          <Field label="Brand" value="—" icon={<Building2 className="h-3 w-3" />} />
          <Field label="Owner / Manager" value="—" />
          <Field label="Onboarded by" value="—" />
          <Field label="Source" value="—" />
          <Field label="Default commission" value="—" />
          <Field label="Default currency" value="—" />
        </Grid>
      </Card>
    </div>
  );
}

function SocialAccounts() {
  const platforms = [
    "YouTube",
    "Instagram",
    "Facebook",
    "LinkedIn",
    "TikTok",
    "X",
    "Telegram",
    "WhatsApp Channel",
    "Pinterest",
    "Threads",
    "Website",
  ];
  return (
    <div className="p-5">
      <Card title="Connected accounts">
        <ul className="divide-y divide-border -mx-3">
          {platforms.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-md bg-muted border border-border grid place-items-center text-[10px] font-semibold text-muted-foreground">
                  {p.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-[12.5px] font-medium text-foreground">
                    {p}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Not connected
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="h-7 px-2.5 rounded-md border border-border bg-surface text-[11.5px] font-medium text-foreground hover:bg-muted"
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SimpleEmpty({ title, message }: { title: string; message: string }) {
  return (
    <div className="p-5">
      <Card title={title}>
        <div className="py-10 text-center">
          <div className="h-10 w-10 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <div className="mt-2 text-[13px] font-medium text-foreground">
            Nothing to show yet
          </div>
          <div className="mt-1 text-[12px] text-muted-foreground max-w-sm mx-auto">
            {message}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Small primitives ---------- */

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-surface">
      <header className="h-9 px-3 flex items-center border-b border-border">
        <h3 className="text-[11.5px] font-semibold text-foreground uppercase tracking-wide">
          {title}
        </h3>
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10.5px] uppercase tracking-wide font-medium text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-foreground">
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "bad" | "neutral";
  children: ReactNode;
}) {
  const cls =
    tone === "good"
      ? "bg-success/10 text-success border-success/20"
      : tone === "warn"
        ? "bg-warning/15 text-warning-foreground border-warning/30"
        : tone === "bad"
          ? "bg-destructive/10 text-destructive border-destructive/20"
          : "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10.5px] font-medium ${cls}`}
    >
      <BadgeCheck className="h-3 w-3" />
      {children}
    </span>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <div className="px-5 py-3 border-t border-border bg-surface flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Message
        </button>
        <button
          type="button"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
        >
          <Send className="h-3.5 w-3.5" />
          Assign campaign
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium text-foreground"
        >
          Suspend
        </button>
        <button
          type="button"
          className="h-8 px-3 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-[12.5px] font-medium"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
