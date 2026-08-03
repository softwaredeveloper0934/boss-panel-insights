import { createFileRoute } from "@tanstack/react-router";
import { Vault } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/content-vault")({
  head: () => ({ meta: [
    { title: "Content Vault — Creator Dashboard" },
    { name: "description", content: "Store every reel, video, caption, hashtag, template and brand asset." },
    { property: "og:title", content: "Content Vault" },
    { property: "og:description", content: "Store every reel, video, caption, hashtag, template and brand asset." },
  ]}),
  component: () => <StubPage title="Content Vault" subtitle="Store every reel, video, caption, hashtag, template and brand asset." icon={Vault}
    sections={["Reels", "Videos", "Captions", "Hashtags", "Templates", "Assets", ]} />,
});
