"use client";

import { useSession } from "next-auth/react";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function FreelanceMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "dev-freelance-1";

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      <MessagingLayout
        userId={userId}
        userRole="freelance"
      />
    </div>
  );
}
