import type { Metadata } from "next";
import { WishlistView } from "@/components/product/wishlist-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <Container className="py-12">
        <h1 className="mb-10 text-5xl">Your wishlist</h1>
        <WishlistView />
      </Container>
    </>
  );
}
