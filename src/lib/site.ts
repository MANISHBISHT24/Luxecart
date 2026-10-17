export const SITE = {
  name: "LuxeCart",
  tagline: "Considered goods for a considered life",
  description:
    "LuxeCart is a premium multi-category marketplace for fashion, electronics, home, beauty and lifestyle essentials.",
  // Replaced by NEXT_PUBLIC_SITE_URL in Phase 9.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  announcement: "Complimentary standard shipping on orders over ₹5,000",
} as const;

export const FOOTER_LINKS = {
  Help: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping" },
    { href: "/returns", label: "Returns & refunds" },
    { href: "/contact", label: "Contact" },
  ],
  Company: [
    { href: "/about", label: "About LuxeCart" },
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of service" },
  ],
  Account: [
    { href: "/login", label: "Sign in" },
    { href: "/register", label: "Create account" },
    { href: "/account/orders", label: "Order history" },
    { href: "/wishlist", label: "Wishlist" },
  ],
} as const;
