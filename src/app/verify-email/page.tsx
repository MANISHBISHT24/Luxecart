import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Verify your email", robots: { index: false } };

export default function VerifyEmailPage() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige" aria-hidden>
          <MailCheck className="h-7 w-7 stroke-[1.3]" />
        </div>
        <h1 className="text-5xl">Verify your email</h1>
        <p className="mt-4 text-ink-soft">
          After registration we&apos;ll email a single-use, expiring link. Opening it confirms your address. The
          verification flow is connected in the authentication phase.
        </p>
        <ButtonLink href="/" variant="secondary" className="mt-8">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
