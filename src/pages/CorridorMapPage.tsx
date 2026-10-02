import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { ReserveMap } from '../components/map/ReserveMap';
import { destinationService } from '../services/api';
import { Destination } from '../types';
import { MAP_LABEL, stateCode, isCoreState, CORE_STATES, YEARS_OF_EXPERIENCE } from '../lib/site';

export const CorridorMapPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedReserve, setSelectedReserve] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getAll();
        setDestinations(data);
        if (data.length > 0) {
          setSelectedReserve(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const states = [...new Set(destinations.map(d => d.state))];
  const core = destinations.filter(d => isCoreState(d.state));

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Landscape Geography and Habitat Network</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest font-bold tracking-tight mb-3">
            {MAP_LABEL}
          </h1>
          <p className="text-forest/80 text-sm sm:text-base leading-relaxed font-sans">
            A topographic view of {destinations.length || 'our'} reserves across the Satpura&ndash;Maikal range, the Vindhyas, and the Sahyadris&mdash;mapped from {YEARS_OF_EXPERIENCE}+ years on the ground.
            {states.length > CORE_STATES.length
              ? ' Our network now spans multiple Indian states and is growing.'
              : ' Core operations in Madhya Pradesh and Maharashtra, expanding Pan-India.'}
          </p>
        </div>

        {/* Quick Jump - above the map. Native select on all viewports. */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-forest/10 shadow-sm mb-4">
          <label
            htmlFor="quick-jump"
            className="text-[10px] uppercase font-bold tracking-wider text-forest/60 block mb-2"
          >
            Quick Jump · {core.length} core reserves
          </label>

          {/* ponytail: native <select> gives a real mobile picker and one-line desktop control, free. */}
          <select
            id="quick-jump"
            value={selectedReserve?.slug ?? ''}
            onChange={(e) => {
              const hit = destinations.find(d => d.slug === e.target.value);
              if (hit) setSelectedReserve(hit);
            }}
            className="w-full max-w-md bg-sand/50 border border-forest/20 rounded-xl px-3 py-2.5 text-sm text-forest focus:outline-none focus:border-gold"
          >
            {destinations.map(d => (
              <option key={d._id} value={d.slug}>
                {d.name} ({stateCode(d.state)})
              </option>
            ))}
          </select>
        </div>

        {/* Interactive Map */}
        <div className="space-y-4">
          <ReserveMap
            destinations={destinations}
            selectedSlug={selectedReserve?.slug}
            onSelectDestination={(d) => setSelectedReserve(d)}
          />
          <p className="px-1 text-forest/60 text-[11px] italic">
            *Pench (MP) and Pench (MH) maintain independent gates and state forest jurisdictions.
          </p>
        </div>

      </div>

    </div>
  );
};
export default CorridorMapPage;
