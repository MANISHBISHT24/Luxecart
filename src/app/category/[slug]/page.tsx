import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingSkeleton } from "@/components/product/listing-skeleton";
import { ProductListing } from "@/components/product/product-listing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";
import { getCategories, getCategory } from "@/lib/catalog/queries";

export const instant = false;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return { title: category.name, description: category.tagline, alternates: { canonical: `/category/${category.slug}` } };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "All products", href: "/products" }, { label: category.name }]}
      />
      <Container className="py-12 sm:py-16">
        <header className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Department</p>
          <h1 className="text-5xl sm:text-6xl">{category.name}</h1>
          <p className="mt-4 text-ink-soft">{category.tagline}</p>
        </header>
        <Suspense fallback={<ListingSkeleton />}>
          <ProductListing
            basePath={`/category/${category.slug}`}
            searchParams={searchParams}
            scope={{ category: category.slug }}
            heading={category.name}
          />
        </Suspense>
      </Container>
    </>
  );
}
