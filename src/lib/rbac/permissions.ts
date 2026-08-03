/**
 * Role-Based Access Control — Permission Registry
 *
 * Every module action used by the UI maps to a permission key here.
 * The Software Vala backend will return the authenticated user's `roles`
 * and (optionally) `permissions`. The frontend resolves permission checks
 * against this registry — no UI changes required when roles change.
 *
 * Convention: `<module>:<action>`
 *   action ∈ view | create | update | delete | export | approve | manage
 */

export type Role =
  | "owner"
  | "admin"
  | "manager"
  | "creator"
  | "editor"
  | "analyst"
  | "finance"
  | "support"
  | "viewer"
  | "guest";

export type Permission =
  // Dashboard / analytics
  | "dashboard:view"
  | "analytics:view"
  | "analytics:export"
  // Catalog
  | "products:view" | "products:create" | "products:update" | "products:delete"
  | "drafts:view" | "drafts:manage"
  | "media:view" | "media:upload" | "media:delete"
  | "brand-assets:view" | "brand-assets:manage"
  | "documentation:view" | "documentation:manage"
  // Commerce
  | "orders:view" | "orders:update" | "orders:export"
  | "customers:view" | "customers:update"
  | "reviews:view" | "reviews:moderate"
  | "licenses:view" | "licenses:manage"
  | "subscriptions:view" | "subscriptions:manage"
  // Finance
  | "revenue:view" | "revenue:export"
  | "wallet:view"
  | "payouts:view" | "payouts:request" | "payouts:approve"
  | "commissions:view" | "commissions:approve"
  | "referrals:view" | "referrals:manage"
  // Marketing
  | "campaigns:view" | "campaigns:manage" | "campaigns:update" | "campaigns:approve"
  | "scheduler:view" | "scheduler:manage"
  | "coupons:view" | "coupons:manage"
  | "promotions:view" | "promotions:manage"
  | "utm:view" | "utm:manage"
  // AI
  | "ai:view" | "ai:run"
  | "ams:view" | "ams:manage"
  | "knowledge-base:view" | "knowledge-base:manage"
  // Operate
  | "messages:view" | "messages:send"
  | "team:view" | "team:manage"
  | "api-center:view" | "api-center:manage"
  // Account
  | "settings:view" | "settings:update"
  | "security:view" | "security:manage"
  | "notifications:view"
  | "audit:view" | "audit:export"
  // Module groups (used by the route-level module access registry)
  | "creator-manager:view" | "creator-manager:manage"
  | "content:view" | "content:manage"
  | "audience:view" | "audience:manage"
  | "referral:view" | "referral:manage"
  | "performance:view"
  | "brand:view" | "brand:manage"
  | "gamification:view"
  | "learn:view"
  | "business:view" | "business:manage"
  | "marketplace:view"
  | "support:view"
  | "profile:view"
  | "activity:view";


/**
 * Default role → permission grants.
 * The backend may override per-tenant; this is the safe default.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[] | "*"> = {
  owner: "*",
  admin: "*",
  manager: [
    "creator-manager:view","creator-manager:manage","content:view","content:manage","audience:view","audience:manage","referral:view","referral:manage","performance:view","brand:view","brand:manage","gamification:view","learn:view","business:view","marketplace:view","support:view","profile:view","activity:view",
    "dashboard:view","analytics:view","analytics:export",
    "products:view","products:create","products:update",
    "drafts:view","drafts:manage","media:view","media:upload",
    "brand-assets:view","documentation:view",
    "orders:view","orders:update","orders:export",
    "customers:view","reviews:view","reviews:moderate",
    "licenses:view","subscriptions:view",
    "revenue:view","wallet:view","payouts:view","commissions:view","referrals:view",
    "campaigns:view","campaigns:manage","scheduler:view","scheduler:manage",
    "coupons:view","coupons:manage","promotions:view","promotions:manage",
    "utm:view","utm:manage",
    "ai:view","ai:run","ams:view","knowledge-base:view",
    "messages:view","messages:send","team:view","api-center:view",
    "settings:view","security:view","notifications:view",
    "audit:view","audit:export",
  ],
  creator: [
    "content:view","content:manage","audience:view","audience:manage","referral:view","referral:manage","performance:view","brand:view","brand:manage","gamification:view","learn:view","marketplace:view","support:view","profile:view","activity:view",
    "dashboard:view","analytics:view",
    "products:view","products:create","products:update",
    "drafts:view","drafts:manage","media:view","media:upload",
    "brand-assets:view","documentation:view",
    "orders:view","customers:view","reviews:view",
    "licenses:view","subscriptions:view",
    "revenue:view","wallet:view","payouts:view","payouts:request","commissions:view","referrals:view",
    "campaigns:view","campaigns:manage","scheduler:view","scheduler:manage",
    "coupons:view","promotions:view","utm:view","utm:manage",
    "ai:view","ai:run","ams:view","knowledge-base:view",
    "messages:view","messages:send","team:view",
    "settings:view","settings:update","security:view","security:manage","notifications:view",
  ],
  editor: [
    "content:view","content:manage","audience:view","brand:view","gamification:view","learn:view","profile:view","support:view","activity:view",
    "dashboard:view","analytics:view",
    "products:view","products:update","drafts:view","drafts:manage",
    "media:view","media:upload","brand-assets:view","documentation:view","documentation:manage",
    "reviews:view","reviews:moderate",
    "campaigns:view","campaigns:manage","scheduler:view","scheduler:manage",
    "ai:view","ai:run","knowledge-base:view","knowledge-base:manage",
    "messages:view","messages:send","notifications:view","settings:view",
  ],
  analyst: [
    "content:view","performance:view","business:view","brand:view","learn:view","profile:view","activity:view",
    "dashboard:view","analytics:view","analytics:export",
    "products:view","orders:view","orders:export","customers:view","reviews:view",
    "licenses:view","subscriptions:view","revenue:view","revenue:export",
    "commissions:view","referrals:view","campaigns:view","scheduler:view",
    "utm:view","ai:view","knowledge-base:view","notifications:view","settings:view",
  ],
  finance: [
    "business:view","performance:view","support:view","profile:view","activity:view",
    "dashboard:view","analytics:view",
    "orders:view","orders:export","customers:view","licenses:view","subscriptions:view","subscriptions:manage",
    "revenue:view","revenue:export","wallet:view",
    "payouts:view","payouts:request","payouts:approve",
    "commissions:view","referrals:view","notifications:view","settings:view",
    "audit:view","audit:export",
  ],
  support: [
    "support:view","audience:view","learn:view","profile:view","activity:view",
    "dashboard:view","orders:view","customers:view","customers:update",
    "reviews:view","reviews:moderate","licenses:view","subscriptions:view",
    "messages:view","messages:send","knowledge-base:view","notifications:view","settings:view",
  ],
  viewer: [
    "content:view","performance:view","brand:view","gamification:view","learn:view","profile:view",
    "dashboard:view","analytics:view","products:view","orders:view","customers:view",
    "reviews:view","revenue:view","campaigns:view","notifications:view","settings:view",
  ],
  guest: [],
};

export function resolvePermissions(roles: Role[]): Set<Permission> {
  const set = new Set<Permission>();
  for (const r of roles) {
    const grants = ROLE_PERMISSIONS[r];
    if (grants === "*") {
      // wildcard — mark with sentinel via has() override path below
      return new Set<Permission>(["__ALL__" as Permission]);
    }
    for (const p of grants) set.add(p);
  }
  return set;
}

export function permissionSetHas(set: Set<Permission>, p: Permission): boolean {
  return set.has("__ALL__" as Permission) || set.has(p);
}
