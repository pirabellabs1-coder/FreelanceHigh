// ============================================================
// FreelanceHigh — Unified Messaging Store
// Store Zustand dedie a la messagerie cross-roles
// Remplacable par une API WebSocket plus tard
// ============================================================

import { create } from "zustand";

// ── Types ──

export type ConversationType = "direct" | "group" | "order" | "admin";
export type MessageContentType = "text" | "file" | "image" | "system" | "voice" | "call_audio" | "call_video" | "call_missed";
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
  audioUrl?: string;
  audioDuration?: number;
  callDuration?: number;
  transcription?: string;
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
  sendMessage: (convId: string, content: string, type?: MessageContentType, fileName?: string, fileSize?: string, audioUrl?: string, audioDuration?: number) => void;
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

// Generate a tiny valid WAV data URL (0.5s silence) for demo voice messages
function makeDemoAudioUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const sampleRate = 8000;
    const numSamples = sampleRate / 2; // 0.5 second
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    // WAV header
    const writeStr = (offset: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, numSamples * 2, true);
    // Silent samples (all zeros)
    const blob = new Blob([buffer], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  } catch {
    return "";
  }
}

let _demoAudioUrl: string | null = null;
function getDemoAudioUrl(): string {
  if (_demoAudioUrl === null) _demoAudioUrl = makeDemoAudioUrl();
  return _demoAudioUrl;
}

function voiceMsg(id: string, senderId: string, audioDuration: number, minutesAgo: number): UnifiedMessage {
  const sender = DEMO_PARTICIPANTS[senderId];
  return {
    id,
    senderId,
    senderName: sender?.name ?? "Inconnu",
    senderRole: sender?.role ?? "client",
    content: "Message vocal",
    type: "voice",
    audioUrl: getDemoAudioUrl(),
    audioDuration,
    transcription: "Bonjour, je voulais discuter du projet en cours...",
    createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
    readBy: [senderId],
  };
}

function callMsg(id: string, senderId: string, callType: "call_audio" | "call_video" | "call_missed", callDuration: number, minutesAgo: number): UnifiedMessage {
  const sender = DEMO_PARTICIPANTS[senderId];
  const labels = { call_audio: "Appel audio", call_video: "Appel video", call_missed: "Appel manque" };
  return {
    id,
    senderId,
    senderName: sender?.name ?? "Inconnu",
    senderRole: sender?.role ?? "client",
    content: labels[callType],
    type: callType,
    callDuration,
    createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
    readBy: [senderId],
  };
}

const DEMO_CONVERSATIONS: UnifiedConversation[] = [
  {
    id: "conv-1",
    type: "direct",
    participants: [p("u1"), p("u6")],
    lastMessage: "Message vocal",
    lastMessageTime: new Date(Date.now() - 5 * 60000).toISOString(),
    unreadCount: 2,
    messages: [
      msg("m1", "u6", "Bonjour Amadou, j'ai vu votre service de developpement web.", "text", 120),
      msg("m2", "u1", "Bonjour Marie ! Oui, je suis disponible. Quel est votre projet ?", "text", 115),
      voiceMsg("m3", "u6", 47, 90),
      msg("m4", "u1", "Tres bien, je comprends vos besoins. Voici ma proposition.", "text", 85),
      callMsg("m5", "u1", "call_audio", 154, 60),
      msg("m6", "u6", "Super appel ! On avance bien.", "text", 50),
      voiceMsg("m7", "u6", 23, 5),
    ],
  },
  {
    id: "conv-2",
    type: "order",
    participants: [p("u1"), p("u8")],
    orderId: "CMD-2024-0042",
    lastMessage: "Appel video",
    lastMessageTime: new Date(Date.now() - 30 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m10", "u8", "J'ai recu votre livraison, merci !", "text", 180),
      msg("m11", "u1", "Avec plaisir ! N'hesitez pas si vous avez des questions.", "text", 175),
      callMsg("m12", "u1", "call_video", 920, 120),
      msg("m13", "u8", "L'appel video etait tres utile pour la demo. Merci !", "text", 60),
      callMsg("m14", "u8", "call_missed", 0, 30),
    ],
  },
  {
    id: "conv-3",
    type: "direct",
    participants: [p("u1"), p("u11")],
    lastMessage: "On cherche un dev React pour un projet urgent.",
    lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(),
    unreadCount: 1,
    messages: [
      msg("m20", "u11", "Salut Amadou ! Studio Digital Dakar ici.", "text", 200),
      msg("m21", "u11", "On cherche un dev React pour un projet urgent.", "text", 45),
      voiceMsg("m22", "u11", 65, 40),
    ],
  },
  {
    id: "conv-4",
    type: "direct",
    participants: [p("u6"), p("u2")],
    lastMessage: "D'accord, je vous envoie le brief.",
    lastMessageTime: new Date(Date.now() - 10 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m30", "u6", "Bonjour Fatou, je cherche une designer.", "text", 100),
      msg("m31", "u2", "Bonjour ! Je suis disponible. Quel type de design ?", "text", 95),
      voiceMsg("m32", "u6", 35, 80),
      msg("m33", "u2", "D'accord, je vous envoie le brief.", "text", 10),
    ],
  },
  {
    id: "conv-5",
    type: "admin",
    participants: [p("admin-1"), p("u1")],
    title: "Support FreelanceHigh",
    lastMessage: "Votre verification KYC a ete approuvee.",
    lastMessageTime: new Date(Date.now() - 240 * 60000).toISOString(),
    unreadCount: 0,
    messages: [
      msg("m40", "admin-1", "Bonjour Amadou, votre document d'identite a ete recu.", "system", 300),
      msg("m41", "admin-1", "Votre verification KYC a ete approuvee.", "system", 240),
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

  sendMessage: (convId, content, type = "text", fileName, fileSize, audioUrl, audioDuration) => {
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
      audioUrl,
      audioDuration,
      createdAt: new Date().toISOString(),
      readBy: [currentUserId],
    };

    const lastMessageText =
      type === "voice" ? "Message vocal" :
      type === "file" ? (fileName ?? content) :
      type === "call_audio" ? "Appel audio" :
      type === "call_video" ? "Appel video" :
      type === "call_missed" ? "Appel manque" :
      content;

    set((s) => ({
      conversations: s.conversations.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: lastMessageText,
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
