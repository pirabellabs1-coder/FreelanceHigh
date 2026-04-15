// Moneroo payment integration — https://docs.moneroo.io/

const MONEROO_API_BASE = "https://api.moneroo.io/v1";

function getApiKey(): string {
  const key = process.env.MONEROO_SECRET_KEY;
  if (!key) {
    throw new Error("MONEROO_SECRET_KEY env var is not set");
  }
  return key;
}

export type MonerooInitParams = {
  amount: number;            // integer in the smallest currency unit per Moneroo conventions (use unit per their docs)
  currency: string;          // e.g. "XOF" for FCFA, "EUR", "USD"
  description: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  return_url: string;        // where Moneroo redirects after payment
  metadata?: Record<string, string | number>;
  methods?: string[];        // optional payment method codes
};

export type MonerooInitResponse = {
  message: string;
  data: {
    id: string;
    checkout_url: string;
  };
};

export type MonerooPaymentStatus = "pending" | "success" | "failed" | "cancelled" | "initiated";

export type MonerooRetrieveResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: MonerooPaymentStatus;
    amount: number;
    currency: string;
    customer: { email: string };
    metadata: Record<string, string | number>;
  };
};

/** Initialize a Moneroo payment session. Returns the checkout URL to redirect to. */
export async function initPayment(params: MonerooInitParams): Promise<MonerooInitResponse["data"]> {
  const apiKey = getApiKey();
  const res = await fetch(`${MONEROO_API_BASE}/payments/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });
  const json = (await res.json()) as MonerooInitResponse | { message?: string; error?: string };
  if (!res.ok || !("data" in json) || !json.data?.checkout_url) {
    const msg = ("message" in json && json.message) || ("error" in json && json.error) || "Moneroo init failed";
    throw new Error(msg);
  }
  return json.data;
}

/** Retrieve a payment status by id. */
export async function retrievePayment(paymentId: string): Promise<MonerooRetrieveResponse["data"]> {
  const apiKey = getApiKey();
  const res = await fetch(`${MONEROO_API_BASE}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });
  const json = (await res.json()) as MonerooRetrieveResponse | { message?: string };
  if (!res.ok || !("data" in json)) {
    throw new Error(("message" in json && json.message) || "Moneroo retrieve failed");
  }
  return json.data;
}

/** Helper to know if Moneroo is configured (env var present). */
export function isMonerooConfigured(): boolean {
  return Boolean(process.env.MONEROO_SECRET_KEY);
}
