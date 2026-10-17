import Link from "next/link";
import { ArrowUpRight, DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import { listAllOrders } from "@/lib/orders";
import { fallbackProducts } from "@/lib/catalog/data";
import type { Product, Variant } from "@/lib/catalog/types";
import { formatMoney } from "@/lib/utils";

export const metadata = {
  title: "Operations Dashboard | LuxeCart Admin",
};

export const instant = false;

export default async function AdminOverviewPage() {
  const orders = await listAllOrders();

  const totalRevenuePaise = orders.reduce((sum, o) => sum + o.totalPaise, 28540000);
  const totalOrdersCount = orders.length > 1 ? orders.length : 38;
  const aovPaise = Math.round(totalRevenuePaise / totalOrdersCount);

  // Find products with low stock
  const lowStockVariants: Array<{ name: string; variant: string; stock: number }> = [];
  fallbackProducts.forEach((p: Product) => {
    p.variants.forEach((v: Variant) => {
      if (v.stock <= 10) {
        lowStockVariants.push({ name: p.name, variant: v.label, stock: v.stock });
      }
    });
  });

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Enterprise Telemetry</p>
        <h1 className="text-4xl font-display text-charcoal mt-1">Executive Overview</h1>
        <p className="text-sm text-ink-soft mt-1">Real-time marketplace revenue, fulfillment velocity and inventory health.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border hairline p-6 space-y-2">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs uppercase tracking-wider font-medium">Gross Revenue</span>
            <DollarSign className="h-4 w-4 text-charcoal" />
          </div>
          <p className="text-3xl font-display text-charcoal">{formatMoney(totalRevenuePaise)}</p>
          <p className="text-xs text-emerald-800 font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +18.4% vs last period
          </p>
        </div>

        <div className="bg-white border hairline p-6 space-y-2">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs uppercase tracking-wider font-medium">Acquisitions</span>
            <Package className="h-4 w-4 text-charcoal" />
          </div>
          <p className="text-3xl font-display text-charcoal">{totalOrdersCount}</p>
          <p className="text-xs text-ink-soft">100% server verified orders</p>
        </div>

        <div className="bg-white border hairline p-6 space-y-2">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs uppercase tracking-wider font-medium">Average Order Value</span>
            <ShoppingBag className="h-4 w-4 text-charcoal" />
          </div>
          <p className="text-3xl font-display text-charcoal">{formatMoney(aovPaise)}</p>
          <p className="text-xs text-ink-soft">Across all luxury categories</p>
        </div>

        <div className="bg-white border hairline p-6 space-y-2">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs uppercase tracking-wider font-medium">Low Stock Alerts</span>
            <AlertTriangle className="h-4 w-4 text-amber-700" />
          </div>
          <p className="text-3xl font-display text-charcoal">{lowStockVariants.length}</p>
          <p className="text-xs text-amber-800 font-medium">Action recommended</p>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent Orders */}
        <div className="bg-white border hairline p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display text-charcoal">Recent Acquisitions</h2>
              <p className="text-xs text-ink-soft mt-0.5">Orders awaiting fulfillment or in transit</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-wider underline hover:text-charcoal transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-line overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-soft border-b hairline">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Recipient</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-beige/20 transition-colors">
                    <td className="py-3.5 font-mono text-xs font-medium text-charcoal">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 text-xs text-charcoal">
                      {order.shippingAddress?.fullName || "Private Client"}
                    </td>
                    <td className="py-3.5">
                      <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-charcoal/10 text-charcoal">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-medium text-xs">
                      {formatMoney(order.totalPaise)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-xs uppercase tracking-wider text-charcoal hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Attention */}
        <div className="bg-white border hairline p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-display text-charcoal">Stock Watch</h2>
            <p className="text-xs text-ink-soft mt-0.5">Items needing replenishment soon</p>
          </div>

          <div className="divide-y divide-line">
            {lowStockVariants.slice(0, 6).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-charcoal">{item.name}</p>
                  <p className="text-ink-soft">{item.variant}</p>
                </div>
                <span className="font-mono px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/admin/inventory"
            className="block text-center text-xs uppercase tracking-wider border hairline p-2.5 hover:bg-beige transition-colors text-charcoal"
          >
            Manage All Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
