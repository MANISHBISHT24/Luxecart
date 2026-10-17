import { Search } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { getCategories } from "@/lib/catalog/queries";
import { SITE } from "@/lib/site";

export async function SiteHeader() {
  const categories = await getCategories();
  const links = [
    { href: "/products", label: "All products" },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  ];

  return (
    <>
      <div className="bg-charcoal text-ivory">
        <Container className="flex h-9 items-center justify-center text-center text-[0.72rem] tracking-[0.14em] uppercase">
          {SITE.announcement}
        </Container>
      </div>
      <header className="sticky top-0 z-50 border-b hairline bg-ivory/90 backdrop-blur-md">
        <Container className="flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:w-52">
            <MobileMenu links={links} />
            <Link href="/" className="font-display text-[1.7rem] tracking-[0.04em]" aria-label="LuxeCart home">
              LUXE<span className="font-light italic">cart</span>
            </Link>
          </div>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.8rem] font-medium uppercase tracking-[0.12em]">
              <li>
                <Link href="/products" className="underline-offset-[10px] hover:underline">
                  Shop all
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="underline-offset-[10px] hover:underline">
                    {c.name.split(" & ")[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1 lg:w-52">
            <form action="/products" method="get" role="search" className="hidden md:block">
              <label htmlFor="header-search" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                  aria-hidden
                />
                <input
                  id="header-search"
                  name="q"
                  type="search"
                  maxLength={80}
                  placeholder="Search"
                  className="h-10 w-36 rounded-full border border-line bg-white pl-9 pr-3 text-sm placeholder:text-muted transition-all focus:w-52 focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                />
              </div>
            </form>
            <HeaderActions />
          </div>
        </Container>
      </header>
    </>
  );
}
