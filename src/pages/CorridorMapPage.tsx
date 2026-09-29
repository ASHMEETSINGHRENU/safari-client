import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Layers, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  TreePine, 
  SlidersHorizontal 
} from 'lucide-react';
import { ReserveMap } from '../components/map/ReserveMap';
import { destinationService } from '../services/api';
import { Destination } from '../types';

export const CorridorMapPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedState, setSelectedState] = useState<'All' | 'Madhya Pradesh' | 'Maharashtra'>('All');
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

  const filtered = destinations.filter(d => 
    selectedState === 'All' ? true : d.state === selectedState
  );

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Landscape Geography & Corridors</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest font-bold tracking-tight mb-3">
            Central Indian Wildlife Corridor Map
          </h1>
          <p className="text-forest/80 text-sm sm:text-base leading-relaxed font-sans">
            Explore 14 contiguous habitats spanning the Satpura-Maikal range, the Vindhyas, and the Sahyadris. Understanding wildlife connectivity is essential for responsible safari planning.
          </p>
        </div>

        {/* State Filter Buttons */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => setSelectedState('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              selectedState === 'All' 
                ? 'bg-forest text-sand shadow-sm' 
                : 'bg-white text-forest/70 border border-forest/15 hover:text-forest'
            }`}
          >
            All Corridors ({destinations.length})
          </button>
          <button
            onClick={() => setSelectedState('Madhya Pradesh')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              selectedState === 'Madhya Pradesh' 
                ? 'bg-forest text-sand shadow-sm' 
                : 'bg-white text-forest/70 border border-forest/15 hover:text-forest'
            }`}
          >
            Madhya Pradesh (7)
          </button>
          <button
            onClick={() => setSelectedState('Maharashtra')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              selectedState === 'Maharashtra' 
                ? 'bg-forest text-sand shadow-sm' 
                : 'bg-white text-forest/70 border border-forest/15 hover:text-forest'
            }`}
          >
            Maharashtra (7)
          </button>
        </div>

        {/* Interactive Map Component Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Map Box (3 cols) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-forest/15 shadow-xl">
            <div className="h-[600px] w-full rounded-2xl overflow-hidden relative">
              <ReserveMap 
                destinations={filtered} 
                onSelectDestination={(d) => setSelectedReserve(d)}
              />
            </div>
            
            {/* Map Legend */}
            <div className="p-4 bg-sand/30 rounded-xl mt-4 border border-forest/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-forest border-2 border-sand" />
                  <span className="text-forest/80 font-medium">Madhya Pradesh Reserves</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-earth border-2 border-sand" />
                  <span className="text-forest/80 font-medium">Maharashtra Reserves</span>
                </div>
              </div>
              <span className="text-forest/60 italic">
                *Pench (MP) and Pench (MH) maintain independent gates and state forest jurisdictions.
              </span>
            </div>
          </div>

          {/* Reserve Detail Sidebar Drawer (1 col) */}
          <div className="lg:col-span-1 space-y-4">
            {selectedReserve ? (
              <div className="bg-white p-6 rounded-3xl border border-forest/15 shadow-lg space-y-4">
                <div className="h-40 rounded-xl overflow-hidden relative">
                  <img
                    src={selectedReserve.heroImage}
                    alt={selectedReserve.name}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow ${
                    selectedReserve.state === 'Madhya Pradesh' ? 'bg-forest' : 'bg-earth'
                  }`}>
                    {selectedReserve.state}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest mb-1">
                    {selectedReserve.name}
                  </h3>
                  <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">
                    {selectedReserve.tagline}
                  </p>
                  <p className="text-forest/70 text-xs leading-relaxed line-clamp-3">
                    {selectedReserve.shortDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-forest/10 text-xs">
                  <div>
                    <span className="text-forest/50 block text-[10px] uppercase">Tiger Est.</span>
                    <span className="font-serif font-bold text-forest text-base">{selectedReserve.tigerCount}</span>
                  </div>
                  <div>
                    <span className="text-forest/50 block text-[10px] uppercase">Territory</span>
                    <span className="font-semibold text-forest">{selectedReserve.areaSqKm} km²</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/destinations/${selectedReserve.slug}`}
                    className="w-full py-2.5 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition shadow flex items-center justify-center space-x-1.5"
                  >
                    <span>Explore Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/booking?destination=${selectedReserve.slug}`}
                    className="w-full py-2.5 border border-forest/20 text-forest rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-sand transition flex items-center justify-center"
                  >
                    Book Safari
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-3xl border border-forest/10 text-center text-forest/60 text-xs">
                Select a reserve pin on the map to inspect telemetry and details.
              </div>
            )}

            {/* Quick List of Reserves */}
            <div className="bg-white p-4 rounded-3xl border border-forest/10 shadow-sm max-h-[300px] overflow-y-auto space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-forest/60 block px-2 mb-1">
                Quick Jump
              </span>
              {filtered.map(d => (
                <button
                  key={d._id}
                  onClick={() => setSelectedReserve(d)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    selectedReserve?.slug === d.slug 
                      ? 'bg-sand font-bold text-forest' 
                      : 'text-forest/80 hover:bg-sand/40'
                  }`}
                >
                  <span className="truncate">{d.name}</span>
                  <span className="text-[10px] text-forest/50 uppercase ml-2">{d.state === 'Madhya Pradesh' ? 'MP' : 'MH'}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default CorridorMapPage;
