import type { PriceBreakdown, Room, Service } from '../types/booking';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 'YYYY-MM-DD' -> UTC შუაღამის timestamp.
 * UTC-ით ვმუშაობთ, რომ დროის სარტყელი და ზაფხულის დრო (DST) დღეების დათვლას არ აბნევდეს.
 * აბრუნებს null-ს არასწორი თარიღისთვის (მაგ. 2026-02-31 ან წელი 0026).
 */
function parseISODate(iso: string): number | null {
  if (!ISO_DATE.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d);
  const date = new Date(t);
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null;
  }
  return t;
}

export function isValidISODate(iso: string): boolean {
  return parseISODate(iso) !== null;
}

/** ღამეების რაოდენობა: გასვლა - შესვლა. არასწორი ან შებრუნებული თარიღებისთვის 0. */
export function calcNights(checkIn: string, checkOut: string): number {
  const from = parseISODate(checkIn);
  const to = parseISODate(checkOut);
  if (from === null || to === null) return 0;
  const nights = (to - from) / MS_PER_DAY;
  return nights > 0 ? nights : 0;
}

/** დღევანდელი თარიღი მომხმარებლის ლოკალურ დროში (YYYY-MM-DD). */
export function todayISO(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** თარიღს ამატებს n დღეს (YYYY-MM-DD). */
export function addDays(iso: string, days: number): string {
  const t = parseISODate(iso);
  if (t === null) return iso;
  return new Date(t + days * MS_PER_DAY).toISOString().slice(0, 10);
}

interface CalcInput {
  room: Room | undefined;
  nights: number;
  guests: number;
  services: Service[];
  discountIndex: number; // 1 = ფასდაკლების გარეშე, 0.85 = 15% ფასდაკლება
}

export function calcTotal({ room, nights, guests, services, discountIndex }: CalcInput): PriceBreakdown {
  const roomCost = room ? room.pricePerNight * nights : 0;

  const servicesCost = nights === 0 ? 0 : services.reduce((sum, s) => {
    if (s.pricing === 'flat') return sum + s.price;
    if (s.pricing === 'perNight') return sum + s.price * nights;
    return sum + s.price * nights * guests;
  }, 0);

  const subtotal = roomCost + servicesCost;
  const total = Math.round(subtotal * discountIndex * 100) / 100;
  return { nights, roomCost, servicesCost, subtotal, discountAmount: subtotal - total, total };
}
