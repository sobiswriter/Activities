"use client";

import { IqTestGenerator } from "@/components/iq-test-generator";
import { ActivityPageLayout } from "@/components/activity-page-layout";

export default function IqTestPage() {
  return (
    <ActivityPageLayout
      title="IQ Test"
      description="Test your smarts with these cool IQ questions. See how many you can get right!"
    >
      <IqTestGenerator />
    </ActivityPageLayout>
  );
}
