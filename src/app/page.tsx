import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/layout";
import { ProductImage } from "@/components/ui/product-image";
import { getCategories, getHomeSections } from "@/lib/catalog/queries";

export default async function HomePage() {
  const [categories, sections] = await Promise.all([getCategories(), getHomeSections()]);

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-beige">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ivory/85 via-ivory/40 to-transparent sm:from-ivory/70" />
        <Container className="flex min-h-[560px] items-center py-20 lg:min-h-[680px]">
          <div className="fade-up max-w-xl">
            <p className="eyebrow mb-5">Autumn · Winter 2026</p>
            <h1 id="hero-title" className="text-[3.4rem] leading-[0.98] sm:text-7xl lg:text-[5.5rem]">
              Quiet luxury,
              <br />
              <span className="italic font-normal">thoughtfully</span> curated.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Fashion, technology, home and wellbeing from makers who value restraint, materials and longevity.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/products" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="/products?sort=newest" size="lg" variant="secondary">
                New arrivals
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Reassurance */}
      <section aria-label="Our promise" className="border-b hairline bg-white">
        <Container>
          <ul className="grid gap-6 py-8 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Free delivery over ₹5,000", text: "Tracked shipping across India." },
              { icon: RotateCcw, title: "14-day returns", text: "On eligible, unused items." },
              { icon: ShieldCheck, title: "Protected checkout", text: "Card details never touch our servers." },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 stroke-[1.2]" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-title" className="pt-24">
        <Container>
          <SectionHeading
            eyebrow="Shop by category"
            title="Find your edit"
            description="Five considered departments, one consistent standard of quality."
            as="h2"
          />
          <h2 id="categories-title" className="sr-only">
            Categories
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-6">
            {categories.map((c, i) => (
              <li key={c.slug} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
                <Link
                  href={`/category/${c.slug}`}
                  className="img-zoom group relative block aspect-[4/5] overflow-hidden bg-beige md:aspect-auto md:h-[420px]"
                >
                  <ProductImage
                    src={c.image}
                    alt={c.name}
                    categorySlug={c.slug}
                    sizes="(min-width: 768px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-2xl sm:text-3xl">{c.name}</h3>
                    <p className="mt-1 hidden text-sm text-white/80 sm:block">{c.tagline}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ProductSection
        eyebrow="Curated"
        title="Featured pieces"
        href="/products?sort=popular"
        items={sections.featured}
      />

      {/* Promo band */}
      <section aria-labelledby="promo-title" className="mt-24 bg-charcoal text-ivory">
        <Container className="grid items-center gap-8 py-16 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow !text-ivory/60">Limited offer</p>
            <h2 id="promo-title" className="mt-3 text-4xl sm:text-5xl">
              The Autumn Edit — up to 25% off selected pieces
            </h2>
            <p className="mt-4 max-w-lg text-ivory/70">
              Seasonal reductions on outerwear, audio and footwear while stocks last.
            </p>
          </div>
          <div className="md:justify-self-end">
            <ButtonLink href="#offers" variant="light" size="lg">
              View the offers
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ProductSection
        eyebrow="Most loved"
        title="Bestsellers"
        href="/products?sort=popular"
        items={sections.bestsellers}
      />
      <ProductSection eyebrow="Just landed" title="New arrivals" href="/products?sort=newest" items={sections.newArrivals} />
      <ProductSection id="offers" eyebrow="Offers" title="Seasonal savings" href="/products?sort=price-asc" items={sections.offers} />
    </>
  );
}

function ProductSection({
  id,
  eyebrow,
  title,
  href,
  items,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  href: string;
  items: Awaited<ReturnType<typeof getHomeSections>>["featured"];
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} aria-label={title} className="scroll-mt-28 pt-24">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          action={
            <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium underline-offset-[6px] hover:underline">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <ProductGrid products={items} />
      </Container>
    </section>
  );
}
