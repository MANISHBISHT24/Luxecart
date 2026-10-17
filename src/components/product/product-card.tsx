import Link from "next/link";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/layout";
import { ProductImage } from "@/components/ui/product-image";
import { Price, Rating } from "@/components/ui/rating-price";
import type { ProductListItem } from "@/lib/catalog/types";

export function ProductCard({ product, priority = false }: { product: ProductListItem; priority?: boolean }) {
  const href = `/products/${product.slug}`;
  return (
    <article className="group relative flex flex-col">
      <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-beige">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0 block">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            categorySlug={product.categorySlug}
            priority={priority}
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.inStock && <Badge tone="dark">Sold out</Badge>}
          {product.inStock && product.badges.includes("new") && <Badge>New</Badge>}
          {product.inStock && product.badges.includes("bestseller") && <Badge>Bestseller</Badge>}
          {product.lowStock && <Badge tone="outline" className="bg-ivory/90">Low stock</Badge>}
        </div>
        <WishlistButton
          slug={product.slug}
          name={product.name}
          className="absolute right-3 top-3 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <p className="eyebrow">{product.brand}</p>
        <h3 className="font-sans text-[0.98rem] font-normal leading-snug tracking-normal">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} />
        <Price price={product.price} compareAt={product.compareAtPrice} className="mt-1" />
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: ProductListItem[];
  priorityCount?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
