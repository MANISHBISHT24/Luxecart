import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { getSession } from "@/lib/auth";
import { listOrdersByUser, listAllOrders } from "@/lib/orders";
import { SignInRequired } from "@/components/account/sign-in-required";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Order History | LuxeCart" };

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-display">Acquisition History</h2>
        <SignInRequired what="order history" />
      </div>
    );
  }

  // Get user's orders or fallback to all orders for demonstration
  const userOrders = await listOrdersByUser(session.id);
  const orders = userOrders.length > 0 ? userOrders : await listAllOrders();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display">Acquisition History</h2>
          <p className="text-sm text-ink-soft mt-1">Review live tracking and receipts for all placed acquisitions.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="border hairline bg-white p-12 text-center space-y-4">
          <Package className="h-8 w-8 mx-auto text-ink-soft stroke-[1.3]" />
          <p className="font-display text-2xl text-charcoal">No acquisitions placed yet</p>
          <p className="text-sm text-ink-soft">Once you complete a purchase, it will appear here with live tracking.</p>
          <Link
            href="/products"
            className="inline-block text-xs uppercase tracking-wider bg-charcoal text-ivory px-6 py-3 hover:bg-charcoal/90 transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line border hairline bg-white">
          {orders.map((order) => (
            <div key={order.id} className="p-6 flex flex-wrap items-center justify-between gap-6 hover:bg-beige/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-charcoal">{order.orderNumber}</span>
                  <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded font-medium bg-charcoal/10 text-charcoal">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
                <p className="text-xs text-ink-muted">
                  {order.items.map((i) => i.productName).slice(0, 2).join(", ")}
                  {order.items.length > 2 && ` +${order.items.length - 2} more`}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs text-ink-soft block">Total</span>
                  <span className="text-base font-display font-medium text-charcoal">
                    {formatMoney(order.totalPaise)}
                  </span>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-charcoal border hairline px-4 py-2 hover:bg-charcoal hover:text-ivory transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
