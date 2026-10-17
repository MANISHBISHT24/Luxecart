import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fallbackProducts } from "@/lib/catalog/data";
import type { Product, Variant } from "@/lib/catalog/types";
import { formatMoney } from "@/lib/utils";

export const metadata = {
  title: "Product Catalogue | LuxeCart Admin",
};

export const instant = false;

export default function AdminProductsPage() {
  const products = fallbackProducts;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Inventory Master</p>
          <h1 className="text-3xl sm:text-4xl font-display text-charcoal mt-1">Product Catalogue</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {products.length} luxury acquisitions active across 5 categories
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 bg-charcoal text-ivory text-xs uppercase tracking-wider px-4 py-2.5 hover:bg-charcoal/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Acquisition Entry</span>
        </button>
      </div>

      <div className="bg-white border hairline p-6 sm:p-8 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-ink-soft border-b hairline">
                <th className="pb-3 font-medium">Acquisition</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-center">Variants</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p: Product) => {
                const totalStock = p.variants.reduce((n: number, v: Variant) => n + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-beige/20 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-beige border hairline">
                          {p.images[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[0.6rem] text-ink-soft">
                              Luxe
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal text-xs sm:text-sm">{p.name}</p>
                          <p className="text-xs text-ink-soft">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-xs text-ink-soft">{p.sku}</td>
                    <td className="py-4 text-xs text-charcoal capitalize">{p.categorySlug}</td>
                    <td className="py-4 text-right font-medium text-xs sm:text-sm">{formatMoney(p.price)}</td>
                    <td className="py-4 text-center text-xs">
                      <span className="font-mono bg-beige/60 px-2 py-0.5 rounded">
                        {p.variants.length} ({totalStock} units)
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Published
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="text-xs uppercase tracking-wider text-charcoal hover:underline"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
