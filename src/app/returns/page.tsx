import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: "How returns, exchanges and refunds work at LuxeCart.",
};

export default function ReturnsPage() {
  return (
    <ContentPage title="Returns & refunds" eyebrow="Help" intro="Changed your mind? Return eligible items within 14 days of delivery.">
      <Section title="Eligibility">
        <ul>
          <li>Items must be unused, unwashed and in original packaging with tags.</li>
          <li>Opened fragrance, skincare and personal-care items cannot be returned.</li>
          <li>Final-sale items are marked on the product page and are not returnable.</li>
        </ul>
      </Section>
      <Section title="How to return">
        <p>Open the order in your account and choose “Request return”. We&apos;ll review it and share pickup or drop-off instructions.</p>
      </Section>
      <Section title="Refunds">
        <p>
          Approved refunds are issued to the original payment method once the item is received and inspected. Timelines
          depend on your bank and are typically 5–10 business days.
        </p>
      </Section>
    </ContentPage>
  );
}
