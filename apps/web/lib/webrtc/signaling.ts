// ============================================================
// FreelanceHigh — WebRTC Signaling via BroadcastChannel
// Permet le signaling entre onglets du meme navigateur.
// Swappable vers Socket.io quand le backend sera pret.
// ============================================================

import type {
  CallOffer,
  CallAnswer,
  IceCandidate,
  CallHangup,
  CallReject,
} from "./types";

type SignalingEventHandler = {
  onOffer: (offer: CallOffer) => void;
  onAnswer: (answer: CallAnswer) => void;
  onIceCandidate: (candidate: IceCandidate) => void;
  onHangup: (hangup: CallHangup) => void;
  onReject: (reject: CallReject) => void;
};

// Message envelope sent via BroadcastChannel
interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate" | "hangup" | "reject";
  to: string; // userId destinataire
  payload: CallOffer | CallAnswer | IceCandidate | CallHangup | CallReject;
}

const CHANNEL_NAME = "freelancehigh-signaling";
let channel: BroadcastChannel | null = null;
let handlers: SignalingEventHandler | null = null;
let currentUserId: string | null = null;
let _callIdCounter = 0;

export function generateCallId(): string {
  _callIdCounter++;
  return `call-${_callIdCounter}-${Date.now()}`;
}

function handleMessage(event: MessageEvent<SignalingMessage>) {
  const msg = event.data;
  if (!handlers || !currentUserId) return;

  // Only process messages addressed to us
  if (msg.to !== currentUserId) return;

  switch (msg.type) {
    case "offer":
      handlers.onOffer(msg.payload as CallOffer);
      break;
    case "answer":
      handlers.onAnswer(msg.payload as CallAnswer);
      break;
    case "ice-candidate":
      handlers.onIceCandidate(msg.payload as IceCandidate);
      break;
    case "hangup":
      handlers.onHangup(msg.payload as CallHangup);
      break;
    case "reject":
      handlers.onReject(msg.payload as CallReject);
      break;
  }
}

// Register handlers for incoming signaling events
export function registerSignalingHandlers(h: SignalingEventHandler, userId: string) {
  handlers = h;
  currentUserId = userId;

  if (typeof BroadcastChannel !== "undefined") {
    // Close previous channel if any
    if (channel) {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    }
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", handleMessage);
  }
}

export function unregisterSignalingHandlers() {
  handlers = null;
  currentUserId = null;
  if (channel) {
    channel.removeEventListener("message", handleMessage);
    channel.close();
    channel = null;
  }
}

function post(msg: SignalingMessage) {
  if (channel) {
    channel.postMessage(msg);
  }
}

// Send offer to remote peer
export function sendOffer(offer: CallOffer) {
  console.log("[Signaling] Sending offer to", offer.to);
  post({ type: "offer", to: offer.to, payload: offer });
}

// Send answer to caller
export function sendAnswer(answer: CallAnswer) {
  console.log("[Signaling] Sending answer to", answer.to);
  post({ type: "answer", to: answer.to, payload: answer });
}

// Send ICE candidate
export function sendIceCandidate(candidate: IceCandidate) {
  post({ type: "ice-candidate", to: candidate.to, payload: candidate });
}

// Send hangup signal
export function sendHangup(hangup: CallHangup) {
  console.log("[Signaling] Sending hangup to", hangup.to);
  post({ type: "hangup", to: hangup.to, payload: hangup });
}

// Send reject signal
export function sendReject(reject: CallReject) {
  console.log("[Signaling] Sending reject to", reject.to);
  post({ type: "reject", to: reject.to, payload: reject });
}
