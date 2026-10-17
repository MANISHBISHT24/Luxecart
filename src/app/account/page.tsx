import Link from "next/link";
import { ArrowUpRight, Package, ShieldCheck, UserCheck, Heart, MapPin } from "lucide-react";
import { getSession } from "@/lib/auth";
import { listOrdersByUser, listAllOrders } from "@/lib/orders";
import { ButtonLink } from "@/components/ui/button";
import { SignOutButton } from "./sign-out-button";
import { SignInRequired } from "@/components/account/sign-in-required";

export default async function AccountOverviewPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="space-y-10">
        <SignInRequired what="profile, order history and saved addresses" />
      </div>
    );
  }

  const userOrders = await listOrdersByUser(session.id);
  const totalOrders = userOrders.length > 0 ? userOrders.length : (await listAllOrders()).length;

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="border hairline bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Client Profile</span>
              <span className="bg-charcoal text-ivory text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                {session.role}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display mt-1 text-charcoal">{session.name}</h1>
            <p className="text-sm text-ink-soft mt-0.5">{session.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {session.role === "ADMIN" && (
              <ButtonLink href="/admin" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Concierge</span>
              </ButtonLink>
            )}
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Highlights grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border hairline bg-white p-6">
          <div className="flex items-center justify-between">
            <Package className="h-5 w-5 text-charcoal stroke-[1.4]" />
            <Link href="/account/orders" className="text-ink-soft hover:text-charcoal transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-2xl font-display text-charcoal mt-4">{totalOrders}</p>
          <p className="text-xs uppercase tracking-wider text-ink-soft mt-1">Orders Recorded</p>
        </div>

        <div className="border hairline bg-white p-6">
          <div className="flex items-center justify-between">
            <Heart className="h-5 w-5 text-charcoal stroke-[1.4]" />
            <Link href="/wishlist" className="text-ink-soft hover:text-charcoal transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-2xl font-display text-charcoal mt-4">Active</p>
          <p className="text-xs uppercase tracking-wider text-ink-soft mt-1">Private Wishlist</p>
        </div>

        <div className="border hairline bg-white p-6">
          <div className="flex items-center justify-between">
            <MapPin className="h-5 w-5 text-charcoal stroke-[1.4]" />
            <Link href="/account/addresses" className="text-ink-soft hover:text-charcoal transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-2xl font-display text-charcoal mt-4">Verified</p>
          <p className="text-xs uppercase tracking-wider text-ink-soft mt-1">Primary Residence</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="border hairline bg-white p-6 sm:p-8">
        <h2 className="eyebrow mb-4">Quick Navigation</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="flex items-center justify-between border hairline p-4 hover:border-charcoal transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-charcoal">Track Orders</p>
              <p className="text-xs text-ink-soft">View live fulfillment status and invoices</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-ink-soft" />
          </Link>

          <Link
            href="/account/profile"
            className="flex items-center justify-between border hairline p-4 hover:border-charcoal transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-charcoal">Profile Preferences</p>
              <p className="text-xs text-ink-soft">Update personal telephone and email</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-ink-soft" />
          </Link>
        </div>
      </div>
    </div>
  );
}
