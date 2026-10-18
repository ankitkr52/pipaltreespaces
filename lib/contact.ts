import type { Property } from "./types";
import { formatPrice } from "./format";

export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
export const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+919999999999";

export function whatsappHref(p?: Property) {
  if (!p) {
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      "Hello, I'd like to speak with the Pipaltreespaces advisor about a property."
    )}`;
  }
  const msg = `Hello, I'm interested in ${p.title} (${p.category}) in ${p.city}. Price: ${formatPrice(
    p
  )}. Please share more details and site-visit availability. Thank you.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

export const telHref = `tel:${PHONE}`;
