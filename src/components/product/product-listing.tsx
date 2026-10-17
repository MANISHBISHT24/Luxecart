import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-card";
import { SortSelect } from "@/components/product/sort-select";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/form";
import {
  getCategories,
  getProducts,
  parseProductQuery,
  SORT_OPTIONS,
  type ProductQuery,
} from "@/lib/catalog/queries";
import { buildQueryString } from "@/lib/catalog/url";
import { cn } from "@/lib/utils";

type RawParams = Record<string, string | string[] | undefined>;

interface Props {
  basePath: string;
  searchParams: Promise<RawParams>;
  /** Route-fixed scope (category pages). Overrides URL params. */
  scope?: { category?: string; sub?: string };
  heading?: string;
}

/**
 * Reads request-time searchParams, so it MUST render inside <Suspense>
 * (Cache Components). The surrounding page shell stays static.
 */
export async function ProductListing({ basePath, searchParams, scope = {}, heading }: Props) {
  const raw = await searchParams;
  const query: ProductQuery = { ...parseProductQuery(raw), ...scope };
  const [{ items, total, page, pageCount }, categories] = await Promise.all([
    getProducts(query),
    getCategories(),
  ]);
  const activeCategory = categories.find((c) => c.slug === query.category);
  const hasFilters = !!(query.q || query.min !== undefined || query.max !== undefined || query.inStock);

  const filterPanel = (
    <div className="space-y-9">
      <nav aria-label="Categories">
        <h2 className="eyebrow mb-4 font-sans">Category</h2>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="/products"
              aria-current={!query.category ? "page" : undefined}
              className={cn("block py-1.5", !query.category ? "font-medium" : "text-ink-soft hover:text-charcoal")}
            >
              All products
            </Link>
          </li>
          {categories.map((c) => {
            const active = c.slug === query.category;
            return (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  aria-current={active && !query.sub ? "page" : undefined}
                  className={cn("block py-1.5", active ? "font-medium" : "text-ink-soft hover:text-charcoal")}
                >
                  {c.name}
                </Link>
                {active && (
                  <ul className="mb-2 ml-3 space-y-1 border-l hairline pl-4">
                    {c.subcategories.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/category/${c.slug}/${s.slug}`}
                          aria-current={query.sub === s.slug ? "page" : undefined}
                          className={cn(
                            "block py-1",
                            query.sub === s.slug ? "font-medium" : "text-ink-soft hover:text-charcoal",
                          )}
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <form action={basePath} method="get" className="space-y-6">
        {query.q && <input type="hidden" name="q" value={query.q} />}
        {query.sort !== "featured" && <input type="hidden" name="sort" value={query.sort} />}
        <fieldset>
          <legend className="eyebrow mb-4 font-sans">Price (₹)</legend>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label htmlFor="min" className="sr-only">
                Minimum price in rupees
              </label>
              <input
                id="min"
                name="min"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Min"
                defaultValue={query.min}
                className="h-11 w-full border border-line bg-white px-3 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>
            <span aria-hidden className="text-muted">
              –
            </span>
            <div className="flex-1">
              <label htmlFor="max" className="sr-only">
                Maximum price in rupees
              </label>
              <input
                id="max"
                name="max"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Max"
                defaultValue={query.max}
                className="h-11 w-full border border-line bg-white px-3 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>
          </div>
        </fieldset>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="inStock"
            value="1"
            defaultChecked={query.inStock}
            className="h-4 w-4 accent-charcoal"
          />
          In stock only
        </label>
        <div className="flex gap-3">
          <Button type="submit" size="sm" className="flex-1">
            Apply
          </Button>
          {hasFilters && (
            <ButtonLink href={basePath} variant="secondary" size="sm">
              Clear
            </ButtonLink>
          )}
        </div>
      </form>
    </div>
  );

  const title = heading ?? (query.q ? `Results for “${query.q}”` : activeCategory?.name ?? "All products");

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
      <aside aria-label="Filters">
        <details className="group border-y hairline py-3 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
            </span>
            <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" aria-hidden />
          </summary>
          <div className="pb-4 pt-6">{filterPanel}</div>
        </details>
        <div className="sticky top-28 hidden lg:block">{filterPanel}</div>
      </aside>

      <section aria-labelledby="results-heading">
        <div className="mb-8 flex flex-col gap-4 border-b hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="results-heading" className="sr-only">
              {title}
            </h2>
            <p className="text-sm text-ink-soft" aria-live="polite">
              {total} {total === 1 ? "product" : "products"}
              {pageCount > 1 && ` · page ${page} of ${pageCount}`}
            </p>
          </div>
          <SortSelect basePath={basePath} query={query} options={SORT_OPTIONS} />
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-7 w-7 stroke-[1.3]" />}
            title="Nothing matches yet"
            description="Try removing a filter or searching for something broader."
            actionHref={basePath}
            actionLabel="Clear all filters"
          />
        ) : (
          <ProductGrid products={items} priorityCount={4} />
        )}

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
            <PageLink basePath={basePath} query={query} page={page - 1} disabled={page <= 1} label="Previous page">
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </PageLink>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`${basePath}${buildQueryString(query, { page: n })}`}
                aria-label={`Page ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "flex h-11 w-11 items-center justify-center border text-sm transition-colors",
                  n === page ? "border-charcoal bg-charcoal text-ivory" : "border-line bg-white hover:border-charcoal",
                )}
              >
                {n}
              </Link>
            ))}
            <PageLink basePath={basePath} query={query} page={page + 1} disabled={page >= pageCount} label="Next page">
              <ChevronRight className="h-4 w-4" aria-hidden />
            </PageLink>
          </nav>
        )}
      </section>
    </div>
  );
}

function PageLink({
  basePath,
  query,
  page,
  disabled,
  label,
  children,
}: {
  basePath: string;
  query: ProductQuery;
  page: number;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const cls = "flex h-11 w-11 items-center justify-center border border-line bg-white transition-colors";
  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={cn(cls, "opacity-40")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={`${basePath}${buildQueryString(query, { page })}`} aria-label={label} className={cn(cls, "hover:border-charcoal")}>
      {children}
    </Link>
  );
}
