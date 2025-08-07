
"use client";

import { FitnessChallenge } from "@/components/fitness-challenge";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function FitnessChallengePage() {
  return (
    <ActivityPageLayout
      title="Fitness Challenge"
      description="Select an exercise, push your limits, and see how you rank on the leaderboard!"
    >
      <FitnessChallenge />
    </ActivityPageLayout>
  );
}
