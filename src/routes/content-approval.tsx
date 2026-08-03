import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/content-approval")({
  head: () => ({ meta: [
    { title: "Content Approval — Creator Dashboard" },
    { name: "description", content: "Draft, review, approve, schedule and publish creator content." },
    { property: "og:title", content: "Content Approval" },
    { property: "og:description", content: "Draft, review, approve, schedule and publish creator content." },
  ]}),
  component: () => <StubPage title="Content Approval" subtitle="Draft, review, approve, schedule and publish creator content." icon={ClipboardCheck}
    sections={["Draft", "Review", "Approved", "Rejected", "Scheduled", "Published", ]} />,
});
