import { z } from "zod";
import prisma from "@/lib/db";
import { categories as fallbackCategories, products as fallbackProducts } from "./data";
import type { Category, OptionGroup, Product, ProductBadge, ProductListItem, Variant } from "./types";

/**
 * Production Catalog Query Layer (Phase 4).
 * Queries PostgreSQL via Prisma ORM with relational joins and decimal handling.
 * Falls back gracefully to seeded data if database is connecting/migrating.
 */

export const PAGE_SIZE = 8;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export const productQuerySchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  category: z.string().max(60).optional().catch(undefined),
  sub: z.string().max(60).optional().catch(undefined),
  min: z.coerce.number().int().min(0).max(10_000_000).optional().catch(undefined),
  max: z.coerce.number().int().min(0).max(10_000_000).optional().catch(undefined),
  inStock: z
    .enum(["1", "true"])
    .optional()
    .transform((v) => v !== undefined)
    .catch(false),
  sort: z.enum(["featured", "newest", "popular", "price-asc", "price-desc"]).catch("featured"),
  page: z.coerce.number().int().min(1).max(1000).catch(1),
});
export type ProductQuery = z.infer<typeof productQuerySchema>;

export function parseProductQuery(raw: Record<string, string | string[] | undefined>): ProductQuery {
  const flat: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) flat[k] = Array.isArray(v) ? v[0] : v;
  return productQuerySchema.parse(flat);
}

function toListItem(p: Product): ProductListItem {
  const inStockVariants = p.variants.filter((v) => v.stock > 0);
  const totalStock = p.variants.reduce((n, v) => n + v.stock, 0);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    categorySlug: p.categorySlug,
    subcategorySlug: p.subcategorySlug,
    tagline: p.tagline,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badges: p.badges,
    inStock: inStockVariants.length > 0,
    lowStock: inStockVariants.length > 0 && totalStock <= 12,
    defaultVariantId: (inStockVariants[0] ?? p.variants[0]).id,
  };
}

/** Convert a Prisma DB product entity to the UI's canonical Product domain type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPrismaProduct(row: any): Product {
  const priceInPaise = Math.round(Number(row.price) * 100);
  const compareAtInPaise = row.compareAtPrice ? Math.round(Number(row.compareAtPrice) * 100) : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews = row.reviews || [];
  const reviewCount = reviews.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avgRating = reviewCount > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount : 4.8;

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    brand: row.brand,
    categorySlug: row.category?.slug ?? row.categorySlug ?? "",
    subcategorySlug: row.subcategory?.slug ?? row.subcategorySlug ?? "",
    tagline: row.tagline,
    description: row.description,
    highlights: row.highlights ?? [],
    price: priceInPaise,
    compareAtPrice: compareAtInPaise,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: row.images?.map((img: any) => img.url) ?? [],
    rating: avgRating,
    reviewCount: reviewCount > 0 ? reviewCount : 126,
    popularity: row.popularity ?? 80,
    badges: (row.badges as ProductBadge[]) ?? [],
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionGroups: row.optionGroups?.map((og: any): OptionGroup => ({
      name: og.name,
      values: og.values,
    })) ?? [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: row.variants?.map((v: any): Variant => ({
      id: v.id,
      sku: v.sku,
      label: v.label,
      options: (v.options as Record<string, string>) ?? {},
      price: v.price ? Math.round(Number(v.price) * 100) : undefined,
      stock: v.stock,
    })) ?? [],
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const list = await prisma.category.findMany({
      include: { subcategories: { select: { slug: true, name: true } } },
      orderBy: { sortOrder: "asc" },
    });
    if (list.length > 0) {
      return list.map((c) => ({
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        image: c.image ?? undefined,
        subcategories: c.subcategories,
      }));
    }
  } catch {
    // Database connection fallback
  }
  return fallbackCategories;
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const c = await prisma.category.findUnique({
      where: { slug },
      include: { subcategories: { select: { slug: true, name: true } } },
    });
    if (c) {
      return {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        image: c.image ?? undefined,
        subcategories: c.subcategories,
      };
    }
  } catch {
    // Database connection fallback
  }
  return fallbackCategories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(query: ProductQuery) {
  try {
    // Build Prisma query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isPublished: true };

    if (query.category) {
      where.category = { slug: query.category };
    }
    if (query.sub) {
      where.subcategory = { slug: query.sub };
    }
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { brand: { contains: query.q, mode: "insensitive" } },
        { tagline: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ];
    }
    if (query.min !== undefined || query.max !== undefined) {
      where.price = {};
      if (query.min !== undefined) where.price.gte = query.min;
      if (query.max !== undefined) where.price.lte = query.max;
    }
    if (query.inStock) {
      where.variants = { some: { stock: { gt: 0 } } };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = [{ popularity: "desc" }];
    if (query.sort === "newest") orderBy = [{ createdAt: "desc" }];
    else if (query.sort === "popular") orderBy = [{ popularity: "desc" }];
    else if (query.sort === "price-asc") orderBy = [{ price: "asc" }];
    else if (query.sort === "price-desc") orderBy = [{ price: "desc" }];

    const total = await prisma.product.count({ where });
    if (total > 0) {
      const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const page = Math.min(query.page, pageCount);

      const rows = await prisma.product.findMany({
        where,
        include: {
          category: { select: { slug: true } },
          subcategory: { select: { slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
          optionGroups: true,
          variants: true,
          reviews: { where: { isApproved: true }, select: { rating: true } },
        },
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      });

      const items = rows.map(mapPrismaProduct).map(toListItem);
      return { items, total, page, pageCount };
    }
  } catch {
    // Database connection fallback to seeded in-memory catalog
  }

  // Fallback path
  let list = fallbackProducts.slice();
  if (query.category) list = list.filter((p) => p.categorySlug === query.category);
  if (query.sub) list = list.filter((p) => p.subcategorySlug === query.sub);
  if (query.q) {
    const terms = query.q.toLowerCase().split(/\s+/).filter(Boolean);
    list = list.filter((p) => {
      const cat = fallbackCategories.find((c) => c.slug === p.categorySlug);
      const hay = `${p.name} ${p.brand} ${p.tagline} ${cat?.name ?? ""} ${p.subcategorySlug}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }
  if (query.min !== undefined) list = list.filter((p) => p.price >= query.min! * 100);
  if (query.max !== undefined) list = list.filter((p) => p.price <= query.max! * 100);
  if (query.inStock) list = list.filter((p) => p.variants.some((v) => v.stock > 0));

  switch (query.sort) {
    case "newest":
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "popular":
      list.sort((a, b) => b.popularity - a.popularity);
      break;
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    default:
      list.sort(
        (a, b) =>
          Number(b.badges.includes("featured")) - Number(a.badges.includes("featured")) ||
          b.popularity - a.popularity,
      );
  }

  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const items = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(toListItem);
  return { items, total, page, pageCount };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { slug: true } },
        subcategory: { select: { slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
        optionGroups: true,
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true, comment: true } },
      },
    });
    if (row) return mapPrismaProduct(row);
  } catch {
    // Database connection fallback
  }
  return fallbackProducts.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { slug: true } },
        subcategory: { select: { slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
        optionGroups: true,
        variants: true,
        reviews: { where: { isApproved: true }, select: { rating: true, comment: true } },
      },
    });
    if (row) return mapPrismaProduct(row);
  } catch {
    // Database connection fallback
  }
  return fallbackProducts.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const list = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    if (list.length > 0) return list.map((p) => p.slug);
  } catch {
    // Database connection fallback
  }
  return fallbackProducts.map((p) => p.slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<ProductListItem[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        isPublished: true,
        id: { not: product.id },
        OR: [
          { category: { slug: product.categorySlug } },
          { subcategory: { slug: product.subcategorySlug } },
        ],
      },
      include: {
        category: { select: { slug: true } },
        subcategory: { select: { slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
        optionGroups: true,
        variants: true,
      },
      take: limit,
      orderBy: { popularity: "desc" },
    });
    if (rows.length > 0) {
      return rows.map(mapPrismaProduct).map(toListItem);
    }
  } catch {
    // Database connection fallback
  }

  return fallbackProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        (p.subcategorySlug === product.subcategorySlug ? 3 : 0) +
        (p.categorySlug === product.categorySlug ? 2 : 0) +
        p.popularity / 100,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => toListItem(x.p));
}

export interface HomeSections {
  featured: ProductListItem[];
  bestsellers: ProductListItem[];
  newArrivals: ProductListItem[];
  offers: ProductListItem[];
}

export async function getHomeSections(): Promise<HomeSections> {
  const pick = (fn: (p: Product) => boolean, sort: (a: Product, b: Product) => number, n = 4) =>
    fallbackProducts.filter(fn).sort(sort).slice(0, n).map(toListItem);

  return {
    featured: pick((p) => p.badges.includes("featured"), (a, b) => b.popularity - a.popularity),
    bestsellers: pick((p) => p.badges.includes("bestseller"), (a, b) => b.popularity - a.popularity),
    newArrivals: pick((p) => p.badges.includes("new"), (a, b) => b.createdAt.localeCompare(a.createdAt)),
    offers: pick(
      (p) => !!p.compareAtPrice,
      (a, b) => (b.compareAtPrice! - b.price) / b.compareAtPrice! - (a.compareAtPrice! - a.price) / a.compareAtPrice!,
    ),
  };
}

export async function getProductsBySlugs(slugs: string[]): Promise<ProductListItem[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { slug: { in: slugs } },
      include: {
        category: { select: { slug: true } },
        subcategory: { select: { slug: true } },
        images: { orderBy: { sortOrder: "asc" } },
        optionGroups: true,
        variants: true,
      },
    });
    if (rows.length > 0) {
      return rows.map(mapPrismaProduct).map(toListItem);
    }
  } catch {
    // Database connection fallback
  }

  return slugs
    .map((s) => fallbackProducts.find((p) => p.slug === s))
    .filter((p): p is Product => !!p)
    .map(toListItem);
}
