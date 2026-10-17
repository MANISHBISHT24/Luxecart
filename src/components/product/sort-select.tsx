"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buildQueryString } from "@/lib/catalog/url";
import type { ProductQuery } from "@/lib/catalog/queries";

export function SortSelect({
  basePath,
  query,
  options,
}: {
  basePath: string;
  query: Partial<ProductQuery>;
  options: readonly { value: string; label: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm text-ink-soft">
        Sort by
      </label>
      <select
        id="sort"
        value={query.sort ?? "featured"}
        aria-busy={pending}
        onChange={(e) => {
          const sort = e.target.value as ProductQuery["sort"];
          startTransition(() => router.push(`${basePath}${buildQueryString(query, { sort, page: 1 })}`));
        }}
        className="h-11 border border-line bg-white px-3 pr-8 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
