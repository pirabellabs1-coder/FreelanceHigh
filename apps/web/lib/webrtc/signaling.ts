// ============================================================
// FreelanceHigh — WebRTC Signaling via Server API + BroadcastChannel fallback
// Le serveur API permet le signaling entre utilisateurs différents.
// BroadcastChannel est utilisé en fallback pour le dev local (même navigateur).
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

interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate" | "hangup" | "reject";
  to: string;
  payload: CallOffer | CallAnswer | IceCandidate | CallHangup | CallReject;
}

const CHANNEL_NAME = "freelancehigh-signaling";
const POLL_INTERVAL_MS = 2000;

let channel: BroadcastChannel | null = null;
let handlers: SignalingEventHandler | null = null;
let currentUserId: string | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let _callIdCounter = 0;

export function generateCallId(): string {
  _callIdCounter++;
  return `call-${_callIdCounter}-${Date.now()}`;
}

function dispatchSignal(type: string, payload: unknown) {
  if (!handlers) return;

  switch (type) {
    case "offer":
      handlers.onOffer(payload as CallOffer);
      break;
    case "answer":
      handlers.onAnswer(payload as CallAnswer);
      break;
    case "ice-candidate":
      handlers.onIceCandidate(payload as IceCandidate);
      break;
    case "hangup":
      handlers.onHangup(payload as CallHangup);
      break;
    case "reject":
      handlers.onReject(payload as CallReject);
      break;
  }
}

// BroadcastChannel handler (fallback for same-browser dev)
function handleBroadcastMessage(event: MessageEvent<SignalingMessage>) {
  const msg = event.data;
  if (!handlers || !currentUserId) return;
  if (msg.to !== currentUserId) return;
  dispatchSignal(msg.type, msg.payload);
}

// Server polling
async function pollServer() {
  if (!currentUserId) return;

  try {
    const res = await fetch(`/api/signaling?userId=${encodeURIComponent(currentUserId)}`);
    if (!res.ok) return;

    const data = await res.json();
    if (data.signals && Array.isArray(data.signals)) {
      for (const sig of data.signals) {
        dispatchSignal(sig.type, sig.payload);
      }
    }
  } catch {
    // Silent fail — network error during polling
  }
}

// Register handlers for incoming signaling events
export function registerSignalingHandlers(h: SignalingEventHandler, userId: string) {
  handlers = h;
  currentUserId = userId;

  // BroadcastChannel (same-browser fallback)
  if (typeof BroadcastChannel !== "undefined") {
    if (channel) {
      channel.removeEventListener("message", handleBroadcastMessage);
      channel.close();
    }
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", handleBroadcastMessage);
  }

  // Start server polling
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(pollServer, POLL_INTERVAL_MS);
  // Immediate first poll
  pollServer();
}

export function unregisterSignalingHandlers() {
  handlers = null;
  currentUserId = null;

  if (channel) {
    channel.removeEventListener("message", handleBroadcastMessage);
    channel.close();
    channel = null;
  }

  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

// Send signal via server API + BroadcastChannel
async function post(msg: SignalingMessage) {
  // BroadcastChannel (same-browser)
  if (channel) {
    channel.postMessage(msg);
  }

  // Server API (cross-browser / cross-device)
  try {
    await fetch("/api/signaling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: msg.type,
        from: currentUserId,
        to: msg.to,
        payload: msg.payload,
      }),
    });
  } catch {
    console.warn("[Signaling] Failed to send via server, BroadcastChannel only");
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
