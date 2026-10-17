import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog/data";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/products", "/about", "/contact", "/faq", "/shipping", "/returns", "/privacy", "/terms"];
  return [
    ...staticPages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.flatMap((c) => [
      { url: `${SITE.url}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 },
      ...c.subcategories.map((s) => ({
        url: `${SITE.url}/category/${c.slug}/${s.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ]),
    ...products.map((p) => ({
      url: `${SITE.url}/products/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
