import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders";

const updateSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURNED",
  ]),
  trackingNumber: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Forbidden: Administrator credentials required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid status parameters" }, { status: 400 });
    }

    const { orderId, status, trackingNumber } = parsed.data;
    const updated = await updateOrderStatus(orderId, status as OrderStatus, trackingNumber);

    return NextResponse.json({
      ok: true,
      order: updated,
      message: `Order status transitioned to ${status}`,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ ok: false, error: "Failed to update order status" }, { status: 500 });
  }
}
