// ============================================================
// FreelanceHigh — Unified Messaging Store
// Store Zustand dedie a la messagerie cross-roles
// Remplacable par une API WebSocket plus tard
// ============================================================

import { create } from "zustand";

// ── Types ──

export type ConversationType = "direct" | "group" | "order" | "admin";
export type MessageContentType = "text" | "file" | "image" | "system";
export type UserRole = "freelance" | "client" | "agence" | "admin";

export interface MessageParticipant {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  online: boolean;
}

export interface UnifiedMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  type: MessageContentType;
  fileName?: string;
  fileSize?: string;
  createdAt: string;
  readBy: string[];
}

export interface UnifiedConversation {
  id: string;
  type: ConversationType;
  participants: MessageParticipant[];
  title?: string;
  orderId?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: UnifiedMessage[];
}

interface MessagingState {
  conversations: UnifiedConversation[];
  currentUserId: string;
  currentUserRole: UserRole;

  // Actions
  setCurrentUser: (userId: string, role: UserRole) => void;
  sendMessage: (convId: string, content: string, type?: MessageContentType, fileName?: string, fileSize?: string) => void;
  markConversationRead: (convId: string) => void;
  createConversation: (participants: MessageParticipant[], type: ConversationType, title?: string, orderId?: string) => string;
  getMyConversations: () => UnifiedConversation[];
  getAllConversations: () => UnifiedConversation[];
  addSystemMessage: (convId: string, content: string) => void;
}

// ── Demo Data ──

const DEMO_PARTICIPANTS: Record<string, MessageParticipant> = {
  "u1": { id: "u1", name: "Amadou Diallo", avatar: "AD", role: "freelance", online: true },
  "u2": { id: "u2", name: "Fatou Ndiaye", avatar: "FN", role: "freelance", online: false },
  "u3": { id: "u3", name: "Kofi Asante", avatar: "KA", role: "freelance", online: true },
  "u5": { id: "u5", name: "Ibrahim Keita", avatar: "IK", role: "freelance", online: false },
  "u6": { id: "u6", name: "Marie Dupont", avatar: "MD", role: "client", online: true },
  "u7": { id: "u7", name: "Jean-Pierre Lefebvre", avatar: "JL", role: "client", online: false },
  "u8": { id: "u8", name: "Sophie Martin", avatar: "SM", role: "client", online: true },
  "u11": { id: "u11", name: "Studio Digital Dakar", avatar: "SD", role: "agence", online: true },
  "u12": { id: "u12", name: "Agence Creatif CI", avatar: "AC", role: "agence", online: false },
  "admin-1": { id: "admin-1", name: "Admin Principal", avatar: "AP", role: "admin", online: true },
};

function p(id: string): MessageParticipant {
  return DEMO_PARTICIPANTS[id] ?? { id, name: "Inconnu", avatar: "??", role: "client", online: false };
}

function msg(id: string, senderId: string, content: string, type: MessageContentType = "text", minutesAgo: number = 0): UnifiedMessage {
  const sender = DEMO_PARTICIPANTS[senderId];
  return {
    id,
    senderId,
    senderName: sender?.name ?? "Inconnu",
    senderRole: sender?.role ?? "client",
    content,
    type,
    createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
    readBy: [senderId],
  };
}

const DEMO_CONVERSATIONS: UnifiedConversation[] = [
  // Freelance <-> Client conversations
  {
    id: "conv-1",
    type: "order",
    participants: [p("u1"), p("u6")],
    orderId: "CMD-342",
    lastMessage: "Le code a ete deploye sur le serveur de staging.",
    lastMessageTime: new Date(Date.now() - 10 * 60000).toISOString(),
    unreadCount: 2,
    messages: [
      msg("m1", "u6", "Bonjour Amadou ! J'ai un projet de site e-commerce a vous confier.", "text", 180),
      msg("m2", "u1", "Bonjour Marie ! Avec plaisir, pouvez-vous me donner plus de details sur vos besoins ?", "text", 170),
      msg("m3", "u6", "Oui bien sur. Je vous envoie le cahier des charges.", "text", 165),
      msg("m4", "u6", "cahier-des-charges-v2.pdf", "file", 164),
      msg("m5", "u1", "Merci ! Je regarde ca et je vous fais un retour demain.", "text", 120),
      msg("m6", "u1", "Le code a ete deploye sur le serveur de staging.", "text", 10),
    ],
  },
  {
    id: "conv-2",
    type: "direct",
    participants: [p("u1"), p("u7")],
    lastMessage: "J'ai envoye les maquettes Figma.",
    lastMessageTime: new Date(Date.now() - 60 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m10", "u7", "Bonjour, je cherche un developpeur pour un projet React.", "text", 300),
      msg("m11", "u1", "Bonjour Jean-Pierre ! Je suis disponible, quel est le scope du projet ?", "text", 295),
      msg("m12", "u7", "C'est un dashboard analytics. Budget de 2000 EUR.", "text", 290),
      msg("m13", "u1", "J'ai envoye les maquettes Figma.", "text", 60),
    ],
  },
  {
    id: "conv-3",
    type: "order",
    participants: [p("u3"), p("u8")],
    orderId: "CMD-567",
    lastMessage: "L'API est prete pour les tests.",
    lastMessageTime: new Date(Date.now() - 30 * 60000).toISOString(),
    unreadCount: 1,
    messages: [
      msg("m20", "u8", "Kofi, comment avance le developpement de l'API ?", "text", 120),
      msg("m21", "u3", "Ca avance bien ! Je finalise les endpoints de paiement.", "text", 100),
      msg("m22", "u3", "L'API est prete pour les tests.", "text", 30),
    ],
  },
  // Agency <-> Client
  {
    id: "conv-4",
    type: "group",
    participants: [p("u11"), p("u6"), p("u1")],
    title: "Projet site vitrine - Marie",
    lastMessage: "Amadou, peux-tu prendre en charge le front ?",
    lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(),
    unreadCount: 3,
    messages: [
      msg("m30", "u6", "Bonjour l'equipe ! Voici le brief pour le site vitrine.", "text", 480),
      msg("m31", "u11", "Merci Marie ! On va assigner Amadou au front-end.", "text", 460),
      msg("m32", "u11", "Amadou, peux-tu prendre en charge le front ?", "text", 45),
    ],
  },
  // Admin <-> User
  {
    id: "conv-5",
    type: "admin",
    participants: [p("admin-1"), p("u1")],
    title: "Verification KYC",
    lastMessage: "Votre verification KYC niveau 3 a ete approuvee.",
    lastMessageTime: new Date(Date.now() - 120 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m40", "admin-1", "Bonjour Amadou, nous avons bien recu vos documents KYC.", "text", 180),
      msg("m41", "u1", "Merci ! Combien de temps pour la verification ?", "text", 170),
      msg("m42", "admin-1", "Votre verification KYC niveau 3 a ete approuvee.", "system", 120),
    ],
  },
  // Agency internal
  {
    id: "conv-6",
    type: "group",
    participants: [p("u11"), p("u1"), p("u2")],
    title: "#general - Studio Digital Dakar",
    lastMessage: "Reunion d'equipe vendredi a 14h",
    lastMessageTime: new Date(Date.now() - 240 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m50", "u11", "Bonjour a tous ! Rappel: reunion d'equipe vendredi a 14h.", "text", 300),
      msg("m51", "u1", "Bien note ! Je serai present.", "text", 280),
      msg("m52", "u2", "Idem pour moi.", "text", 260),
      msg("m53", "u11", "Reunion d'equipe vendredi a 14h", "text", 240),
    ],
  },
  // Another client <-> freelance
  {
    id: "conv-7",
    type: "direct",
    participants: [p("u2"), p("u8")],
    lastMessage: "Les maquettes V2 sont pretes pour review.",
    lastMessageTime: new Date(Date.now() - 90 * 60000).toISOString(),
    unreadCount: 1,
    messages: [
      msg("m60", "u8", "Fatou, comment avancent les maquettes ?", "text", 150),
      msg("m61", "u2", "J'y travaille ! Ca sera pret demain.", "text", 140),
      msg("m62", "u2", "Les maquettes V2 sont pretes pour review.", "text", 90),
    ],
  },
  // Admin <-> Agency (dispute)
  {
    id: "conv-8",
    type: "admin",
    participants: [p("admin-1"), p("u12")],
    title: "Litige #LIT-001",
    lastMessage: "Nous examinons votre dossier. Merci de votre patience.",
    lastMessageTime: new Date(Date.now() - 360 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m70", "u12", "Bonjour, nous souhaitons signaler un probleme avec une commande.", "text", 400),
      msg("m71", "admin-1", "Nous examinons votre dossier. Merci de votre patience.", "text", 360),
    ],
  },
];

// ── Helpers ──

let _msgCounter = 100;
function genMsgId() {
  _msgCounter++;
  return `msg-${_msgCounter}-${Date.now()}`;
}

let _convCounter = 100;
function genConvId() {
  _convCounter++;
  return `conv-${_convCounter}`;
}

// ── Store ──

export const useMessagingStore = create<MessagingState>()((set, get) => ({
  conversations: DEMO_CONVERSATIONS,
  currentUserId: "u1", // Default pour le demo
  currentUserRole: "freelance" as UserRole,

  setCurrentUser: (userId, role) => set({ currentUserId: userId, currentUserRole: role }),

  sendMessage: (convId, content, type = "text", fileName, fileSize) => {
    const { currentUserId, currentUserRole } = get();
    const participant = DEMO_PARTICIPANTS[currentUserId];

    const newMessage: UnifiedMessage = {
      id: genMsgId(),
      senderId: currentUserId,
      senderName: participant?.name ?? "Vous",
      senderRole: currentUserRole,
      content,
      type,
      fileName,
      fileSize,
      createdAt: new Date().toISOString(),
      readBy: [currentUserId],
    };

    set((s) => ({
      conversations: s.conversations.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: type === "file" ? fileName ?? content : content,
              lastMessageTime: newMessage.createdAt,
            }
          : conv
      ),
    }));

    // Simuler une reponse automatique apres 2 secondes
    if (type === "text") {
      setTimeout(() => {
        const conv = get().conversations.find((c) => c.id === convId);
        if (!conv) return;

        const otherParticipant = conv.participants.find((p) => p.id !== currentUserId);
        if (!otherParticipant) return;

        const replies = [
          "Merci pour votre message ! Je reviens vers vous rapidement.",
          "Bien recu, je regarde ca.",
          "Parfait, c'est note !",
          "Merci ! Je vous tiens au courant.",
          "D'accord, je m'en occupe.",
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];

        const autoReply: UnifiedMessage = {
          id: genMsgId(),
          senderId: otherParticipant.id,
          senderName: otherParticipant.name,
          senderRole: otherParticipant.role,
          content: reply,
          type: "text",
          createdAt: new Date().toISOString(),
          readBy: [otherParticipant.id],
        };

        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: [...c.messages, autoReply],
                  lastMessage: reply,
                  lastMessageTime: autoReply.createdAt,
                  unreadCount: c.unreadCount + 1,
                }
              : c
          ),
        }));
      }, 2000);
    }
  },

  markConversationRead: (convId) => {
    const { currentUserId } = get();
    set((s) => ({
      conversations: s.conversations.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map((m) =>
                m.readBy.includes(currentUserId) ? m : { ...m, readBy: [...m.readBy, currentUserId] }
              ),
            }
          : conv
      ),
    }));
  },

  createConversation: (participants, type, title, orderId) => {
    const id = genConvId();
    const newConv: UnifiedConversation = {
      id,
      type,
      participants,
      title,
      orderId,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: [],
    };

    set((s) => ({
      conversations: [newConv, ...s.conversations],
    }));

    return id;
  },

  getMyConversations: () => {
    const { conversations, currentUserId } = get();
    return conversations.filter((c) => c.participants.some((p) => p.id === currentUserId));
  },

  getAllConversations: () => {
    return get().conversations;
  },

  addSystemMessage: (convId, content) => {
    const newMessage: UnifiedMessage = {
      id: genMsgId(),
      senderId: "system",
      senderName: "Systeme",
      senderRole: "admin",
      content,
      type: "system",
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    set((s) => ({
      conversations: s.conversations.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content,
              lastMessageTime: newMessage.createdAt,
            }
          : conv
      ),
    }));
  },
}));
