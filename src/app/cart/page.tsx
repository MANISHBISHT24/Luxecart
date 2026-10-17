import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Shopping cart", robots: { index: false } };

export const instant = false;

export default function CartPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <Container className="pt-12">
        <h1 className="text-5xl">Shopping cart</h1>
      </Container>
      <CartView />
    </>
  );
}
