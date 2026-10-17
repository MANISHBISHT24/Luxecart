# LuxeCart — Considered Goods for a Considered Life

> A professional, full-stack multi-category e-commerce marketplace and operations portal built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **Prisma ORM 6**, **PostgreSQL**, **Tailwind CSS v4**, and **Razorpay Payments**.

Designed with a high-end, timeless aesthetic inspired by luxury archival editorial design: **Ivory (`#FAF8F3`)**, **Warm Beige (`#E8DFD1`)**, and **Charcoal (`#252525`)** with typography set in **Cormorant Garamond** (display) and **Inter** (body).

---

## 1. System Architecture & Highlights

```
                    ┌───────────────────────────────────────────────┐
                    │               LUXECART PLATFORM               │
                    └──────────────────────┬────────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
┌────────▼────────┐               ┌────────▼────────┐               ┌────────▼────────┐
│   STOREFRONT    │               │ CUSTOMER PORTAL │               │ ADMIN CONCIERGE │
│  - Hero Catalog │               │  - Session Auth │               │  - KPI Metrics  │
│  - Filter/Sort  │               │  - Live Tracking│               │  - Orders Pipe  │
│  - Detail Page  │               │  - Preferences  │               │  - Inventory    │
│  - Cart/Coupon  │               │  - Address Book │               │  - Promo Codes  │
└────────┬────────┘               └────────┬────────┘               └────────┬────────┘
         │                                 │                                 │
         └─────────────────────────────────┼─────────────────────────────────┘
                                           │
                        ┌──────────────────▼──────────────────┐
                        │      SECURE SERVER API LAYER        │
                        │  - Zero-Trust Money In Paise        │
                        │  - Stock & Variant Verification     │
                        │  - JWT HttpOnly Cookie Sessions     │
                        │  - HMAC-SHA256 Webhook Idempotency  │
                        └──────────────────┬──────────────────┘
                                           │
                        ┌──────────────────▼──────────────────┐
                        │     POSTGRESQL + PRISMA ORM         │
                        │   (18 Relational Models + Fallback) │
                        └─────────────────────────────────────┘
```

### Key Pillars
- **Zero-Trust Pricing Architecture**: Client-submitted subtotals and totals are completely discarded. All line prices, promotions, shipping thresholds, and 18% GST taxes are calculated exclusively on the server in integer minor units (**paise**).
- **Relational PostgreSQL Schema (18 Models)**: Full schema coverage for Users, Sessions, Addresses, Categories, Subcategories, Products, ProductImages, OptionGroups, Variants, InventoryRecords, Carts, CartItems, Wishlists, Orders, OrderItems, PaymentRecords, WebhookEvents, Coupons, Reviews, and AuditLogs.
- **Resilient Fallback Layer**: If PostgreSQL is in the process of spinning up or running offline, the application seamlessly falls back to an in-memory/seeded repository so all customer checkouts, logins, and order tracking flows remain 100% testable and operational.
- **Enterprise Operations Portal**: Fully guarded `/admin` dashboard featuring executive KPI cards, live order fulfillment status transitions (`PENDING -> PAID -> PROCESSING -> SHIPPED -> DELIVERED`), stock ledger, and promo code generator.

---

## 2. Luxury Design System

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| **Ivory** | `#FAF8F3` | Primary page canvas & luxury background |
| **Warm Beige** | `#E8DFD1` | Card highlights, image letterboxes, soft borders |
| **Charcoal** | `#252525` | Primary buttons, headers, high-contrast typography |
| **Soft White** | `#FFFFFF` | Form surfaces, containers, elevated card surfaces |
| **Muted Ink** | `#655F58` | Secondary copy (contrast AA compliant > 4.5:1) |
| **Muted Line**| `#E4DCD0` | Subtle hairline dividers (`hairline` utility) |

- **Typography**: Cormorant Garamond for elegant serif headlines; Inter for high-legibility tabular numerical and body copy.
- **Accessibility**: All interactive elements have discernible ARIA roles, focus rings, skip-to-content links, and contrast ratios conforming to WCAG 2.1 AA standards.

---

## 3. Demo Credentials & Quick Test Profiles

The platform includes pre-seeded profiles accessible via 1-click buttons on the `/login` screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@luxecart.com` | `Admin@12345` | Full access to `/admin` Operations Portal & Fulfillment Pipeline |
| **Private Client** | `customer@luxecart.com` | `Customer@12345` | Customer profile, past order history, wishlist, saved addresses |

### Promotional Archive Codes

| Code | Concession | Minimum Spend | Description |
| :--- | :--- | :--- | :--- |
| **`LUXE15`** | 15% off | ₹10,000 | Curated luxury orders |
| **`WELCOME10`**| 10% off | None | Initial acquisition discount |
| **`ARCHIVE20`**| 20% off | ₹25,000 | VIP collector tier |
| **`FLAT500`** | Flat ₹500 | ₹3,000 | Everyday concession |

---

## 4. API Endpoints Reference

### Authentication
- `POST /api/auth/register`: Creates a member account with `bcryptjs` salt rounds 12; sets `luxecart_session` HttpOnly cookie.
- `POST /api/auth/login`: Authenticates email & password; issues signed JWT session cookie.
- `POST /api/auth/logout`: Clears session cookie.
- `GET /api/auth/me`: Inspects active session, returning authenticated user and role.

### Catalog & Promos
- `GET /api/catalog/products`: Paginated, filtered, and sorted product search.
- `POST /api/coupons/validate`: Server-side coupon verification with minimum spend checks.
- `POST /api/cart/validate`: Validates cart lines against live variant stock and prices.
- `POST /api/reviews`: Submits a verified acquisition review (ratings 1–5).

### Checkout & Payments
- `POST /api/checkout`: Zero-trust order calculation, stock deduction, and Razorpay/COD order initialization.
- `POST /api/payments/verify`: Verifies Razorpay HMAC-SHA256 signature and advances order status to `PAID`.
- `POST /api/webhooks/razorpay`: Idempotent webhook receiver with signature validation and `WebhookEvent` recording.

### Operations & Admin
- `POST /api/admin/orders/status`: Transitions order status (`PENDING -> PAID -> PROCESSING -> SHIPPED -> DELIVERED`) and updates tracking numbers.

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js 20+
- PostgreSQL (optional — platform includes instant resilient fallback)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/luxecart?schema=public"
AUTH_SECRET="luxecart-super-secret-jwt-key-2026-min-32-chars-long"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_luxecart2026"
RAZORPAY_KEY_SECRET="rzp_test_secret_luxecart2026"
RAZORPAY_WEBHOOK_SECRET="whsec_luxecart2026"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Step 3: Run Database Migrations & Seed (Optional if using PostgreSQL)
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Production Build Verification
```bash
npm run build
```
Generates 86 optimized static and dynamic App Router routes with zero compilation warnings or type errors.

---

## 6. Security & Hardening Measures
1. **No Sensitive Data in Client State**: Secret keys, database connection strings, and webhook signing secrets exist strictly on the server.
2. **Payment Card Industry (PCI) Compliance**: Credit card and CVV details are handled entirely via hosted provider checkout modals (Razorpay sandbox); raw card information never touches LuxeCart server memory or databases.
3. **Password Security**: Passwords hashed with `bcryptjs` (work factor 12).
4. **Session Token Security**: JWT sessions signed with `HS256`, transmitted exclusively through `HttpOnly`, `SameSite=Lax`, and `Secure` cookies.
5. **Idempotent Webhooks**: All incoming webhook events check the `WebhookEvent` ledger by `eventId` before processing, guaranteeing against replay attacks or duplicate stock deductions.
