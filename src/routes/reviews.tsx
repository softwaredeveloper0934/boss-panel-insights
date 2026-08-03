import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [
    { title: "Reviews — Creator Dashboard" },
    { name: "description", content: "Reviews, replies, moderation, spam, ratings and sentiment analysis." },
  ]}),
  component: () => <StubPage title="Reviews" subtitle="All product reviews — reply, moderate, fight spam and analyze sentiment." icon={Star}
    sections={["All","Reply","Moderation","Spam","Rating Analytics","Sentiment Analysis"]} />,
});
