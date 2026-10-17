"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import type { OrderRecord, OrderStatus } from "@/lib/orders";

export function OrderRow({ order }: { order: OrderRecord }) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setCurrentStatus(newStatus);
        setMsg(`Status: ${newStatus}`);
      }
    } catch {
      setMsg("Failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="hover:bg-beige/20 transition-colors">
      <td className="py-4 font-mono text-xs font-medium text-charcoal">
        <Link href={`/orders/${order.id}`} className="hover:underline">
          {order.orderNumber}
        </Link>
        <span className="block text-[0.65rem] text-ink-soft">
          {new Date(order.createdAt).toLocaleDateString("en-IN")}
        </span>
      </td>

      <td className="py-4 text-xs text-charcoal">
        <p className="font-medium">{order.shippingAddress?.fullName || "Private Client"}</p>
        <p className="text-ink-soft">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
      </td>

      <td className="py-4 text-xs text-charcoal">
        <p className="font-mono">{order.items.length} items</p>
        <p className="text-ink-soft text-[0.65rem]">
          {order.items[0]?.productName.slice(0, 20)}...
        </p>
      </td>

      <td className="py-4 text-right font-medium text-xs">
        {formatMoney(order.totalPaise)}
      </td>

      <td className="py-4 text-center">
        <div className="inline-flex flex-col items-center gap-1.5">
          <select
            value={currentStatus}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="text-xs bg-ivory border hairline px-2 py-1 focus:outline-none focus:ring-1 focus:ring-charcoal"
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          {currentStatus === "SHIPPED" && (
            <input
              type="text"
              placeholder="Courier tracking #"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="text-[0.68rem] font-mono border hairline px-1.5 py-0.5 w-32 bg-white"
            />
          )}
          {msg && <span className="text-[0.65rem] text-emerald-800 font-mono">{msg}</span>}
        </div>
      </td>

      <td className="py-4 text-right">
        <Link
          href={`/orders/${order.id}`}
          target="_blank"
          className="text-xs uppercase tracking-wider text-charcoal border hairline px-3 py-1.5 hover:bg-charcoal hover:text-ivory transition-colors"
        >
          View Receipt
        </Link>
      </td>
    </tr>
  );
}
