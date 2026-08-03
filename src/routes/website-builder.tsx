import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/website-builder")({
  head: () => ({ meta: [
    { title: "Personal Website Builder — Creator Dashboard" },
    { name: "description", content: "Build a public creator website, portfolio, services and contact pages." },
    { property: "og:title", content: "Personal Website Builder" },
    { property: "og:description", content: "Build a public creator website, portfolio, services and contact pages." },
  ]}),
  component: () => <StubPage title="Personal Website Builder" subtitle="Build a public creator website, portfolio, services and contact pages." icon={Globe}
    sections={["Website", "Portfolio", "Achievements", "Services", "Products", "Contact", ]} />,
});
