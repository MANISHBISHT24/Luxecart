import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="text-6xl sm:text-7xl">This page has wandered off.</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to something beautiful.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/products" variant="secondary">
          Browse products
        </ButtonLink>
      </div>
    </Container>
  );
}
