import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/fan-club")({
  head: () => ({ meta: [
    { title: "Fan Club — Creator Dashboard" },
    { name: "description", content: "Followers, super followers, VIP members and private community." },
    { property: "og:title", content: "Fan Club" },
    { property: "og:description", content: "Followers, super followers, VIP members and private community." },
  ]}),
  component: () => <StubPage title="Fan Club" subtitle="Followers, super followers, VIP members and private community." icon={Heart}
    sections={["Followers", "Super", "VIP", "Community", "Ranking", ]} />,
});
