import Link from "next/link";
import type { ReactNode } from "react";
import { Notice } from "@/components/ui/form";
import { Container } from "@/components/ui/layout";

/** Shared frame for sign-in style pages. */
export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Container className="grid min-h-[640px] items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-5xl">{title}</h1>
          <p className="mt-4 text-ink-soft">{intro}</p>
        </div>
        <div className="border border-line bg-white p-7 sm:p-10">
          <div className="mb-6">
            <Notice tone="warning" title="Not connected yet">
              This form is the finished UI. Server-side authentication (hashed passwords, secure sessions, rate
              limiting) is built in the authentication phase, so submitting is disabled.
            </Notice>
          </div>
          {children}
        </div>
        {footer && <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>}
      </div>
    </Container>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-charcoal underline underline-offset-4">
      {children}
    </Link>
  );
}
