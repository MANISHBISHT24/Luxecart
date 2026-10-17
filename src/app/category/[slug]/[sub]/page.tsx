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
  return (await getCategories()).flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

async function resolve(params: PageProps<"/category/[slug]/[sub]">["params"]) {
  const { slug, sub } = await params;
  const category = await getCategory(slug);
  const subcategory = category?.subcategories.find((s) => s.slug === sub);
  return category && subcategory ? { category, subcategory } : null;
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]/[sub]">): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  return {
    title: `${found.subcategory.name} — ${found.category.name}`,
    description: `Shop ${found.subcategory.name.toLowerCase()} in ${found.category.name} at LuxeCart.`,
    alternates: { canonical: `/category/${found.category.slug}/${found.subcategory.slug}` },
  };
}

export default async function SubcategoryPage({ params, searchParams }: PageProps<"/category/[slug]/[sub]">) {
  const found = await resolve(params);
  if (!found) notFound();
  const { category, subcategory } = found;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: `/category/${category.slug}` },
          { label: subcategory.name },
        ]}
      />
      <Container className="py-12 sm:py-16">
        <header className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">{category.name}</p>
          <h1 className="text-5xl sm:text-6xl">{subcategory.name}</h1>
        </header>
        <Suspense fallback={<ListingSkeleton />}>
          <ProductListing
            basePath={`/category/${category.slug}/${subcategory.slug}`}
            searchParams={searchParams}
            scope={{ category: category.slug, sub: subcategory.slug }}
            heading={subcategory.name}
          />
        </Suspense>
      </Container>
    </>
  );
}
