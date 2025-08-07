"use client";

import { TruthOrDareGenerator } from "@/components/truth-or-dare-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function TruthOrDarePage() {
  return (
    <ActivityPageLayout
      title="Truth or Dare"
      description="Get to know each other with this classic game. Will you tell the truth or take the dare?"
    >
      <TruthOrDareGenerator />
    </ActivityPageLayout>
  );
}
