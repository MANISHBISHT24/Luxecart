import { Container } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { ReactNode } from "react";

/** Shared layout for editorial/policy pages. */
export function ContentPage({
  title,
  eyebrow,
  intro,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-5xl sm:text-6xl">{title}</h1>
          {intro && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>}
          <div className="mt-12 space-y-10 text-[1.02rem] leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-3xl [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_p]:text-ink-soft [&_li]:text-ink-soft [&_ul]:space-y-1.5">
            {children}
          </div>
        </div>
      </Container>
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
