import { createFileRoute } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/success-playbook")({
  head: () => ({ meta: [
    { title: "Success Playbook — Creator Dashboard" },
    { name: "description", content: "Top campaigns, content, winning strategies and best practices." },
    { property: "og:title", content: "Success Playbook" },
    { property: "og:description", content: "Top campaigns, content, winning strategies and best practices." },
  ]}),
  component: () => <StubPage title="Success Playbook" subtitle="Top campaigns, content, winning strategies and best practices." icon={BookMarked}
    sections={["Campaigns", "Content", "Strategies", "Best Practices", ]} />,
});
