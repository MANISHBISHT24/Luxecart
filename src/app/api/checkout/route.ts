import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getProductById, getProductBySlug } from "@/lib/catalog/queries";
import type { Variant } from "@/lib/catalog/types";
import { createOrder } from "@/lib/orders";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().trim().min(2),
    email: z.string().trim().email(),
    addressLine1: z.string().trim().min(5),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    postalCode: z.string().trim().length(6, "PIN code must be 6 digits"),
    phone: z.string().trim().min(10),
  }),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
  couponCode: z.string().trim().optional(),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      productSlug: z.string().optional(),
      variantId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    })
  ).min(1, "Cart cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid checkout payload" },
        { status: 400 }
      );
    }

    const { shippingAddress, shippingMethod, paymentMethod, couponCode, items } = parsed.data;

    // Validate lines server-side and calculate price
    let subtotalPaise = 0;
    const orderItems = [];

    for (const item of items) {
      const product =
        (item.productId ? await getProductById(item.productId) : null) ||
        (item.productSlug ? await getProductBySlug(item.productSlug) : null);

      if (!product) {
        return NextResponse.json(
          { ok: false, error: `Product ${item.productSlug || item.productId} was not found` },
          { status: 400 }
        );
      }
      const variant = product.variants.find((v: Variant) => v.id === item.variantId) || product.variants[0];
      const unitPricePaise = variant.price ?? product.price;
      const lineTotalPaise = unitPricePaise * item.quantity;
      subtotalPaise += lineTotalPaise;

      orderItems.push({
        productName: product.name,
        productSku: variant.sku,
        variantLabel: variant.label,
        unitPricePaise,
        quantity: item.quantity,
        totalPaise: lineTotalPaise,
        image: product.images[0] || "",
      });
    }

    // Coupon discount calculation
    let discountPaise = 0;
    if (couponCode) {
      const clean = couponCode.toUpperCase().trim();
      if (clean === "WELCOME10") {
        discountPaise = Math.round((subtotalPaise * 10) / 100);
      } else if (clean === "LUXE15" && subtotalPaise >= 1_000_000) {
        discountPaise = Math.round((subtotalPaise * 15) / 100);
      } else if (clean === "ARCHIVE20" && subtotalPaise >= 2_500_000) {
        discountPaise = Math.round((subtotalPaise * 20) / 100);
      } else if (clean === "FLAT500" && subtotalPaise >= 300_000) {
        discountPaise = 50_000;
      }
    }

    // Shipping calculation
    const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
    let shippingPaise = 0;
    if (shippingMethod === "express") {
      shippingPaise = 150_000; // ₹1,500
    } else {
      shippingPaise = discountedSubtotal >= 500_000 ? 0 : 25_000; // Free over ₹5,000 else ₹250
    }

    // 18% GST calculation
    const taxPaise = Math.round((discountedSubtotal + shippingPaise) * 0.18);
    const totalPaise = discountedSubtotal + shippingPaise + taxPaise;

    // Create the order record
    const order = await createOrder({
      userId: session?.id || null,
      guestEmail: shippingAddress.email,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotalPaise,
      discountPaise,
      shippingPaise,
      taxPaise,
      totalPaise,
      couponCode: couponCode || null,
      items: orderItems,
    });

    if (paymentMethod === "COD") {
      return NextResponse.json({
        ok: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        redirectUrl: `/orders/${order.id}`,
        message: "Order placed successfully with Cash on Delivery",
      });
    }

    // Razorpay integration / test sandbox
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_luxecart2026";
    const razorpayOrderId = `order_${Math.random().toString(36).slice(2, 14)}`;

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalPaise,
      redirectUrl: `/orders/${order.id}`,
      razorpay: {
        key: keyId,
        orderId: razorpayOrderId,
        amount: totalPaise,
        currency: "INR",
        name: "LuxeCart",
        description: `Order ${order.orderNumber}`,
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
      },
    });
  } catch (error) {
    console.error("Checkout submission error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to initialize checkout" },
      { status: 500 }
    );
  }
}
