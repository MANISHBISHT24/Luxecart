import { ChevronDown, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/product/gallery";
import { ProductGrid } from "@/components/product/product-card";
import { ProductPurchase } from "@/components/product/product-purchase";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Price, Rating } from "@/components/ui/rating-price";
import {
  getAllProductSlugs,
  getCategory,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog/queries";
import { RecordView } from "@/lib/recently-viewed";
import { SITE } from "@/lib/site";

export const instant = false;

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([getCategory(product.categorySlug), getRelatedProducts(product)]);
  const sub = category?.subcategories.find((s) => s.slug === product.subcategorySlug);
  const anyStock = product.variants.some((v) => v.stock > 0);

  // Structured data. aggregateRating is intentionally omitted until ratings
  // come from real, moderated reviews (sample values must not reach search engines).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((i) => `${SITE.url}${i}`),
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${product.slug}`,
      priceCurrency: "INR",
      price: (product.price / 100).toFixed(2),
      availability: anyStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so catalog text can never terminate the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <RecordView slug={product.slug} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
          ...(category && sub ? [{ label: sub.name, href: `/category/${category.slug}/${sub.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Gallery images={product.images} name={product.name} categorySlug={product.categorySlug} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-ink-soft">{product.tagline}</p>
            <Rating value={product.rating} count={product.reviewCount} size="md" className="mt-5" />
            <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-5" />
            <p className="mt-1 text-xs text-ink-soft">Inclusive of GST. Shipping calculated at checkout.</p>

            <hr className="my-8 border-line" />
            <ProductPurchase
              slug={product.slug}
              name={product.name}
              image={product.images[0]}
              basePrice={product.price}
              optionGroups={product.optionGroups}
              variants={product.variants}
            />

            <ul className="mt-8 space-y-3 border-t hairline pt-6 text-sm text-ink-soft">
              <li className="flex items-center gap-3">
                <Truck className="h-5 w-5 stroke-[1.3] text-charcoal" aria-hidden /> Free standard delivery over ₹5,000
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 stroke-[1.3] text-charcoal" aria-hidden /> 14-day returns on eligible items
              </li>
            </ul>

            <div className="mt-8 divide-y divide-line border-y hairline">
              <Disclosure title="Description" defaultOpen>
                <p className="text-ink-soft">{product.description}</p>
              </Disclosure>
              <Disclosure title="Details & care">
                <ul className="list-disc space-y-1.5 pl-5 text-ink-soft marker:text-beige-deep">
                  {product.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </Disclosure>
              <Disclosure title="Shipping & returns">
                <p className="text-ink-soft">
                  Orders ship within 1–2 business days. Unused items can be returned within 14 days of delivery. See our{" "}
                  <a href="/shipping" className="underline underline-offset-4">
                    shipping
                  </a>{" "}
                  and{" "}
                  <a href="/returns" className="underline underline-offset-4">
                    returns
                  </a>{" "}
                  policies.
                </p>
              </Disclosure>
            </div>
          </div>
        </div>
      </Container>

      <section aria-labelledby="reviews-title" className="border-t hairline pt-16">
        <Container>
          <div className="grid gap-10 md:grid-cols-[320px_1fr]">
            <div>
              <h2 id="reviews-title" className="text-3xl">
                Customer reviews
              </h2>
              <p className="mt-4 font-display text-6xl">{product.rating.toFixed(1)}</p>
              <Rating value={product.rating} size="md" className="mt-2" />
              <p className="mt-2 text-sm text-ink-soft">Based on {product.reviewCount} sample ratings</p>
            </div>
            <div className="border border-dashed border-beige-deep bg-white/60 p-8">
              <h3 className="font-sans text-base font-medium tracking-normal">Verified-purchase reviews are coming</h3>
              <p className="mt-2 max-w-xl text-sm text-ink-soft">
                Reviews will open to signed-in customers who have received this product, with moderation. Until the
                reviews backend is connected, the rating shown is sample data.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section aria-label="Related products" className="pt-24">
          <Container>
            <SectionHeading eyebrow="You may also like" title="Related products" />
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
      <RecentlyViewed excludeSlug={product.slug} />
    </>
  );
}

function Disclosure({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group py-5" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium uppercase tracking-[0.12em]">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4 text-sm leading-relaxed">{children}</div>
    </details>
  );
}
