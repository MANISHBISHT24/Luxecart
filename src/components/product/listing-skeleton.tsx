import { Container } from "@/components/ui/layout";

export function ListingSkeleton() {
  return (
    <Container className="py-12" aria-busy="true" aria-label="Loading products">
      <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-6 w-3/4" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/5] w-full" />
              <div className="skeleton mt-4 h-4 w-2/3" />
              <div className="skeleton mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
