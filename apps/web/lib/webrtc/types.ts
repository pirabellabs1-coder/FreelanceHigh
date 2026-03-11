// ============================================================
// FreelanceHigh — WebRTC Types
// Types partagés pour le signaling et les appels
// ============================================================

export type CallType = "audio" | "video";

export type CallState =
  | "idle"
  | "calling"      // Appelant : en attente de réponse
  | "ringing"      // Appelé : appel entrant
  | "connecting"   // Connexion WebRTC en cours
  | "connected"    // Appel actif
  | "reconnecting" // Reconnexion après coupure
  | "ended";       // Appel terminé

export interface CallUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface CallOffer {
  callId: string;
  callType: CallType;
  from: CallUser;
  to: string; // userId destinataire
  sdp: RTCSessionDescriptionInit;
}

export interface CallAnswer {
  callId: string;
  from: string;
  to: string;
  sdp: RTCSessionDescriptionInit;
}

export interface IceCandidate {
  callId: string;
  from: string;
  to: string;
  candidate: RTCIceCandidateInit;
}

export interface CallHangup {
  callId: string;
  from: string;
  to: string;
  duration: number; // secondes
}

export interface CallReject {
  callId: string;
  from: string;
  to: string;
  reason: "rejected" | "busy" | "offline" | "timeout";
}

// Configuration STUN/TURN
export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];
