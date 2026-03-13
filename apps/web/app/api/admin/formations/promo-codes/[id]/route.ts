import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import prisma from "@freelancehigh/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { code, discountPct, maxUsage, expiresAt, isActive, formationIds } = body;

  const promoCode = await prisma.promoCode.update({
    where: { id },
    data: {
      ...(code !== undefined && { code: code.toUpperCase() }),
      ...(discountPct !== undefined && { discountPct: Number(discountPct) }),
      ...(maxUsage !== undefined && { maxUsage: maxUsage ? Number(maxUsage) : null }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(isActive !== undefined && { isActive }),
      ...(formationIds !== undefined && { formationIds }),
    },
  });

  return NextResponse.json({ promoCode });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.promoCode.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
