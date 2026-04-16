import { NextResponse } from "next/server";

/**
 * POST /api/formations/newsletter
 * Subscribe an email to the newsletter.
 *
 * Currently stores via console + future integration with Resend audiences.
 * Returns 200 if email is valid, 400 if invalid.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }

    // Log subscription (replace with real persistence later)
    console.log(`[newsletter] New subscription: ${email}`);

    // TODO: integrate with Resend audiences when RESEND_AUDIENCE_ID is configured:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });

    return NextResponse.json({ data: { ok: true, email } });
  } catch (err) {
    console.error("[newsletter POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
