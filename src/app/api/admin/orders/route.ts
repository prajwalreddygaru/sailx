import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch sample orders
    const sampleOrders = await db.sampleOrder.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true, mobile: true } },
        product: { select: { title: true, images: true } },
        agent: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch catalogue purchases
    const cataloguePurchases = await db.cataloguePurchase.findMany({
      include: {
        item: { select: { title: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Look up user phone for catalogue purchases
    const userIds = cataloguePurchases.map((p: any) => p.userId).filter(Boolean);
    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, phone: true, mobile: true },
        })
      : [];
    const userPhoneMap = new Map(users.map((u) => [u.id, u.phone || u.mobile]));

    // Transform sample orders
    const sampleFormatted = sampleOrders.map((o: any) => ({
      id: o.id,
      type: "sample" as const,
      code: o.code,
      status: o.status,
      paymentStatus: o.status === "PAID" ? "PAID" : "PENDING",
      quantity: o.quantity ?? 1,
      amount: o.quotedPrice ?? 0,
      quotedPrice: o.quotedPrice,
      isBulk: o.isBulk ?? false,
      trackingInfo: o.trackingInfo,
      createdAt: o.createdAt?.toISOString?.() ?? o.createdAt,
      productTitle: o.productTitle ?? o.product?.title ?? "",
      product: {
        title: o.product?.title ?? o.productTitle ?? "",
        images: o.product?.images ?? [],
      },
      user: {
        name: o.user?.name ?? "",
        email: o.user?.email ?? "",
        phone: o.user?.phone || o.user?.mobile || null,
      },
      agent: o.agent ? { name: o.agent.name } : undefined,
    }));

    // Transform catalogue purchases
    const catalogueFormatted = cataloguePurchases.map((p: any) => ({
      id: p.id,
      type: "catalogue" as const,
      code: `CAT-${p.id.slice(-6).toUpperCase()}`,
      status: p.paymentStatus === "PAID" ? "PAID" : "PAYMENT_PENDING",
      paymentStatus: p.paymentStatus ?? "PENDING",
      quantity: 1,
      amount: p.totalAmount ?? 0,
      quotedPrice: p.totalAmount,
      isBulk: false,
      trackingInfo: null,
      createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
      productTitle: p.item?.title ?? "",
      product: {
        title: p.item?.title ?? "",
        images: p.item?.image ? [p.item.image] : [],
      },
      user: {
        name: p.userName ?? "",
        email: p.userEmail ?? "",
        phone: userPhoneMap.get(p.userId) || null,
      },
      agent: undefined,
    }));

    // Merge and sort by createdAt desc
    const allOrders = [...sampleFormatted, ...catalogueFormatted].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allOrders);
  } catch (e: any) {
    console.error("[GET /api/admin/orders]", e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
