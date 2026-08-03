import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/secret-achievements")({
  head: () => ({ meta: [
    { title: "Secret Achievements — Creator Dashboard" },
    { name: "description", content: "Hidden, rare, special-event and founder easter-egg awards." },
    { property: "og:title", content: "Secret Achievements" },
    { property: "og:description", content: "Hidden, rare, special-event and founder easter-egg awards." },
  ]}),
  component: () => <StubPage title="Secret Achievements" subtitle="Hidden, rare, special-event and founder easter-egg awards." icon={Lock}
    sections={["Hidden", "Rare", "Special", "Easter Eggs", ]} />,
});
