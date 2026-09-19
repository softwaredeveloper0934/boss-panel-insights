import type { FieldDef } from "@/components/influencer/record-form-dialog";
import type { ColumnDef } from "@/components/influencer/records-surface";
import { countWhere, distinct, money, num, sumBy, type AnyRow, type TableName } from "@/lib/use-records";

export type RecordConfig = {
  table: TableName;
  title: string;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  kpis: (rows: AnyRow[]) => Record<string, string>;
};

const thisMonth = (value: unknown) => {
  if (!value) return false;
  const d = new Date(String(value));
  const now = new Date();
  return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
};

const today = (value: unknown) => {
  if (!value) return false;
  return new Date(String(value)).toDateString() === new Date().toDateString();
};

const avg = (rows: AnyRow[], field: string) =>
  rows.length ? sumBy(rows, field) / rows.length : 0;

/* ------------------------------- Applications ------------------------------ */

export const APPLICATION_STAGES = [
  "submitted",
  "identity",
  "kyc",
  "social",
  "audience",
  "brand",
  "interview",
  "agreement",
  "approved",
  "rejected",
] as const;

export const applicationsConfig: RecordConfig = {
  table: "applications",
  title: "Application queue",
  addLabel: "Submit application",
  emptyTitle: "No applications yet",
  emptyDescription:
    "Submit a creator application and it will appear here for triage, KYC and brand review.",
  fields: [
    { name: "full_name", label: "Full name", required: true },
    { name: "handle", label: "Handle", required: true, placeholder: "@creator" },
    { name: "email", label: "Email", kind: "email" },
    { name: "country", label: "Country" },
    { name: "platform", label: "Platform", kind: "select", options: ["Instagram", "YouTube", "TikTok", "X", "LinkedIn", "Facebook"] },
    { name: "followers", label: "Followers", kind: "number" },
    { name: "categories", label: "Categories", kind: "list", placeholder: "Tech, Finance" },
    { name: "source", label: "Source", kind: "select", options: ["direct", "referral", "marketplace", "outreach"] },
    { name: "stage", label: "Stage", kind: "select", options: APPLICATION_STAGES },
    { name: "risk_score", label: "Risk score", kind: "number" },
    { name: "reviewer", label: "Reviewer" },
    { name: "reviewer_note", label: "Reviewer note", kind: "textarea" },
  ],
  columns: [
    { key: "full_name", label: "Applicant" },
    { key: "handle", label: "Handle" },
    { key: "country", label: "Country" },
    { key: "platform", label: "Platform" },
    { key: "followers", label: "Followers", kind: "number", align: "right" },
    { key: "source", label: "Source", kind: "badge" },
    { key: "stage", label: "Stage", kind: "badge" },
    { key: "risk_score", label: "Risk", kind: "number", align: "right" },
    { key: "created_at", label: "Submitted", kind: "date" },
  ],
  kpis: (rows) => ({
    Submitted: num(countWhere(rows, "stage", "submitted")),
    "In Review": num(
      rows.filter((r) => !["submitted", "approved", "rejected"].includes(String(r["stage"]))).length,
    ),
    "Awaiting KYC": num(countWhere(rows, "stage", "kyc")),
    "Approved Today": num(
      rows.filter((r) => r["stage"] === "approved" && today(r["updated_at"])).length,
    ),
    "Rejected Today": num(
      rows.filter((r) => r["stage"] === "rejected" && today(r["updated_at"])).length,
    ),
    "Average Review Time": rows.length
      ? `${(
          rows.reduce(
            (a, r) =>
              a +
              (new Date(String(r["updated_at"])).getTime() -
                new Date(String(r["created_at"])).getTime()) /
                3_600_000,
            0,
          ) / rows.length
        ).toFixed(1)}h`
      : "0h",
  }),
};

/* -------------------------------- Campaigns -------------------------------- */

export const campaignsConfig: RecordConfig = {
  table: "campaigns",
  title: "Campaigns",
  addLabel: "Create campaign",
  emptyTitle: "No campaigns yet",
  emptyDescription:
    "Create your first campaign with budget, schedule and approval rules — then assign creators to it.",
  fields: [
    { name: "name", label: "Campaign name", required: true },
    { name: "brand_name", label: "Brand" },
    { name: "objective", label: "Objective", kind: "select", options: ["awareness", "traffic", "conversions", "sales", "retention"] },
    { name: "budget", label: "Budget", kind: "number" },
    { name: "spent", label: "Spent", kind: "number" },
    { name: "start_date", label: "Start date", kind: "date" },
    { name: "end_date", label: "End date", kind: "date" },
    { name: "approval", label: "Approval", kind: "select", options: ["pending", "approved", "changes_requested", "rejected"] },
    { name: "status", label: "Status", kind: "select", options: ["draft", "scheduled", "active", "in_review", "completed", "archived"] },
    { name: "brief", label: "Brief", kind: "textarea" },
  ],
  columns: [
    { key: "name", label: "Campaign" },
    { key: "brand_name", label: "Brand" },
    { key: "objective", label: "Objective", kind: "badge" },
    { key: "budget", label: "Budget", kind: "money", align: "right" },
    { key: "spent", label: "Spent", kind: "money", align: "right" },
    { key: "start_date", label: "Start", kind: "date" },
    { key: "end_date", label: "End", kind: "date" },
    { key: "approval", label: "Approval", kind: "badge" },
    { key: "status", label: "Status", kind: "badge" },
  ],
  kpis: (rows) => ({
    Active: num(countWhere(rows, "status", "active")),
    Scheduled: num(countWhere(rows, "status", "scheduled")),
    "In Review": num(countWhere(rows, "status", "in_review")),
    Completed: num(countWhere(rows, "status", "completed")),
    "Budget Allocated": money(sumBy(rows, "budget")),
    "Budget Spent": money(sumBy(rows, "spent")),
  }),
};

/* ---------------------------------- Brands --------------------------------- */

export const brandsConfig: RecordConfig = {
  table: "brands",
  title: "Brands",
  addLabel: "Add brand",
  emptyTitle: "No brands yet",
  emptyDescription: "Add the brands you run campaigns for. Contracts and spend roll up per brand.",
  fields: [
    { name: "name", label: "Brand name", required: true },
    { name: "website", label: "Website" },
    { name: "contact_email", label: "Contact email", kind: "email" },
    { name: "industry", label: "Industry" },
    { name: "country", label: "Country" },
    { name: "status", label: "Status", kind: "select", options: ["active", "onboarding", "paused", "churned"] },
    { name: "notes", label: "Notes", kind: "textarea" },
  ],
  columns: [
    { key: "name", label: "Brand" },
    { key: "industry", label: "Industry" },
    { key: "country", label: "Country" },
    { key: "contact_email", label: "Contact" },
    { key: "website", label: "Website" },
    { key: "status", label: "Status", kind: "badge" },
    { key: "created_at", label: "Added", kind: "date" },
  ],
  kpis: (rows) => ({
    "Total Brands": num(rows.length),
    Active: num(countWhere(rows, "status", "active")),
    "In Onboarding": num(countWhere(rows, "status", "onboarding")),
    "Contracts Expiring": num(0),
    "Live Campaigns": num(0),
    "Committed Spend": money(0),
  }),
};

/* ------------------------------ Collaborations ----------------------------- */

export const collaborationsConfig: RecordConfig = {
  table: "collaborations",
  title: "Collaborations",
  addLabel: "Add collaboration",
  emptyTitle: "No collaborations yet",
  emptyDescription: "Track deals between brands and creators from proposal to completion.",
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "type", label: "Type", kind: "select", options: ["sponsored_post", "affiliate", "ambassador", "event", "barter"] },
    { name: "value", label: "Deal value", kind: "number" },
    { name: "start_date", label: "Start date", kind: "date" },
    { name: "end_date", label: "End date", kind: "date" },
    { name: "status", label: "Status", kind: "select", options: ["proposed", "negotiating", "active", "completed", "rejected"] },
    { name: "notes", label: "Notes", kind: "textarea" },
  ],
  columns: [
    { key: "title", label: "Collaboration" },
    { key: "type", label: "Type", kind: "badge" },
    { key: "value", label: "Value", kind: "money", align: "right" },
    { key: "start_date", label: "Start", kind: "date" },
    { key: "end_date", label: "End", kind: "date" },
    { key: "status", label: "Status", kind: "badge" },
  ],
  kpis: (rows) => ({
    Requests: num(countWhere(rows, "status", "proposed")),
    "In Negotiation": num(countWhere(rows, "status", "negotiating")),
    "Active Deals": num(countWhere(rows, "status", "active")),
    Completed: num(countWhere(rows, "status", "completed")),
    Rejected: num(countWhere(rows, "status", "rejected")),
    "Total Value": money(sumBy(rows, "value")),
  }),
};

/* ----------------------------- Social accounts ---------------------------- */

export const socialAccountsConfig: RecordConfig = {
  table: "social_accounts",
  title: "Connected accounts",
  addLabel: "Connect account",
  emptyTitle: "No social accounts connected",
  emptyDescription: "Add a creator's platform profile to track followers, engagement and verification.",
  fields: [
    { name: "platform", label: "Platform", required: true, kind: "select", options: ["Instagram", "YouTube", "TikTok", "X", "LinkedIn", "Facebook"] },
    { name: "handle", label: "Handle", required: true },
    { name: "profile_url", label: "Profile URL" },
    { name: "followers", label: "Followers", kind: "number" },
    { name: "engagement_rate", label: "Engagement rate %", kind: "number" },
    { name: "verification", label: "Verification", kind: "select", options: ["unverified", "pending", "verified", "rejected"] },
    { name: "status", label: "Status", kind: "select", options: ["connected", "sync_error", "disconnected"] },
  ],
  columns: [
    { key: "platform", label: "Platform" },
    { key: "handle", label: "Handle" },
    { key: "followers", label: "Followers", kind: "number", align: "right" },
    { key: "engagement_rate", label: "Engagement", kind: "number", align: "right" },
    { key: "verification", label: "Verification", kind: "badge" },
    { key: "status", label: "Status", kind: "badge" },
  ],
  kpis: (rows) => ({
    "Connected Accounts": num(countWhere(rows, "status", "connected")),
    "Verified Handles": num(countWhere(rows, "verification", "verified")),
    Platforms: num(distinct(rows, "platform")),
    "Followers (sum)": num(sumBy(rows, "followers")),
    "Avg. Engagement": `${avg(rows, "engagement_rate").toFixed(2)}%`,
    "Sync Issues": num(countWhere(rows, "status", "sync_error")),
  }),
};

/* ---------------------------------- Content -------------------------------- */

export const contentConfig: RecordConfig = {
  table: "content_items",
  title: "Content library",
  addLabel: "Add content",
  emptyTitle: "No content yet",
  emptyDescription: "Add creator deliverables to review, schedule and measure them.",
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "type", label: "Type", kind: "select", options: ["post", "reel", "story", "video", "blog", "live"] },
    { name: "platform", label: "Platform", kind: "select", options: ["Instagram", "YouTube", "TikTok", "X", "LinkedIn", "Facebook"] },
    { name: "asset_url", label: "Asset URL" },
    { name: "scheduled_at", label: "Scheduled", kind: "datetime" },
    { name: "published_at", label: "Published", kind: "datetime" },
    { name: "approval", label: "Approval", kind: "select", options: ["pending", "approved", "rejected"] },
    { name: "status", label: "Status", kind: "select", options: ["draft", "scheduled", "published", "archived"] },
    { name: "views", label: "Views", kind: "number" },
    { name: "likes", label: "Likes", kind: "number" },
    { name: "comments", label: "Comments", kind: "number" },
    { name: "clicks", label: "Clicks", kind: "number" },
  ],
  columns: [
    { key: "title", label: "Title" },
    { key: "type", label: "Type", kind: "badge" },
    { key: "platform", label: "Platform" },
    { key: "scheduled_at", label: "Scheduled", kind: "date" },
    { key: "published_at", label: "Published", kind: "date" },
    { key: "views", label: "Views", kind: "number", align: "right" },
    { key: "clicks", label: "Clicks", kind: "number", align: "right" },
    { key: "approval", label: "Approval", kind: "badge" },
    { key: "status", label: "Status", kind: "badge" },
  ],
  kpis: (rows) => ({
    Items: num(rows.length),
    Approved: num(countWhere(rows, "approval", "approved")),
    "Pending Review": num(countWhere(rows, "approval", "pending")),
    Rejected: num(countWhere(rows, "approval", "rejected")),
    Downloads: num(0),
    "Storage Used": `${rows.filter((r) => r["asset_url"]).length} assets`,
  }),
};

export const contentPerformanceKpis = (rows: AnyRow[]): Record<string, string> => {
  const impressions = sumBy(rows, "views");
  const clicks = sumBy(rows, "clicks");
  const engagements = sumBy(rows, "likes") + sumBy(rows, "comments");
  return {
    "Followers Growth": num(0),
    Engagement: num(engagements),
    Reach: num(impressions),
    Impressions: num(impressions),
    Clicks: num(clicks),
    CTR: impressions ? `${((clicks / impressions) * 100).toFixed(2)}%` : "0%",
    Revenue: money(0),
    ROI: "0%",
  };
};

/* --------------------------------- Payouts -------------------------------- */

export const payoutsConfig: RecordConfig = {
  table: "payouts",
  title: "Payouts",
  addLabel: "Create payout",
  emptyTitle: "No payouts yet",
  emptyDescription: "Create a payout to record what was paid out, how and when.",
  fields: [
    { name: "amount", label: "Amount", kind: "number", required: true },
    { name: "currency", label: "Currency", kind: "select", options: ["USD", "EUR", "GBP", "INR", "AED"] },
    { name: "method", label: "Method", kind: "select", options: ["bank_transfer", "upi", "paypal", "wise", "crypto"] },
    { name: "period", label: "Period", placeholder: "2026-09" },
    { name: "reference", label: "Reference" },
    { name: "status", label: "Status", kind: "select", options: ["pending", "awaiting_approval", "scheduled", "paid", "failed"] },
    { name: "paid_at", label: "Paid at", kind: "datetime" },
  ],
  columns: [
    { key: "amount", label: "Amount", kind: "money", align: "right" },
    { key: "currency", label: "Currency" },
    { key: "method", label: "Method", kind: "badge" },
    { key: "period", label: "Period" },
    { key: "reference", label: "Reference" },
    { key: "status", label: "Status", kind: "badge" },
    { key: "paid_at", label: "Paid", kind: "date" },
  ],
  kpis: (rows) => ({
    "Pending Requests": num(countWhere(rows, "status", "pending")),
    "Awaiting Approval": num(countWhere(rows, "status", "awaiting_approval")),
    Scheduled: num(countWhere(rows, "status", "scheduled")),
    "Paid (MTD)": money(
      rows.filter((r) => r["status"] === "paid" && thisMonth(r["paid_at"])).reduce((a, r) => a + Number(r["amount"] ?? 0), 0),
    ),
    Failed: num(countWhere(rows, "status", "failed")),
    "Total Amount": money(sumBy(rows, "amount")),
  }),
};

/* --------------------------------- Wallet --------------------------------- */

export const walletConfig: RecordConfig = {
  table: "wallet_transactions",
  title: "Wallet ledger",
  addLabel: "Add transaction",
  emptyTitle: "No wallet activity yet",
  emptyDescription: "Every credit and debit you record appears here as an auditable ledger entry.",
  fields: [
    { name: "direction", label: "Direction", kind: "select", options: ["credit", "debit"] },
    { name: "amount", label: "Amount", kind: "number", required: true },
    { name: "currency", label: "Currency", kind: "select", options: ["USD", "EUR", "GBP", "INR", "AED"] },
    { name: "category", label: "Category", kind: "select", options: ["commission", "bonus", "payout", "adjustment", "hold", "refund"] },
    { name: "reference", label: "Reference" },
    { name: "status", label: "Status", kind: "select", options: ["posted", "pending", "hold", "reversed"] },
    { name: "description", label: "Description", kind: "textarea" },
  ],
  columns: [
    { key: "created_at", label: "Date", kind: "date" },
    { key: "direction", label: "Direction", kind: "badge" },
    { key: "category", label: "Category", kind: "badge" },
    { key: "amount", label: "Amount", kind: "money", align: "right" },
    { key: "currency", label: "Currency" },
    { key: "reference", label: "Reference" },
    { key: "status", label: "Status", kind: "badge" },
  ],
  kpis: (rows) => {
    const signed = (r: AnyRow) => (r["direction"] === "debit" ? -1 : 1) * Number(r["amount"] ?? 0);
    const balance = rows.filter((r) => r["status"] === "posted").reduce((a, r) => a + signed(r), 0);
    const hold = rows.filter((r) => r["status"] === "hold").reduce((a, r) => a + Number(r["amount"] ?? 0), 0);
    const pending = rows.filter((r) => r["status"] === "pending").reduce((a, r) => a + Number(r["amount"] ?? 0), 0);
    return {
      "Total Balance": money(balance + hold),
      Available: money(balance),
      "On Hold": money(hold),
      Reserved: money(pending),
      Currencies: num(distinct(rows, "currency")),
      Reconciled: `${rows.length ? Math.round((countWhere(rows, "status", "posted") / rows.length) * 100) : 0}%`,
    };
  },
};

export const commissionsKpis = (rows: AnyRow[]): Record<string, string> => {
  const commission = rows.filter((r) => r["category"] === "commission");
  return {
    Pending: money(commission.filter((r) => r["status"] === "pending").reduce((a, r) => a + Number(r["amount"] ?? 0), 0)),
    Approved: money(commission.filter((r) => r["status"] === "posted").reduce((a, r) => a + Number(r["amount"] ?? 0), 0)),
    "Paid (MTD)": money(
      commission.filter((r) => r["status"] === "posted" && thisMonth(r["created_at"])).reduce((a, r) => a + Number(r["amount"] ?? 0), 0),
    ),
    Adjustments: money(rows.filter((r) => r["category"] === "adjustment").reduce((a, r) => a + Number(r["amount"] ?? 0), 0)),
    Disputed: money(rows.filter((r) => r["status"] === "reversed").reduce((a, r) => a + Number(r["amount"] ?? 0), 0)),
    "Avg. Rate": commission.length ? money(avg(commission, "amount")) : money(0),
  };
};

/* --------------------------------- Rewards -------------------------------- */

export const rewardsConfig: RecordConfig = {
  table: "rewards",
  title: "Rewards",
  addLabel: "Grant reward",
  emptyTitle: "No rewards yet",
  emptyDescription: "Grant points, bonuses and badges — every grant is stored and counted here.",
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "kind", label: "Kind", kind: "select", options: ["reward", "badge", "milestone", "bonus"] },
    { name: "points", label: "Points", kind: "number" },
    { name: "value", label: "Value", kind: "number" },
    { name: "status", label: "Status", kind: "select", options: ["granted", "pending", "redeemed", "expired"] },
    { name: "awarded_at", label: "Awarded at", kind: "datetime" },
    { name: "notes", label: "Notes", kind: "textarea" },
  ],
  columns: [
    { key: "title", label: "Reward" },
    { key: "kind", label: "Kind", kind: "badge" },
    { key: "points", label: "Points", kind: "number", align: "right" },
    { key: "value", label: "Value", kind: "money", align: "right" },
    { key: "status", label: "Status", kind: "badge" },
    { key: "awarded_at", label: "Awarded", kind: "date" },
  ],
  kpis: (rows) => ({
    "Active Rewards": num(countWhere(rows, "status", "granted")),
    "Awarded This Month": num(rows.filter((r) => thisMonth(r["awarded_at"])).length),
    Recipients: num(distinct(rows, "influencer_id")),
    "Value Awarded": money(sumBy(rows, "value")),
    "Pending Claims": num(countWhere(rows, "status", "pending")),
    Redeemed: num(countWhere(rows, "status", "redeemed")),
  }),
};

export const achievementsKpis = (rows: AnyRow[]): Record<string, string> => ({
  Badges: num(countWhere(rows, "kind", "badge")),
  Milestones: num(countWhere(rows, "kind", "milestone")),
  "Ranked Creators": num(distinct(rows, "influencer_id")),
  "Top Rank Holders": num(rows.filter((r) => Number(r["points"] ?? 0) >= 1000).length),
  "Awarded This Month": num(rows.filter((r) => thisMonth(r["awarded_at"])).length),
  "Pending Reviews": num(countWhere(rows, "status", "pending")),
});

/* ------------------------------- Verification ----------------------------- */

export const verificationConfig: RecordConfig = {
  table: "verification_requests",
  title: "Verification requests",
  addLabel: "New request",
  emptyTitle: "No verification requests yet",
  emptyDescription: "Log identity, KYC, social and audience checks and record each decision.",
  fields: [
    { name: "kind", label: "Kind", kind: "select", options: ["identity", "kyc", "social", "audience", "tax"] },
    { name: "document_type", label: "Document type", kind: "select", options: ["passport", "national_id", "driving_licence", "address_proof", "tax_form", "other"] },
    { name: "document_url", label: "Document URL" },
    { name: "reviewer", label: "Reviewer" },
    { name: "decision", label: "Decision", kind: "select", options: ["pending", "in_review", "verified", "rejected"] },
    { name: "reviewed_at", label: "Reviewed at", kind: "datetime" },
    { name: "notes", label: "Notes", kind: "textarea" },
  ],
  columns: [
    { key: "kind", label: "Kind", kind: "badge" },
    { key: "document_type", label: "Document", kind: "badge" },
    { key: "reviewer", label: "Reviewer" },
    { key: "decision", label: "Decision", kind: "badge" },
    { key: "submitted_at", label: "Submitted", kind: "date" },
    { key: "reviewed_at", label: "Reviewed", kind: "date" },
  ],
  kpis: (rows) => ({
    Pending: num(countWhere(rows, "decision", "pending")),
    "In Review": num(countWhere(rows, "decision", "in_review")),
    Verified: num(countWhere(rows, "decision", "verified")),
    Rejected: num(countWhere(rows, "decision", "rejected")),
    "Expiring Soon": num(0),
    "Avg. Review Time": (() => {
      const done = rows.filter((r) => r["reviewed_at"]);
      if (!done.length) return "0h";
      const hours =
        done.reduce(
          (a, r) =>
            a +
            (new Date(String(r["reviewed_at"])).getTime() -
              new Date(String(r["submitted_at"])).getTime()) /
              3_600_000,
          0,
        ) / done.length;
      return `${hours.toFixed(1)}h`;
    })(),
  }),
};
