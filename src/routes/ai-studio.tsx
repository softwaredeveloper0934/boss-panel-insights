import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Bot, Wand2, FileText, Image as ImageIcon, Video, Languages, BadgeDollarSign, History, BookOpen, Settings as SettingsIcon, ScrollText } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ai-studio")({
  head: () => ({ meta: [
    { title: "AI Studio — Creator Dashboard" },
    { name: "description", content: "AI Studio: chat, writers, generators, translation, pricing, audits and multi-model BYOK." },
  ]}),
  component: () => <StubPage title="AI Studio" subtitle="Unified AI workspace — chat, writers, generators, audits and BYOK across GPT, Claude, Gemini, DeepSeek, Llama, Mistral and Grok." icon={Sparkles}
    sections={["AI Chat","Product Writer","SEO","Description","Banner","Screenshot","Video","Translation","Pricing","Changelog","Release Notes","Marketing Copy","Product Audit","Prompt Library","Templates","History","Memory","Multi Models","BYOK","Settings"]}
    features={[
      { icon: Bot, title: "AI Chat", description: "Conversational assistant tuned to your products and catalog." },
      { icon: FileText, title: "AI Product Writer", description: "Long-form product pages, features and benefits in seconds." },
      { icon: Wand2, title: "AI SEO", description: "Titles, meta, schema and keyword suggestions per product." },
      { icon: ImageIcon, title: "Banner & Screenshot", description: "On-brand banners and product screenshots from prompts." },
      { icon: Video, title: "AI Video", description: "Promo videos, demos and shorts from script or product page." },
      { icon: Languages, title: "Translation", description: "Localize product copy across 30+ markets with glossary memory." },
      { icon: BadgeDollarSign, title: "Pricing Suggestion", description: "Region-aware pricing and elasticity insights." },
      { icon: ScrollText, title: "Changelog & Release Notes", description: "Generate consistent changelogs from commits and tickets." },
      { icon: History, title: "History & Memory", description: "Reusable prompt library, templates and per-product memory." },
      { icon: BookOpen, title: "Prompt Library", description: "Curated prompts for SEO, marketing, support and audits." },
      { icon: SettingsIcon, title: "Multi-Model & BYOK", description: "Bring your own keys for GPT, Claude, Gemini, DeepSeek, Llama, Mistral, Grok." },
      { icon: Sparkles, title: "Product Audit", description: "Automated quality, SEO and conversion audits per product." },
    ]} />,
});
