"use client";

import { useSession } from "next-auth/react";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "dev-admin-1";

  return (
    <MessagingLayout
      userId={userId}
      userRole="admin"
      showAllConversations={true}
    />
  );
}
