import { createFileRoute } from "@tanstack/react-router";
import {
  FileVideo, Instagram, Facebook, Linkedin, MessageCircle, Send, Youtube,
  Music, Hash, Type, Megaphone, Calendar, CheckCircle2, Download,
} from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content Center — Influencer Dashboard" },
      { name: "description", content: "Ready-made captions, reels, scripts, hashtags and downloads for every channel." },
      { property: "og:title", content: "Content Center" },
      { property: "og:description", content: "Ready-made captions, reels, scripts, hashtags and downloads for every channel." },
    ],
  }),
  component: () => (
    <StubPage
      title="Content Center"
      subtitle="Your full content stack — captions, hashtags, reels, shorts, story templates and downloads — every asset ready for every channel."
      icon={FileVideo}
      ctaLabel="Open AI Studio"
      ctaTo="/ai-chat"
      sections={["Ready Made", "Instagram", "Facebook", "LinkedIn", "WhatsApp", "Telegram", "YouTube", "Shorts", "Reels", "TikTok", "Stories", "Captions", "Hashtags", "CTA Library"]}
      kpis={[
        { label: "Assets",     icon: FileVideo,    tint: "text-primary-glow" },
        { label: "Scheduled",  icon: Calendar,     tint: "text-accent-amber" },
        { label: "Published",  icon: CheckCircle2, tint: "text-accent-emerald" },
        { label: "Downloads",  icon: Download,     tint: "text-accent-pink" },
        { label: "Reels",      icon: FileVideo,    tint: "text-primary-glow" },
        { label: "Captions",   icon: Type,         tint: "text-accent-amber" },
      ]}
      features={[
        { icon: Instagram,     title: "Instagram Posts",   description: "Feed, carousel and reel-ready creatives with hooked captions." },
        { icon: Facebook,      title: "Facebook Posts",    description: "Long-form, link posts and community group templates." },
        { icon: Linkedin,      title: "LinkedIn Posts",    description: "Professional formats — thought leadership, case studies, hooks." },
        { icon: MessageCircle, title: "WhatsApp Content",  description: "Status, broadcasts and channel posts with deep links." },
        { icon: Send,          title: "Telegram Content",  description: "Channel posts, polls and link previews built to convert." },
        { icon: Youtube,       title: "YouTube Scripts",   description: "Long-form scripts with hooks, B-roll cues and end-screens." },
        { icon: FileVideo,     title: "Reel & Short Scripts", description: "15s, 30s and 60s scripts engineered for retention and CTAs." },
        { icon: Music,         title: "TikTok Scripts",    description: "Trend-aware hooks, sound cues and on-screen text blocks." },
        { icon: Type,          title: "Caption Library",   description: "Reusable captions sorted by tone, niche and conversion goal." },
        { icon: Hash,          title: "Hashtag Sets",      description: "Curated hashtag bundles by reach, country and category." },
        { icon: Megaphone,     title: "CTA Library",       description: "Tested calls-to-action for every funnel stage and channel." },
        { icon: Download,      title: "Download Center",   description: "Banners, posters, reels, stories, logos and full media kits." },
      ]}
    />
  ),
});
