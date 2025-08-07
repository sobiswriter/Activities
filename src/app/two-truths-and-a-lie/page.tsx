"use client";

import { TwoTruthsAndALieGenerator } from "@/components/two-truths-and-a-lie-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function TwoTruthsAndALiePage() {
  return (
    <ActivityPageLayout
      title="Two Truths and a Lie"
      description="Can you spot the lie? Test your intuition with these tricky statements."
    >
      <TwoTruthsAndALieGenerator />
    </ActivityPageLayout>
  );
}
