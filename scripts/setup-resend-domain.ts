#!/usr/bin/env npx tsx
/**
 * FreelanceHigh — Setup Resend Domain
 *
 * Ce script ajoute le domaine freelancehigh.com dans Resend
 * et affiche les enregistrements DNS a configurer.
 *
 * Usage: npx tsx scripts/setup-resend-domain.ts
 *
 * Apres avoir configure les DNS, passer RESEND_DOMAIN_VERIFIED="true" dans .env.local
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DOMAIN = "freelancehigh.com";

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY non defini. Ajoutez-le dans .env.local");
  process.exit(1);
}

async function main() {
  console.log(`\nAjout du domaine ${DOMAIN} dans Resend...\n`);

  // Check existing domains
  const domainsRes = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  const domains = await domainsRes.json();

  const existing = domains.data?.find((d: { name: string }) => d.name === DOMAIN);
  if (existing) {
    console.log(`Le domaine ${DOMAIN} existe deja (status: ${existing.status})\n`);
    showDnsRecords(existing);
    return;
  }

  // Add domain
  const addRes = await fetch("https://api.resend.com/domains", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: DOMAIN }),
  });

  if (!addRes.ok) {
    const err = await addRes.json();
    console.error("Erreur lors de l'ajout du domaine:", err);
    process.exit(1);
  }

  const domain = await addRes.json();
  console.log(`Domaine ${DOMAIN} ajoute avec succes (ID: ${domain.id})\n`);
  showDnsRecords(domain);
}

function showDnsRecords(domain: { records?: { type: string; name: string; value: string; priority?: number }[] }) {
  if (!domain.records?.length) {
    console.log("Aucun enregistrement DNS retourne. Verifiez dans le dashboard Resend.");
    return;
  }

  console.log("=== ENREGISTREMENTS DNS A CONFIGURER ===\n");
  console.log("Ajoutez ces enregistrements dans votre registrar DNS (Vercel, Cloudflare, etc.):\n");

  for (const record of domain.records) {
    console.log(`Type: ${record.type}`);
    console.log(`Nom:  ${record.name}`);
    console.log(`Valeur: ${record.value}`);
    if (record.priority) console.log(`Priorite: ${record.priority}`);
    console.log("---");
  }

  console.log("\nApres configuration DNS, attendez la propagation (quelques minutes a quelques heures).");
  console.log("Puis passez RESEND_DOMAIN_VERIFIED=\"true\" dans .env.local et .env.production.");
  console.log("Les emails seront alors envoyes depuis noreply@freelancehigh.com");
}

main().catch(console.error);
