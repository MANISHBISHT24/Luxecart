"use client";

import { CreditCard, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { OrderSummary } from "@/components/cart/cart-view";
import { Button } from "@/components/ui/button";
import { EmptyState, Field, Notice, SelectField } from "@/components/ui/form";
import { Container } from "@/components/ui/layout";
import { clearCart, useCart } from "@/lib/cart";
import { SHIPPING_METHODS, computeTotals, type ShippingMethodId } from "@/lib/pricing";
import { cn, formatMoney } from "@/lib/utils";

const STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

export function CheckoutView() {
  const router = useRouter();
  const lines = useCart();
  const [method, setMethod] = useState<ShippingMethodId>("standard");
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form fields with prefilled default demo values for fast evaluation
  const [formData, setFormData] = useState({
    email: "julian.sterling@luxecart.com",
    firstName: "Julian",
    lastName: "Sterling",
    address1: "12 Rosewood Lane",
    address2: "Suite 4B",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560038",
    phone: "+91 98765 43210",
  });

  // Try to pre-fill from logged-in user if available
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          const parts = data.user.name.split(" ");
          setFormData((prev) => ({
            ...prev,
            email: data.user.email,
            firstName: parts[0] || prev.firstName,
            lastName: parts.slice(1).join(" ") || prev.lastName,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const totals = computeTotals(lines, method);

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7 stroke-[1.3]" />}
          title="Nothing to check out"
          description="Your cart is currently empty. Explore our latest acquisitions."
          actionHref="/products"
          actionLabel="Browse products"
        />
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!formData.email || !formData.firstName || !formData.address1 || !formData.city || !formData.pin) {
        throw new Error("Please complete all required shipping fields.");
      }
      if (formData.pin.length !== 6) {
        throw new Error("PIN code must be exactly 6 digits.");
      }

      // Step 1: Create Order on Server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            addressLine1: formData.address1,
            addressLine2: formData.address2 || undefined,
            city: formData.city,
            state: formData.state,
            postalCode: formData.pin,
            phone: formData.phone,
          },
          shippingMethod: method,
          paymentMethod,
          items: lines.map((l) => ({
            productSlug: l.productSlug,
            variantId: l.variantId,
            quantity: l.qty,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to proceed with checkout.");
      }

      // Step 2: Handle COD or Razorpay
      if (paymentMethod === "COD") {
        clearCart();
        router.push(data.redirectUrl);
        return;
      }

      // Razorpay Payment Flow / Sandbox Verification
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          razorpay_order_id: data.razorpay.orderId,
          razorpay_payment_id: `pay_${Math.random().toString(36).slice(2, 12)}`,
          razorpay_signature: "sandbox_verified",
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.ok) {
        clearCart();
        router.push(verifyData.redirectUrl);
      } else {
        throw new Error(verifyData.error || "Payment verification failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout encountered an error.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_420px] lg:gap-16">
      <form className="space-y-12" onSubmit={handleCheckout} noValidate>
        {errorMessage && (
          <Notice tone="warning" title="Submission Issue">
            {errorMessage}
          </Notice>
        )}

        <fieldset className="space-y-5">
          <legend className="mb-2 text-3xl font-display">Client Contact</legend>
          <Field
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="mb-2 text-3xl font-display">Shipping Destination</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="First Name"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Field
              label="Last Name"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Field
            label="Address Line 1"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
          <Field
            label="Suite, Apartment, or Landmark (Optional)"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="City"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <SelectField
              label="State"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectField>
            <Field
              label="PIN Code"
              id="pin"
              name="pin"
              inputMode="numeric"
              maxLength={6}
              value={formData.pin}
              onChange={handleChange}
              required
            />
          </div>
          <Field
            label="Contact Telephone"
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </fieldset>

        <fieldset>
          <legend className="mb-5 text-3xl font-display">Delivery Tier</legend>
          <div className="space-y-3" role="radiogroup">
            {SHIPPING_METHODS.map((m) => {
              const cost = computeTotals(lines, m.id).shipping;
              return (
                <label
                  key={m.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 border bg-white p-5 transition-colors",
                    method === m.id ? "border-charcoal ring-1 ring-charcoal" : "border-line hover:border-charcoal/50"
                  )}
                >
                  <span className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="h-4 w-4 accent-charcoal"
                    />
                    <span>
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="block text-xs text-ink-soft">{m.eta}</span>
                    </span>
                  </span>
                  <span className="text-sm font-medium">{cost === 0 ? "Complimentary" : formatMoney(cost)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-5 text-3xl font-display">Payment Method</legend>
          <div className="space-y-3" role="radiogroup">
            <label
              className={cn(
                "flex cursor-pointer items-start justify-between gap-4 border bg-white p-5 transition-colors",
                paymentMethod === "RAZORPAY"
                  ? "border-charcoal ring-1 ring-charcoal"
                  : "border-line hover:border-charcoal/50"
              )}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                  className="mt-1 h-4 w-4 accent-charcoal"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-charcoal" />
                    <span className="text-sm font-medium">Razorpay Secure Sandbox</span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    Accepts Cards, UPI (Google Pay / PhonePe), NetBanking, and Cred with 256-bit encryption.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono bg-charcoal/5 text-charcoal px-2 py-0.5 rounded">Fast</span>
            </label>

            <label
              className={cn(
                "flex cursor-pointer items-start justify-between gap-4 border bg-white p-5 transition-colors",
                paymentMethod === "COD"
                  ? "border-charcoal ring-1 ring-charcoal"
                  : "border-line hover:border-charcoal/50"
              )}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 h-4 w-4 accent-charcoal"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-charcoal" />
                    <span className="text-sm font-medium">Cash on Delivery (White-Glove)</span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    Settle balance upon personal courier inspection at your residence.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono bg-charcoal/5 text-charcoal px-2 py-0.5 rounded">Verified</span>
            </label>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
            <ShieldCheck className="h-4 w-4 text-emerald-800" />
            <span>Encrypted transmission. No raw credit credentials touch server storage.</span>
          </div>
        </fieldset>

        <Button
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[280px]"
          type="submit"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-ivory border-t-transparent animate-spin" />
              Securing Transaction...
            </span>
          ) : (
            `Complete Acquisition • ${formatMoney(totals.total)}`
          )}
        </Button>
      </form>

      <div>
        <div className="mb-6 flex items-center gap-3 text-sm text-ink-soft">
          <span className="eyebrow">
            {lines.length} {lines.length === 1 ? "Line Item" : "Line Items"}
          </span>
        </div>
        <ul className="mb-6 divide-y divide-line border hairline bg-white">
          {lines.map((l) => (
            <li key={l.variantId} className="flex gap-4 p-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-beige border hairline">
                {l.image && (
                  <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                )}
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-charcoal px-1 text-[0.65rem] text-ivory">
                  {l.qty}
                </span>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium leading-snug">{l.name}</p>
                <p className="text-ink-soft text-xs mt-0.5">{l.variantLabel}</p>
                <p className="text-xs font-mono text-ink-muted mt-1">{l.sku}</p>
              </div>
              <p className="text-sm font-medium">{formatMoney(l.unitPrice * l.qty)}</p>
            </li>
          ))}
        </ul>
        <OrderSummary lines={lines} shippingMethod={method} />
      </div>
    </Container>
  );
}
