import { createFileRoute } from "@tanstack/react-router";
import { Code2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/api-center")({
  head: () => ({ meta: [
    { title: "API Center — Creator Dashboard" },
    { name: "description", content: "API keys, webhooks, tokens, usage, logs and security." },
  ]}),
  component: () => <StubPage title="API Center" subtitle="API keys, webhooks, tokens, usage, logs and security controls." icon={Code2}
    sections={["API Keys","Webhooks","Tokens","Usage","Logs","Security"]} />,
});
