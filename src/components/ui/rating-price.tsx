import { Star } from "lucide-react";
import { cn, discountPercent, formatMoney } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            aria-hidden
            className={cn(icon, i <= Math.round(value) ? "fill-charcoal text-charcoal" : "text-beige-deep")}
          />
        ))}
      </span>
      {count !== undefined && (
        <span className="text-xs text-ink-soft">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}

export function Price({
  price,
  compareAt,
  size = "md",
  className,
}: {
  price: number;
  compareAt?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const off = discountPercent(price, compareAt);
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className={cn("font-medium", size === "lg" ? "text-2xl" : "text-[0.95rem]")}>
        {formatMoney(price)}
      </span>
      {off > 0 && compareAt && (
        <>
          <s className="text-sm text-ink-soft">
            <span className="sr-only">Was </span>
            {formatMoney(compareAt)}
          </s>
          <span className="text-xs font-medium uppercase tracking-wider text-success">{off}% off</span>
        </>
      )}
    </p>
  );
}
