// Socket.io client singleton for real-time messaging
// Connects to the Fastify backend (apps/api) when NEXT_PUBLIC_SOCKET_URL is set
// Falls back to polling when Socket.io is unavailable

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

export interface SocketEvents {
  "message:new": (data: { conversationId: string; message: Record<string, unknown> }) => void;
  "message:read": (data: { conversationId: string; userId: string; readAt: string }) => void;
  "message:edited": (data: { conversationId: string; messageId: string; content: string; editedAt: string }) => void;
  "message:deleted": (data: { conversationId: string; messageId: string; deletedAt: string }) => void;
  "user:online": (data: { userId: string; online: boolean }) => void;
}

export function getSocket(): Socket | null {
  return socket;
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

export function connectSocket(token: string): Socket | null {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (!socketUrl) {
    // No Socket.io server configured — use polling fallback
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  connectionAttempts = 0;

  socket = io(socketUrl, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    reconnectionAttempts: Infinity,
    timeout: 10000,
  });

  socket.on("connect", () => {
    connectionAttempts = 0;
    console.log("[Socket.io] Connected");
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket.io] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    connectionAttempts++;
    console.warn("[Socket.io] Connection error:", error.message);

    if (connectionAttempts >= MAX_ATTEMPTS) {
      console.warn("[Socket.io] Max attempts reached, falling back to polling");
      socket?.disconnect();
    }
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connectionAttempts = 0;
}

// Join conversation rooms (called after connection)
export function joinConversationRooms(conversationIds: string[]): void {
  if (socket?.connected) {
    socket.emit("conversation:join", { conversationIds });
  }
}
