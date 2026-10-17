import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { updateOrderStatus } from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Idempotency check via WebhookEvent
    try {
      const existing = await prisma.webhookEvent.findUnique({
        where: { eventId },
      });
      if (existing) {
        return NextResponse.json({ received: true, note: "Already processed" });
      }

      await prisma.webhookEvent.create({
        data: {
          provider: "razorpay",
          eventId,
          eventType: eventType || "unknown",
          payload,
          processed: true,
          processedAt: new Date(),
        },
      });
    } catch {
      // Continue if DB is offline
    }

    // Process event
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = payload.payload?.payment?.entity;
      const orderNotes = payment?.notes || payload.payload?.order?.entity?.notes;
      const orderId = orderNotes?.orderId || payment?.order_id;
      if (orderId) {
        await updateOrderStatus(orderId, "PAID");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
