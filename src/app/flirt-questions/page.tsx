"use client";

import { FlirtQuestionGenerator } from "@/components/flirt-question-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function FlirtQuestionsPage() {
  return (
    <ActivityPageLayout
      title="Flirt Questions"
      description="Break the ice with some charming and playful questions. Let's see if sparks fly!"
    >
      <FlirtQuestionGenerator />
    </ActivityPageLayout>
  );
}
