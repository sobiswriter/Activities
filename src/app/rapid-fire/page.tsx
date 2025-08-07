"use client";

import { RapidFireGenerator } from "@/components/rapid-fire-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function RapidFirePage() {
  return (
    <ActivityPageLayout
      title="Rapid Fire Round"
      description="Quick questions for quick thinking. How fast can you answer? Let's go!"
    >
      <RapidFireGenerator />
    </ActivityPageLayout>
  );
}
