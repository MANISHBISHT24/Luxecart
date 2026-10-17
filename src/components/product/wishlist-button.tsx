"use client";

import { Heart } from "lucide-react";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  name,
  variant = "overlay",
  className,
}: {
  slug: string;
  name: string;
  variant?: "overlay" | "outline";
  className?: string;
}) {
  const saved = useWishlist().includes(slug);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => toggleWishlist(slug)}
      className={cn(
        "flex h-10 w-10 items-center justify-center transition-colors",
        variant === "overlay"
          ? "rounded-full bg-white/90 text-charcoal shadow-soft hover:bg-white"
          : "h-12 w-12 border border-charcoal hover:bg-charcoal hover:text-ivory",
        className,
      )}
    >
      <Heart className={cn("h-[18px] w-[18px] stroke-[1.5]", saved && "fill-current")} aria-hidden />
    </button>
  );
}
