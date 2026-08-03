/**
 * Module Access Registry — the single source of truth for which permission
 * a module (route) requires. Every route in the app must be listed here.
 *
 * The route guard in `__root.tsx` resolves the current pathname against this
 * map and renders the 403 panel when the signed-in user lacks the permission.
 * The sidebar uses the same map to hide modules the user cannot open.
 */
import type { Permission } from "./permissions";

export const MODULE_PERMISSIONS: Record<string, Permission> = {
  "/": "dashboard:view",

  // Creator Manager
  "/creator-manager": "creator-manager:view",
  "/creators": "creator-manager:view",
  "/creator-onboarding": "creator-manager:manage",
  "/creator-applications": "creator-manager:manage",
  "/creator-assignments": "creator-manager:manage",
  "/creator-tasks": "creator-manager:manage",
  "/creator-performance": "creator-manager:view",
  "/creator-payouts": "payouts:view",
  "/creator-tiers": "creator-manager:view",
  "/creator-compliance": "creator-manager:manage",
  "/creator-support-desk": "creator-manager:view",
  "/creator-reports": "creator-manager:view",
  "/creator-map": "creator-manager:view",
  "/creator-crm": "creator-manager:view",

  // Promote
  "/marketplace": "marketplace:view",
  "/campaigns": "campaigns:view",
  "/campaign-scheduler": "scheduler:view",
  "/marketing": "campaigns:view",
  "/products": "products:view",
  "/brand-collaboration": "campaigns:view",
  "/sponsorship": "campaigns:view",
  "/collaboration": "campaigns:view",
  "/contracts": "campaigns:view",
  "/booking": "campaigns:view",
  "/leads": "customers:view",

  // Content
  "/content": "content:view",
  "/content-center": "content:view",
  "/content-calendar": "content:view",
  "/content-approval": "content:manage",
  "/content-vault": "content:view",
  "/download-center": "content:view",
  "/media-library": "media:view",
  "/brand-assets": "brand-assets:view",
  "/thumbnail-generator": "content:manage",
  "/banner-generator": "content:manage",
  "/media-kit": "content:view",
  "/press-kit": "content:view",
  "/drafts": "drafts:view",
  "/assets-vault": "content:view",
  "/documentation": "documentation:view",

  // Audience
  "/social-accounts": "audience:view",
  "/multi-channel": "audience:view",
  "/fan-club": "audience:view",
  "/creator-subscriptions": "subscriptions:view",
  "/influence-map": "audience:view",
  "/inbox": "messages:view",
  "/messages": "messages:view",

  // Referral
  "/referrals": "referrals:view",
  "/short-links": "referral:view",
  "/utm-builder": "utm:view",
  "/qr": "referral:view",
  "/link-in-bio": "referral:view",

  // Performance
  "/live-performance": "performance:view",
  "/sales": "orders:view",
  "/commissions": "commissions:view",
  "/analytics": "analytics:view",
  "/top-content": "performance:view",
  "/competitor-insights": "performance:view",
  "/market-intelligence": "performance:view",
  "/opportunity-engine": "performance:view",

  // Finance
  "/creator-banking": "wallet:view",
  "/wallet": "wallet:view",
  "/revenue": "revenue:view",
  "/payouts": "payouts:view",
  "/withdrawals": "payouts:view",
  "/media-value": "revenue:view",
  "/loyalty": "performance:view",

  // Rank & Awards
  "/leaderboard": "gamification:view",
  "/rank": "gamification:view",
  "/creator-levels": "gamification:view",
  "/prestige": "gamification:view",
  "/achievements": "gamification:view",
  "/trophy-room": "gamification:view",
  "/hall-of-fame": "gamification:view",
  "/award-ceremony": "gamification:view",
  "/record-book": "gamification:view",
  "/founder-spotlight": "gamification:view",
  "/secret-achievements": "gamification:view",
  "/challenges": "gamification:view",
  "/streaks": "gamification:view",
  "/memory-capsule": "gamification:view",

  // Brand
  "/personal-brand": "brand:view",
  "/social-score": "brand:view",
  "/power-score": "brand:view",
  "/creator-economy-score": "brand:view",
  "/brand-safety": "brand:view",
  "/reputation": "brand:view",
  "/creator-dna": "brand:view",
  "/profile": "profile:view",
  "/creator-passport": "profile:view",
  "/influencer-store": "brand:manage",
  "/website-builder": "brand:manage",
  "/verification": "profile:view",

  // AI
  "/ai-studio": "ai:view",
  "/ai-chat": "ai:view",
  "/ams": "ams:view",
  "/ai-tools": "ai:view",
  "/digital-twin": "ai:view",
  "/ai-social-manager": "ai:view",
  "/ai-community-manager": "ai:view",
  "/ai-sales-agent": "ai:view",
  "/ai-brand-negotiator": "ai:view",
  "/ai-avatar": "ai:view",
  "/ai-content-factory": "ai:view",
  "/ai-video-factory": "ai:view",
  "/ai-podcast-factory": "ai:view",
  "/ai-newsroom": "ai:view",
  "/brand-matching": "ai:view",
  "/creator-intelligence": "ai:view",
  "/enterprise-chat": "messages:view",
  "/knowledge-base": "knowledge-base:view",

  // Learn & Events
  "/academy": "learn:view",
  "/creator-university": "learn:view",
  "/knowledge-vault": "learn:view",
  "/success-playbook": "learn:view",
  "/events": "learn:view",
  "/creator-tv": "learn:view",
  "/calendar": "learn:view",

  // Business
  "/command-center": "business:view",
  "/ceo-dashboard": "business:view",
  "/cfo-dashboard": "revenue:view",
  "/growth-dashboard": "business:view",
  "/creator-erp": "business:manage",
  "/creator-marketplace": "marketplace:view",
  "/creator-app-store": "marketplace:view",
  "/company-mode": "business:manage",
  "/agency-mode": "business:manage",
  "/white-label": "business:manage",
  "/employees": "team:view",
  "/team": "team:view",
  "/api-center": "api-center:view",

  // Commerce
  "/orders": "orders:view",
  "/customers": "customers:view",
  "/reviews": "reviews:view",
  "/licenses": "licenses:view",
  "/subscriptions": "subscriptions:view",
  "/coupons": "coupons:view",
  "/promotions": "promotions:view",

  // Account
  "/activity": "activity:view",
  "/audit-log": "audit:view",
  "/notifications": "notifications:view",
  "/security": "security:view",
  "/settings": "settings:view",
  "/support": "support:view",
};

/** Resolve the required permission for a pathname (longest-prefix match). */
export function permissionForPath(pathname: string): Permission | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (MODULE_PERMISSIONS[clean]) return MODULE_PERMISSIONS[clean];
  let best: { path: string; perm: Permission } | null = null;
  for (const [path, perm] of Object.entries(MODULE_PERMISSIONS)) {
    if (path === "/") continue;
    if (clean.startsWith(path + "/") && (!best || path.length > best.path.length)) {
      best = { path, perm };
    }
  }
  return best?.perm ?? null;
}
