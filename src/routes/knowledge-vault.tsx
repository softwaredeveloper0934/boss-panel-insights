import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/knowledge-vault")({
  head: () => ({ meta: [
    { title: "Personal Knowledge Vault — Creator Dashboard" },
    { name: "description", content: "Saved prompts, campaigns, strategies and learnings." },
    { property: "og:title", content: "Personal Knowledge Vault" },
    { property: "og:description", content: "Saved prompts, campaigns, strategies and learnings." },
  ]}),
  component: () => <StubPage title="Personal Knowledge Vault" subtitle="Saved prompts, campaigns, strategies and learnings." icon={BookOpen}
    sections={["Prompts", "Campaigns", "Strategies", "Content", "Learning", ]} />,
});
