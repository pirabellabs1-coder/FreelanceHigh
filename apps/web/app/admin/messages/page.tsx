"use client";

import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function AdminMessagesPage() {
  return (
    <MessagingLayout
      userId="admin-1"
      userRole="admin"
      showAllConversations={true}
      title="Messagerie — Administration"
    />
  );
}
