import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [
    { title: "Team — Creator Dashboard" },
    { name: "description", content: "Members, roles, permissions, invitations and activity." },
  ]}),
  component: () => <StubPage title="Team" subtitle="Members, roles, permissions, invitations and activity log." icon={UsersRound}
    sections={["Members","Roles","Permissions","Invitations","Activity"]} />,
});
