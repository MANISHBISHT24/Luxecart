"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed external store (no provider needed).
 * Used for the guest cart and guest wishlist. Phase 4/5 adds server-side
 * persistence for authenticated users; this store remains the guest fallback.
 * Stored data is untrusted: every read passes through `parse` (zod).
 */
export function createLocalStore<T>(key: string, empty: T, parse: (raw: unknown) => T) {
  let cache: T = empty;
  let loaded = false;
  const listeners = new Set<() => void>();

  const read = (text: string | null): T => {
    if (!text) return empty;
    try {
      return parse(JSON.parse(text));
    } catch {
      return empty;
    }
  };

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      cache = read(window.localStorage.getItem(key));
    } catch {
      cache = empty;
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      cache = read(e.newValue);
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const getSnapshot = () => {
    load();
    return cache;
  };

  const set = (next: T) => {
    cache = next;
    loaded = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage may be full or disabled; in-memory state still works */
    }
    emit();
  };

  const useStore = () => useSyncExternalStore(subscribe, getSnapshot, () => empty);

  return { useStore, get: getSnapshot, set };
}
