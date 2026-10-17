import { PrismaClient, UserRole, OrderStatus, PaymentStatus, PaymentMethod, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting LuxeCart Database Seed...");

  // 1. Clean existing records safely in order of foreign key dependencies
  await prisma.auditLog.deleteMany();
  await prisma.returnRecord.deleteMany();
  await prisma.review.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventoryRecord.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.optionGroup.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users (Admin, Staff, Customer)
  const passwordHash = await bcrypt.hash("LuxeCart@Secure2026", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@luxecart.com",
      name: "Victoria Sterling",
      passwordHash,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      phone: "+91 98765 43210",
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: "staff@luxecart.com",
      name: "Marcus Vance",
      passwordHash,
      role: UserRole.STAFF,
      emailVerified: new Date(),
      phone: "+91 98765 43211",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@luxecart.com",
      name: "Aarav Mehta",
      passwordHash,
      role: UserRole.CUSTOMER,
      emailVerified: new Date(),
      phone: "+91 98765 43212",
      addresses: {
        create: [
          {
            fullName: "Aarav Mehta",
            addressLine1: "12 Rosewood Lane",
            addressLine2: "Indiranagar",
            city: "Bengaluru",
            state: "Karnataka",
            postalCode: "560038",
            phone: "+91 98765 43212",
            isDefault: true,
          },
          {
            fullName: "Aarav Mehta (Office)",
            addressLine1: "WeWork Galaxy, 43 Residency Road",
            addressLine2: "Shanthala Nagar",
            city: "Bengaluru",
            state: "Karnataka",
            postalCode: "560025",
            phone: "+91 98765 43212",
            isDefault: false,
          },
        ],
      },
    },
  });

  console.log("✓ Created Users (Admin, Staff, Customer)");

  // 3. Categories & Subcategories
  const categoriesData = [
    {
      slug: "fashion",
      name: "Fashion & Clothing",
      tagline: "Considered tailoring and timeless knitwear.",
      image: "/images/camel-coat.jpg",
      sortOrder: 1,
      subcategories: [
        { slug: "outerwear", name: "Outerwear" },
        { slug: "knitwear", name: "Knitwear" },
        { slug: "bags-accessories", name: "Bags & Accessories" },
      ],
    },
    {
      slug: "electronics",
      name: "Electronics & Accessories",
      tagline: "Quietly powerful tech, beautifully made.",
      image: "/images/headphones.jpg",
      sortOrder: 2,
      subcategories: [
        { slug: "audio", name: "Audio" },
        { slug: "wearables", name: "Wearables" },
        { slug: "desk-tech", name: "Desk & Workspace" },
      ],
    },
    {
      slug: "home",
      name: "Home & Living",
      tagline: "Objects that make a room feel finished.",
      sortOrder: 3,
      subcategories: [
        { slug: "decor", name: "Decor" },
        { slug: "lighting", name: "Lighting" },
        { slug: "textiles", name: "Textiles" },
      ],
    },
    {
      slug: "beauty",
      name: "Beauty & Personal Care",
      tagline: "Rituals for skin, scent and self.",
      sortOrder: 4,
      subcategories: [
        { slug: "skincare", name: "Skincare" },
        { slug: "fragrance", name: "Fragrance" },
      ],
    },
    {
      slug: "sports",
      name: "Sports & Lifestyle",
      tagline: "Gear for movement, designed to be seen.",
      sortOrder: 5,
      subcategories: [
        { slug: "yoga", name: "Yoga & Studio" },
        { slug: "running", name: "Running" },
        { slug: "outdoors", name: "Outdoors" },
      ],
    },
  ];

  const categoryMap = new Map<string, string>();
  const subcategoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        tagline: cat.tagline,
        image: cat.image,
        sortOrder: cat.sortOrder,
        subcategories: {
          create: cat.subcategories.map((sub) => ({
            slug: sub.slug,
            name: sub.name,
          })),
        },
      },
      include: { subcategories: true },
    });
    categoryMap.set(cat.slug, createdCat.id);
    for (const sub of createdCat.subcategories) {
      subcategoryMap.set(`${cat.slug}:${sub.slug}`, sub.id);
    }
  }

  console.log("✓ Created Categories & Subcategories");

  // 4. Products, Option Groups, Variants & Inventory
  interface SeedProduct {
    slug: string;
    sku: string;
    name: string;
    brand: string;
    categorySlug: string;
    subcategorySlug: string;
    tagline: string;
    description: string;
    highlights: string[];
    price: number;
    compareAtPrice?: number;
    images: string[];
    popularity: number;
    badges: string[];
    options: { name: string; values: string[] }[];
  }

  const catalog: SeedProduct[] = [
    {
      slug: "camel-double-breasted-wool-coat",
      sku: "LC-FSH-001",
      name: "Camel Double-Breasted Wool Coat",
      brand: "Maison Aurel",
      categorySlug: "fashion",
      subcategorySlug: "outerwear",
      tagline: "A heritage overcoat in dense Italian wool.",
      description:
        "Cut with a peak lapel and a relaxed shoulder, this double-breasted overcoat is woven from a dense wool blend that holds its shape through the season. Fully lined in cupro with horn-effect buttons and generous welt pockets.",
      highlights: ["80% wool, 20% cashmere", "Fully lined in cupro", "Horn-effect buttons", "Dry clean only"],
      price: 18900.0,
      compareAtPrice: 24500.0,
      images: ["/images/camel-coat.jpg"],
      popularity: 98,
      badges: ["bestseller", "featured"],
      options: [{ name: "Size", values: ["XS", "S", "M", "L", "XL"] }],
    },
    {
      slug: "cream-cashmere-knit-sweater",
      sku: "LC-FSH-002",
      name: "Cream Cashmere Knit Sweater",
      brand: "Maison Aurel",
      categorySlug: "fashion",
      subcategorySlug: "knitwear",
      tagline: "Featherlight cashmere with a chunky rib.",
      description:
        "A generous crew-neck knit spun from grade-A cashmere. Soft against the skin, with a ribbed hem and cuffs that keep the silhouette clean.",
      highlights: ["100% grade-A cashmere", "Ribbed hem and cuffs", "Hand wash cold"],
      price: 8400.0,
      images: [],
      popularity: 82,
      badges: ["new"],
      options: [{ name: "Size", values: ["S", "M", "L"] }],
    },
    {
      slug: "leather-crossbody-satchel",
      sku: "LC-FSH-003",
      name: "Leather Crossbody Satchel",
      brand: "Atelier Nord",
      categorySlug: "fashion",
      subcategorySlug: "bags-accessories",
      tagline: "Vegetable-tanned leather that ages beautifully.",
      description:
        "A compact structured satchel in full-grain, vegetable-tanned leather with a suede-lined interior, magnetic closure and an adjustable strap.",
      highlights: ["Full-grain leather", "Suede-lined interior", "Adjustable strap"],
      price: 12500.0,
      images: [],
      popularity: 76,
      badges: ["featured"],
      options: [{ name: "Colour", values: ["Tan", "Espresso"] }],
    },
    {
      slug: "studio-wireless-headphones",
      sku: "LC-ELC-001",
      name: "Studio Wireless Headphones",
      brand: "Vessel Audio",
      categorySlug: "electronics",
      subcategorySlug: "audio",
      tagline: "Adaptive noise cancelling, 40-hour battery.",
      description:
        "Tuned for warmth and detail, with adaptive noise cancelling, multipoint Bluetooth and memory-foam cushions wrapped in soft leather.",
      highlights: ["Adaptive noise cancelling", "40-hour battery", "Multipoint Bluetooth 5.3", "USB-C fast charge"],
      price: 14900.0,
      compareAtPrice: 17900.0,
      images: ["/images/headphones.jpg"],
      popularity: 96,
      badges: ["bestseller", "featured"],
      options: [{ name: "Colour", values: ["Charcoal", "Sand"] }],
    },
    {
      slug: "minimal-round-smartwatch",
      sku: "LC-ELC-002",
      name: "Minimal Round Smartwatch",
      brand: "Vessel Audio",
      categorySlug: "electronics",
      subcategorySlug: "wearables",
      tagline: "A calm, always-on display with seven-day battery.",
      description:
        "A sapphire-glass smartwatch focused on the essentials: health tracking, notifications and a week of battery life.",
      highlights: ["Sapphire glass", "7-day battery", "5 ATM water resistance"],
      price: 11900.0,
      images: [],
      popularity: 80,
      badges: ["new"],
      options: [{ name: "Strap", values: ["Sand leather", "Charcoal silicone"] }],
    },
    {
      slug: "aluminium-laptop-stand",
      sku: "LC-ELC-003",
      name: "Aluminium Laptop Stand",
      brand: "Deskcraft",
      categorySlug: "electronics",
      subcategorySlug: "desk-tech",
      tagline: "Machined from a single block of aluminium.",
      description:
        "A fold-flat stand with six height settings and silicone contact points, designed to lift your screen to eye level.",
      highlights: ["CNC-machined aluminium", "6 height settings", "Folds flat"],
      price: 3900.0,
      images: [],
      popularity: 70,
      badges: [],
      options: [{ name: "Finish", values: ["Silver", "Graphite"] }],
    },
    {
      slug: "handmade-ceramic-vase-trio",
      sku: "LC-HOM-001",
      name: "Handmade Ceramic Vase Trio",
      brand: "Terra & Co.",
      categorySlug: "home",
      subcategorySlug: "decor",
      tagline: "Three organic forms, glazed by hand.",
      description:
        "A trio of hand-thrown stoneware vases in a soft matte glaze. Each piece is unique, with subtle variations in tone and texture.",
      highlights: ["Hand-thrown stoneware", "Matte reactive glaze", "Set of three"],
      price: 4600.0,
      images: [],
      popularity: 90,
      badges: ["bestseller"],
      options: [{ name: "Glaze", values: ["Oat", "Stone"] }],
    },
    {
      slug: "travertine-table-lamp",
      sku: "LC-HOM-002",
      name: "Travertine Table Lamp",
      brand: "Terra & Co.",
      categorySlug: "home",
      subcategorySlug: "lighting",
      tagline: "Sculpted stone with a linen drum shade.",
      description:
        "Carved from natural travertine with a washed-linen shade that diffuses a warm, ambient glow. Dimmable, with an inline switch.",
      highlights: ["Natural travertine base", "Linen shade", "Dimmable, E27 bulb"],
      price: 9800.0,
      images: [],
      popularity: 78,
      badges: ["new", "featured"],
      options: [{ name: "Size", values: ["Medium", "Large"] }],
    },
    {
      slug: "washed-linen-throw",
      sku: "LC-HOM-003",
      name: "Washed Linen Throw",
      brand: "Terra & Co.",
      categorySlug: "home",
      subcategorySlug: "textiles",
      tagline: "Stonewashed European flax, softer with every wash.",
      description:
        "A lightweight, breathable throw in stonewashed European flax linen with a hand-knotted fringe.",
      highlights: ["100% European flax", "Pre-washed", "Machine washable"],
      price: 3200.0,
      images: [],
      popularity: 64,
      badges: [],
      options: [{ name: "Colour", values: ["Oat", "Stone", "Charcoal"] }],
    },
    {
      slug: "vitamin-c-brightening-serum",
      sku: "LC-BEA-001",
      name: "Vitamin C Brightening Serum",
      brand: "Lumen Skin",
      categorySlug: "beauty",
      subcategorySlug: "skincare",
      tagline: "15% stabilised vitamin C for visible radiance.",
      description:
        "A lightweight daily serum with stabilised vitamin C, ferulic acid and hyaluronic acid to even tone and support a luminous complexion.",
      highlights: ["15% vitamin C", "Fragrance-free", "Dermatologist tested"],
      price: 2400.0,
      images: [],
      popularity: 94,
      badges: ["bestseller"],
      options: [{ name: "Size", values: ["30 ml", "50 ml"] }],
    },
    {
      slug: "barrier-repair-face-cream",
      sku: "LC-BEA-002",
      name: "Barrier Repair Face Cream",
      brand: "Lumen Skin",
      categorySlug: "beauty",
      subcategorySlug: "skincare",
      tagline: "Ceramides and squalane for resilient skin.",
      description:
        "A rich yet fast-absorbing moisturiser that replenishes the skin barrier with ceramides, squalane and oat extract.",
      highlights: ["Ceramide complex", "Suitable for sensitive skin", "Recyclable porcelain jar"],
      price: 1950.0,
      images: [],
      popularity: 72,
      badges: [],
      options: [{ name: "Size", values: ["50 ml"] }],
    },
    {
      slug: "oud-amber-eau-de-parfum",
      sku: "LC-BEA-003",
      name: "Oud & Amber Eau de Parfum",
      brand: "Maison Aurel",
      categorySlug: "beauty",
      subcategorySlug: "fragrance",
      tagline: "Smoked oud, warm amber, a trace of vanilla.",
      description:
        "A long-lasting eau de parfum with smoky oud and resinous amber over a soft vanilla base. Unisex.",
      highlights: ["Top: bergamot, saffron", "Heart: oud, rose", "Base: amber, vanilla"],
      price: 6800.0,
      images: [],
      popularity: 74,
      badges: ["new"],
      options: [{ name: "Size", values: ["50 ml", "100 ml"] }],
    },
    {
      slug: "natural-rubber-yoga-mat",
      sku: "LC-SPT-001",
      name: "Natural Rubber Yoga Mat",
      brand: "Stillform",
      categorySlug: "sports",
      subcategorySlug: "yoga",
      tagline: "Dense grip, sustainably sourced rubber.",
      description:
        "A 5 mm natural rubber mat with a closed-cell surface that resists moisture and grips even through a hot practice.",
      highlights: ["Natural tree rubber", "5 mm thick", "Non-slip, closed-cell surface"],
      price: 3400.0,
      images: [],
      popularity: 88,
      badges: ["bestseller"],
      options: [{ name: "Colour", values: ["Sand", "Slate"] }],
    },
    {
      slug: "cloud-runner-sneaker",
      sku: "LC-SPT-002",
      name: "Cloud Runner Sneaker",
      brand: "Stillform",
      categorySlug: "sports",
      subcategorySlug: "running",
      tagline: "Responsive cushioning, a breathable knit upper.",
      description:
        "An everyday running shoe with a responsive foam midsole, engineered-knit upper and a durable rubber outsole.",
      highlights: ["Responsive foam midsole", "Engineered-knit upper", "Reflective details"],
      price: 7900.0,
      compareAtPrice: 9500.0,
      images: [],
      popularity: 84,
      badges: ["new"],
      options: [{ name: "Size (UK)", values: ["6", "7", "8", "9", "10"] }],
    },
    {
      slug: "insulated-steel-bottle",
      sku: "LC-SPT-003",
      name: "Insulated Steel Bottle",
      brand: "Stillform",
      categorySlug: "sports",
      subcategorySlug: "outdoors",
      tagline: "Cold for 24 hours, hot for 12.",
      description:
        "Double-wall vacuum insulated bottle in 18/8 stainless steel with a powder-coated finish and leak-proof cap.",
      highlights: ["18/8 stainless steel", "24h cold / 12h hot", "BPA-free cap"],
      price: 1800.0,
      images: [],
      popularity: 68,
      badges: [],
      options: [{ name: "Colour", values: ["Oat", "Charcoal"] }],
    },
  ];

  let sampleVariantForOrder: string | null = null;

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const categoryId = categoryMap.get(item.categorySlug)!;
    const subcategoryId = subcategoryMap.get(`${item.categorySlug}:${item.subcategorySlug}`);

    const product = await prisma.product.create({
      data: {
        slug: item.slug,
        sku: item.sku,
        name: item.name,
        brand: item.brand,
        tagline: item.tagline,
        description: item.description,
        highlights: item.highlights,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        categoryId,
        subcategoryId,
        popularity: item.popularity,
        badges: item.badges,
        isPublished: true,
        images: {
          create: item.images.map((url, sortOrder) => ({
            url,
            alt: `${item.name} - View ${sortOrder + 1}`,
            sortOrder,
          })),
        },
        optionGroups: {
          create: item.options.map((opt) => ({
            name: opt.name,
            values: opt.values,
          })),
        },
      },
    });

    // Generate variants
    const group = item.options[0];
    for (let vIdx = 0; vIdx < group.values.length; vIdx++) {
      const val = group.values[vIdx];
      const variantSku = `${item.sku}-${val.toUpperCase().replace(/[^A-Z0-9]+/g, "")}`;
      const stock = (i * 7 + vIdx * 5) % 17 < 2 ? 0 : (i * 7 + vIdx * 5) % 17;

      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variantSku,
          label: val,
          options: { [group.name]: val },
          stock,
          inventoryRecords: {
            create: {
              change: stock,
              previousStock: 0,
              newStock: stock,
              reason: "INITIAL_SEED",
              referenceId: admin.id,
            },
          },
        },
      });

      if (!sampleVariantForOrder && stock > 0) {
        sampleVariantForOrder = variant.id;
      }
    }
  }

  console.log("✓ Created 15 Products, Images, Option Groups, Variants & Inventory Records");

  // 5. Promotional Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "LUXE10",
        description: "10% off on premium orders over ₹3,000",
        discountType: DiscountType.PERCENTAGE,
        value: 10,
        minOrderAmount: 3000.0,
        maxDiscount: 1500.0,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: "WELCOME500",
        description: "₹500 flat discount on your first order over ₹4,000",
        discountType: DiscountType.FIXED_AMOUNT,
        value: 500.0,
        minOrderAmount: 4000.0,
        maxDiscount: 500.0,
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: "AUTUMN25",
        description: "25% seasonal promotion",
        discountType: DiscountType.PERCENTAGE,
        value: 25,
        minOrderAmount: 5000.0,
        maxDiscount: 3000.0,
        usageLimit: 200,
        isActive: true,
      },
    ],
  });

  console.log("✓ Created Coupons (LUXE10, WELCOME500, AUTUMN25)");

  // 6. Sample Completed Order with Payment Record
  if (sampleVariantForOrder) {
    const sampleVariant = await prisma.productVariant.findUnique({
      where: { id: sampleVariantForOrder },
      include: { product: true },
    });

    if (sampleVariant) {
      const orderNumber = "LC-20261017-0001";
      const unitPrice = Number(sampleVariant.price ?? sampleVariant.product.price);
      const quantity = 1;
      const subtotal = unitPrice * quantity;
      const shipping = subtotal >= 5000 ? 0 : 99;
      const tax = Math.round((subtotal * 0.18) / 1.18);
      const total = subtotal + shipping;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: customer.id,
          status: OrderStatus.SHIPPED,
          subtotal,
          discount: 0,
          shipping,
          tax,
          total,
          shippingMethod: "standard",
          trackingNumber: "IN-DEL-984321045",
          shippingAddress: {
            fullName: "Aarav Mehta",
            addressLine1: "12 Rosewood Lane",
            addressLine2: "Indiranagar",
            city: "Bengaluru",
            state: "Karnataka",
            postalCode: "560038",
            phone: "+91 98765 43212",
          },
          items: {
            create: {
              variantId: sampleVariant.id,
              productName: sampleVariant.product.name,
              productSku: sampleVariant.sku,
              variantLabel: sampleVariant.label,
              unitPrice,
              quantity,
              total: subtotal,
            },
          },
          payments: {
            create: {
              provider: PaymentMethod.RAZORPAY,
              paymentOrderId: "order_mock_sample_123",
              transactionId: "pay_mock_sample_456",
              signature: "sig_verified_mock_789",
              status: PaymentStatus.PAID,
              amount: total,
              currency: "INR",
            },
          },
          reviews: {
            create: {
              productId: sampleVariant.product.id,
              userId: customer.id,
              rating: 5,
              title: "Exceptional craftsmanship and fit",
              comment:
                "The tailoring is outstanding. The wool feels dense, warm, and holds its silhouette without feeling heavy.",
              isApproved: true,
            },
          },
        },
      });

      console.log(`✓ Created Sample Order: ${order.orderNumber} with verified Review`);
    }
  }

  // 7. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "INITIAL_DATABASE_SEED",
      entity: "Database",
      entityId: "system",
      metadata: { seededBy: "admin@luxecart.com", timestamp: new Date().toISOString() },
    },
  });

  console.log("✓ Logged Audit Record");
  console.log("✨ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
