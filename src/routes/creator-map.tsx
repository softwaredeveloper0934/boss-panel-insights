import { createFileRoute } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-map")({
  head: () => ({ meta: [
    { title: "Global Creator Map — Creator Dashboard" },
    { name: "description", content: "Country, state, city and category ranking." },
    { property: "og:title", content: "Global Creator Map" },
    { property: "og:description", content: "Country, state, city and category ranking." },
  ]}),
  component: () => <StubPage title="Global Creator Map" subtitle="Country, state, city and category ranking." icon={Map}
    sections={["Country", "State", "City", "Category", ]} />,
});
