import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/ams")({
  head: () => ({ meta: [
    { title: "AMS — Influencer Dashboard" },
    { name: "description", content: "AI assistants for campaigns, content, sales, leads and automation." },
    { property: "og:title", content: "AMS" },
    { property: "og:description", content: "AI assistants for campaigns, content, sales, leads and automation." },
  ]}),
  component: () => <StubPage title="AMS — AI Marketing System" subtitle="Specialized AI assistants for every workflow." icon={Sparkles}
    sections={["Campaign", "Content", "Caption", "Hashtag", "Video", "Sales", "Lead", "Analytics", "Automation"]}
    emptyDescription="AMS is wired to your existing AI System. Connect Software Vala AI to activate the assistants." />,
});
