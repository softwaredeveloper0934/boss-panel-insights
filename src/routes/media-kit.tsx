import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/media-kit")({
  head: () => ({ meta: [
    { title: "Media Kit — Influencer Dashboard" },
    { name: "description", content: "Profile kit, brand kit, audience and engagement stats." },
    { property: "og:title", content: "Media Kit" },
    { property: "og:description", content: "Profile kit, brand kit, audience and engagement stats." },
  ]}),
  component: () => <StubPage title="Media Kit Center" subtitle="Brand-ready profile, audience stats and a public media kit URL." icon={ImageIcon}
    sections={["Profile Kit", "Brand Kit", "Audience Stats", "Engagement Stats", "Public URL", "Download"]} />,
});
