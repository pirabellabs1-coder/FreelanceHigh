// FreelanceHigh — Admin Email Templates
// Uses the same sendEmail helper as the main email module (lib/email/index.ts)
// Domain noreply@freelancehigh.com is verified and DNS configured

import {
  sendWelcomeEmail,
  sendKycApprovedEmail,
  sendKycRejectedEmail,
  sendServiceApprovedEmail,
  sendServiceRejectedEmail,
} from "@/lib/email";

// Re-export existing email functions for convenience
export {
  sendKycApprovedEmail,
  sendKycRejectedEmail,
  sendServiceApprovedEmail,
  sendServiceRejectedEmail,
};

// ── Resend setup (same as lib/email/index.ts) ──

let _resend: InstanceType<typeof import("resend").Resend> | null = null;
function getResend() {
  if (!_resend) {
    const { Resend } = require("resend") as typeof import("resend");
    _resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
  }
  return _resend;
}

// Always use the verified domain — DNS is configured
const FROM_ADDRESS = "FreelanceHigh <noreply@freelancehigh.com>";

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "https://freelancehigh.com";
}

async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n========== EMAIL ADMIN (DEV — pas de RESEND_API_KEY) ==========`);
    console.log(`To: ${params.to} | Subject: ${params.subject}`);
    console.log(`================================================================\n`);
    return { data: { id: "dev-" + Date.now() }, error: null };
  }

  try {
    const resend = getResend();
    const result = await resend.emails.send({ ...params, from: FROM_ADDRESS });
    if (result.error) {
      console.error(`[ADMIN EMAIL FAIL] To: ${params.to}`, result.error);
    } else {
      console.log(`[ADMIN EMAIL OK] To: ${params.to} | Subject: ${params.subject} | ID: ${result.data?.id}`);
    }
    return result;
  } catch (err) {
    console.error(`[ADMIN EMAIL EXCEPTION] To: ${params.to}`, err);
    return { data: null, error: err };
  }
}

function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:40px;margin-bottom:40px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
    <div style="background:linear-gradient(135deg,#6C2BD9,#8B5CF6);padding:32px 40px;text-align:center;">
      <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;">FreelanceHigh</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:4px 0 0;letter-spacing:1px;">LA PLATEFORME FREELANCE</p>
    </div>
    <div style="padding:40px;">
      ${content}
    </div>
    <div style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">L'equipe FreelanceHigh</p>
      <p style="color:#d1d5db;font-size:10px;margin:12px 0 0;">© 2026 FreelanceHigh — Fondee par Lissanon Gildas</p>
    </div>
  </div>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#6C2BD9;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:16px 0;">${text}</a>`;
}

// ── Admin Broadcast Notification Email ──
export async function sendAdminBroadcastEmail(
  email: string,
  name: string,
  title: string,
  message: string
) {
  const html = emailLayout(`
    <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">${title}</h2>
    <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">Bonjour ${name},</p>
    <div style="background:#f9fafb;border-left:4px solid #6C2BD9;padding:16px 20px;margin:0 0 24px;border-radius:0 8px 8px 0;">
      <p style="color:#4b5563;margin:0;line-height:1.6;">${message}</p>
    </div>
    ${button("Acceder a la plateforme", getAppUrl())}
  `);
  return sendEmail({ to: email, subject: `${title} — FreelanceHigh`, html });
}

// ── Account Suspended Email ──
export async function sendAccountSuspendedEmail(email: string, name: string, reason?: string) {
  const html = emailLayout(`
    <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Compte suspendu</h2>
    <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">Bonjour ${name}, votre compte FreelanceHigh a ete temporairement suspendu.</p>
    ${reason ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:0 0 24px;"><p style="color:#dc2626;font-weight:600;margin:0 0 4px;">Motif :</p><p style="color:#991b1b;margin:0;">${reason}</p></div>` : ""}
    <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">Si vous pensez que cette suspension est une erreur, contactez notre equipe de support.</p>
    ${button("Contacter le support", `${getAppUrl()}/contact`)}
  `);
  return sendEmail({ to: email, subject: "Compte suspendu — FreelanceHigh", html });
}

// ── Account Banned Email ──
export async function sendAccountBannedEmail(email: string, name: string, reason?: string) {
  const html = emailLayout(`
    <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Compte banni</h2>
    <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">Bonjour ${name}, votre compte FreelanceHigh a ete definitivement banni.</p>
    ${reason ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:0 0 24px;"><p style="color:#dc2626;font-weight:600;margin:0 0 4px;">Motif :</p><p style="color:#991b1b;margin:0;">${reason}</p></div>` : ""}
    ${button("Contacter le support", `${getAppUrl()}/contact`)}
  `);
  return sendEmail({ to: email, subject: "Compte banni — FreelanceHigh", html });
}

// ── Admin Team Invitation Email ──
export async function sendAdminTeamInviteEmail(email: string, inviterName: string, role: string) {
  const roleLabels: Record<string, string> = {
    super_admin: "Super Administrateur",
    moderateur: "Moderateur",
    validateur_kyc: "Validateur KYC",
    analyste: "Analyste",
    support: "Support",
    financier: "Financier",
  };
  const roleLabel = roleLabels[role] || role;

  const html = emailLayout(`
    <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">Invitation a l'equipe d'administration</h2>
    <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
      Bonjour, <strong>${inviterName}</strong> vous invite a rejoindre l'equipe d'administration de FreelanceHigh
      en tant que <strong>${roleLabel}</strong>.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;margin:0 0 24px;">
      <p style="color:#16a34a;font-size:16px;font-weight:700;margin:0;">Role : ${roleLabel}</p>
    </div>
    ${button("Accepter l'invitation", `${getAppUrl()}/admin`)}
    <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.</p>
  `);
  return sendEmail({ to: email, subject: `Invitation equipe admin — FreelanceHigh`, html });
}
