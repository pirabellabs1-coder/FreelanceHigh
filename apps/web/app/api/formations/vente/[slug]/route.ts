// GET /api/formations/vente/[slug] — Page publique du tunnel de vente

import { NextRequest, NextResponse } from "next/server";
import prisma from "@freelancehigh/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const funnel = await prisma.salesPage.findUnique({
      where: { slug },
      include: {
        formation: {
          select: {
            id: true,
            title: true,
            shortDesc: true,
            description: true,
            slug: true,
            thumbnail: true,
            previewVideo: true,
            price: true,
            originalPrice: true,
            isFree: true,
            duration: true,
            level: true,
            studentsCount: true,
            rating: true,
            reviewsCount: true,
            hasCertificate: true,
            learnPoints: true,
            instructeur: {
              select: {
                user: { select: { name: true, image: true } },
                bio: true,
              },
            },
          },
        },
      },
    });

    if (!funnel || !funnel.published) {
      return NextResponse.json({ error: "Page introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      funnel: {
        id: funnel.id,
        slug: funnel.slug,
        blocks: funnel.blocks,
        formation: funnel.formation,
      },
    });
  } catch (error) {
    console.error("[GET /api/formations/vente/[slug]]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
