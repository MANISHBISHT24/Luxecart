import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Delivery options, timelines and shipping charges at LuxeCart.",
};

export default function ShippingPage() {
  return (
    <ContentPage title="Shipping" eyebrow="Help" intro="Tracked delivery across India, with free standard shipping on larger orders.">
      <Section title="Delivery options">
        <ul>
          {SHIPPING_METHODS.map((m) => (
            <li key={m.id}>
              <strong className="font-medium text-charcoal">{m.label}</strong> — {m.eta}, {formatMoney(m.price)}
              {m.id === "standard" && ` (free on orders over ${formatMoney(FREE_SHIPPING_THRESHOLD)})`}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Processing time">
        <p>Orders are processed within 1–2 business days. You&apos;ll receive a notification when your order ships.</p>
      </Section>
      <Section title="Delivery issues">
        <p>If your parcel is delayed or damaged, contact us within 7 days of the expected delivery date and we will make it right.</p>
      </Section>
    </ContentPage>
  );
}
