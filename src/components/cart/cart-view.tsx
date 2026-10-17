"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/form";
import { Container } from "@/components/ui/layout";
import { removeFromCart, setCartQty, useCart } from "@/lib/cart";
import { computeTotals, FREE_SHIPPING_THRESHOLD, type ShippingMethodId } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";

export function OrderSummary({
  lines,
  action,
  showCoupon = true,
  shippingMethod = "standard",
}: {
  lines: { unitPrice: number; qty: number }[];
  action?: React.ReactNode;
  showCoupon?: boolean;
  shippingMethod?: ShippingMethodId;
}) {
  const [coupon, setCoupon] = useState("");
  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    discountPaise: number;
    description?: string;
    message?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const baseTotals = computeTotals(lines, shippingMethod);
  const discount = couponResult?.valid ? couponResult.discountPaise : 0;
  const finalTotal = Math.max(0, baseTotals.total - discount);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - baseTotals.subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    setIsValidating(true);
    setCouponResult(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: coupon.trim(),
          subtotal: baseTotals.subtotal,
        }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponResult({
          valid: true,
          discountPaise: data.discountPaise,
          description: data.description,
        });
      } else {
        setCouponResult({
          valid: false,
          discountPaise: 0,
          message: data.message || "Invalid or inapplicable promotional code",
        });
      }
    } catch {
      setCouponResult({
        valid: false,
        discountPaise: 0,
        message: "Unable to reach coupon validation service",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <aside aria-labelledby="summary-title" className="h-fit border border-line bg-white p-6 sm:p-8">
      <h2 id="summary-title" className="text-3xl font-display">
        Acquisition Summary
      </h2>

      {showCoupon && (
        <form className="mt-6" onSubmit={handleApplyCoupon}>
          <label htmlFor="coupon" className="mb-2 block text-xs uppercase tracking-wider text-ink-soft">
            Promotional Archive Code
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase().slice(0, 30))}
              autoComplete="off"
              className="h-11 min-w-0 flex-1 border border-line bg-ivory px-4 text-xs font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
              placeholder="e.g. LUXE15, WELCOME10"
            />
            <Button type="submit" variant="secondary" size="sm" disabled={!coupon || isValidating}>
              {isValidating ? "Verifying..." : "Apply"}
            </Button>
          </div>
          {couponResult && (
            <div className="mt-3">
              <Notice tone={couponResult.valid ? undefined : "warning"}>
                {couponResult.valid
                  ? `Applied: ${couponResult.description} (-${formatMoney(couponResult.discountPaise)})`
                  : couponResult.message}
              </Notice>
            </div>
          )}
        </form>
      )}

      <dl className="mt-6 space-y-3 border-t hairline pt-6 text-sm">
        <Row label="Subtotal" value={formatMoney(baseTotals.subtotal)} />
        {discount > 0 && (
          <Row label="Promotional Code" value={`-${formatMoney(discount)}`} />
        )}
        <Row
          label={`Shipping (${shippingMethod})`}
          value={baseTotals.shipping === 0 ? "Complimentary" : formatMoney(baseTotals.shipping)}
        />
        <Row label="GST Included (18%)" value={formatMoney(baseTotals.includedTax)} muted />
        <div className="flex items-baseline justify-between border-t hairline pt-4 text-base">
          <dt className="font-medium">Total Balance</dt>
          <dd className="font-display text-3xl">{formatMoney(finalTotal)}</dd>
        </div>
      </dl>

      {baseTotals.subtotal > 0 && remaining > 0 && (
        <p className="mt-4 text-xs text-ink-soft">
          Add {formatMoney(remaining)} more for complimentary white-glove delivery.
        </p>
      )}
      <p className="mt-4 text-xs text-ink-soft">
        Live currency settlement verified by server security safeguards.
      </p>
      {action && <div className="mt-6">{action}</div>}
    </aside>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? "text-ink-soft" : undefined}>{label}</dt>
      <dd className={muted ? "text-ink-soft" : undefined}>{value}</dd>
    </div>
  );
}

export function CartView() {
  const lines = useCart();

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7 stroke-[1.3]" />}
          title="Your cart is empty"
          description="Discover something you'll keep for years. Your selections will wait for you here."
          actionHref="/products"
          actionLabel="Continue shopping"
        />
      </Container>
    );
  }

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_400px] lg:gap-14">
      <section aria-label="Items in your cart">
        <ul className="divide-y divide-line border-y hairline">
          {lines.map((line) => (
            <li key={line.variantId} className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr]">
              <Link
                href={`/products/${line.productSlug}`}
                className="relative aspect-[4/5] overflow-hidden bg-beige"
                aria-label={line.name}
              >
                {line.image ? (
                  <Image src={line.image} alt="" fill sizes="120px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-ink-soft">
                    <ShoppingBag className="h-6 w-6 stroke-[1.2]" aria-hidden />
                  </span>
                )}
              </Link>
              <div className="flex flex-col justify-between gap-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-base font-normal tracking-normal">
                      <Link href={`/products/${line.productSlug}`} className="hover:underline underline-offset-4">
                        {line.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft">{line.variantLabel}</p>
                    <p className="text-xs text-ink-soft">SKU {line.sku}</p>
                  </div>
                  <p className="text-sm font-medium">{formatMoney(line.unitPrice * line.qty)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 items-center border border-line bg-white" role="group" aria-label={`Quantity for ${line.name}`}>
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={line.qty <= 1}
                      onClick={() => setCartQty(line.variantId, line.qty - 1)}
                      className="flex h-full w-10 items-center justify-center hover:bg-beige/60 disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <output aria-live="polite" className="w-8 text-center text-sm">
                      {line.qty}
                    </output>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={line.qty >= line.maxQty}
                      onClick={() => setCartQty(line.variantId, line.qty + 1)}
                      className="flex h-full w-10 items-center justify-center hover:bg-beige/60 disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.variantId)}
                    className="flex items-center gap-2 text-sm text-ink-soft underline-offset-4 hover:text-charcoal hover:underline"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden /> Remove
                    <span className="sr-only"> {line.name}</span>
                  </button>
                </div>
                {line.qty >= line.maxQty && (
                  <p className="text-xs text-[#8a5a14]">Maximum available quantity selected.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Link href="/products" className="mt-6 inline-block text-sm underline underline-offset-4">
          ← Continue shopping
        </Link>
      </section>

      <OrderSummary
        lines={lines}
        action={
          <ButtonLink href="/checkout" size="lg" className="w-full">
            Proceed to checkout
          </ButtonLink>
        }
      />
    </Container>
  );
}
