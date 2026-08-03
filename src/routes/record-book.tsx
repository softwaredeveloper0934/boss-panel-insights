import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/record-book")({
  head: () => ({ meta: [
    { title: "Record Book — Creator Dashboard" },
    { name: "description", content: "All-time records for reach, sales, commission and conversions." },
    { property: "og:title", content: "Record Book" },
    { property: "og:description", content: "All-time records for reach, sales, commission and conversions." },
  ]}),
  component: () => <StubPage title="Record Book" subtitle="All-time records for reach, sales, commission and conversions." icon={BookOpen}
    sections={["Reach", "Sales", "Commission", "Conversion", "Campaigns", ]} />,
});
