import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
  name: z.string().min(2, "Le nom est requis"),
  role: z.enum(["freelance", "client", "agence"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;

    const { prisma } = await import("@freelancehigh/db");

    // Verifier que l'email n'est pas deja utilise
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Un compte avec cet email existe deja" }, { status: 409 });
    }

    // Hasher le mot de passe — JAMAIS stocker en clair
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role.toUpperCase() as "FREELANCE" | "CLIENT" | "AGENCE",
        plan: "GRATUIT",
        kyc: 1,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // TODO: Envoyer email de bienvenue via Resend quand configure
    // await sendWelcomeEmail(user.email, user.name);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role.toLowerCase() },
    }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
