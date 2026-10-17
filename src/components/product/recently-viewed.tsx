"use client";

import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { Container, SectionHeading } from "@/components/ui/layout";
import { useProductsBySlugs } from "@/lib/catalog/client";
import { useRecentlyViewed } from "@/lib/recently-viewed";

function Items({ slugs }: { slugs: string[] }) {
  const items = useProductsBySlugs(slugs);
  return <ProductGrid products={items} />;
}

export function RecentlyViewed({ excludeSlug }: { excludeSlug: string }) {
  const slugs = useRecentlyViewed().filter((s) => s !== excludeSlug).slice(0, 4);
  if (slugs.length === 0) return null;
  return (
    <section aria-label="Recently viewed" className="pt-24">
      <Container>
        <SectionHeading eyebrow="Pick up where you left off" title="Recently viewed" />
        <Suspense fallback={<div className="skeleton h-72 w-full" aria-hidden />}>
          <Items slugs={slugs} />
        </Suspense>
      </Container>
    </section>
  );
}
