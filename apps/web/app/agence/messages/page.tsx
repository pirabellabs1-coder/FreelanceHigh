"use client";

import { useSession } from "next-auth/react";
import { SocketProvider } from "@/lib/socket-provider";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function AgenceMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  if (!userId) return null;

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      <SocketProvider token={undefined}>
        <MessagingLayout
          userId={userId}
          userRole="agence"
        />
      </SocketProvider>
    </div>
  );
}
