import Link from "next/link";
import { ArrowLeft, Box, LayoutDashboard, Package, ShieldCheck, ShieldAlert, Tag, Warehouse } from "lucide-react";
import { getSession } from "@/lib/auth";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border hairline p-8 space-y-6">
          <ShieldAlert className="h-10 w-10 text-amber-700 mx-auto stroke-[1.4]" />
          <div>
            <h1 className="text-3xl font-display text-charcoal">Restricted Portal</h1>
            <p className="text-sm text-ink-soft mt-2">
              The LuxeCart Operations Management system requires verified administrator privileges.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="bg-charcoal text-ivory text-xs uppercase tracking-wider py-3 px-6 hover:bg-charcoal/90 transition-colors"
            >
              Sign In as Administrator
            </Link>
            <Link
              href="/"
              className="border hairline text-charcoal text-xs uppercase tracking-wider py-3 px-6 hover:bg-beige transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-charcoal">
      {/* Top Banner */}
      <div className="bg-charcoal text-ivory text-[0.72rem] uppercase tracking-[0.15em] h-9 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>LuxeCart Concierge & Operations Management System</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Logged as: {session?.name || "Eleanor Vance (Admin)"}</span>
          <Link href="/" className="underline hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Storefront</span>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] min-h-[calc(100vh-36px)]">
        {/* Admin Navigation Sidebar */}
        <aside className="border-r hairline bg-white/80 backdrop-blur p-6 space-y-8">
          <div>
            <Link href="/admin" className="font-display text-2xl tracking-wider block">
              LUXE<span className="font-light italic">admin</span>
            </Link>
            <p className="text-[0.68rem] uppercase tracking-wider text-ink-soft mt-1">Management Portal</p>
          </div>

          <nav className="space-y-1.5" aria-label="Admin Navigation">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-charcoal hover:bg-beige transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 stroke-[1.4]" />
              <span>Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-charcoal hover:bg-beige transition-colors"
            >
              <Box className="h-4 w-4 stroke-[1.4]" />
              <span>Products & Catalog</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-charcoal hover:bg-beige transition-colors"
            >
              <Package className="h-4 w-4 stroke-[1.4]" />
              <span>Orders & Fulfillment</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-charcoal hover:bg-beige transition-colors"
            >
              <Warehouse className="h-4 w-4 stroke-[1.4]" />
              <span>Inventory Logs</span>
            </Link>

            <Link
              href="/admin/coupons"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium text-charcoal hover:bg-beige transition-colors"
            >
              <Tag className="h-4 w-4 stroke-[1.4]" />
              <span>Promotional Codes</span>
            </Link>
          </nav>

          <div className="pt-8 border-t hairline space-y-3">
            <div className="bg-beige/40 p-3 text-xs space-y-1">
              <p className="font-medium text-charcoal">Database State</p>
              <p className="text-ink-soft">PostgreSQL 18 • Resilient fallback active</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-soft hover:text-charcoal px-3 py-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Exit to Storefront</span>
            </Link>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
