import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { eventTypeLabel } from "@/lib/event-type";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  try {
    const { eventId, makeActive = true, order } = await req.json();
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    const ev = await (prisma as any).event.findUnique({ where: { id: eventId } });
    if (!ev) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const imageUrl = Array.isArray(ev.images) && ev.images.length > 0 ? ev.images[0] : null;
    const ctaHref  = `/events/${ev.id}`;

    const existing = await (prisma as any).banner.findFirst({ where: { ctaHref } });
    let banner;
    if (existing) {
      banner = await (prisma as any).banner.update({
        where: { id: existing.id },
        data: {
          title: ev.title,
          subtitle: `${ev.city}, ${ev.country}`,
          ctaLabel: "View Package Details",
          ctaHref,
          imageUrl,
          isActive: makeActive,
        },
      });
    } else {
      const nextOrder = order ?? (await (prisma as any).banner.count()) + 1;
      banner = await (prisma as any).banner.create({
        data: {
          title: ev.title,
          subtitle: `${ev.city}, ${ev.country}`,
          ctaLabel: "View Package Details",
          ctaHref,
          badge: eventTypeLabel(ev.eventType),
          imageUrl,
          gradient: "from-brand-950 via-brand-900 to-background",
          isActive: makeActive,
          order: nextOrder,
        },
      });
    }

    return NextResponse.json({ ok: true, banner });
  } catch (e) {
    console.error("[POST /api/admin/banners/from-event]", e);
    return NextResponse.json({ error: "Failed to create banner from event" }, { status: 500 });
  }
}
