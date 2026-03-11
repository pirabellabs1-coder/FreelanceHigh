"use client";

import { useSession } from "next-auth/react";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function ClientMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? "u6";

  return (
    <MessagingLayout
      userId={userId}
      userRole="client"
    />
  );
}
