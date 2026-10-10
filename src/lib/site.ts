import { Destination, Zone } from '../types';

export const MAP_LABEL = 'The Safari Landscape';
export const MAP_ROUTE = '/map';
export const YEARS_OF_EXPERIENCE = 15;
export const TOURS_COMPLETED = 1000;
export const CONTACT_EMAIL = 'enquiries@shutterandstripessafaries.com';
export const FOUNDER_NAME = 'Sachin Neware';
export const COFOUNDER_NAME = 'Urmila Suvarna';

// Flat upgrade over the guide bundled with every package. Must match server NATURALIST_FEE.
export const NATURALIST_FEE = 1000;

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

/** Designation of a protected area, used to colour-code the map. */
export type ReserveKind = 'Tiger Reserve' | 'Wildlife Sanctuary';

// ponytail: two buckets only — sanctuaries vs everything else (tiger reserves,
// national parks and conservation reserves all count as "tiger reserve" country).
export const reserveKind = (name?: string): ReserveKind =>
  /Sanctuary/i.test(name ?? '') ? 'Wildlife Sanctuary' : 'Tiger Reserve';

/** Marker fill per designation — sanctuaries and reserves read apart. */
export const RESERVE_KIND_COLOR: Record<ReserveKind, string> = {
  'Tiger Reserve': '#D4834A',
  'Wildlife Sanctuary': '#6B7A5A',
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