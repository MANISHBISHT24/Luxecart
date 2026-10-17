import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/layout";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b hairline">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-4 text-xs text-ink-soft">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {item.href && !last ? (
                  <Link href={item.href} className="underline-offset-4 hover:text-charcoal hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "text-charcoal" : undefined}>
                    {item.label}
                  </span>
                )}
                {!last && <ChevronRight className="h-3 w-3" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
