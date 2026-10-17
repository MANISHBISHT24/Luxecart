"use client";

import { useEffect } from "react";
import { z } from "zod";
import { createLocalStore } from "@/lib/local-store";

const MAX = 8;
const store = createLocalStore<string[]>("luxecart.recent.v1", [], (raw) =>
  z.array(z.string().max(120)).max(MAX).parse(raw),
);

export const useRecentlyViewed = store.useStore;

export function recordView(slug: string) {
  const next = [slug, ...store.get().filter((s) => s !== slug)].slice(0, MAX);
  store.set(next);
}

/** Records the current product as viewed (browser-only, never sent to the server). */
export function RecordView({ slug }: { slug: string }) {
  useEffect(() => {
    recordView(slug);
  }, [slug]);
  return null;
}
