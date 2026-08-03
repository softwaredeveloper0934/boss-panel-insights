import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [
    { title: "Marketplace — Creator Dashboard" },
    { name: "description", content: "Featured, trending, top-selling, recommendations and categories." },
  ]}),
  component: () => <StubPage title="Marketplace" subtitle="Featured, trending, top-selling, AI recommendations and categories across the Software Vala marketplace." icon={Store}
    sections={["Featured","Trending","Top Selling","Recommendations","Categories"]} />,
});
