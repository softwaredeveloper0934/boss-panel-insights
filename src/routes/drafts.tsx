import { createFileRoute } from "@tanstack/react-router";
import { FileEdit } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/drafts")({
  head: () => ({ meta: [
    { title: "Drafts — Creator Dashboard" },
    { name: "description", content: "Unpublished products, in-progress edits and scheduled drops." },
  ]}),
  component: () => <StubPage title="Drafts" subtitle="Unpublished products, in-progress edits, AI-generated drafts and scheduled drops." icon={FileEdit}
    sections={["All","Products","Pages","AI Generated","Scheduled","Auto-saved"]} />,
});
