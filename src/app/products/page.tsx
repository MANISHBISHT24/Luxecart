import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductListing } from "@/components/product/product-listing";
import { ListingSkeleton } from "@/components/product/listing-skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse every LuxeCart product: fashion, electronics, home, beauty and lifestyle essentials.",
};

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All products" }]} />
      <Container className="py-12 sm:py-16">
        <header className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">The collection</p>
          <h1 className="text-5xl sm:text-6xl">All products</h1>
          <p className="mt-4 text-ink-soft">
            Search, filter and sort the full LuxeCart range across all five departments.
          </p>
        </header>
        <Suspense fallback={<ListingSkeleton />}>
          <ProductListing basePath="/products" searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
