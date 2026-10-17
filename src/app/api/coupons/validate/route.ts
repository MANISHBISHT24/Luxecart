import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const couponSchema = z.object({
  code: z.string().trim().min(2).max(30),
  subtotal: z.number().int().min(0), // subtotal in paise
});

interface PromoCoupon {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number; // e.g. 15 for 15% or 50000 for ₹500 in paise
  minOrderAmountPaise?: number;
  maxDiscountPaise?: number;
  isActive: boolean;
}

const FALLBACK_COUPONS: Record<string, PromoCoupon> = {
  WELCOME10: {
    code: "WELCOME10",
    description: "10% off your initial luxury acquisition",
    discountType: "PERCENTAGE",
    value: 10,
    minOrderAmountPaise: 0,
    maxDiscountPaise: 500_000, // max ₹5,000
    isActive: true,
  },
  LUXE15: {
    code: "LUXE15",
    description: "15% off curated orders over ₹10,000",
    discountType: "PERCENTAGE",
    value: 15,
    minOrderAmountPaise: 1_000_000, // ₹10,000 in paise
    maxDiscountPaise: 1_000_000, // max ₹10,000
    isActive: true,
  },
  ARCHIVE20: {
    code: "ARCHIVE20",
    description: "20% VIP collector discount over ₹25,000",
    discountType: "PERCENTAGE",
    value: 20,
    minOrderAmountPaise: 2_500_000, // ₹25,000 in paise
    maxDiscountPaise: 2_000_000, // max ₹20,000
    isActive: true,
  },
  FLAT500: {
    code: "FLAT500",
    description: "Flat ₹500 off orders over ₹3,000",
    discountType: "FIXED_AMOUNT",
    value: 50_000, // ₹500 in paise
    minOrderAmountPaise: 300_000, // ₹3,000 in paise
    isActive: true,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = couponSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { valid: false, message: "Invalid coupon request parameters" },
        { status: 400 }
      );
    }

    const { code, subtotal } = result.data;
    const cleanCode = code.toUpperCase().trim();

    // 1. Try DB lookup
    let couponRecord: PromoCoupon | null = null;
    try {
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });
      if (dbCoupon && dbCoupon.isActive) {
        if (dbCoupon.expiresAt && new Date(dbCoupon.expiresAt) < new Date()) {
          return NextResponse.json(
            { valid: false, message: "This coupon code has expired" },
            { status: 400 }
          );
        }
        if (dbCoupon.usageLimit && dbCoupon.usageCount >= dbCoupon.usageLimit) {
          return NextResponse.json(
            { valid: false, message: "This promotional code usage limit has been reached" },
            { status: 400 }
          );
        }
        couponRecord = {
          code: dbCoupon.code,
          description: dbCoupon.description || "",
          discountType: dbCoupon.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
          value:
            dbCoupon.discountType === "PERCENTAGE"
              ? Number(dbCoupon.value)
              : Math.round(Number(dbCoupon.value) * 100),
          minOrderAmountPaise: dbCoupon.minOrderAmount
            ? Math.round(Number(dbCoupon.minOrderAmount) * 100)
            : undefined,
          maxDiscountPaise: dbCoupon.maxDiscount
            ? Math.round(Number(dbCoupon.maxDiscount) * 100)
            : undefined,
          isActive: dbCoupon.isActive,
        };
      }
    } catch {
      // Fallback if DB is offline
    }

    // 2. Fall back to promo catalog
    if (!couponRecord) {
      couponRecord = FALLBACK_COUPONS[cleanCode] || null;
    }

    if (!couponRecord || !couponRecord.isActive) {
      return NextResponse.json(
        { valid: false, message: "Invalid or inactive promotional code" },
        { status: 404 }
      );
    }

    // Minimum order amount requirement
    if (couponRecord.minOrderAmountPaise && subtotal < couponRecord.minOrderAmountPaise) {
      const minInRupees = Math.round(couponRecord.minOrderAmountPaise / 100);
      return NextResponse.json(
        {
          valid: false,
          message: `This code requires a minimum order value of ₹${minInRupees.toLocaleString("en-IN")}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount in paise
    let discountPaise = 0;
    if (couponRecord.discountType === "PERCENTAGE") {
      discountPaise = Math.round((subtotal * couponRecord.value) / 100);
      if (couponRecord.maxDiscountPaise && discountPaise > couponRecord.maxDiscountPaise) {
        discountPaise = couponRecord.maxDiscountPaise;
      }
    } else {
      discountPaise = Math.min(couponRecord.value, subtotal);
    }

    return NextResponse.json({
      valid: true,
      code: couponRecord.code,
      description: couponRecord.description,
      discountType: couponRecord.discountType,
      value: couponRecord.value,
      discountPaise,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Unable to validate coupon at this time" },
      { status: 500 }
    );
  }
}
