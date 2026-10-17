"use client";

import { Heart } from "lucide-react";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { EmptyState, Notice } from "@/components/ui/form";
import { useProductsBySlugs } from "@/lib/catalog/client";
import { useWishlist } from "@/lib/wishlist";

function Items({ slugs }: { slugs: string[] }) {
  const items = useProductsBySlugs(slugs);
  return <ProductGrid products={items} />;
}

export function WishlistView() {
  const slugs = useWishlist();

  return (
    <div className="space-y-8">
      <Notice title="Saved on this device">
        Your wishlist is stored in this browser. Sign-in sync (saved to your account) arrives with the authentication phase.
      </Notice>
      {slugs.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-7 w-7 stroke-[1.3]" />}
          title="Nothing saved yet"
          description="Tap the heart on any product to keep it here for later."
          actionHref="/products"
          actionLabel="Browse products"
        />
      ) : (
        <Suspense fallback={<div className="skeleton h-80 w-full" aria-busy="true" />}>
          <Items slugs={slugs} />
        </Suspense>
      )}
    </div>
  );
}
