import type { Room, Service, ServicePricing } from '../types/booking';

export const ROOMS: Room[] = [
  { id: 'standard', name: 'სტანდარტული ნომერი', pricePerNight: 120, maxGuests: 2 },
  { id: 'deluxe', name: 'დელუქს ნომერი', pricePerNight: 190, maxGuests: 3 },
  { id: 'family', name: 'საოჯახო ნომერი', pricePerNight: 260, maxGuests: 5 },
];

export const SERVICES: Service[] = [
  { id: 'breakfast', name: 'საუზმე', price: 15, pricing: 'perGuestPerNight' },
  { id: 'spa', name: 'სპა', price: 80, pricing: 'flat' },
  { id: 'transfer', name: 'ტრანსფერი', price: 40, pricing: 'flat' },
];

export const PRICING_LABELS: Record<ServicePricing, string> = {
  perNight: 'ღამეში',
  perGuestPerNight: 'სტუმარზე / ღამეში',
  flat: 'ერთჯერადად',
};
