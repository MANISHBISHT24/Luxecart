"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <Container className="py-28 text-center" role="alert">
      <p className="eyebrow mb-4">Something went wrong</p>
      <h1 className="text-5xl sm:text-6xl">We couldn&apos;t load this page.</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">
        An unexpected error occurred. Please try again. If it keeps happening, contact us and quote the reference below.
      </p>
      {error.digest && <p className="mt-3 text-xs text-ink-soft">Reference: {error.digest}</p>}
      <div className="mt-10 flex justify-center gap-4">
        <Button onClick={() => unstable_retry()}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </Container>
  );
}
