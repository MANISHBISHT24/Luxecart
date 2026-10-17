import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * All monetary values are integers in minor units (paise). Phase 3 maps these
 * to Prisma `Decimal` columns; integer minor units avoid float drift in the UI.
 */
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(minor: number) {
  return minor % 100 === 0 ? inr.format(minor / 100) : inrPrecise.format(minor / 100);
}

export const rupees = (n: number) => Math.round(n * 100);

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
