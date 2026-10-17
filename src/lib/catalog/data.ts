import { rupees } from "@/lib/utils";
import type { Category, OptionGroup, Product, ProductBadge, Variant } from "./types";

/**
 * SAMPLE DATA (Phase 2 only).
 * This static module stands in for the database until Phase 3 introduces
 * PostgreSQL + Prisma. Pages never import this file directly; they go through
 * `queries.ts`, which is the seam that Phase 4 swaps for real DB queries.
 * Ratings, review counts and stock numbers are fabricated sample values.
 */

export const categories: Category[] = [
  {
    slug: "fashion",
    name: "Fashion & Clothing",
    tagline: "Considered tailoring and timeless knitwear.",
    image: "/images/camel-coat.jpg",
    subcategories: [
      { slug: "outerwear", name: "Outerwear" },
      { slug: "knitwear", name: "Knitwear" },
      { slug: "bags-accessories", name: "Bags & Accessories" },
    ],
  },
  {
    slug: "electronics",
    name: "Electronics & Accessories",
    tagline: "Quietly powerful tech, beautifully made.",
    image: "/images/headphones.jpg",
    subcategories: [
      { slug: "audio", name: "Audio" },
      { slug: "wearables", name: "Wearables" },
      { slug: "desk-tech", name: "Desk & Workspace" },
    ],
  },
  {
    slug: "home",
    name: "Home & Living",
    tagline: "Objects that make a room feel finished.",
    subcategories: [
      { slug: "decor", name: "Decor" },
      { slug: "lighting", name: "Lighting" },
      { slug: "textiles", name: "Textiles" },
    ],
  },
  {
    slug: "beauty",
    name: "Beauty & Personal Care",
    tagline: "Rituals for skin, scent and self.",
    subcategories: [
      { slug: "skincare", name: "Skincare" },
      { slug: "fragrance", name: "Fragrance" },
    ],
  },
  {
    slug: "sports",
    name: "Sports & Lifestyle",
    tagline: "Gear for movement, designed to be seen.",
    subcategories: [
      { slug: "yoga", name: "Yoga & Studio" },
      { slug: "running", name: "Running" },
      { slug: "outdoors", name: "Outdoors" },
    ],
  },
];

function slugPart(s: string) {
  return s.toUpperCase().replace(/[^A-Z0-9]+/g, "");
}

/** Cartesian product of option groups -> variants with deterministic stock. */
function buildVariants(sku: string, groups: OptionGroup[], seed: number): Variant[] {
  let combos: Record<string, string>[] = [{}];
  for (const group of groups) {
    combos = combos.flatMap((c) => group.values.map((v) => ({ ...c, [group.name]: v })));
  }
  return combos.map((options, i) => {
    const values = Object.values(options);
    const stock = (seed * 7 + i * 5) % 17;
    return {
      id: `${sku}-${values.map(slugPart).join("-")}`.toLowerCase(),
      sku: `${sku}-${values.map(slugPart).join("-")}`,
      label: values.join(" / "),
      options,
      // A few variants are deliberately out of stock to exercise that UI state.
      stock: stock < 2 ? 0 : stock,
    };
  });
}

interface Seed {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  subcategorySlug: string;
  tagline: string;
  description: string;
  highlights: string[];
  price: number;
  compareAt?: number;
  images?: string[];
  rating: number;
  reviewCount: number;
  popularity: number;
  badges?: ProductBadge[];
  createdAt: string;
  options: OptionGroup[];
}

const seeds: Seed[] = [
  {
    slug: "camel-double-breasted-wool-coat",
    sku: "LC-FSH-001",
    name: "Camel Double-Breasted Wool Coat",
    brand: "Maison Aurel",
    categorySlug: "fashion",
    subcategorySlug: "outerwear",
    tagline: "A heritage overcoat in dense Italian wool.",
    description:
      "Cut with a peak lapel and a relaxed shoulder, this double-breasted overcoat is woven from a dense wool blend that holds its shape through the season. Fully lined in cupro with horn-effect buttons and generous welt pockets.",
    highlights: ["80% wool, 20% cashmere", "Fully lined in cupro", "Horn-effect buttons", "Dry clean only"],
    price: rupees(18900),
    compareAt: rupees(24500),
    images: ["/images/camel-coat.jpg"],
    rating: 4.8,
    reviewCount: 126,
    popularity: 98,
    badges: ["bestseller", "featured"],
    createdAt: "2026-08-12",
    options: [{ name: "Size", values: ["XS", "S", "M", "L", "XL"] }],
  },
  {
    slug: "cream-cashmere-knit-sweater",
    sku: "LC-FSH-002",
    name: "Cream Cashmere Knit Sweater",
    brand: "Maison Aurel",
    categorySlug: "fashion",
    subcategorySlug: "knitwear",
    tagline: "Featherlight cashmere with a chunky rib.",
    description:
      "A generous crew-neck knit spun from grade-A cashmere. Soft against the skin, with a ribbed hem and cuffs that keep the silhouette clean.",
    highlights: ["100% grade-A cashmere", "Ribbed hem and cuffs", "Hand wash cold"],
    price: rupees(8400),
    rating: 4.6,
    reviewCount: 74,
    popularity: 82,
    badges: ["new"],
    createdAt: "2026-10-02",
    options: [{ name: "Size", values: ["S", "M", "L"] }],
  },
  {
    slug: "leather-crossbody-satchel",
    sku: "LC-FSH-003",
    name: "Leather Crossbody Satchel",
    brand: "Atelier Nord",
    categorySlug: "fashion",
    subcategorySlug: "bags-accessories",
    tagline: "Vegetable-tanned leather that ages beautifully.",
    description:
      "A compact structured satchel in full-grain, vegetable-tanned leather with a suede-lined interior, magnetic closure and an adjustable strap.",
    highlights: ["Full-grain leather", "Suede-lined interior", "Adjustable strap"],
    price: rupees(12500),
    rating: 4.7,
    reviewCount: 58,
    popularity: 76,
    badges: ["featured"],
    createdAt: "2026-07-21",
    options: [{ name: "Colour", values: ["Tan", "Espresso"] }],
  },
  {
    slug: "studio-wireless-headphones",
    sku: "LC-ELC-001",
    name: "Studio Wireless Headphones",
    brand: "Vessel Audio",
    categorySlug: "electronics",
    subcategorySlug: "audio",
    tagline: "Adaptive noise cancelling, 40-hour battery.",
    description:
      "Tuned for warmth and detail, with adaptive noise cancelling, multipoint Bluetooth and memory-foam cushions wrapped in soft leather.",
    highlights: ["Adaptive noise cancelling", "40-hour battery", "Multipoint Bluetooth 5.3", "USB-C fast charge"],
    price: rupees(14900),
    compareAt: rupees(17900),
    images: ["/images/headphones.jpg"],
    rating: 4.7,
    reviewCount: 212,
    popularity: 96,
    badges: ["bestseller", "featured"],
    createdAt: "2026-06-30",
    options: [{ name: "Colour", values: ["Charcoal", "Sand"] }],
  },
  {
    slug: "minimal-round-smartwatch",
    sku: "LC-ELC-002",
    name: "Minimal Round Smartwatch",
    brand: "Vessel Audio",
    categorySlug: "electronics",
    subcategorySlug: "wearables",
    tagline: "A calm, always-on display with seven-day battery.",
    description:
      "A sapphire-glass smartwatch focused on the essentials: health tracking, notifications and a week of battery life.",
    highlights: ["Sapphire glass", "7-day battery", "5 ATM water resistance"],
    price: rupees(11900),
    rating: 4.4,
    reviewCount: 91,
    popularity: 80,
    badges: ["new"],
    createdAt: "2026-09-18",
    options: [{ name: "Strap", values: ["Sand leather", "Charcoal silicone"] }],
  },
  {
    slug: "aluminium-laptop-stand",
    sku: "LC-ELC-003",
    name: "Aluminium Laptop Stand",
    brand: "Deskcraft",
    categorySlug: "electronics",
    subcategorySlug: "desk-tech",
    tagline: "Machined from a single block of aluminium.",
    description:
      "A fold-flat stand with six height settings and silicone contact points, designed to lift your screen to eye level.",
    highlights: ["CNC-machined aluminium", "6 height settings", "Folds flat"],
    price: rupees(3900),
    rating: 4.5,
    reviewCount: 143,
    popularity: 70,
    createdAt: "2026-04-11",
    options: [{ name: "Finish", values: ["Silver", "Graphite"] }],
  },
  {
    slug: "handmade-ceramic-vase-trio",
    sku: "LC-HOM-001",
    name: "Handmade Ceramic Vase Trio",
    brand: "Terra & Co.",
    categorySlug: "home",
    subcategorySlug: "decor",
    tagline: "Three organic forms, glazed by hand.",
    description:
      "A trio of hand-thrown stoneware vases in a soft matte glaze. Each piece is unique, with subtle variations in tone and texture.",
    highlights: ["Hand-thrown stoneware", "Matte reactive glaze", "Set of three"],
    price: rupees(4600),
    rating: 4.9,
    reviewCount: 88,
    popularity: 90,
    badges: ["bestseller"],
    createdAt: "2026-05-27",
    options: [{ name: "Glaze", values: ["Oat", "Stone"] }],
  },
  {
    slug: "travertine-table-lamp",
    sku: "LC-HOM-002",
    name: "Travertine Table Lamp",
    brand: "Terra & Co.",
    categorySlug: "home",
    subcategorySlug: "lighting",
    tagline: "Sculpted stone with a linen drum shade.",
    description:
      "Carved from natural travertine with a washed-linen shade that diffuses a warm, ambient glow. Dimmable, with an inline switch.",
    highlights: ["Natural travertine base", "Linen shade", "Dimmable, E27 bulb"],
    price: rupees(9800),
    rating: 4.8,
    reviewCount: 41,
    popularity: 78,
    badges: ["new", "featured"],
    createdAt: "2026-10-05",
    options: [{ name: "Size", values: ["Medium", "Large"] }],
  },
  {
    slug: "washed-linen-throw",
    sku: "LC-HOM-003",
    name: "Washed Linen Throw",
    brand: "Terra & Co.",
    categorySlug: "home",
    subcategorySlug: "textiles",
    tagline: "Stonewashed European flax, softer with every wash.",
    description:
      "A lightweight, breathable throw in stonewashed European flax linen with a hand-knotted fringe.",
    highlights: ["100% European flax", "Pre-washed", "Machine washable"],
    price: rupees(3200),
    rating: 4.6,
    reviewCount: 67,
    popularity: 64,
    createdAt: "2026-03-14",
    options: [{ name: "Colour", values: ["Oat", "Stone", "Charcoal"] }],
  },
  {
    slug: "vitamin-c-brightening-serum",
    sku: "LC-BEA-001",
    name: "Vitamin C Brightening Serum",
    brand: "Lumen Skin",
    categorySlug: "beauty",
    subcategorySlug: "skincare",
    tagline: "15% stabilised vitamin C for visible radiance.",
    description:
      "A lightweight daily serum with stabilised vitamin C, ferulic acid and hyaluronic acid to even tone and support a luminous complexion.",
    highlights: ["15% vitamin C", "Fragrance-free", "Dermatologist tested"],
    price: rupees(2400),
    rating: 4.7,
    reviewCount: 301,
    popularity: 94,
    badges: ["bestseller"],
    createdAt: "2026-02-08",
    options: [{ name: "Size", values: ["30 ml", "50 ml"] }],
  },
  {
    slug: "barrier-repair-face-cream",
    sku: "LC-BEA-002",
    name: "Barrier Repair Face Cream",
    brand: "Lumen Skin",
    categorySlug: "beauty",
    subcategorySlug: "skincare",
    tagline: "Ceramides and squalane for resilient skin.",
    description:
      "A rich yet fast-absorbing moisturiser that replenishes the skin barrier with ceramides, squalane and oat extract.",
    highlights: ["Ceramide complex", "Suitable for sensitive skin", "Recyclable porcelain jar"],
    price: rupees(1950),
    rating: 4.5,
    reviewCount: 119,
    popularity: 72,
    createdAt: "2026-04-29",
    options: [{ name: "Size", values: ["50 ml"] }],
  },
  {
    slug: "oud-amber-eau-de-parfum",
    sku: "LC-BEA-003",
    name: "Oud & Amber Eau de Parfum",
    brand: "Maison Aurel",
    categorySlug: "beauty",
    subcategorySlug: "fragrance",
    tagline: "Smoked oud, warm amber, a trace of vanilla.",
    description:
      "A long-lasting eau de parfum with smoky oud and resinous amber over a soft vanilla base. Unisex.",
    highlights: ["Top: bergamot, saffron", "Heart: oud, rose", "Base: amber, vanilla"],
    price: rupees(6800),
    rating: 4.8,
    reviewCount: 55,
    popularity: 74,
    badges: ["new"],
    createdAt: "2026-09-24",
    options: [{ name: "Size", values: ["50 ml", "100 ml"] }],
  },
  {
    slug: "natural-rubber-yoga-mat",
    sku: "LC-SPT-001",
    name: "Natural Rubber Yoga Mat",
    brand: "Stillform",
    categorySlug: "sports",
    subcategorySlug: "yoga",
    tagline: "Dense grip, sustainably sourced rubber.",
    description:
      "A 5 mm natural rubber mat with a closed-cell surface that resists moisture and grips even through a hot practice.",
    highlights: ["Natural tree rubber", "5 mm thick", "Non-slip, closed-cell surface"],
    price: rupees(3400),
    rating: 4.8,
    reviewCount: 188,
    popularity: 88,
    badges: ["bestseller"],
    createdAt: "2026-05-02",
    options: [{ name: "Colour", values: ["Sand", "Slate"] }],
  },
  {
    slug: "cloud-runner-sneaker",
    sku: "LC-SPT-002",
    name: "Cloud Runner Sneaker",
    brand: "Stillform",
    categorySlug: "sports",
    subcategorySlug: "running",
    tagline: "Responsive cushioning, a breathable knit upper.",
    description:
      "An everyday running shoe with a responsive foam midsole, engineered-knit upper and a durable rubber outsole.",
    highlights: ["Responsive foam midsole", "Engineered-knit upper", "Reflective details"],
    price: rupees(7900),
    compareAt: rupees(9500),
    rating: 4.5,
    reviewCount: 97,
    popularity: 84,
    badges: ["new"],
    createdAt: "2026-10-09",
    options: [{ name: "Size (UK)", values: ["6", "7", "8", "9", "10"] }],
  },
  {
    slug: "insulated-steel-bottle",
    sku: "LC-SPT-003",
    name: "Insulated Steel Bottle",
    brand: "Stillform",
    categorySlug: "sports",
    subcategorySlug: "outdoors",
    tagline: "Cold for 24 hours, hot for 12.",
    description:
      "Double-wall vacuum insulated bottle in 18/8 stainless steel with a powder-coated finish and leak-proof cap.",
    highlights: ["18/8 stainless steel", "24h cold / 12h hot", "BPA-free cap"],
    price: rupees(1800),
    rating: 4.6,
    reviewCount: 164,
    popularity: 68,
    createdAt: "2026-01-19",
    options: [{ name: "Colour", values: ["Oat", "Charcoal"] }],
  },
];

export const products: Product[] = seeds.map((s, i) => ({
  id: s.sku.toLowerCase(),
  slug: s.slug,
  sku: s.sku,
  name: s.name,
  brand: s.brand,
  categorySlug: s.categorySlug,
  subcategorySlug: s.subcategorySlug,
  tagline: s.tagline,
  description: s.description,
  highlights: s.highlights,
  price: s.price,
  compareAtPrice: s.compareAt,
  images: s.images ?? [],
  rating: s.rating,
  reviewCount: s.reviewCount,
  popularity: s.popularity,
  badges: s.badges ?? [],
  createdAt: s.createdAt,
  optionGroups: s.options,
  variants: buildVariants(s.sku, s.options, i + 3),
}));

export const fallbackProducts = products;
