import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getProductsBySlugs } from "@/lib/catalog/queries";

/**
 * GET /api/catalog/products?slugs=a,b,c
 * Public catalog data used by the wishlist and "recently viewed" views, whose
 * slug lists live in the browser. Input is validated; output is public data only.
 */
const querySchema = z.object({
  slugs: z
    .string()
    .max(2000)
    .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean))
    .pipe(z.array(z.string().regex(/^[a-z0-9-]{1,120}$/)).max(24)),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({ slugs: request.nextUrl.searchParams.get("slugs") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid slugs parameter" }, { status: 400 });
  }
  const items = await getProductsBySlugs(parsed.data.slugs);
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
