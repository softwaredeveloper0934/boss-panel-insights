import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Search,
  Filter,
  ListFilter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Star,
  Image as ImageIcon,
  Languages,
  MapPin,
  Calendar,
  Award,
  FileBadge,
  FileUp,
  FileWarning,
  FileCheck2,
  Trophy,
  Megaphone,
  MessageSquare,
  ExternalLink,
  Users2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  X,
  Loader2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from "lucide-react";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";
import {
  PageHeader,
  KpiStrip,
  SectionTabs,
  RightPanel,
  EmptySurface,
  PanelCard as _PanelCard,
} from "@/components/influencer/wall-page";
void _PanelCard;

const wall = WALL_BY_SLUG["creator-profiles"];

export const Route = createFileRoute("/creator-profiles")({
  head: () => ({
    meta: [
      { title: "Creator Profiles — Influencer Manager" },
      { name: "description", content: wall.description },
    ],
  }),
  component: CreatorProfilesPage,
});

const SECTIONS = [
  "All Profiles",
  "Workspace Preview",
  "Biography",
  "Skills & Niche",
  "Audience",
  "Languages",
  "Availability",
  "Portfolio",
  "Achievements",
  "Ratings",
  "Verification",
  "Documents",
  "Compliance",
];

const FILTER_CHIPS = [
  "Country",
  "Niche",
  "Audience Size",
  "Language",
  "Verification",
  "Rating",
  "Availability",
  "Portfolio",
  "Documents",
  "Last Updated",
];

const COLUMNS = [
  "Creator",
  "Niche",
  "Audience Size",
  "Languages",
  "Rating",
  "Verification",
  "Portfolio",
  "Documents",
  "Last Updated",
];

function CreatorProfilesPage() {
  const [active, setActive] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} />
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <SectionTabs sections={wall.sections.map((s) => ({ label: s.label }))} active={active} onChange={setActive} />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mt-3 flex items-center gap-1 border-b border-border">
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(i)}
              className={[
                "h-9 px-3 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                i === active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0 space-y-6">
          <ProfilesFilterBar />

          {active === 1 ? (
            <ProfileWorkspacePreview />
          ) : (
            <div className="rounded-md border border-border bg-surface overflow-hidden">
              <ProfilesTable onOpen={() => setDrawerOpen(true)} />
            </div>
          )}
        </main>
        <RightPanel wall={wall} />
      </div>

      {drawerOpen ? <CreatorProfileDrawer onClose={() => setDrawerOpen(false)} /> : null}
    </div>
  );
}

function ProfilesFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
      <div className="flex items-center gap-1.5 flex-1 min-w-[260px] h-8 px-2.5 rounded-md border border-border bg-background">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, handle, niche, country, skill…"
          className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
        <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      {FILTER_CHIPS.map((c) => (
        <button
          key={c}
          type="button"
          className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px] text-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          {c}
        </button>
      ))}
      <button
        type="button"
        className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
      >
        <ListFilter className="h-3.5 w-3.5" />
        More
      </button>
      <div className="ml-auto flex items-center gap-1">
        {[RefreshCw, Upload, Download].map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfilesTable({ onOpen }: { onOpen: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
        <div className="text-[12.5px] font-semibold">Creator Profile Index</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview profile workspace
          </button>
          <span className="text-[11.5px] text-muted-foreground">0 records · Page 1 of 1</span>
        </div>
      </div>
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-surface-muted/50 text-left text-muted-foreground">
            <th className="w-8 py-2 pl-4">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
            </th>
            {COLUMNS.map((c) => (
              <th key={c} className="py-2 px-3 font-medium text-[11.5px] uppercase tracking-wide">
                {c}
              </th>
            ))}
            <th className="w-12" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={COLUMNS.length + 2} className="py-0">
              <EmptySurface
                title="No creator profiles loaded"
                description="Approved creators will appear here as full profile records once the Boss Panel data sources are connected."
                primaryAction="Open Profile"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 h-10 border-t border-border bg-surface-muted text-[11.5px] text-muted-foreground">
        <div>0 selected</div>
        <div className="flex items-center gap-1.5">
          <button className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Previous</button>
          <button className="h-7 px-2 rounded border border-border bg-surface hover:bg-muted">Next</button>
        </div>
      </div>
    </>
  );
}

/* ---------- Profile workspace preview ---------- */

type VerifyState = "unverified" | "verifying" | "verified";

type AchievementDecision = "pending" | "approved" | "rejected" | "evidence";

type AchievementItem = {
  id: string;
  title: string;
  source: string;
  submittedAt: string;
  reviewItemId: string;
  decision: AchievementDecision;
  note?: string;
};

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "ach_001",
    title: "Top performer — Q3 referral leaderboard",
    source: "Auto-detected · Referral engine",
    submittedAt: "2 days ago",
    reviewItemId: "rev_4821",
    decision: "pending",
  },
  {
    id: "ach_002",
    title: "1M total audience milestone",
    source: "Creator submitted",
    submittedAt: "5 days ago",
    reviewItemId: "rev_4810",
    decision: "pending",
  },
  {
    id: "ach_003",
    title: "Brand-safety certified content streak",
    source: "Compliance engine",
    submittedAt: "1 week ago",
    reviewItemId: "rev_4799",
    decision: "pending",
  },
];

type RatingItem = {
  id: string;
  reviewer: string;
  rating: number;
  campaign: string;
  submittedAt: string;
  body: string;
  flag?: string;
  outcome: "pending" | "approved" | "rejected";
  moderatorNote?: string;
};

const INITIAL_RATINGS: RatingItem[] = [
  {
    id: "rt_3201",
    reviewer: "Acme Corp — Brand Manager",
    rating: 5,
    campaign: "Spring launch — IN",
    submittedAt: "3h ago",
    body:
      "Delivered every asset ahead of schedule and engagement landed 32% above forecast. Would absolutely re-book.",
    outcome: "pending",
  },
  {
    id: "rt_3198",
    reviewer: "Nimbus Cloud — Marketing Lead",
    rating: 2,
    campaign: "Developer webinar",
    submittedAt: "1d ago",
    body:
      "Final video was off-brief and missed two required talking points. Disclosure was also delayed by 48h.",
    flag: "Possible policy issue · #ad disclosure",
    outcome: "pending",
  },
  {
    id: "rt_3187",
    reviewer: "Verified buyer — anon",
    rating: 1,
    campaign: "Coupon: SAVE20",
    submittedAt: "2d ago",
    body: "Suspect repeated wording across multiple reviews — possible review-farm signal.",
    flag: "Spam signal · duplicate phrasing",
    outcome: "pending",
  },
];

function ProfileWorkspacePreview() {
  const [verify, setVerify] = useState<VerifyState>("unverified");
  const [confirmVerify, setConfirmVerify] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [ratings, setRatings] = useState<RatingItem[]>(INITIAL_RATINGS);

  function runVerify() {
    setConfirmVerify(false);
    setVerify("verifying");
    const toastId = toast.loading("Running verification checks…", {
      description: "Identity, social and audience signals.",
    });
    window.setTimeout(() => {
      // Simulate a deterministic success path for the demo.
      const ok = true;
      if (ok) {
        setVerify("verified");
        toast.success("Creator verified", {
          id: toastId,
          description: "All 7 verification checks passed.",
        });
      } else {
        setVerify("unverified");
        toast.error("Verification failed", {
          id: toastId,
          description: "One or more checks could not be completed.",
        });
      }
    }, 1400);
  }

  function handleAssignCampaign(campaignName: string) {
    setAssignOpen(false);
    const toastId = toast.loading(`Assigning to “${campaignName}”…`);
    window.setTimeout(() => {
      toast.success("Creator assigned", {
        id: toastId,
        description: `Added to campaign “${campaignName}”. Brief queued for dispatch.`,
      });
    }, 900);
  }

  function decideAchievement(id: string, decision: AchievementDecision) {
    setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, decision } : a)));
    const labels: Record<AchievementDecision, string> = {
      pending: "Reset to pending",
      approved: "Achievement approved",
      rejected: "Achievement rejected",
      evidence: "Evidence requested",
    };
    const tones: Record<AchievementDecision, "success" | "error" | "info" | "warning"> = {
      pending: "info",
      approved: "success",
      rejected: "error",
      evidence: "warning",
    };
    const fn = toast[tones[decision]];
    fn(labels[decision], {
      description: `Linked review item ${achievements.find((a) => a.id === id)?.reviewItemId ?? ""}.`,
    });
  }

  function decideRating(id: string, outcome: "approved" | "rejected", note: string) {
    setRatings((prev) => prev.map((r) => (r.id === id ? { ...r, outcome, moderatorNote: note } : r)));
    if (outcome === "approved") {
      toast.success("Rating approved", { description: "Published to creator profile." });
    } else {
      toast.error("Rating rejected", { description: "Hidden from public profile. Reviewer notified." });
    }
  }

  const verificationLabel: Record<VerifyState, string> = {
    unverified: "Unverified",
    verifying: "Verifying…",
    verified: "Verified",
  };

  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      {/* Hero */}
      <div className="px-5 py-4 border-b border-border bg-surface-muted/40">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-muted grid place-items-center text-muted-foreground border border-border">
            <Users2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-foreground">Creator workspace preview</h2>
              <VerificationBadge state={verify} />
            </div>
            <p className="text-[12.5px] text-muted-foreground mt-1 max-w-2xl">
              When a creator profile is opened, this workspace shows the full record: biography, niche, audience, languages, availability, portfolio,
              achievements, ratings, verification and documents — laid out for fast review and edit.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px]">Request update</button>
            <button
              onClick={() => setAssignOpen(true)}
              className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] inline-flex items-center gap-1.5"
            >
              <Megaphone className="h-3.5 w-3.5" /> Assign campaign
            </button>
            <button
              onClick={() => {
                if (verify === "verified") {
                  toast.info("Already verified", {
                    description: "Use “Request re-verification” to re-run checks.",
                  });
                  return;
                }
                if (verify === "verifying") return;
                setConfirmVerify(true);
              }}
              disabled={verify === "verifying"}
              className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {verify === "verifying" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying
                </>
              ) : verify === "verified" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> Verify
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            { label: "Audience", value: "—" },
            { label: "Engagement", value: "—" },
            { label: "Rating", value: "—" },
            { label: "Portfolio", value: "—" },
            { label: "Languages", value: "—" },
            { label: "Verification", value: verificationLabel[verify] },
          ].map((s) => (
            <div key={s.label} className="rounded-md border border-border bg-surface px-2.5 py-2">
              <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="text-[14px] font-semibold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body grid */}
      <div className="grid lg:grid-cols-3 gap-0">
        <ProfileCard icon={<Sparkles className="h-3.5 w-3.5" />} title="Biography">
          <EmptyMini text="No biography on file." />
        </ProfileCard>
        <ProfileCard icon={<Award className="h-3.5 w-3.5" />} title="Skills & Niche">
          <EmptyMini text="No skills or niche tags." />
        </ProfileCard>
        <ProfileCard icon={<Users2 className="h-3.5 w-3.5" />} title="Audience">
          <EmptyMini text="Audience demographics unavailable." />
        </ProfileCard>
        <ProfileCard icon={<Languages className="h-3.5 w-3.5" />} title="Languages">
          <EmptyMini text="No language data." />
        </ProfileCard>
        <ProfileCard icon={<Calendar className="h-3.5 w-3.5" />} title="Availability">
          <EmptyMini text="Availability not set." />
        </ProfileCard>
        <ProfileCard icon={<MapPin className="h-3.5 w-3.5" />} title="Location & Travel">
          <EmptyMini text="No location preferences." />
        </ProfileCard>
        <ProfileCard icon={<ImageIcon className="h-3.5 w-3.5" />} title="Portfolio">
          <EmptyMini text="No portfolio items uploaded." />
        </ProfileCard>
        <ProfileCard icon={<Star className="h-3.5 w-3.5" />} title="Ratings & Reviews">
          <RatingsCard ratings={ratings} onOpen={() => setRatingsOpen(true)} />
        </ProfileCard>
        <ProfileCard icon={<FileBadge className="h-3.5 w-3.5" />} title="Documents">
          <DocumentsCard />
        </ProfileCard>
        <ProfileCard icon={<ShieldCheck className="h-3.5 w-3.5" />} title="Verification">
          <VerificationCard
            state={verify}
            onVerify={() => setConfirmVerify(true)}
            onRecheck={() => {
              setVerify("unverified");
              setConfirmVerify(true);
            }}
          />
        </ProfileCard>
        <ProfileCard icon={<Trophy className="h-3.5 w-3.5" />} title="Achievements">
          <AchievementsCard items={achievements} onDecide={decideAchievement} />
        </ProfileCard>
        <ProfileCard icon={<FileCheck2 className="h-3.5 w-3.5" />} title="Compliance Checks">
          <ComplianceCard />
        </ProfileCard>
        <ProfileCard icon={<ChevronRight className="h-3.5 w-3.5" />} title="Activity">
          <EmptyMini text="No recent activity." />
        </ProfileCard>
      </div>

      {confirmVerify ? (
        <ConfirmDialog
          title="Run verification checks?"
          description="This triggers identity, social ownership and audience-authenticity checks. The creator will be notified by email once the verification completes."
          confirmLabel="Run verification"
          tone="primary"
          onCancel={() => setConfirmVerify(false)}
          onConfirm={runVerify}
        />
      ) : null}

      {assignOpen ? (
        <AssignCampaignDialog onCancel={() => setAssignOpen(false)} onConfirm={handleAssignCampaign} />
      ) : null}

      {ratingsOpen ? (
        <RatingsModerationDrawer
          ratings={ratings}
          onClose={() => setRatingsOpen(false)}
          onDecide={decideRating}
        />
      ) : null}
    </div>
  );
}

function VerificationBadge({ state }: { state: VerifyState }) {
  if (state === "verified") {
    return (
      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="h-3 w-3" /> Verified
      </span>
    );
  }
  if (state === "verifying") {
    return (
      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
        <Loader2 className="h-3 w-3 animate-spin" /> Verifying
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium bg-muted text-muted-foreground border border-border">
      <ShieldCheck className="h-3 w-3" /> Unverified
    </span>
  );
}

function ProfileCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-r border-b border-border last:border-r p-4 min-h-[148px]">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-foreground">
          <span className="h-5 w-5 grid place-items-center rounded bg-muted text-muted-foreground">
            {icon}
          </span>
          {title}
        </div>
        <button className="text-[11px] text-muted-foreground hover:text-foreground">Edit</button>
      </header>
      {children}
    </section>
  );
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="text-[12px] text-muted-foreground italic py-3">{text}</div>
  );
}

function ErrorMini({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-1.5 rounded border border-destructive/30 bg-destructive/5 p-2 text-[11.5px] text-destructive">
      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function MiniKpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded border border-border bg-surface px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-[13px] font-semibold tabular-nums leading-tight">{value}</div>
      {hint ? <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div> : null}
    </div>
  );
}

/* ---------- Section cards ---------- */

function RatingsCard({ ratings, onOpen }: { ratings: RatingItem[]; onOpen: () => void }) {
  const pending = ratings.filter((r) => r.outcome === "pending").length;
  const flagged = ratings.filter((r) => !!r.flag && r.outcome === "pending").length;
  const approved = ratings.filter((r) => r.outcome === "approved");
  const avg =
    approved.length > 0
      ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
      : "—";
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <MiniKpi label="Avg rating" value={avg} hint={`${approved.length} published`} />
        <MiniKpi label="Pending" value={String(pending)} hint="awaiting decision" />
        <MiniKpi label="Flagged" value={String(flagged)} hint="needs review" />
      </div>
      {pending === 0 ? (
        <EmptyMini text="No ratings awaiting moderation." />
      ) : (
        <div className="text-[12px] text-muted-foreground">
          {pending} rating{pending === 1 ? "" : "s"} awaiting moderator decision.
        </div>
      )}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={onOpen}
          className="h-7 px-2 inline-flex items-center gap-1.5 rounded bg-primary text-primary-foreground text-[11.5px]"
        >
          <MessageSquare className="h-3 w-3" /> Moderate ratings
        </button>
        <a
          href="/reviews"
          className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]"
        >
          Open Reviews wall <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}

function AchievementsCard({
  items,
  onDecide,
}: {
  items: AchievementItem[];
  onDecide: (id: string, decision: AchievementDecision) => void;
}) {
  const pending = items.filter((a) => a.decision === "pending");
  const approved = items.filter((a) => a.decision === "approved");
  const rejected = items.filter((a) => a.decision === "rejected");

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <MiniKpi label="Pending" value={String(pending.length)} hint="moderation queue" />
        <MiniKpi label="Approved" value={String(approved.length)} />
        <MiniKpi label="Rejected" value={String(rejected.length)} />
      </div>
      {items.length === 0 ? (
        <EmptyMini text="No achievements recorded." />
      ) : (
        <ul className="space-y-1.5">
          {items.slice(0, 4).map((a) => (
            <li
              key={a.id}
              className="rounded border border-border bg-surface px-2 py-1.5 text-[12px]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {a.source} · {a.submittedAt}
                  </div>
                </div>
                <AchievementBadge decision={a.decision} />
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <a
                  href={`/reviews?item=${a.reviewItemId}`}
                  className="text-[11px] inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Review item {a.reviewItemId}
                  <ExternalLink className="h-3 w-3" />
                </a>
                {a.decision === "pending" ? (
                  <div className="flex items-center gap-1">
                    <IconBtn
                      title="Approve"
                      onClick={() => onDecide(a.id, "approved")}
                      tone="success"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </IconBtn>
                    <IconBtn
                      title="Request evidence"
                      onClick={() => onDecide(a.id, "evidence")}
                      tone="warning"
                    >
                      <Flag className="h-3 w-3" />
                    </IconBtn>
                    <IconBtn
                      title="Reject"
                      onClick={() => onDecide(a.id, "rejected")}
                      tone="destructive"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </IconBtn>
                  </div>
                ) : (
                  <button
                    onClick={() => onDecide(a.id, "pending")}
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-1.5">
        <button className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]">
          <Trophy className="h-3 w-3" /> Award badge
        </button>
      </div>
    </div>
  );
}

function AchievementBadge({ decision }: { decision: AchievementDecision }) {
  const map: Record<AchievementDecision, { label: string; cls: string; icon: ReactNode }> = {
    pending: {
      label: "Pending",
      cls: "bg-muted text-muted-foreground border-border",
      icon: <Clock className="h-3 w-3" />,
    },
    approved: {
      label: "Approved",
      cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    rejected: {
      label: "Rejected",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
      icon: <X className="h-3 w-3" />,
    },
    evidence: {
      label: "Evidence requested",
      cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
      icon: <Flag className="h-3 w-3" />,
    },
  };
  const s = map[decision];
  return (
    <span
      className={`inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium border whitespace-nowrap ${s.cls}`}
    >
      {s.icon} {s.label}
    </span>
  );
}

function IconBtn({
  title,
  onClick,
  tone,
  children,
}: {
  title: string;
  onClick: () => void;
  tone: "success" | "destructive" | "warning";
  children: ReactNode;
}) {
  const tones: Record<typeof tone, string> = {
    success:
      "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10",
    destructive: "border-destructive/30 text-destructive hover:bg-destructive/10",
    warning: "border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
  };
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`h-6 w-6 grid place-items-center rounded border ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

const VERIFICATION_CHECKS = [
  "Identity (KYC)",
  "Address proof",
  "Tax / PAN / W-9",
  "Bank / Payout",
  "Social handles",
  "Audience authenticity",
  "Two-factor auth",
];

function VerificationCard({
  state,
  onVerify,
  onRecheck,
}: {
  state: VerifyState;
  onVerify: () => void;
  onRecheck: () => void;
}) {
  const verified = state === "verified";
  const inProgress = state === "verifying";
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <MiniKpi label="Verified" value={verified ? "7 / 7" : "0 / 7"} />
        <MiniKpi label="Pending" value={verified ? "0" : inProgress ? "7" : "7"} />
        <MiniKpi label="Failed" value="0" />
      </div>
      <ul className="text-[12px] space-y-1">
        {VERIFICATION_CHECKS.map((v) => (
          <li
            key={v}
            className="flex items-center justify-between border-b border-border/60 last:border-b-0 py-1"
          >
            <span className="text-muted-foreground">{v}</span>
            <span className="inline-flex items-center gap-1 text-[11px]">
              {verified ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              ) : inProgress ? (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Loader2 className="h-3 w-3 animate-spin" /> Checking
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" /> Pending
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-1.5">
        {verified ? (
          <button
            onClick={onRecheck}
            className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]"
          >
            <ShieldAlert className="h-3 w-3" /> Request re-verification
          </button>
        ) : (
          <button
            disabled={inProgress}
            onClick={onVerify}
            className="h-7 px-2 inline-flex items-center gap-1.5 rounded bg-primary text-primary-foreground text-[11.5px] disabled:opacity-60"
          >
            {inProgress ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Verifying…
              </>
            ) : (
              <>
                <ShieldCheck className="h-3 w-3" /> Verify now
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

const DOCUMENT_TYPES = [
  "Government ID",
  "Address proof",
  "Tax form (PAN / W-9 / W-8BEN)",
  "Bank statement / Void cheque",
  "Agency authorization",
  "Brand-safety acknowledgement",
];

function DocumentsCard() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <MiniKpi label="Uploaded" value="0" />
        <MiniKpi label="Approved" value="0" />
        <MiniKpi label="Expired" value="0" />
      </div>
      <ul className="text-[12px] space-y-1">
        {DOCUMENT_TYPES.map((d) => (
          <li key={d} className="flex items-center justify-between border-b border-border/60 last:border-b-0 py-1">
            <span className="text-muted-foreground truncate">{d}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <FileWarning className="h-3 w-3" /> Missing
            </span>
          </li>
        ))}
      </ul>
      <EmptyMini text="No documents uploaded." />
      <div className="flex items-center gap-1.5">
        <button className="h-7 px-2 inline-flex items-center gap-1.5 rounded bg-primary text-primary-foreground text-[11.5px]">
          <FileUp className="h-3 w-3" /> Upload document
        </button>
        <button className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]">
          <Eye className="h-3 w-3" /> View all
        </button>
      </div>
    </div>
  );
}

const COMPLIANCE_CHECKS = [
  "Sanctions / PEP screening",
  "Age verification (18+)",
  "Content brand-safety policy",
  "Disclosure (#ad / FTC / ASCI)",
  "Exclusivity & conflict check",
  "GDPR / data-processing consent",
  "Tax residency declaration",
];

function ComplianceCard() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <MiniKpi label="Passed" value="0" />
        <MiniKpi label="Pending" value={String(COMPLIANCE_CHECKS.length)} />
        <MiniKpi label="Issues" value="0" />
      </div>
      <ul className="text-[12px] space-y-1">
        {COMPLIANCE_CHECKS.map((c) => (
          <li key={c} className="flex items-center justify-between border-b border-border/60 last:border-b-0 py-1">
            <span className="text-muted-foreground truncate">{c}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <AlertTriangle className="h-3 w-3" /> Pending
            </span>
          </li>
        ))}
      </ul>
      <ErrorMini text="Compliance engine not connected — checks cannot run until the Boss Panel data source is wired." />
      <div className="flex items-center gap-1.5">
        <button className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]">
          <ShieldCheck className="h-3 w-3" /> Run checks
        </button>
        <a
          href="/compliance"
          className="h-7 px-2 inline-flex items-center gap-1.5 rounded border border-border bg-surface hover:bg-muted text-[11.5px]"
        >
          Open compliance <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}


/* ---------- Slide-over drawer ---------- */

function CreatorProfileDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-foreground/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="w-full max-w-[860px] h-full bg-surface border-l border-border shadow-xl flex flex-col">
        <header className="h-12 px-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-muted grid place-items-center text-muted-foreground">
              <Users2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold leading-none">Creator profile</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Workspace preview</div>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <ProfileWorkspacePreview />
        </div>
      </aside>
    </div>
  );
}

/* ---------- Confirm dialog ---------- */

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "primary",
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "primary" | "destructive";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] grid place-items-center"
    >
      <div className="absolute inset-0 bg-foreground/40" onClick={onCancel} />
      <div className="relative w-full max-w-[440px] mx-4 rounded-lg border border-border bg-surface shadow-xl">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{description}</p>
        </div>
        <div className="px-5 py-3 border-t border-border bg-surface-muted/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 px-3 rounded-md text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              tone === "destructive"
                ? "h-8 px-3 rounded-md bg-destructive text-destructive-foreground text-[12.5px] font-medium"
                : "h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] font-medium"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Assign campaign dialog ---------- */

const CAMPAIGN_CANDIDATES = [
  { name: "Spring product launch — IN", window: "Apr 1 – May 15", spots: 4 },
  { name: "Developer webinar series Q3", window: "Jul 8 – Aug 30", spots: 2 },
  { name: "Founders podcast — Season 4", window: "Open enrollment", spots: 8 },
  { name: "Coupon: SAVE20 — affiliate push", window: "Always-on", spots: 12 },
];

function AssignCampaignDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Assign creator to campaign"
      className="fixed inset-0 z-[60] grid place-items-center"
    >
      <div className="absolute inset-0 bg-foreground/40" onClick={onCancel} />
      <div className="relative w-full max-w-[560px] mx-4 rounded-lg border border-border bg-surface shadow-xl overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-border flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
              Creator workspace
            </div>
            <h3 className="text-[15px] font-semibold text-foreground mt-0.5">
              Assign to campaign
            </h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto divide-y divide-border">
          {CAMPAIGN_CANDIDATES.map((c) => {
            const active = selected === c.name;
            return (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => setSelected(c.name)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-muted/50 ${active ? "bg-primary/5" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-foreground truncate">{c.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {c.window} · {c.spots} open seat{c.spots === 1 ? "" : "s"}
                    </div>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border ${active ? "bg-primary border-primary" : "border-border"}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="px-5 py-3 border-t border-border bg-surface-muted/40 flex items-center justify-between">
          <div className="text-[11.5px] text-muted-foreground">
            {selected ? "1 campaign selected" : "Select a campaign to continue"}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="h-8 px-3 rounded-md text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => selected && onConfirm(selected)}
              className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-[12.5px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign creator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Ratings moderation drawer ---------- */

function RatingsModerationDrawer({
  ratings,
  onClose,
  onDecide,
}: {
  ratings: RatingItem[];
  onClose: () => void;
  onDecide: (id: string, outcome: "approved" | "rejected", note: string) => void;
}) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const visible = filter === "pending" ? ratings.filter((r) => r.outcome === "pending") : ratings;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-foreground/40" onClick={onClose} />
      <aside className="w-full max-w-[640px] h-full bg-surface border-l border-border shadow-xl flex flex-col">
        <header className="h-12 px-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold leading-none">Ratings moderation</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Approve or reject creator ratings. Decisions are logged to the audit trail.
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="px-4 py-2 border-b border-border flex items-center gap-1.5 bg-surface-muted/40">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-7 px-2.5 rounded-md text-[12px] font-medium ${
                filter === f
                  ? "bg-surface border border-border text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "pending" ? "Pending" : "All"} ({f === "pending" ? ratings.filter((r) => r.outcome === "pending").length : ratings.length})
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {visible.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center">
              <div className="h-10 w-10 mx-auto rounded-full bg-muted grid place-items-center text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="mt-2 text-[13px] font-medium text-foreground">
                No ratings to moderate
              </div>
              <div className="mt-1 text-[12px] text-muted-foreground">
                Nothing is waiting for a decision right now.
              </div>
            </div>
          ) : (
            visible.map((r) => (
              <article
                key={r.id}
                className="rounded-md border border-border bg-background overflow-hidden"
              >
                <header className="px-3 py-2.5 border-b border-border flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-[13px] font-medium text-foreground truncate">
                        {r.reviewer}
                      </div>
                      <RatingOutcomeBadge outcome={r.outcome} />
                    </div>
                    <div className="text-[11.5px] text-muted-foreground mt-0.5">
                      {r.campaign} · {r.submittedAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </header>
                <div className="px-3 py-2.5 text-[12.5px] text-foreground">{r.body}</div>
                {r.flag ? (
                  <div className="mx-3 mb-2 flex items-start gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 p-2 text-[11.5px] text-amber-700 dark:text-amber-400">
                    <Flag className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{r.flag}</span>
                  </div>
                ) : null}
                {r.outcome === "pending" ? (
                  <div className="px-3 pb-3 space-y-2">
                    <label className="block">
                      <span className="block text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1">
                        Moderator note
                      </span>
                      <textarea
                        value={notes[r.id] ?? ""}
                        onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                        rows={2}
                        placeholder="Why are you approving or rejecting this rating? Visible to other moderators."
                        className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-[12.5px] outline-none placeholder:text-muted-foreground"
                      />
                    </label>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onDecide(r.id, "rejected", notes[r.id] ?? "")}
                        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 text-[12.5px] font-medium"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => onDecide(r.id, "approved", notes[r.id] ?? "")}
                        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-[12.5px] font-medium"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> Approve
                      </button>
                    </div>
                  </div>
                ) : r.moderatorNote ? (
                  <div className="px-3 pb-3">
                    <div className="rounded border border-border bg-surface-muted/40 p-2 text-[11.5px] text-muted-foreground">
                      <span className="font-medium text-foreground">Moderator note:</span> {r.moderatorNote}
                    </div>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
        <footer className="px-4 py-2.5 border-t border-border bg-surface-muted/40 flex items-center justify-between">
          <a
            href="/reviews"
            className="text-[12px] inline-flex items-center gap-1 text-primary hover:underline"
          >
            Open full Reviews wall <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={onClose}
            className="h-8 px-3 rounded-md border border-border bg-surface hover:bg-muted text-[12.5px] font-medium"
          >
            Done
          </button>
        </footer>
      </aside>
    </div>
  );
}

function RatingOutcomeBadge({ outcome }: { outcome: RatingItem["outcome"] }) {
  if (outcome === "approved") {
    return (
      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  }
  if (outcome === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium bg-destructive/10 text-destructive border border-destructive/30">
        <X className="h-3 w-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium bg-muted text-muted-foreground border border-border">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}
