import test from "node:test";
import assert from "node:assert/strict";
import { computeTotals, FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from "../src/lib/pricing";

test("Pricing: calculates subtotal correctly from line items", () => {
  const lines = [
    { unitPrice: 3800000, qty: 1 }, // ₹38,000 (Camel Coat)
    { unitPrice: 1490000, qty: 2 }, // ₹14,900 x 2 = ₹29,800 (Headphones)
  ];
  const totals = computeTotals(lines, "standard");
  assert.strictEqual(totals.subtotal, 6780000); // ₹67,800
});

test("Pricing: applies free standard shipping when subtotal >= ₹5,000", () => {
  const lines = [{ unitPrice: 500000, qty: 1 }]; // Exactly ₹5,000
  const totals = computeTotals(lines, "standard");
  assert.strictEqual(totals.subtotal, 500000);
  assert.strictEqual(totals.shipping, 0); // Complimentary
});

test("Pricing: charges standard shipping fee (₹99) when subtotal < ₹5,000", () => {
  const lines = [{ unitPrice: 320000, qty: 1 }]; // ₹3,200
  const totals = computeTotals(lines, "standard");
  assert.strictEqual(totals.subtotal, 320000);
  assert.strictEqual(totals.shipping, 9900); // ₹99 (9,900 paise)
  assert.strictEqual(totals.total, 329900);
});

test("Pricing: charges express shipping fee (₹249) regardless of subtotal", () => {
  const lines = [{ unitPrice: 5000000, qty: 1 }]; // ₹50,000
  const totals = computeTotals(lines, "express");
  assert.strictEqual(totals.shipping, 24900); // ₹249 (24,900 paise)
  assert.strictEqual(totals.total, 5024900);
});

test("Pricing: correctly derives included 18% GST tax", () => {
  const lines = [{ unitPrice: 118000, qty: 1 }]; // ₹1,180
  const totals = computeTotals(lines, "standard");
  // 18% GST included: includedTax = round(118000 * 18 / 118) = 18000
  const expectedTax = Math.round((118000 * 18) / 118);
  assert.strictEqual(totals.includedTax, expectedTax);
});

test("Pricing: returns 0 total when cart is empty", () => {
  const totals = computeTotals([], "standard");
  assert.strictEqual(totals.subtotal, 0);
  assert.strictEqual(totals.shipping, 0);
  assert.strictEqual(totals.total, 0);
  assert.strictEqual(totals.includedTax, 0);
});
