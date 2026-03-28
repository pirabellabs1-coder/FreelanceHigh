import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { IS_DEV, USE_PRISMA_FOR_DATA } from "@/lib/env";
import fs from "fs";
import path from "path";

// ── Persistence (dev-only) ──
const DEV_DIR = path.join(process.cwd(), "lib", "dev");
const AUTOMATIONS_FILE = path.join(DEV_DIR, "automations.json");
const HISTORY_FILE = path.join(DEV_DIR, "automation-history.json");

function ensureDir() {
  if (!fs.existsSync(DEV_DIR)) fs.mkdirSync(DEV_DIR, { recursive: true });
}

function readScenarios(): unknown[] {
  try {
    if (!fs.existsSync(AUTOMATIONS_FILE)) return [];
    return JSON.parse(fs.readFileSync(AUTOMATIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeScenarios(scenarios: unknown[]) {
  ensureDir();
  fs.writeFileSync(AUTOMATIONS_FILE, JSON.stringify(scenarios, null, 2), "utf-8");
}

function readHistory(): unknown[] {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function addHistoryEntry(scenarioName: string, action: string) {
  ensureDir();
  const history = readHistory() as Record<string, unknown>[];
  history.unshift({
    id: "h" + Date.now(),
    scenarioId: "",
    scenarioName,
    action,
    time: new Date().toISOString(),
    badge: "auto",
  });
  // Keep last 50 entries
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2), "utf-8");
}

// ── Static config ──
const TRIGGERS = [
  { id: "t1", icon: "chat_bubble", label: "Nouveau message recu", category: "Messages" },
  { id: "t2", icon: "person_add", label: "Nouveau client qui contacte", category: "Messages" },
  { id: "t3", icon: "shopping_cart", label: "Commande passee", category: "Commandes" },
  { id: "t4", icon: "check_circle", label: "Commande livree", category: "Commandes" },
  { id: "t5", icon: "star", label: "Avis laisse", category: "Avis" },
  { id: "t6", icon: "visibility", label: "Profil visite X fois", category: "Profil" },
  { id: "t7", icon: "schedule", label: "Chaque jour a heure fixe", category: "Temps" },
  { id: "t8", icon: "trending_up", label: "Seuil de revenus atteint", category: "Finances" },
];

const CONDITIONS = [
  { id: "c1", icon: "schedule", label: "Heure de la journee", valueType: "select", options: ["Matin (6h-12h)", "Apres-midi (12h-18h)", "Soir (18h-00h)", "Nuit (00h-6h)"] },
  { id: "c2", icon: "repeat", label: "Nombre de commandes du client", valueType: "number" },
  { id: "c3", icon: "attach_money", label: "Montant superieur a", valueType: "number" },
  { id: "c4", icon: "category", label: "Categorie du service", valueType: "select", options: ["Developpement Web", "Design", "Redaction", "Marketing", "Formation"] },
  { id: "c5", icon: "language", label: "Langue du client", valueType: "select", options: ["Francais", "Anglais", "Arabe", "Espagnol"] },
];

const ACTIONS = [
  { id: "a1", icon: "send", label: "Envoyer un message", hasMessage: true },
  { id: "a2", icon: "notifications", label: "Envoyer une notification push" },
  { id: "a3", icon: "email", label: "Envoyer un email", hasMessage: true },
  { id: "a4", icon: "label", label: "Ajouter un tag au client" },
  { id: "a5", icon: "priority_high", label: "Marquer comme prioritaire" },
  { id: "a6", icon: "discount", label: "Offrir une reduction", hasMessage: true },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !(IS_DEV && !USE_PRISMA_FOR_DATA)) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  if (IS_DEV && !USE_PRISMA_FOR_DATA) {
    const scenarios = readScenarios();
    return NextResponse.json({
      triggers: TRIGGERS,
      conditions: CONDITIONS,
      actions: ACTIONS,
      scenarios,
    });
  }

  // Production: Prisma
  const { prisma } = await import("@/lib/prisma");
  const userId = session!.user!.id;
  const dbScenarios = await prisma.automationScenario.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const scenarios = dbScenarios.map((s) => ({
    id: s.id,
    name: s.name,
    trigger: s.trigger,
    conditions: s.conditions,
    actions: s.actions,
    active: s.status === "ACTIF",
    triggerCount: s.executionCount,
    lastTriggered: s.lastExecutedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString().slice(0, 10),
  }));

  return NextResponse.json({
    triggers: TRIGGERS,
    conditions: CONDITIONS,
    actions: ACTIONS,
    scenarios,
    history: [],
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !(IS_DEV && !USE_PRISMA_FOR_DATA)) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide" }, { status: 400 });
  }

  try {
    if (IS_DEV && !USE_PRISMA_FOR_DATA) {
      if (body.action === "create") {
        if (!body.scenario || typeof body.scenario !== "object") {
          return NextResponse.json({ error: "Donnees du scenario manquantes" }, { status: 400 });
        }
        const scenarios = readScenarios() as Record<string, unknown>[];
        const scenario = body.scenario as Record<string, unknown>;
        const newScenario = {
          id: "sc" + Date.now(),
          ...scenario,
          triggerCount: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        scenarios.push(newScenario);
        writeScenarios(scenarios);
        addHistoryEntry(String(scenario.name || "Scenario"), "Scenario cree");
        return NextResponse.json({ scenario: newScenario });
      }

      if (body.action === "update") {
        const scenarios = readScenarios() as Record<string, unknown>[];
        const idx = scenarios.findIndex((s) => s.id === body.id);
        if (idx < 0) return NextResponse.json({ error: "Scenario introuvable" }, { status: 404 });
        const existing = scenarios[idx];
        const updated = {
          ...existing,
          ...(body.scenario as Record<string, unknown>),
          id: body.id,
          triggerCount: existing.triggerCount,
          lastTriggered: existing.lastTriggered,
          createdAt: existing.createdAt,
        };
        scenarios[idx] = updated;
        writeScenarios(scenarios);
        addHistoryEntry(String((body.scenario as Record<string, unknown>)?.name || "Scenario"), "Scenario modifie");
        return NextResponse.json({ scenario: updated });
      }

      if (body.action === "duplicate") {
        const scenarios = readScenarios() as Record<string, unknown>[];
        const original = scenarios.find((s) => s.id === body.id) as Record<string, unknown> | undefined;
        if (!original) return NextResponse.json({ error: "Scenario introuvable" }, { status: 404 });
        const cloned = {
          ...original,
          id: "sc" + Date.now(),
          name: String(original.name || "Scenario") + " (copie)",
          triggerCount: 0,
          active: false,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        scenarios.push(cloned);
        writeScenarios(scenarios);
        addHistoryEntry(String(cloned.name), "Scenario duplique");
        return NextResponse.json({ scenario: cloned });
      }

      if (body.action === "toggle") {
        const scenarios = readScenarios() as Record<string, unknown>[];
        const idx = scenarios.findIndex((s) => s.id === body.id);
        if (idx >= 0) {
          scenarios[idx].active = body.active;
          writeScenarios(scenarios);
          addHistoryEntry(String(scenarios[idx].name || "Scenario"), body.active ? "Scenario active" : "Scenario desactive");
        }
        return NextResponse.json({ success: true, id: body.id, active: body.active });
      }

      if (body.action === "delete") {
        const scenarios = readScenarios() as Record<string, unknown>[];
        const target = scenarios.find((s) => s.id === body.id) as Record<string, unknown> | undefined;
        const filtered = scenarios.filter((s) => s.id !== body.id);
        writeScenarios(filtered);
        if (target) addHistoryEntry(String(target.name || "Scenario"), "Scenario supprime");
        return NextResponse.json({ success: true, id: body.id });
      }

      if (body.action === "history") {
        const history = readHistory();
        return NextResponse.json({ history });
      }

      return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }

    // Production: Prisma
    const { prisma } = await import("@/lib/prisma");
    const userId = session!.user!.id;

    if (body.action === "create") {
      if (!body.scenario || typeof body.scenario !== "object") {
        return NextResponse.json({ error: "Donnees du scenario manquantes" }, { status: 400 });
      }
      const sc = body.scenario as Record<string, unknown>;
      const newScenario = await prisma.automationScenario.create({
        data: {
          userId,
          name: String(sc.name || "Scenario"),
          trigger: String(sc.trigger || "order_accepted"),
          conditions: (sc.conditions as object) ?? undefined,
          actions: (sc.actions as object) ?? [],
          status: "BROUILLON",
        },
      });
      return NextResponse.json({
        scenario: {
          id: newScenario.id,
          name: newScenario.name,
          trigger: newScenario.trigger,
          active: newScenario.status === "ACTIF",
          triggerCount: newScenario.executionCount,
          createdAt: newScenario.createdAt.toISOString().slice(0, 10),
        },
      });
    }

    if (body.action === "update") {
      const sc = body.scenario as Record<string, unknown>;
      const updated = await prisma.automationScenario.update({
        where: { id: String(body.id), userId },
        data: {
          name: sc.name ? String(sc.name) : undefined,
          trigger: sc.trigger ? String(sc.trigger) : undefined,
          conditions: (sc.conditions as object) ?? undefined,
          actions: (sc.actions as object) ?? undefined,
        },
      });
      return NextResponse.json({
        scenario: { id: updated.id, name: updated.name, active: updated.status === "ACTIF" },
      });
    }

    if (body.action === "toggle") {
      const updated = await prisma.automationScenario.update({
        where: { id: String(body.id), userId },
        data: { status: body.active ? "ACTIF" : "PAUSE" },
      });
      return NextResponse.json({ success: true, id: updated.id, active: updated.status === "ACTIF" });
    }

    if (body.action === "delete") {
      await prisma.automationScenario.delete({ where: { id: String(body.id), userId } });
      return NextResponse.json({ success: true, id: body.id });
    }

    if (body.action === "history") {
      return NextResponse.json({ history: [] });
    }

    if (body.action === "duplicate") {
      const original = await prisma.automationScenario.findFirst({
        where: { id: String(body.id), userId },
      });
      if (!original) return NextResponse.json({ error: "Scenario introuvable" }, { status: 404 });
      const cloned = await prisma.automationScenario.create({
        data: {
          userId,
          name: original.name + " (copie)",
          trigger: original.trigger,
          conditions: (original.conditions as object) ?? undefined,
          actions: original.actions as object,
          status: "BROUILLON",
        },
      });
      return NextResponse.json({
        scenario: { id: cloned.id, name: cloned.name, active: false, triggerCount: 0 },
      });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err) {
    console.error("[Automation API] Error:", err);
    return NextResponse.json({ error: "Erreur serveur lors du traitement" }, { status: 500 });
  }
}
