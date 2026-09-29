import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Destination } from '../../types';
import { MapPin, Compass, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface ReserveMapProps {
  destinations: Destination[];
  selectedSlug?: string;
  onSelectDestination?: (dest: Destination) => void;
}

export const ReserveMap: React.FC<ReserveMapProps> = ({ 
  destinations, 
  selectedSlug, 
  onSelectDestination 
}) => {
  const [activeDest, setActiveDest] = useState<Destination | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Madhya Pradesh' | 'Maharashtra'>('All');

  useEffect(() => {
    if (selectedSlug && destinations.length > 0) {
      const found = destinations.find(d => d.slug === selectedSlug);
      if (found) setActiveDest(found);
    } else if (destinations.length > 0 && !activeDest) {
      setActiveDest(destinations[0]);
    }
  }, [selectedSlug, destinations]);

  const filtered = destinations.filter(d => {
    if (activeFilter === 'All') return true;
    return d.state === activeFilter;
  });

  return (
    <div className="bg-forest-deep text-sand rounded-2xl overflow-hidden border-2 border-forest/40 shadow-2xl">
      {/* Map Control Bar */}
      <div className="p-4 sm:p-6 bg-forest border-b border-sand/15 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest-safari text-gold font-bold">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Topographic Corridor Map</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand mt-0.5">
            Central India Wildlife Network
          </h3>
          <p className="text-xs text-sand/70">
            Click any reserve marker to view territory details, permit quotas, and immediate safari booking.
          </p>
        </div>

        {/* State Filter Pills */}
        <div className="flex items-center bg-forest-deep/80 p-1 rounded-lg border border-sand/15 text-xs">
          {(['All', 'Madhya Pradesh', 'Maharashtra'] as const).map(state => (
            <button
              key={state}
              onClick={() => setActiveFilter(state)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeFilter === state 
                  ? 'bg-gold text-forest font-bold shadow-sm' 
                  : 'text-sand/80 hover:text-sand hover:bg-forest/50'
              }`}
            >
              {state === 'All' ? 'All 14 Reserves' : state}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Visual Map + Active Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        
        {/* Interactive Topographic Canvas */}
        <div className="lg:col-span-8 relative bg-[#202918] p-6 flex items-center justify-center overflow-hidden border-r border-sand/10 select-none">
          {/* Subtle Topographic Elevation Contour SVG lines in background */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contourPattern" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#D4A35B" strokeWidth="0.8" strokeDasharray="3 3"/>
                <circle cx="60" cy="60" r="35" fill="none" stroke="#EADCC6" strokeWidth="0.6"/>
                <circle cx="60" cy="60" r="20" fill="none" stroke="#D4A35B" strokeWidth="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contourPattern)" />
          </svg>

          {/* Stylized State Territory Boundary Representations */}
          <div className="absolute inset-8 border border-dashed border-sand/15 rounded-xl pointer-events-none">
            <span className="absolute top-4 left-6 text-[10px] tracking-widest uppercase font-serif text-sand/40">
              Madhya Pradesh Corridor (North)
            </span>
            <span className="absolute bottom-4 right-6 text-[10px] tracking-widest uppercase font-serif text-sand/40">
              Maharashtra Tiger Arc (South)
            </span>
            {/* Corridor connecting line */}
            <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t border-dashed border-gold/30"></div>
          </div>

          {/* Interactive Destination Nodes */}
          <div className="relative w-full max-w-2xl h-[460px] my-auto">
            {filtered.map((dest) => {
              const isSelected = activeDest?.slug === dest.slug;
              const isMP = dest.state === 'Madhya Pradesh';

              return (
                <div
                  key={dest.slug}
                  onClick={() => {
                    setActiveDest(dest);
                    if (onSelectDestination) onSelectDestination(dest);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${dest.mapPosition.x}%`,
                    top: `${dest.mapPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="group cursor-pointer z-20"
                >
                  {/* Pin Pulse effect */}
                  {isSelected && (
                    <div className="absolute -inset-3 bg-gold/25 rounded-full animate-ping pointer-events-none" />
                  )}

                  {/* Marker Node */}
                  <div className={`relative px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-lg border ${
                    isSelected 
                      ? 'bg-gold text-forest font-bold border-sand scale-110 shadow-gold/30' 
                      : 'bg-forest/90 text-sand/90 hover:bg-forest hover:text-gold border-sand/30 hover:scale-105'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isMP ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <span className="text-xs font-serif font-semibold whitespace-nowrap hidden sm:inline">
                      {dest.name.replace(' Tiger Reserve', '').replace(' Wildlife Sanctuary', '').replace(' National Park', '')}
                    </span>
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-forest' : 'text-gold'}`} />
                  </div>

                  {/* Hover Tag on Mobile or Desktop */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-sand text-forest text-[11px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap border border-forest/20">
                      {dest.name} ({dest.state === 'Madhya Pradesh' ? 'MP' : 'MH'})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-forest-deep/90 backdrop-blur-md px-3 py-2 rounded-md border border-sand/15 text-[11px] flex items-center gap-4 text-sand/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span>Madhya Pradesh (7)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>Maharashtra (7)</span>
            </div>
          </div>
        </div>

        {/* Selected Reserve Detail Preview Drawer */}
        <div className="lg:col-span-4 bg-forest p-6 flex flex-col justify-between">
          {activeDest ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Photo Banner */}
              <div className="relative h-44 rounded-xl overflow-hidden border border-sand/20 group">
                <img 
                  src={activeDest.heroImage} 
                  alt={activeDest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                    activeDest.state === 'Madhya Pradesh' ? 'bg-amber-600 text-sand' : 'bg-emerald-700 text-sand'
                  }`}>
                    {activeDest.state}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold">
                    {activeDest.tagline}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-sand leading-snug">
                    {activeDest.name}
                  </h4>
                </div>
              </div>

              {/* Reserve Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-forest-deep/60 p-2.5 rounded border border-sand/10">
                  <span className="text-sand/60 block text-[10px]">TIGER METRIC</span>
                  <strong className="text-gold font-serif">{activeDest.tigerCount}</strong>
                </div>
                <div className="bg-forest-deep/60 p-2.5 rounded border border-sand/10">
                  <span className="text-sand/60 block text-[10px]">PERMIT STATUS</span>
                  <strong className="text-emerald-400">{activeDest.availability}</strong>
                </div>
              </div>

              {/* Short Narrative */}
              <p className="text-xs text-sand/80 leading-relaxed line-clamp-3">
                {activeDest.shortDesc}
              </p>

              {/* Core Zones */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-sand/60 uppercase font-bold tracking-wider">
                  Configured Zones ({activeDest.zones.length}):
                </span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeDest.zones.map(z => (
                    <span key={z.name} className="px-2 py-0.5 bg-sand/10 text-sand rounded text-[10px] border border-sand/15">
                      {z.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Starting Price */}
              <div className="pt-2 border-t border-sand/10 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-sand/60 block">Permits from</span>
                  <span className="font-serif text-lg text-gold font-bold">₹{activeDest.startingPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-sand/60"> / vehicle</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/destinations/${activeDest.slug}`}
                  className="flex-1 text-center py-2.5 px-3 bg-sand text-forest font-semibold rounded text-xs hover:bg-gold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Reserve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/booking?destination=${activeDest.slug}`}
                  className="flex-1 text-center py-2.5 px-3 bg-gold text-forest font-bold rounded text-xs hover:bg-gold-light transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Book Safari</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-sand/60 text-xs">
              Select a reserve pin on the map to inspect territory details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
