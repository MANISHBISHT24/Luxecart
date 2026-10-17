"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Button } from "@/components/ui/button";
import { addToCart, MAX_LINE_QTY } from "@/lib/cart";
import type { OptionGroup, Variant } from "@/lib/catalog/types";
import { cn, formatMoney } from "@/lib/utils";

interface Props {
  slug: string;
  name: string;
  image?: string;
  basePrice: number;
  optionGroups: OptionGroup[];
  variants: Variant[];
}

export function ProductPurchase({ slug, name, image, basePrice, optionGroups, variants }: Props) {
  const initial = variants.find((v) => v.stock > 0) ?? variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(initial.options);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () => variants.find((v) => optionGroups.every((g) => v.options[g.name] === selected[g.name])),
    [variants, optionGroups, selected],
  );
  const stock = variant?.stock ?? 0;
  const maxQty = Math.max(1, Math.min(stock, MAX_LINE_QTY));
  const price = variant?.price ?? basePrice;

  const hasStock = (group: string, value: string) =>
    variants.some(
      (v) =>
        v.stock > 0 &&
        v.options[group] === value &&
        optionGroups.every((g) => g.name === group || v.options[g.name] === selected[g.name]),
    );

  function select(group: string, value: string) {
    setSelected((s) => ({ ...s, [group]: value }));
    setQty(1);
    setJustAdded(false);
  }

  function add() {
    if (!variant || stock < 1) return;
    addToCart(
      {
        variantId: variant.id,
        productSlug: slug,
        name,
        variantLabel: variant.label,
        sku: variant.sku,
        unitPrice: price,
        image,
      },
      qty,
      stock,
    );
    setJustAdded(true);
  }

  return (
    <div className="space-y-7">
      {optionGroups.map((group) => (
        <fieldset key={group.name}>
          <legend className="mb-3 text-sm">
            <span className="font-medium">{group.name}:</span>{" "}
            <span className="text-ink-soft">{selected[group.name]}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={group.name}>
            {group.values.map((value) => {
              const active = selected[group.name] === value;
              const available = hasStock(group.name, value);
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => select(group.name, value)}
                  className={cn(
                    "min-h-11 min-w-12 border px-4 text-sm transition-colors",
                    active
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-line bg-white hover:border-charcoal",
                    !available && !active && "text-muted line-through decoration-1",
                  )}
                >
                  {value}
                  {!available && <span className="sr-only"> (unavailable)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm" aria-live="polite">
        <span className="text-ink-soft">
          SKU: <span className="text-charcoal">{variant?.sku ?? "—"}</span>
        </span>
        {stock === 0 && <span className="font-medium text-danger">Out of stock</span>}
        {stock > 0 && stock <= 5 && <span className="font-medium text-[#8a5a14]">Only {stock} left</span>}
        {stock > 5 && <span className="font-medium text-success">In stock</span>}
      </div>

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex h-14 items-center border border-line bg-white" role="group" aria-label="Quantity">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-full w-12 items-center justify-center hover:bg-beige/60 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <output aria-live="polite" className="w-8 text-center text-sm">
            {qty}
          </output>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={qty >= maxQty || stock === 0}
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="flex h-full w-12 items-center justify-center hover:bg-beige/60 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <Button size="lg" className="min-w-0 flex-1" disabled={stock < 1} onClick={add}>
          <ShoppingBag className="h-4 w-4" aria-hidden />
          {stock < 1 ? "Out of stock" : `Add to cart · ${formatMoney(price * qty)}`}
        </Button>
        <WishlistButton slug={slug} name={name} variant="outline" className="!h-14 !w-14" />
      </div>

      <p role="status" className="min-h-6 text-sm">
        {justAdded && (
          <span className="inline-flex items-center gap-2 text-success">
            <Check className="h-4 w-4" aria-hidden /> Added to your cart.{" "}
            <Link href="/cart" className="font-medium text-charcoal underline underline-offset-4">
              View cart
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}
