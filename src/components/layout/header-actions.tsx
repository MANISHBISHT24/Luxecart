"use client";

import { Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { cartCount, useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden
      className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-charcoal px-1 text-[0.65rem] font-medium text-ivory"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

const iconLink =
  "relative flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-beige/70";

export function HeaderActions() {
  const lines = useCart();
  const wishlist = useWishlist();
  const items = cartCount(lines);

  return (
    <div className="flex items-center gap-0.5">
      <Link href="/account" className={iconLink} aria-label="Account">
        <User className="h-[20px] w-[20px] stroke-[1.4]" aria-hidden />
      </Link>
      <Link
        href="/wishlist"
        className={iconLink}
        aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} saved` : ""}`}
      >
        <Heart className="h-[20px] w-[20px] stroke-[1.4]" aria-hidden />
        <CountBadge count={wishlist.length} />
      </Link>
      <Link href="/cart" className={iconLink} aria-label={`Cart${items ? `, ${items} items` : ""}`}>
        <ShoppingBag className="h-[20px] w-[20px] stroke-[1.4]" aria-hidden />
        <CountBadge count={items} />
      </Link>
    </div>
  );
}
