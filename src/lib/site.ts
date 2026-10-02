import { Destination, Zone } from '../types';

export const MAP_LABEL = 'The Wild Blueprint';
export const MAP_ROUTE = '/map';
export const YEARS_OF_EXPERIENCE = 15;
export const CONTACT_EMAIL = 'concierge@shutterandstripes.com';
export const FOUNDER_NAME = 'Sachin';

// States we actively operate in, in priority order. Everything else renders as Pan-India expansion.
export const CORE_STATES = ['Madhya Pradesh', 'Maharashtra'];

const STATE_CODES: Record<string, string> = {
  'Andhra Pradesh': 'AP', Arunachal: 'AR', Assam: 'AS', Bihar: 'BR', Chhattisgarh: 'CG',
  Goa: 'GA', Gujarat: 'GJ', Haryana: 'HR', 'Himachal Pradesh': 'HP', Jharkhand: 'JH',
  Karnataka: 'KA', Kerala: 'KL', 'Madhya Pradesh': 'MP', Maharashtra: 'MH',
  Manipur: 'MN', Meghalaya: 'ML', Mizoram: 'MZ', Nagaland: 'NL', Odisha: 'OD',
  Punjab: 'PB', Rajasthan: 'RJ', Sikkim: 'SK', 'Tamil Nadu': 'TN', Telangana: 'TG',
  Tripura: 'TR', 'Uttar Pradesh': 'UP', Uttarakhand: 'UK', 'West Bengal': 'WB',
  'Jammu and Kashmir': 'JK', Ladakh: 'LA', 'Andaman and Nicobar': 'AN',
  Chandigarh: 'CH', Dadra: 'DN', Daman: 'DH', Lakshadweep: 'LD', Puducherry: 'PY'
};

export const stateCode = (state?: string): string =>
  (state && STATE_CODES[state]) || state?.slice(0, 2).toUpperCase() || '—';

export const isCoreState = (state?: string): boolean =>
  !!state && CORE_STATES.includes(state);

export const stateBadgeClass = (state?: string): string => {
  if (state === 'Madhya Pradesh') return 'bg-forest';
  if (state === 'Maharashtra') return 'bg-earth';
  return 'bg-slate-700';
};

/** A zone is "prime" only when explicitly curated, never inferred from other copy. */
export const isPrimeZone = (zone: Zone): boolean => zone.isPrime === true;

export type PackageTier = NonNullable<Destination['packages']>[number];

/**
 * The whole package is the only price we quote — permit, vehicle, guide and forest
 * dues are bundled into each tier, so they are never shown as a separate line.
 */
export const packagesOf = (d: Pick<Destination, 'packages'>): PackageTier[] =>
  d.packages ?? [];

/** Lowest advertised package price, used for sorting and "from" labels. */
export const packageFromOf = (d: Pick<Destination, 'packages' | 'startingPrice'>): number | null =>
  packagesOf(d)[0]?.min ?? d.startingPrice ?? null;

export const inr = (amount: number | null | undefined): string =>
  amount == null ? 'On request' : `₹${amount.toLocaleString('en-IN')}`;

/** "₹14,500 – ₹17,500", "₹40,000 – ₹65,000+" or "₹9,000" for single-price tiers. */
export const tierPrice = (t: PackageTier): string => {
  if (t.min === t.max) return inr(t.min);
  return `${inr(t.min)} – ${inr(t.max)}${t.openEnded ? '+' : ''}`;
};

export const enquiryMailto = (subject: string, body?: string): string =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;