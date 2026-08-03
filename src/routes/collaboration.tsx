import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/collaboration")({
  head: () => ({ meta: [
    { title: "Collaboration Center — Creator Dashboard" },
    { name: "description", content: "Find brands, products, campaigns and invite team collaborators." },
    { property: "og:title", content: "Collaboration Center" },
    { property: "og:description", content: "Find brands, products, campaigns and invite team collaborators." },
  ]}),
  component: () => <StubPage title="Collaboration Center" subtitle="Find brands, products, campaigns and invite team collaborators." icon={Users}
    sections={["Brands", "Products", "Campaigns", "Invites", "Teams", ]} />,
});
