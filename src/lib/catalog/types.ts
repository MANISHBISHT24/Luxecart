export type ProductBadge = "bestseller" | "new" | "featured";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  /** Optional photo. Categories without one render a tonal placeholder. */
  image?: string;
  subcategories: { slug: string; name: string }[];
}

export interface OptionGroup {
  name: string;
  values: string[];
}

export interface Variant {
  id: string;
  sku: string;
  label: string;
  options: Record<string, string>;
  /** Minor units. Falls back to the product price. */
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  subcategorySlug: string;
  tagline: string;
  description: string;
  highlights: string[];
  /** Minor units (paise). */
  price: number;
  compareAtPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  popularity: number;
  badges: ProductBadge[];
  createdAt: string;
  optionGroups: OptionGroup[];
  variants: Variant[];
}

export interface ProductListItem
  extends Pick<
    Product,
    | "id"
    | "slug"
    | "name"
    | "brand"
    | "categorySlug"
    | "subcategorySlug"
    | "tagline"
    | "price"
    | "compareAtPrice"
    | "images"
    | "rating"
    | "reviewCount"
    | "badges"
  > {
  inStock: boolean;
  lowStock: boolean;
  defaultVariantId: string;
}
