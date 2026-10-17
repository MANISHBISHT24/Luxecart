import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/checkout-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export const instant = false;

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <Container className="pt-12">
        <h1 className="text-5xl">Checkout</h1>
      </Container>
      <CheckoutView />
    </>
  );
}
