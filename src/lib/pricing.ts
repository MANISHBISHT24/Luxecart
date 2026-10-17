/**
 * Price breakdown used for UI estimates in the cart.
 *
 * IMPORTANT: this is NOT authoritative. At checkout (Phase 6) the server
 * recomputes every figure from database prices, stock and validated coupons.
 * Prices are tax-inclusive (GST 18%), the usual convention for Indian retail.
 */
import { rupees } from "@/lib/utils";

export const GST_RATE = 0.18;
export const FREE_SHIPPING_THRESHOLD = rupees(5000);

export const SHIPPING_METHODS = [
  { id: "standard", label: "Standard delivery", eta: "5–7 business days", price: rupees(99) },
  { id: "express", label: "Express delivery", eta: "2–3 business days", price: rupees(249) },
] as const;
export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export function shippingCost(subtotal: number, method: ShippingMethodId = "standard") {
  if (subtotal === 0) return 0;
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_METHODS.find((m) => m.id === method)!.price;
}

export function computeTotals(
  lines: { unitPrice: number; qty: number }[],
  method: ShippingMethodId = "standard",
  discount = 0,
) {
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
  const shipping = shippingCost(subtotal, method);
  const total = Math.max(0, subtotal - discount) + shipping;
  // GST is included in the item prices; shown for transparency.
  const includedTax = Math.round((Math.max(0, subtotal - discount) * GST_RATE) / (1 + GST_RATE));
  return { subtotal, discount, shipping, includedTax, total };
}
