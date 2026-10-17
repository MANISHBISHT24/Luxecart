"use client";

import { z } from "zod";
import { createLocalStore } from "@/lib/local-store";

/**
 * Guest cart (browser only).
 * Lines hold a display snapshot so the cart renders without a round trip.
 * These values are NOT trusted for money: Phase 6 re-prices every line from
 * the database on the server at checkout.
 */
export const MAX_LINE_QTY = 10;

const lineSchema = z.object({
  variantId: z.string().max(80),
  productSlug: z.string().max(120),
  name: z.string().max(160),
  variantLabel: z.string().max(120),
  sku: z.string().max(80),
  unitPrice: z.number().int().min(0),
  image: z.string().max(200).optional(),
  qty: z.number().int().min(1).max(MAX_LINE_QTY),
  maxQty: z.number().int().min(1).max(MAX_LINE_QTY),
});
export type CartLine = z.infer<typeof lineSchema>;

const store = createLocalStore<CartLine[]>("luxecart.cart.v1", [], (raw) =>
  z.array(lineSchema).max(50).parse(raw),
);

export const useCart = store.useStore;

export function addToCart(line: Omit<CartLine, "qty" | "maxQty">, qty: number, stock: number) {
  const maxQty = Math.max(1, Math.min(stock, MAX_LINE_QTY));
  const lines = store.get();
  const existing = lines.find((l) => l.variantId === line.variantId);
  if (existing) {
    store.set(
      lines.map((l) =>
        l.variantId === line.variantId
          ? { ...l, ...line, maxQty, qty: Math.min(l.qty + qty, maxQty) }
          : l,
      ),
    );
  } else {
    store.set([...lines, { ...line, maxQty, qty: Math.min(qty, maxQty) }]);
  }
}

export function setCartQty(variantId: string, qty: number) {
  store.set(
    store
      .get()
      .map((l) => (l.variantId === variantId ? { ...l, qty: Math.max(1, Math.min(qty, l.maxQty)) } : l)),
  );
}

export function removeFromCart(variantId: string) {
  store.set(store.get().filter((l) => l.variantId !== variantId));
}

export function clearCart() {
  store.set([]);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}
