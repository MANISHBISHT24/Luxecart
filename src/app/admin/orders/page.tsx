import { listAllOrders } from "@/lib/orders";
import { OrderRow } from "./order-row";

export const metadata = {
  title: "Fulfillment Pipeline | LuxeCart Admin",
};

export const instant = false;

export default async function AdminOrdersPage() {
  const orders = await listAllOrders();

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Operations & Dispatch</p>
        <h1 className="text-3xl sm:text-4xl font-display text-charcoal mt-1">Fulfillment Pipeline</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Transition orders through packing, dispatch, and final courier delivery.
        </p>
      </div>

      <div className="bg-white border hairline p-6 sm:p-8 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-ink-soft border-b hairline">
                <th className="pb-3 font-medium">Order Number</th>
                <th className="pb-3 font-medium">Recipient</th>
                <th className="pb-3 font-medium">Acquisitions</th>
                <th className="pb-3 font-medium text-right">Total Amount</th>
                <th className="pb-3 font-medium text-center">Fulfillment Stage</th>
                <th className="pb-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
