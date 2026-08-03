import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [
    { title: "Messages — Creator Dashboard" },
    { name: "description", content: "Inbox, buyer chat, support chat and announcements." },
  ]}),
  component: () => <StubPage title="Messages" subtitle="Inbox, buyer chat, support chat and announcements — all in one thread." icon={MessagesSquare}
    sections={["Inbox","Buyer Chat","Support Chat","Announcements"]} />,
});
