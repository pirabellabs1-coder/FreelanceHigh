import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { z } from "zod";

const schema = z.object({
  formationsRole: z.enum(["apprenant", "instructeur"]),
});

const IS_DEV_MODE = process.env.DEV_MODE === "true";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Role invalide" }, { status: 400 });
    }

    const { formationsRole } = parsed.data;

    if (IS_DEV_MODE) {
      const { devStore } = await import("@/lib/dev/dev-store");
      devStore.update(session.user.id, { formationsRole } as Record<string, unknown>);
    } else {
      const { prisma } = await import("@freelancehigh/db");
      await prisma.user.update({
        where: { id: session.user.id },
        data: { formationsRole },
      });
    }

    return NextResponse.json({ success: true, formationsRole });
  } catch (err) {
    console.error("[UPDATE_FORMATIONS_ROLE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
