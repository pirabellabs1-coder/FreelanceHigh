"use client";

import { useSession } from "next-auth/react";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function ClientMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? "u6";

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      <MessagingLayout
        userId={userId}
        userRole="client"
      />
    </div>
  );
}
