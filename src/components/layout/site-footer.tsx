import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-charcoal text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-3xl tracking-[0.04em]">
            LUXE<span className="font-light italic">cart</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">{SITE.tagline}.</p>
          <form className="mt-8 max-w-sm" aria-label="Newsletter (not yet connected)">
            <label htmlFor="newsletter" className="eyebrow !text-ivory/70">
              Newsletter
            </label>
            <div className="mt-3 flex border-b border-ivory/40 focus-within:border-ivory">
              <input
                id="newsletter"
                type="email"
                disabled
                placeholder="Coming soon"
                className="h-11 w-full bg-transparent text-sm placeholder:text-ivory/50 focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
          </form>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h2 className="eyebrow !text-ivory/60 font-sans">{title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ivory/85 underline-offset-4 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-ivory/15">
        <Container className="flex flex-col gap-2 py-6 text-xs text-ivory/60 sm:flex-row sm:justify-between">
          <p>© 2026 LuxeCart. A portfolio project — no real orders are fulfilled.</p>
          <p>Prices in INR, inclusive of GST.</p>
        </Container>
      </div>
    </footer>
  );
}
