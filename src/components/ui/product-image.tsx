import { Dumbbell, Headphones, Lamp, Shirt, Sparkles, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  fashion: Shirt,
  electronics: Headphones,
  home: Lamp,
  beauty: Sparkles,
  sports: Dumbbell,
};

/**
 * Renders a product/category photo. When no photo exists yet, shows a tonal
 * placeholder tile (clearly not a photo) so layouts stay intact. Real
 * photography is dropped into /public/images and referenced from the catalog.
 */
export function ProductImage({
  src,
  alt,
  categorySlug,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
}: {
  src?: string;
  alt: string;
  categorySlug?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }
  const Icon = (categorySlug && CATEGORY_ICONS[categorySlug]) || Sparkles;
  return (
    <div
      role="img"
      aria-label={`${alt} (photo coming soon)`}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-beige to-[#efe7da] text-ink-soft",
        className,
      )}
    >
      <Icon className="h-10 w-10 stroke-[1.1]" aria-hidden />
      <span className="eyebrow !tracking-[0.18em]">Photo coming soon</span>
    </div>
  );
}
