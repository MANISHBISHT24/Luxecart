import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/content-page";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about orders, delivery, returns, payments and your LuxeCart account.",
};

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–7 business days and express takes 2–3 business days. Orders over ₹5,000 qualify for free standard delivery.",
  },
  {
    q: "Can I return an item?",
    a: "Yes. Unused items in original packaging can be returned within 14 days of delivery. Some categories, such as opened fragrance and skincare, are not eligible for hygiene reasons. See the returns policy for details.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "Payments are handled by a hosted payment provider, so your card details are never stored on LuxeCart. Cash on delivery may be offered on eligible orders.",
  },
  {
    q: "Are prices inclusive of tax?",
    a: "Yes. All prices are in Indian rupees and include GST. The tax component is itemised on your order summary.",
  },
  {
    q: "How do I track my order?",
    a: "Signed-in customers can follow an order from placed to delivered in their account under Orders.",
  },
  {
    q: "Can I cancel an order?",
    a: "Orders can be cancelled until they are shipped. After shipping, you can request a return once the order is delivered.",
  },
];

export default function FaqPage() {
  return (
    <ContentPage title="Frequently asked questions" eyebrow="Help" intro="Quick answers to the questions we hear most.">
      <div className="divide-y divide-line border-y hairline !space-y-0">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl">
              {f.q}
              <span aria-hidden className="text-2xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-2xl">{f.a}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
