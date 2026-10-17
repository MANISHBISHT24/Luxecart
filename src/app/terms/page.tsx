import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that apply when you use LuxeCart.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of service"
      eyebrow="Legal"
      intro="Template terms for a portfolio project. Replace with counsel-reviewed text before operating a real store."
    >
      <Section title="Using the site">
        <p>You agree to use LuxeCart lawfully and not to attempt to disrupt, scrape at scale or gain unauthorised access to the service.</p>
      </Section>
      <Section title="Orders and pricing">
        <p>
          Prices are shown in INR and include GST. An order is confirmed only after payment is verified by our server.
          We may cancel orders affected by pricing errors or stock unavailability and will refund any payment taken.
        </p>
      </Section>
      <Section title="Returns">
        <p>Returns are governed by the returns &amp; refunds policy.</p>
      </Section>
      <Section title="Demonstration environment">
        <p>Development and sandbox deployments do not fulfil orders or process real payments.</p>
      </Section>
    </ContentPage>
  );
}
