import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Destination } from '../../types';
import { Compass, ArrowRight, Star } from 'lucide-react';
import { MAP_LABEL, stateCode, isCoreState, isPrimeZone, packageFromOf, inr, CONTACT_EMAIL } from '../../lib/site';

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
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ponytail: states derived from data, not a hardcoded list. New states appear with zero code change.
  const states = useMemo(
    () => [...new Set(destinations.map(d => d.state))].sort(
      (a, b) => Number(isCoreState(b)) - Number(isCoreState(a)) || a.localeCompare(b)
    ),
    [destinations]
  );

  const filtered = useMemo(
    () => destinations.filter(d => activeFilter === 'All' || d.state === activeFilter),
    [destinations, activeFilter]
  );

  useEffect(() => {
    if (activeFilter !== 'All' && !states.includes(activeFilter)) {
      setActiveFilter('All');
    }
  }, [states, activeFilter]);

  // Create the map once. OpenStreetMap tiles, no API key.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [21.5, 79.0],
      zoom: 6,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      attribution: 'and OpenStreetMap contributors',
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Container is hidden until layout settles; Leaflet needs a nudge.
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 120);
    return () => clearTimeout(t);
  }, []);

  // Draw markers for whatever is currently visible.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    for (const dest of filtered) {
      const { lat, lng } = dest.coordinates;
      const isSelected = activeDest?.slug === dest.slug;
      const core = isCoreState(dest.state);

      const marker = L.circleMarker([lat, lng], {
        radius: isSelected ? 12 : 8,
        color: '#202918',
        weight: 2,
        fillColor: isSelected ? '#D4A35B' : core ? '#8B5A2B' : '#6B7A5A',
        fillOpacity: 0.95,
      }).addTo(layer);

      marker.bindTooltip(
        `<strong>${dest.name}</strong><br/><span style="font-size:11px;opacity:.75">${dest.state}</span>`,
        { direction: 'top', offset: [0, -6] }
      );

      marker.bindPopup(
        `<div class="text-sand text-xs leading-relaxed">
          <strong class="font-serif text-sm">${dest.name}</strong><br/>
          ${dest.tagline}<br/>
          <span style="opacity:.7">Packages from ${inr(packageFromOf(dest))} pp</span>
        </div>`,
        { className: 'custom-map-popup' }
      );

      marker.on('click', () => {
        setActiveDest(dest);
        if (onSelectDestination) onSelectDestination(dest);
      });
    }

    if (filtered.length > 1) {
      const bounds = L.latLngBounds(filtered.map(d => [d.coordinates.lat, d.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [filtered, activeDest, onSelectDestination]);

  useEffect(() => {
    if (selectedSlug && destinations.length > 0) {
      const found = destinations.find(d => d.slug === selectedSlug);
      if (found) setActiveDest(found);
    } else if (destinations.length > 0 && !activeDest) {
      setActiveDest(destinations[0]);
    }
  }, [selectedSlug, destinations]);

  // Pan to whatever got selected from outside the map (sidebar / list click).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeDest) return;
    map.flyTo([activeDest.coordinates.lat, activeDest.coordinates.lng], Math.max(map.getZoom(), 7), { duration: 0.6 });
  }, [activeDest?.slug]);

  const primeZones = activeDest ? activeDest.zones.filter(isPrimeZone) : [];

  return (
    <div className="bg-forest-deep text-sand rounded-2xl overflow-hidden border-2 border-forest/40 shadow-2xl isolate">
      {/* Map Control Bar */}
      <div className="p-4 sm:p-6 bg-forest border-b border-sand/15 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest-safari text-gold font-bold">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Topographic Survey Sheet</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand mt-0.5">
            {MAP_LABEL}
          </h3>
          <p className="text-xs text-sand/70">
            Click any reserve marker to view territory details, prime zones, gates, and rates.
          </p>
        </div>

        {/* State Filter Pills — derived from data */}
        <div className="flex flex-wrap items-center bg-forest-deep/80 p-1 rounded-lg border border-sand/15 text-xs">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeFilter === 'All'
                ? 'bg-gold text-forest font-bold shadow-sm'
                : 'text-sand/80 hover:text-sand hover:bg-forest/50'
            }`}
          >
            All ({destinations.length})
          </button>
          {states.map(state => (
            <button
              key={state}
              onClick={() => setActiveFilter(state)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === state
                  ? 'bg-gold text-forest font-bold shadow-sm'
                  : 'text-sand/80 hover:text-sand hover:bg-forest/50'
              }`}
            >
              {isCoreState(state) && <Star className="w-3 h-3 text-gold" />}
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Visual Map + Active Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        
        {/* Real Leaflet Map */}
        <div className="lg:col-span-8 relative border-r border-sand/10">
          <div ref={containerRef} className="w-full h-full min-h-[560px]" />

          {/* Map Legend — generated from the states actually present */}
          <div className="absolute bottom-6 left-3 z-[500] bg-forest-deep/90 backdrop-blur-md px-3 py-2 rounded-md border border-sand/15 text-[11px] flex items-center gap-4 text-sand/80 max-w-[calc(100%-1.5rem)] flex-wrap pointer-events-none">
            {states.map(state => (
              <div key={state} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full inline-block ${isCoreState(state) ? 'bg-[#8B5A2B]' : 'bg-[#6B7A5A]'}`} />
                <span>{state} ({destinations.filter(d => d.state === state).length})</span>
              </div>
            ))}
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
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-forest-deep/85 text-sand">
                    {activeDest.state} ({stateCode(activeDest.state)})
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
                <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-forest-deep/60 p-2.5 rounded border border-sand/10">
                  <span className="text-sand/60 block text-[10px]">HEADLINE SPECIES</span>
                  <strong className="text-gold font-serif">{activeDest.headlineSpecies || activeDest.tigerCount}</strong>
                </div>
                <div className="bg-forest-deep/60 p-2.5 rounded border border-sand/10">
                  <span className="text-sand/60 block text-[10px]">TERRITORY</span>
                  <strong className="text-gold font-serif">{activeDest.areaSqKm} km²</strong>
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

              {/* Prime Zones and Gates */}
              {primeZones.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] text-gold uppercase font-bold tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" /> Prime Zones ({primeZones.length})
                  </span>
                  <div className="space-y-1">
                    {primeZones.slice(0, 4).map(z => (
                      <div key={z.name} className="bg-forest-deep/50 px-2.5 py-1.5 rounded border border-sand/10">
                        <span className="text-sand font-medium">{z.name}</span>
                        <span className="text-sand/60 text-[10px] block">
                          Gates: {z.gates.join(', ') || 'On request'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Whole packages only — permits/vehicle/guide are bundled in. */}
              <div className="pt-3 border-t border-sand/10">
                <span className="text-[10px] text-sand/60 block">Packages From</span>
                <span className="font-serif text-base text-gold font-bold">
                  {inr(packageFromOf(activeDest))}
                </span>
                <span className="text-[10px] text-sand/50 block">Per person, all-inclusive</span>
                <Link
                  to={`/destinations/${activeDest.slug}`}
                  className="text-[11px] text-sand/70 hover:text-gold underline underline-offset-2 mt-1 inline-block"
                >
                  View full inclusions
                </Link>
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

              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Package Enquiry — ${activeDest.name}`)}&body=${encodeURIComponent(`Reserve: ${activeDest.name} (${activeDest.state})\n\nI'd like to discuss:\n`)}`}
                className="pt-3 border-t border-sand/10 text-center text-[11px] text-sand/70 hover:text-gold transition"
              >
                Prefer email? Enquire about this reserve →
              </a>
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
