
"use client";

import { GuessTheNameGenerator } from "@/components/guess-the-name-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function GuessTheNamePage() {
  return (
    <ActivityPageLayout
      title="Guess the Name"
      description="Use the description, hints, and a final image to guess the famous person, place, or thing!"
    >
      <GuessTheNameGenerator />
    </ActivityPageLayout>
  );
}
