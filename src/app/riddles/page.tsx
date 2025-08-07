"use client";

import { RiddleGenerator } from "@/components/riddle-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function RiddlesPage() {
  return (
    <ActivityPageLayout
      title="Fun Riddles"
      description="Challenge your mind with these fun and tricky riddles. Can you solve them all?"
    >
      <RiddleGenerator />
    </ActivityPageLayout>
  );
}
