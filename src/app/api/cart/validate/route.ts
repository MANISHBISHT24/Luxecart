import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProductBySlug, getProductById } from "@/lib/catalog/queries";
import type { Variant } from "@/lib/catalog/types";
import { computeTotals } from "@/lib/pricing";

const validateCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    })
  ),
  couponCode: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = validateCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid cart payload" },
        { status: 400 }
      );
    }

    const { items } = parsed.data;
    const validatedItems = [];
    let subtotalPaise = 0;
    const warnings: string[] = [];

    for (const item of items) {
      // Find product
      const product = await getProductById(item.productId);
      if (!product) {
        warnings.push(`Item ${item.productId} is no longer available in the catalogue.`);
        continue;
      }

      const variant = product.variants.find((v: Variant) => v.id === item.variantId) || product.variants[0];
      if (!variant) {
        warnings.push(`The selected configuration for ${product.name} is unavailable.`);
        continue;
      }

      const availableStock = variant.stock;
      let effectiveQty = item.quantity;
      if (availableStock <= 0) {
        warnings.push(`${product.name} (${variant.label}) is currently out of stock.`);
        effectiveQty = 0;
      } else if (item.quantity > availableStock) {
        warnings.push(
          `Only ${availableStock} units available for ${product.name} (${variant.label}). Quantity updated.`
        );
        effectiveQty = availableStock;
      }

      const unitPricePaise = variant.price ?? product.price;
      const lineTotalPaise = unitPricePaise * effectiveQty;
      subtotalPaise += lineTotalPaise;

      validatedItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || "",
        variantId: variant.id,
        variantLabel: variant.label,
        requestedQuantity: item.quantity,
        confirmedQuantity: effectiveQty,
        availableStock,
        unitPricePaise,
        lineTotalPaise,
      });
    }

    const pricing = computeTotals(
      validatedItems.map((i) => ({ unitPrice: i.unitPricePaise, qty: i.confirmedQuantity }))
    );

    return NextResponse.json({
      ok: true,
      items: validatedItems,
      subtotalPaise: pricing.subtotal,
      shippingPaise: pricing.shipping,
      taxPaise: pricing.includedTax,
      totalPaise: pricing.total,
      freeShippingThresholdPaise: 500_000,
      qualifiesForFreeShipping: pricing.shipping === 0,
      warnings,
    });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to validate cart lines" },
      { status: 500 }
    );
  }
}
