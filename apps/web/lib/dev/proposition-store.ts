/**
 * Dev Proposition Store — In-memory store for propositions in dev mode
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "lib/dev");
const PROPOSITIONS_FILE = join(DATA_DIR, "propositions.json");

export interface StoredProposition {
  id: string;
  serviceId: string;
  freelanceId: string;
  clientId: string;
  projectId: string | null;
  title: string;
  description: string;
  amount: number;
  deliveryDays: number;
  revisions: number;
  status: "PENDING" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "WITHDRAWN";
  viewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  expiresAt: string | null;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
}

function readJson<T>(path: string, defaultValue: T): T {
  try {
    if (!existsSync(path)) return defaultValue;
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return defaultValue;
  }
}

function writeJson(path: string, data: unknown): void {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("[proposition-store] write error:", e);
  }
}

export const propositionStore = {
  getAll(): StoredProposition[] {
    return readJson<StoredProposition[]>(PROPOSITIONS_FILE, []);
  },

  getById(id: string): StoredProposition | null {
    return this.getAll().find((p) => p.id === id) ?? null;
  },

  getByFreelance(freelanceId: string): StoredProposition[] {
    return this.getAll().filter((p) => p.freelanceId === freelanceId);
  },

  getByClient(clientId: string): StoredProposition[] {
    return this.getAll().filter((p) => p.clientId === clientId);
  },

  getByService(serviceId: string): StoredProposition[] {
    return this.getAll().filter((p) => p.serviceId === serviceId);
  },

  create(data: Omit<StoredProposition, "id" | "createdAt" | "updatedAt" | "viewedAt" | "acceptedAt" | "rejectedAt" | "orderId"> & Partial<Pick<StoredProposition, "viewedAt" | "acceptedAt" | "rejectedAt" | "orderId" | "expiresAt">>): StoredProposition {
    const propositions = this.getAll();
    const now = new Date().toISOString();
    const proposition: StoredProposition = {
      id: `prop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      viewedAt: null,
      acceptedAt: null,
      rejectedAt: null,
      orderId: null,
      ...data,
      expiresAt: data.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
    };
    propositions.push(proposition);
    writeJson(PROPOSITIONS_FILE, propositions);
    return proposition;
  },

  update(id: string, updates: Partial<StoredProposition>): StoredProposition | null {
    const propositions = this.getAll();
    const idx = propositions.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    propositions[idx] = { ...propositions[idx], ...updates, updatedAt: new Date().toISOString() };
    writeJson(PROPOSITIONS_FILE, propositions);
    return propositions[idx];
  },

  delete(id: string): boolean {
    const propositions = this.getAll();
    const filtered = propositions.filter((p) => p.id !== id);
    if (filtered.length === propositions.length) return false;
    writeJson(PROPOSITIONS_FILE, filtered);
    return true;
  },
};
