"use client";

import { useSession } from "next-auth/react";
import { SocketProvider } from "@/lib/socket-provider";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  if (!userId) return null;

  return (
    <SocketProvider token={undefined}>
      <MessagingLayout
        userId={userId}
        userRole="admin"
        showAllConversations={true}
      />
    </SocketProvider>
  );
}
