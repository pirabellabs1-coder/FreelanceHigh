"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { type Socket } from "socket.io-client";
import { connectSocket, disconnectSocket, getSocket, isSocketConnected } from "./socket-client";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  isPollingMode: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  isPollingMode: true,
});

export function useSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
  token?: string;
  onConnectionChange?: (connected: boolean) => void;
}

export function SocketProvider({ children, token, onConnectionChange }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isPollingMode, setIsPollingMode] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const sock = connectSocket(token);
    socketRef.current = sock;

    if (!sock) {
      // No Socket.io URL configured — polling mode
      setIsPollingMode(true);
      setIsConnected(false);
      return;
    }

    const onConnect = () => {
      setIsConnected(true);
      setIsPollingMode(false);
      onConnectionChange?.(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setIsPollingMode(true);
      onConnectionChange?.(false);
    };

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);

    // Check current state
    if (sock.connected) {
      setIsConnected(true);
      setIsPollingMode(false);
    }

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      disconnectSocket();
      socketRef.current = null;
    };
  }, [token, onConnectionChange]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        isPollingMode,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
