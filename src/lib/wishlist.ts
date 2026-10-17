"use client";

import { z } from "zod";
import { createLocalStore } from "@/lib/local-store";

/**
 * Guest wishlist (browser only). Server-persisted wishlists for authenticated
 * users arrive with Phase 4/5; this is only the interim guest store.
 */
const store = createLocalStore<string[]>("luxecart.wishlist.v1", [], (raw) =>
  z.array(z.string().max(120)).max(200).parse(raw),
);

export const useWishlist = store.useStore;

export function toggleWishlist(slug: string) {
  const list = store.get();
  store.set(list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);
}

export function removeFromWishlist(slug: string) {
  store.set(store.get().filter((s) => s !== slug));
}
