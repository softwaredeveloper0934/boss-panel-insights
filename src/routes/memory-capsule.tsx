import { createFileRoute } from "@tanstack/react-router";
import { Album } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/memory-capsule")({
  head: () => ({ meta: [
    { title: "Memory Capsule — Creator Dashboard" },
    { name: "description", content: "Year-end report, growth journey, achievement and sales history." },
    { property: "og:title", content: "Memory Capsule" },
    { property: "og:description", content: "Year-end report, growth journey, achievement and sales history." },
  ]}),
  component: () => <StubPage title="Memory Capsule" subtitle="Year-end report, growth journey, achievement and sales history." icon={Album}
    sections={["Year End", "Growth", "Achievements", "Sales", ]} />,
});
