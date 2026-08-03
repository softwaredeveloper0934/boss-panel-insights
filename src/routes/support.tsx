import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [
    { title: "Support — Influencer Dashboard" },
    { name: "description", content: "Get help, contact the team and read the docs." },
    { property: "og:title", content: "Support" },
    { property: "og:description", content: "Get help, contact the team and read the docs." },
  ]}),
  component: () => <StubPage title="Support" subtitle="Reach the Software Vala team and browse help articles." icon={LifeBuoy}
    sections={["Help Center", "Contact", "Docs", "Status"]} />,
});
