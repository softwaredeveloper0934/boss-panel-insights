import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/documentation")({
  head: () => ({ meta: [
    { title: "Documentation — Creator Dashboard" },
    { name: "description", content: "Guides, FAQs, release notes, API docs and downloads." },
  ]}),
  component: () => <StubPage title="Documentation" subtitle="Guides, FAQs, release notes, API docs and downloads for your products." icon={FileText}
    sections={["Guides","FAQs","Release Notes","API Docs","Downloads"]} />,
});
