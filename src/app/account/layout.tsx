import type { Metadata } from "next";
import { AccountNav } from "@/components/account/account-nav";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = { title: { default: "My account", template: "%s | My account | LuxeCart" }, robots: { index: false, follow: false } };

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="mb-10 text-5xl">My account</h1>
      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <AccountNav />
        <div>{children}</div>
      </div>
    </Container>
  );
}
