"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useMessagingStore } from "@/store/messaging";
import { useCallStore } from "@/store/call";
import type { UserRole } from "@/store/messaging";
import type { CallType, CallUser } from "@/lib/webrtc/types";
import { ConversationList } from "./ConversationList";
import { ChatPanel } from "./ChatPanel";
import { AudioCallModal } from "./calls/AudioCallModal";
import { VideoCallModal } from "./calls/VideoCallModal";
import { IncomingCallPopup } from "./calls/IncomingCallPopup";
import { useWebRTC } from "./calls/useWebRTC";

interface MessagingLayoutProps {
  userId: string;
  userRole: UserRole;
  showAllConversations?: boolean;
}

// Map store participants to CallUser
function toCallUser(participant: { id: string; name: string; avatar: string; role: string }): CallUser {
  return {
    id: participant.id,
    name: participant.name,
    avatar: participant.avatar,
    role: participant.role,
  };
}

export function MessagingLayout({
  userId,
  userRole,
  showAllConversations = false,
}: MessagingLayoutProps) {
  const {
    conversations,
    setCurrentUser,
    sendMessage,
    markConversationRead,
    getMyConversations,
    getAllConversations,
    addSystemMessage,
  } = useMessagingStore();

  const callStore = useCallStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentUser: CallUser = useMemo(() => ({
    id: userId,
    name: userRole === "admin" ? "Admin" : "Vous",
    avatar: userId.slice(0, 2).toUpperCase(),
    role: userRole,
  }), [userId, userRole]);

  // Call ended callback — insert message in conversation
  const handleCallEnded = useCallback((callType: CallType, duration: number) => {
    const convId = callStore.conversationId;
    if (!convId) return;
    const msgType = callType === "video" ? "call_video" as const : "call_audio" as const;
    sendMessage(convId, callType === "video" ? "Appel video" : "Appel audio", msgType);
  }, [callStore.conversationId, sendMessage]);

  // Call missed callback
  const handleCallMissed = useCallback((fromUser: CallUser) => {
    const convId = callStore.conversationId || selectedId;
    if (!convId) return;
    sendMessage(convId, "Appel manque", "call_missed");
  }, [callStore.conversationId, selectedId, sendMessage]);

  const {
    callState,
    callType,
    remoteUser,
    localStream,
    remoteStream,
    initiateCall,
    answerCall,
    rejectCall,
    hangup,
    toggleMuteReal,
    toggleCameraReal,
    toggleScreenShareReal,
  } = useWebRTC({
    currentUser,
    onCallEnded: handleCallEnded,
    onCallMissed: handleCallMissed,
  });

  // Set current user on mount
  useEffect(() => {
    setCurrentUser(userId, userRole);
  }, [userId, userRole, setCurrentUser]);

  const myConversations = useMemo(() => {
    return showAllConversations ? getAllConversations() : getMyConversations();
  }, [conversations, showAllConversations, getAllConversations, getMyConversations]);

  // Auto-select first conversation
  useEffect(() => {
    if (!selectedId && myConversations.length > 0) {
      setSelectedId(myConversations[0].id);
    }
  }, [myConversations, selectedId]);

  const selectedConv = useMemo(
    () => myConversations.find((c) => c.id === selectedId) ?? null,
    [myConversations, selectedId]
  );

  // Start audio call
  const handleStartAudioCall = useCallback(() => {
    if (!selectedConv) return;
    const otherParticipant = selectedConv.participants.find((p) => p.id !== userId);
    if (!otherParticipant) return;
    initiateCall(toCallUser(otherParticipant), "audio", selectedConv.id);
  }, [selectedConv, userId, initiateCall]);

  // Start video call
  const handleStartVideoCall = useCallback(() => {
    if (!selectedConv) return;
    const otherParticipant = selectedConv.participants.find((p) => p.id !== userId);
    if (!otherParticipant) return;
    initiateCall(toCallUser(otherParticipant), "video", selectedConv.id);
  }, [selectedConv, userId, initiateCall]);

  // Switch audio call to video
  const handleSwitchToVideo = useCallback(() => {
    useCallStore.getState().setCallType("video");
  }, []);

  // Screen share toggle — delegate to real WebRTC implementation
  const handleToggleScreenShare = useCallback(async () => {
    toggleScreenShareReal();
  }, [toggleScreenShareReal]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex flex-1 min-h-0 bg-background-dark/50 overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-80 border-r border-border-dark flex-shrink-0">
          <ConversationList
            conversations={myConversations}
            currentUserId={userId}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showTypeFilter={userRole === "agence"}
            showAllTypes={showAllConversations}
          />
        </div>

        {/* Chat area */}
        <ChatPanel
          conversation={selectedConv}
          currentUserId={userId}
          onSendMessage={(content, type, fileName, fileSize, audioUrl, audioDuration) => {
            if (selectedId) {
              sendMessage(selectedId, content, type, fileName, fileSize, audioUrl, audioDuration);
            }
          }}
          onMarkRead={() => {
            if (selectedId) markConversationRead(selectedId);
          }}
          showAdminActions={showAllConversations}
          onSendSystemMessage={
            showAllConversations
              ? (content) => {
                  if (selectedId) addSystemMessage(selectedId, content);
                }
              : undefined
          }
          onStartAudioCall={handleStartAudioCall}
          onStartVideoCall={handleStartVideoCall}
        />
      </div>

      {/* Call modals */}
      {callState === "ringing" && remoteUser && (
        <IncomingCallPopup
          caller={remoteUser}
          callType={callType}
          onAccept={() => answerCall()}
          onAcceptAudioOnly={callType === "video" ? () => answerCall("audio") : undefined}
          onReject={() => rejectCall()}
        />
      )}

      {(callState === "calling" || callState === "connecting" || callState === "connected" || callState === "reconnecting") && callType === "audio" && (
        <AudioCallModal
          onHangup={hangup}
          onSwitchToVideo={handleSwitchToVideo}
          onToggleMute={toggleMuteReal}
        />
      )}

      {(callState === "calling" || callState === "connecting" || callState === "connected" || callState === "reconnecting") && callType === "video" && (
        <VideoCallModal
          localStream={localStream}
          remoteStream={remoteStream}
          onHangup={hangup}
          onToggleScreenShare={handleToggleScreenShare}
          onToggleMute={toggleMuteReal}
          onToggleCamera={toggleCameraReal}
        />
      )}
    </div>
  );
}
