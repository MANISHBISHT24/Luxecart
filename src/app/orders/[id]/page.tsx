import { Check, Clock, Package, PackageCheck, Truck, Wallet, AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { getOrderById, type OrderStatus } from "@/lib/orders";
import { cn, formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Details | LuxeCart",
  robots: { index: false, follow: false },
};

export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; icon: typeof Package }> = [
  { key: "PENDING", label: "Order placed", icon: Package },
  { key: "PAID", label: "Payment confirmed", icon: Wallet },
  { key: "PROCESSING", label: "Crafting & Packing", icon: PackageCheck },
  { key: "SHIPPED", label: "In transit", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Check },
];

function getStatusIndex(status: OrderStatus): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "PAID":
      return 1;
    case "PROCESSING":
      return 2;
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return 0;
  }
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const statusIdx = getStatusIndex(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Orders", href: "/account/orders" },
          { label: order.orderNumber },
        ]}
      />
      <Container className="py-12">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b hairline pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Order Reference</span>
              {isCancelled ? (
                <span className="bg-red-900/10 text-red-800 text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                  Cancelled
                </span>
              ) : (
                <span className="bg-emerald-900/10 text-emerald-800 text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                  {order.status}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-display mt-2">{order.orderNumber}</h1>
            <p className="text-sm text-ink-soft mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={undefined}
              className="text-xs uppercase tracking-wider"
            >
              Print Receipt
            </Button>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider">
                Support Concierge
              </Button>
            </Link>
          </div>
        </header>

        {/* Progress Tracker */}
        {!isCancelled && (
          <section aria-labelledby="tracking-title" className="mb-14 bg-white border hairline p-6 sm:p-8">
            <h2 id="tracking-title" className="eyebrow mb-6">
              Fulfillment Journey
            </h2>
            <ol className="grid gap-6 sm:grid-cols-5">
              {STATUS_STEPS.map((s, i) => {
                const done = i <= statusIdx;
                const current = i === statusIdx;
                const Icon = s.icon;
                return (
                  <li
                    key={s.key}
                    aria-current={current ? "step" : undefined}
                    className="flex items-center gap-4 sm:flex-col sm:text-center"
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
                        done
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-line bg-beige/40 text-ink-muted",
                        current && "ring-4 ring-charcoal/10"
                      )}
                    >
                      <Icon className="h-5 w-5 stroke-[1.4]" />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-xs uppercase tracking-wider",
                          done ? "font-medium text-charcoal" : "text-ink-muted"
                        )}
                      >
                        {s.label}
                      </p>
                      {current && (
                        <p className="text-[0.7rem] text-ink-soft font-mono mt-0.5">Current stage</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {order.trackingNumber && (
              <div className="mt-8 pt-6 border-t hairline flex flex-wrap items-center justify-between gap-4 text-sm">
                <div>
                  <span className="text-ink-soft">Carrier Tracking Number: </span>
                  <span className="font-mono font-medium text-charcoal">{order.trackingNumber}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live courier telemetry active
                </span>
              </div>
            )}
          </section>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Items List */}
          <div className="space-y-6">
            <h2 className="eyebrow">Items in this Acquisition</h2>
            <div className="divide-y divide-line border hairline bg-white">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5 sm:p-6">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-beige border hairline">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-muted">
                        Luxe
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-charcoal text-base">{item.productName}</h3>
                      <p className="text-xs text-ink-soft mt-0.5">
                        {item.variantLabel} • SKU: <span className="font-mono">{item.productSku}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-3">
                      <span className="text-ink-soft">Qty: {item.quantity}</span>
                      <span className="font-medium">{formatMoney(item.totalPaise)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address & Details */}
            <div className="grid gap-6 sm:grid-cols-2 pt-4">
              <div className="border hairline bg-white p-6">
                <h3 className="eyebrow mb-3">Destination</h3>
                <address className="not-italic text-sm text-ink-soft leading-relaxed">
                  <span className="font-medium text-charcoal block">{order.shippingAddress.fullName}</span>
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && <br />}
                  {order.shippingAddress.addressLine2}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  <br />
                  Phone: {order.shippingAddress.phone}
                </address>
              </div>

              <div className="border hairline bg-white p-6">
                <h3 className="eyebrow mb-3">Payment & Delivery</h3>
                <div className="space-y-2 text-sm text-ink-soft">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium text-charcoal">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-medium text-charcoal">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Service:</span>
                    <span className="font-medium text-charcoal capitalize">{order.shippingMethod}</span>
                  </div>
                  {order.couponCode && (
                    <div className="flex justify-between">
                      <span>Applied Promo:</span>
                      <span className="font-mono font-medium text-charcoal">{order.couponCode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div>
            <div className="border hairline bg-white p-6 sticky top-24">
              <h2 className="eyebrow mb-4">Financial Summary</h2>
              <dl className="space-y-3 text-sm divide-y divide-line/60">
                <div className="flex justify-between pt-2">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-medium text-charcoal">{formatMoney(order.subtotalPaise)}</dd>
                </div>
                {order.discountPaise > 0 && (
                  <div className="flex justify-between pt-2 text-emerald-800">
                    <dt>Promotional Discount</dt>
                    <dd>-{formatMoney(order.discountPaise)}</dd>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <dt className="text-ink-soft">Delivery</dt>
                  <dd className="font-medium text-charcoal">
                    {order.shippingPaise === 0 ? "Complimentary" : formatMoney(order.shippingPaise)}
                  </dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="text-ink-soft">GST (18% Included)</dt>
                  <dd className="font-medium text-charcoal">{formatMoney(order.taxPaise)}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-charcoal/20 text-base font-medium">
                  <dt className="text-charcoal">Total Amount</dt>
                  <dd className="text-charcoal font-display text-xl">{formatMoney(order.totalPaise)}</dd>
                </div>
              </dl>

              <div className="mt-8 space-y-3">
                <Link href="/products" className="block w-full">
                  <Button variant="secondary" className="w-full">
                    Continue Exploring
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
