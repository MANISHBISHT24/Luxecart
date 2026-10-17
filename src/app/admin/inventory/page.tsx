import { fallbackProducts } from "@/lib/catalog/data";
import type { Product, Variant } from "@/lib/catalog/types";

export const metadata = {
  title: "Inventory Master | LuxeCart Admin",
};

export const instant = false;

export default function AdminInventoryPage() {
  const inventoryItems: Array<{
    productName: string;
    variantLabel: string;
    sku: string;
    stock: number;
    category: string;
  }> = [];

  fallbackProducts.forEach((p: Product) => {
    p.variants.forEach((v: Variant) => {
      inventoryItems.push({
        productName: p.name,
        variantLabel: v.label,
        sku: v.sku,
        stock: v.stock,
        category: p.categorySlug,
      });
    });
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Warehouse & Logistics</p>
        <h1 className="text-3xl sm:text-4xl font-display text-charcoal mt-1">Inventory Ledger</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Real-time stock holdings across all SKUs and variant configurations.
        </p>
      </div>

      <div className="bg-white border hairline p-6 sm:p-8 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-ink-soft border-b hairline">
                <th className="pb-3 font-medium">Acquisition</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Configuration</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Available Stock</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {inventoryItems.map((item, idx) => {
                const isLow = item.stock <= 10;
                const isOut = item.stock <= 0;
                return (
                  <tr key={idx} className="hover:bg-beige/20 transition-colors">
                    <td className="py-3.5 font-medium text-xs text-charcoal">{item.productName}</td>
                    <td className="py-3.5 font-mono text-xs text-ink-soft">{item.sku}</td>
                    <td className="py-3.5 text-xs text-charcoal">{item.variantLabel}</td>
                    <td className="py-3.5 text-xs text-ink-soft capitalize">{item.category}</td>
                    <td className="py-3.5 text-right font-mono text-xs font-medium text-charcoal">
                      {item.stock} units
                    </td>
                    <td className="py-3.5 text-center">
                      {isOut ? (
                        <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
                          Depleted
                        </span>
                      ) : isLow ? (
                        <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Healthy
                        </span>
                      )}
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
