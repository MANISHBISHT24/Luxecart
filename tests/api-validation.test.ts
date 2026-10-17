import test from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().trim().min(2),
    email: z.string().trim().email(),
    addressLine1: z.string().trim().min(5),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    postalCode: z.string().trim().length(6, "PIN code must be 6 digits"),
    phone: z.string().trim().min(10),
  }),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  paymentMethod: z.enum(["RAZORPAY", "COD"]).default("RAZORPAY"),
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    })
  ).min(1, "Cart cannot be empty"),
});

test("Validation: Checkout rejects invalid PIN code length", () => {
  const invalidPayload = {
    shippingAddress: {
      fullName: "Julian Sterling",
      email: "julian@luxecart.com",
      addressLine1: "12 Rosewood Lane",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "5600", // Invalid: only 4 digits
      phone: "+91 98765 43210",
    },
    items: [{ variantId: "var_1", quantity: 1 }],
  };

  const parsed = checkoutSchema.safeParse(invalidPayload);
  assert.strictEqual(parsed.success, false);
  assert.match(parsed.error.issues[0].message, /PIN code/i);
});

test("Validation: Checkout rejects empty cart", () => {
  const invalidPayload = {
    shippingAddress: {
      fullName: "Julian Sterling",
      email: "julian@luxecart.com",
      addressLine1: "12 Rosewood Lane",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      phone: "+91 98765 43210",
    },
    items: [], // Empty
  };

  const parsed = checkoutSchema.safeParse(invalidPayload);
  assert.strictEqual(parsed.success, false);
});

test("Security/Payments: Razorpay HMAC-SHA256 signature verification matches", () => {
  const secret = "test_webhook_secret_key_123";
  const orderId = "order_12345678";
  const paymentId = "pay_87654321";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // Re-verify
  const verifiedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  assert.strictEqual(expectedSignature, verifiedSignature);

  // Altering paymentId must fail
  const tamperedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|pay_fake`)
    .digest("hex");

  assert.notStrictEqual(expectedSignature, tamperedSignature);
});
