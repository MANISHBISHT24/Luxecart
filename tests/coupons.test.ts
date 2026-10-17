import test from "node:test";
import assert from "node:assert/strict";

function calculateCouponDiscount(
  code: string,
  subtotalPaise: number
): { valid: boolean; discountPaise: number; message?: string } {
  const clean = code.toUpperCase().trim();

  if (clean === "WELCOME10") {
    const raw = Math.round((subtotalPaise * 10) / 100);
    const maxDiscount = 500000; // ₹5,000 max
    return { valid: true, discountPaise: Math.min(raw, maxDiscount) };
  }

  if (clean === "LUXE15") {
    if (subtotalPaise < 1000000) {
      return { valid: false, discountPaise: 0, message: "Requires minimum order of ₹10,000" };
    }
    const raw = Math.round((subtotalPaise * 15) / 100);
    const maxDiscount = 1000000; // ₹10,000 max
    return { valid: true, discountPaise: Math.min(raw, maxDiscount) };
  }

  if (clean === "ARCHIVE20") {
    if (subtotalPaise < 2500000) {
      return { valid: false, discountPaise: 0, message: "Requires minimum order of ₹25,000" };
    }
    const raw = Math.round((subtotalPaise * 20) / 100);
    const maxDiscount = 2000000;
    return { valid: true, discountPaise: Math.min(raw, maxDiscount) };
  }

  if (clean === "FLAT500") {
    if (subtotalPaise < 300000) {
      return { valid: false, discountPaise: 0, message: "Requires minimum order of ₹3,000" };
    }
    return { valid: true, discountPaise: 50000 };
  }

  return { valid: false, discountPaise: 0, message: "Invalid promotional code" };
}

test("Coupons: WELCOME10 applies 10% discount", () => {
  const res = calculateCouponDiscount("WELCOME10", 2000000); // ₹20,000
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.discountPaise, 200000); // 10% = ₹2,000
});

test("Coupons: WELCOME10 caps at ₹5,000 max discount", () => {
  const res = calculateCouponDiscount("welcome10", 10000000); // ₹100,000
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.discountPaise, 500000); // Capped at ₹5,000
});

test("Coupons: LUXE15 rejects if subtotal < ₹10,000", () => {
  const res = calculateCouponDiscount("LUXE15", 800000); // ₹8,000
  assert.strictEqual(res.valid, false);
  assert.strictEqual(res.discountPaise, 0);
  assert.match(res.message || "", /minimum/i);
});

test("Coupons: LUXE15 applies 15% when subtotal >= ₹10,000", () => {
  const res = calculateCouponDiscount("LUXE15", 3800000); // ₹38,000 (Camel Coat)
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.discountPaise, 570000); // 15% of 38,000 = ₹5,700
});

test("Coupons: FLAT500 gives exactly ₹500 off", () => {
  const res = calculateCouponDiscount("FLAT500", 500000); // ₹5,000
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.discountPaise, 50000); // ₹500
});

test("Coupons: rejects nonexistent codes gracefully", () => {
  const res = calculateCouponDiscount("INVALID_CODE_999", 500000);
  assert.strictEqual(res.valid, false);
  assert.strictEqual(res.discountPaise, 0);
});
