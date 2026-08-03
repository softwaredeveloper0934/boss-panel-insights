import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/power-score")({
  head: () => ({ meta: [
    { title: "Influencer Power Score — Creator Dashboard" },
    { name: "description", content: "Combined power score from followers, reach, sales, leads and revenue." },
    { property: "og:title", content: "Influencer Power Score" },
    { property: "og:description", content: "Combined power score from followers, reach, sales, leads and revenue." },
  ]}),
  component: () => <StubPage title="Influencer Power Score" subtitle="Combined power score from followers, reach, sales, leads and revenue." icon={Zap}
    sections={["Followers", "Reach", "Sales", "Leads", "Revenue", "Engagement", "XP", ]} />,
});
