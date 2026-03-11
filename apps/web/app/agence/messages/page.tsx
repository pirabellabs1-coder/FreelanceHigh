"use client";

import { useSession } from "next-auth/react";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function AgenceMessagesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "u11";

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8">
      <MessagingLayout
        userId={userId}
        userRole="agence"
      />
    </div>
  );
}
