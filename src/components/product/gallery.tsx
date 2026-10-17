"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  name,
  categorySlug,
}: {
  images: string[];
  name: string;
  categorySlug: string;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-beige lg:order-2">
        <ProductImage
          src={images[active]}
          alt={name}
          categorySlug={categorySlug}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {images.length > 1 && (
        <ul className="order-2 flex gap-3 lg:order-1 lg:flex-col" aria-label="Product images">
          {images.map((src, i) => (
            <li key={src} className="w-20 shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === active}
                className={cn(
                  "relative block aspect-[4/5] w-full overflow-hidden border bg-beige",
                  i === active ? "border-charcoal" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
