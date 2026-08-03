import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/founder-spotlight")({
  head: () => ({ meta: [
    { title: "Founder Spotlight — Creator Dashboard" },
    { name: "description", content: "Founder picks, featured creators and creator of the month/year." },
    { property: "og:title", content: "Founder Spotlight" },
    { property: "og:description", content: "Founder picks, featured creators and creator of the month/year." },
  ]}),
  component: () => <StubPage title="Founder Spotlight" subtitle="Founder picks, featured creators and creator of the month/year." icon={Star}
    sections={["Founder Picks", "Featured", "Of The Month", "Of The Year", ]} />,
});
