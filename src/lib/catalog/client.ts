"use client";

import { use } from "react";
import type { ProductListItem } from "@/lib/catalog/types";

const cache = new Map<string, Promise<ProductListItem[]>>();

/** Client-side fetch of public catalog cards, memoised per slug list. */
export function fetchProductsBySlugs(slugs: string[]): Promise<ProductListItem[]> {
  const key = slugs.join(",");
  let promise = cache.get(key);
  if (!promise) {
    promise = slugs.length
      ? fetch(`/api/catalog/products?slugs=${encodeURIComponent(key)}`)
          .then((r) => {
            if (!r.ok) throw new Error("Failed to load products");
            return r.json() as Promise<{ items: ProductListItem[] }>;
          })
          .then((d) => d.items)
          .catch((e) => {
            cache.delete(key);
            throw e;
          })
      : Promise.resolve([]);
    cache.set(key, promise);
  }
  return promise;
}

/** Suspends until the cards for the given slugs have loaded. */
export function useProductsBySlugs(slugs: string[]) {
  const items = use(fetchProductsBySlugs(slugs));
  // Preserve the caller's ordering (e.g. most recently viewed first).
  const order = new Map(slugs.map((s, i) => [s, i]));
  return items.slice().sort((a, b) => order.get(a.slug)! - order.get(b.slug)!);
}
