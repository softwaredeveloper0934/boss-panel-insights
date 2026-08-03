import { createFileRoute } from "@tanstack/react-router";
import { UserCheck } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-applications")({
  head: () => ({ meta: [
    { title: "Creator Applications — Creator Dashboard" },
    { name: "description", content: "Review, score and approve incoming creator applications." },
    { property: "og:title", content: "Creator Applications" },
    { property: "og:description", content: "Review, score and approve incoming creator applications." },
  ]}),
  component: () => <StubPage title="Applications" subtitle="Review, score and approve incoming creator applications." icon={UserCheck}
    sections={["Inbox", "Screening", "Approved", "Rejected"]} />,
});
