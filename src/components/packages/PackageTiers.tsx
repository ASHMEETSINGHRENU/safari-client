import { packagesOf, tierPrice, type PackageTier } from '../../lib/site';

interface Props {
  destination: { packages?: PackageTier[]; packageDuration?: string; safariPlan?: string };
  variant?: 'card' | 'panel';
  className?: string;
}

const TIER_NOTE: Record<PackageTier['label'], string> = {
  'Budget': 'Essential comfort',
  'Mid-Range': 'Elevated stays',
  'Luxury': 'Signature experience'
};

/**
 * Renders the whole-package tiers for a destination. Every tier is a complete
 * package — permits, vehicle, guide and forest dues are included, never itemised.
 */
export default function PackageTiers({ destination, variant = 'panel', className = '' }: Props) {
  const packages = packagesOf(destination);
  if (packages.length === 0) return null;

  if (variant === 'card') {
    return (
      <div className={`space-y-2 ${className}`}>
        {packages.map((p) => (
          <div key={p.label} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-forest/70">{p.label}</span>
            <span className="font-semibold text-forest whitespace-nowrap">{tierPrice(p)}</span>
          </div>
        ))}
        <p className="text-[11px] text-forest/50 pt-1">Per person. Permits, vehicle, guide and forest dues included.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-3">
        {packages.map((p) => (
          <div
            key={p.label}
            className={`rounded-xl border p-4 flex flex-col ${
              p.label === 'Luxury'
                ? 'border-gold/40 bg-sand/40'
                : 'border-forest/15 bg-white/5'
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-serif text-sm font-bold text-forest">{p.label}</h4>
              <span className="text-[10px] uppercase tracking-wider text-forest/45">
                {TIER_NOTE[p.label]}
              </span>
            </div>
            <p className="font-serif text-lg font-bold text-forest mt-1">{tierPrice(p)}</p>
            <p className="text-[11px] text-forest/55 mb-3">Per person</p>
            <ul className="space-y-1.5 text-[12px] leading-relaxed text-forest/75">
              {p.includes.map((item) => (
                <li key={item} className="flex gap-1.5">
                  <span aria-hidden className="text-gold shrink-0">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {(destination.packageDuration || destination.safariPlan) && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-forest/60">
          {destination.packageDuration && <span><span className="text-forest/40 uppercase tracking-wider text-[10px]">Duration</span> {destination.packageDuration}</span>}
          {destination.safariPlan && <span><span className="text-forest/40 uppercase tracking-wider text-[10px]">Safaris</span> {destination.safariPlan}</span>}
        </div>
      )}
      <p className="mt-3 text-[11px] text-forest/50">
        All prices are per person and inclusive of park permits, safari vehicle, guide and applicable forest dues.
        Custom and group itineraries on request.
      </p>
    </div>
  );
}
