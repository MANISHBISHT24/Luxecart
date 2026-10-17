import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How LuxeCart collects, uses and protects personal data.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy policy"
      eyebrow="Legal"
      intro="A plain-language summary of how personal data is handled. This is a portfolio project: replace this template with counsel-reviewed text before operating a real store."
    >
      <Section title="What we collect">
        <ul>
          <li>Account details: name, email and a salted password hash — never the password itself.</li>
          <li>Order details: shipping addresses, phone number and purchased items.</li>
          <li>Technical data needed to keep the site secure, such as rate-limiting identifiers.</li>
        </ul>
      </Section>
      <Section title="Payments">
        <p>Card data is entered with our payment provider and never reaches LuxeCart servers. We store only a payment reference and status.</p>
      </Section>
      <Section title="Browser storage">
        <p>
          Your cart, wishlist and recently viewed items are kept in this browser&apos;s local storage until you sign in.
          Nothing in them is sent to us until you check out.
        </p>
      </Section>
      <Section title="Your rights">
        <p>You can request access, correction or deletion of your data through the contact page.</p>
      </Section>
    </ContentPage>
  );
}
