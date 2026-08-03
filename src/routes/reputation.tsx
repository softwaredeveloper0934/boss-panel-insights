import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/reputation")({
  head: () => ({ meta: [
    { title: "Reputation Engine — Creator Dashboard" },
    { name: "description", content: "Community, brand, sales and support reputation." },
    { property: "og:title", content: "Reputation Engine" },
    { property: "og:description", content: "Community, brand, sales and support reputation." },
  ]}),
  component: () => <StubPage title="Reputation Engine" subtitle="Community, brand, sales and support reputation." icon={Star}
    sections={["Community", "Brand", "Sales", "Support", ]} />,
});
