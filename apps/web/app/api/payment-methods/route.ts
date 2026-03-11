import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

// In-memory store — will be replaced by Stripe + CinetPay in production
const paymentMethods: Array<{
  id: string;
  userId: string;
  type: "card" | "momo" | "bank" | "paypal";
  label: string;
  last4?: string;
  brand?: string;
  provider?: string;
  phone?: string;
  email?: string;
  bankName?: string;
  iban?: string;
  expiresAt?: string;
  isDefault: boolean;
  createdAt: string;
}> = [
  {
    id: "pm-1",
    userId: "u6",
    type: "card",
    label: "Visa ****4242",
    last4: "4242",
    brand: "Visa",
    expiresAt: "12/28",
    isDefault: true,
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "pm-2",
    userId: "u6",
    type: "momo",
    label: "Orange Money",
    provider: "Orange Money",
    phone: "+221 77 *** ** 45",
    isDefault: false,
    createdAt: "2026-02-05T14:00:00Z",
  },
  {
    id: "pm-3",
    userId: "u6",
    type: "paypal",
    label: "PayPal",
    email: "c***@gmail.com",
    isDefault: false,
    createdAt: "2026-02-20T09:00:00Z",
  },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const userMethods = paymentMethods.filter((m) => m.userId === userId);
  return NextResponse.json({ methods: userMethods });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const { action } = body;

  if (action === "delete") {
    const idx = paymentMethods.findIndex((m) => m.id === body.id && m.userId === userId);
    if (idx !== -1) paymentMethods.splice(idx, 1);
    return NextResponse.json({ success: true });
  }

  if (action === "set-default") {
    paymentMethods.forEach((m) => {
      if (m.userId === userId) m.isDefault = m.id === body.id;
    });
    return NextResponse.json({ success: true });
  }

  // Add new method
  const method = {
    id: `pm-${Date.now()}`,
    userId,
    type: body.type || "card",
    label: body.label || "",
    last4: body.last4,
    brand: body.brand,
    provider: body.provider,
    phone: body.phone,
    email: body.email,
    bankName: body.bankName,
    iban: body.iban,
    expiresAt: body.expiresAt,
    isDefault: paymentMethods.filter((m) => m.userId === userId).length === 0,
    createdAt: new Date().toISOString(),
  };
  paymentMethods.push(method);
  return NextResponse.json({ success: true, method });
}
