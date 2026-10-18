// Price + area formatting. Pure, no deps.

import type { Property } from "./types";

const CRORE = 10_000_000;
const LAKH = 100_000;

export function formatInr(n: number): string {
  if (n >= CRORE) {
    const v = n / CRORE;
    return `₹${Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, "")} Cr`;
  }
  if (n >= LAKH) {
    const v = n / LAKH;
    return `₹${Number.isInteger(v) ? v : v.toFixed(1).replace(/\.0$/, "")}L`;
  }
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatPrice(p: Property): string {
  if (p.priceType === "on-request") return "Price on request";
  const { priceMin, priceMax } = p;
  if (priceMin && priceMax && priceMin !== priceMax) {
    return `${formatInr(priceMin)}–${formatInr(priceMax)}`;
  }
  return formatInr(priceMin ?? priceMax ?? 0);
}

export function formatArea(p: Property): string {
  const unit = p.area.unit === "sqft" ? "sq ft" : "sq yd";
  return `${p.area.value.toLocaleString("en-IN")} ${unit}`;
}
