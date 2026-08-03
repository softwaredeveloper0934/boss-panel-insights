import { createFileRoute } from "@tanstack/react-router";
import { Users2 } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [
    { title: "Employee Center — Creator Dashboard" },
    { name: "description", content: "Content, video, sales, support and manager teams." },
    { property: "og:title", content: "Employee Center" },
    { property: "og:description", content: "Content, video, sales, support and manager teams." },
  ]}),
  component: () => <StubPage title="Employee Center" subtitle="Content, video, sales, support and manager teams." icon={Users2}
    sections={["Content", "Video", "Sales", "Support", "Managers", ]} />,
});
