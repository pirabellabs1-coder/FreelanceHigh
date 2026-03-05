"use client";

import { MessagingLayout } from "@/components/messaging/MessagingLayout";

export default function FreelanceMessagesPage() {
  // En production: recuperer l'ID depuis la session NextAuth
  // Pour le demo: utiliser l'ID du freelance par defaut
  return (
    <MessagingLayout
      userId="u1"
      userRole="freelance"
      title="Messagerie"
    />
  );
}
