import { Container } from "@/components/ui/layout";

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-12 w-72" />
      <div className="skeleton mt-6 h-5 w-96 max-w-full" />
      <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5] w-full" />
            <div className="skeleton mt-4 h-4 w-2/3" />
          </div>
        ))}
      </div>
    </Container>
  );
}
