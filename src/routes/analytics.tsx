import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3, TrendingUp, Eye, MousePointerClick, Users, ShoppingBag, Wallet,
  Target, Megaphone, Package, FileVideo, Globe,
} from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Influencer Dashboard" },
      { name: "description", content: "Follower, reach, view, lead, sale and commission growth in one place." },
      { property: "og:title", content: "Analytics" },
      { property: "og:description", content: "Follower, reach, view, lead, sale and commission growth in one place." },
    ],
  }),
  component: () => (
    <StubPage
      title="Analytics"
      subtitle="Every growth metric in one command center — followers, reach, views, clicks, leads, sales and commission — segmented by campaign, content and product."
      icon={BarChart3}
      ctaLabel="Connect Software Vala"
      ctaTo="/settings"
      sections={["Overview", "Followers", "Reach", "Views", "Clicks", "Leads", "Sales", "Commission", "Top Campaigns", "Top Content", "Top Products"]}
      kpis={[
        { label: "Followers",   icon: Users,             tint: "text-accent-pink" },
        { label: "Reach",       icon: TrendingUp,        tint: "text-primary-glow" },
        { label: "Views",       icon: Eye,               tint: "text-accent-emerald" },
        { label: "Clicks",      icon: MousePointerClick, tint: "text-accent-amber" },
        { label: "Leads",       icon: Target,            tint: "text-accent-pink" },
        { label: "Sales",       icon: ShoppingBag,       tint: "text-primary-glow" },
      ]}
      features={[
        { icon: Users,             title: "Follower Growth",  description: "Daily / weekly / monthly net follower change, by channel." },
        { icon: TrendingUp,        title: "Reach Growth",     description: "Total accounts reached, broken down by post type and origin." },
        { icon: Eye,               title: "View Growth",      description: "Impressions and watch-time across reels, shorts and videos." },
        { icon: MousePointerClick, title: "Click Growth",     description: "Referral and short-link clicks, source attribution and CTR." },
        { icon: Target,            title: "Lead Growth",      description: "Form fills, signups and qualified leads per campaign." },
        { icon: ShoppingBag,       title: "Sales Growth",     description: "Orders and revenue attributed to your links and codes." },
        { icon: Wallet,            title: "Commission Growth",description: "Earned, pending, approved and paid over time." },
        { icon: Megaphone,         title: "Top Campaigns",    description: "Which campaigns delivered the most reach, leads and revenue." },
        { icon: FileVideo,         title: "Top Content",      description: "Best-performing posts, reels and shorts by KPI." },
        { icon: Package,           title: "Top Products",     description: "Highest converting products in your audience." },
        { icon: Globe,             title: "Audience Geo",     description: "Country, city and language breakdown of your converted audience." },
        { icon: BarChart3,         title: "Custom Reports",   description: "Saved reports and exports for brand and tax submissions." },
      ]}
    />
  ),
});
