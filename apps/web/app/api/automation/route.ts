import { NextResponse } from "next/server";

// Demo automation data
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

const DEMO_SCENARIOS = [
  {
    id: "sc1", name: "Accueil nouveau client", active: true,
    trigger: TRIGGERS[1],
    conditions: [{ condition: CONDITIONS[0], value: "Matin (6h-12h)" }],
    actions: [{ action: ACTIONS[0], message: "Bonjour ! Merci pour votre interet. Comment puis-je vous aider ?" }],
    triggerCount: 28, lastTriggered: "2026-03-08", createdAt: "2026-01-10",
  },
  {
    id: "sc2", name: "Rappel commande livree", active: true,
    trigger: TRIGGERS[3],
    conditions: [],
    actions: [{ action: ACTIONS[2], message: "Votre commande a ete livree ! N'hesitez pas a valider si tout est conforme." }],
    triggerCount: 15, lastTriggered: "2026-03-05", createdAt: "2026-01-15",
  },
  {
    id: "sc3", name: "Client fidele - reduction", active: false,
    trigger: TRIGGERS[2],
    conditions: [{ condition: CONDITIONS[1], value: "3" }, { condition: CONDITIONS[2], value: "100" }],
    actions: [{ action: ACTIONS[5], message: "Merci pour votre fidelite ! Voici 10% de reduction sur votre prochaine commande." }],
    triggerCount: 5, lastTriggered: "2026-02-20", createdAt: "2026-02-01",
  },
];

export async function GET() {
  return NextResponse.json({
    triggers: TRIGGERS,
    conditions: CONDITIONS,
    actions: ACTIONS,
    scenarios: DEMO_SCENARIOS,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "create") {
    const newScenario = {
      id: "sc" + Date.now(),
      ...body.scenario,
      triggerCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    return NextResponse.json({ scenario: newScenario });
  }

  if (body.action === "toggle") {
    return NextResponse.json({ success: true, id: body.id, active: body.active });
  }

  if (body.action === "delete") {
    return NextResponse.json({ success: true, id: body.id });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
