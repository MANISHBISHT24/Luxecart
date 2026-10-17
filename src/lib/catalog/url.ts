import type { ProductQuery } from "./queries";

/** Builds a canonical query string from a validated query, omitting defaults. */
export function buildQueryString(query: Partial<ProductQuery>, overrides: Partial<ProductQuery> = {}) {
  const q = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (q.q) params.set("q", q.q);
  if (q.category) params.set("category", q.category);
  if (q.sub) params.set("sub", q.sub);
  if (q.min !== undefined) params.set("min", String(q.min));
  if (q.max !== undefined) params.set("max", String(q.max));
  if (q.inStock) params.set("inStock", "1");
  if (q.sort && q.sort !== "featured") params.set("sort", q.sort);
  if (q.page && q.page > 1) params.set("page", String(q.page));
  const s = params.toString();
  return s ? `?${s}` : "";
}
