import test from "node:test";
import assert from "node:assert/strict";
import {
  createOrder,
  getOrderById,
  generateOrderNumber,
  updateOrderStatus,
  listOrdersByUser,
  listAllOrders,
  type OrderStatus,
} from "../src/lib/orders";

test("Orders: generates standard LuxeCart order number (LC-YYYYMMDD-XXXX)", () => {
  const num = generateOrderNumber();
  assert.match(num, /^LC-\d{8}-\d{4}$/, "Order number must follow strict pattern");
});

test("Orders: creates order with zero-trust server calculated totals", async () => {
  const order = await createOrder({
    userId: "usr_buyer_99",
    guestEmail: "buyer@example.com",
    shippingAddress: {
      fullName: "Priya Sharma",
      email: "buyer@example.com",
      addressLine1: "44 Palm Meadows",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560066",
      phone: "+91 99887 76655",
    },
    shippingMethod: "standard",
    paymentMethod: "COD",
    subtotalPaise: 3800000,
    discountPaise: 570000,
    shippingPaise: 0,
    taxPaise: 581400,
    totalPaise: 3811400,
    couponCode: "LUXE15",
    items: [
      {
        productName: "Camel Double-Breasted Wool Coat",
        productSku: "LC-FAS-001-CAMEL-M",
        variantLabel: "Camel / Medium",
        unitPricePaise: 3800000,
        quantity: 1,
        totalPaise: 3800000,
      },
    ],
  });

  assert.ok(order.id.startsWith("ord_"));
  assert.strictEqual(order.status, "PROCESSING"); // COD starts at PROCESSING
  assert.strictEqual(order.totalPaise, 3811400);
  assert.strictEqual(order.items.length, 1);

  // Lookup by ID
  const retrieved = await getOrderById(order.id);
  assert.ok(retrieved !== null);
  assert.strictEqual(retrieved.orderNumber, order.orderNumber);
});

test("Orders: state machine transitions through fulfillment stages", async () => {
  const order = await createOrder({
    userId: "usr_buyer_99",
    shippingAddress: {
      fullName: "Aarav Gupta",
      email: "aarav@example.com",
      addressLine1: "10 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      phone: "+91 91234 56789",
    },
    shippingMethod: "standard",
    paymentMethod: "RAZORPAY",
    subtotalPaise: 1490000,
    discountPaise: 0,
    shippingPaise: 0,
    taxPaise: 268200,
    totalPaise: 1758200,
    items: [
      {
        productName: "Studio Wireless Headphones",
        productSku: "LC-ELC-001-CHARCOAL",
        variantLabel: "Charcoal",
        unitPricePaise: 1490000,
        quantity: 1,
        totalPaise: 1490000,
      },
    ],
  });

  assert.strictEqual(order.status, "PENDING");

  // Payment confirmation -> PAID
  const paid = await updateOrderStatus(order.id, "PAID");
  assert.strictEqual(paid?.status, "PAID");

  // Fulfillment -> PROCESSING
  const processing = await updateOrderStatus(order.id, "PROCESSING");
  assert.strictEqual(processing?.status, "PROCESSING");

  // Courier dispatch -> SHIPPED with tracking number
  const shipped = await updateOrderStatus(order.id, "SHIPPED", "LX-DEL-992144");
  assert.strictEqual(shipped?.status, "SHIPPED");
  assert.strictEqual(shipped?.trackingNumber, "LX-DEL-992144");

  // Delivery confirmation -> DELIVERED
  const delivered = await updateOrderStatus(order.id, "DELIVERED");
  assert.strictEqual(delivered?.status, "DELIVERED");
});
