import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Camera,
  Car
} from 'lucide-react';
import { safariService, destinationService } from '../services/api';
import { Safari, Destination } from '../types';
import { stateCode, inr } from '../lib/site';

export const SafarisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [safaris, setSafaris] = useState<Safari[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'All');
  const [selectedSlot, setSelectedSlot] = useState<string>(searchParams.get('slot') || 'All');
  const [selectedDestination, setSelectedDestination] = useState<string>(searchParams.get('destination') || 'All');
  const [selectedArea, setSelectedArea] = useState<string>(searchParams.get('area') || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [safariData, destData] = await Promise.all([
          safariService.getAll(),
          destinationService.getAll()
        ]);
        setSafaris(safariData);
        setDestinations(destData);
      } catch (err: any) {
        setError(err.message || 'Failed to load safaris.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safariTypes = [
    'All',
    'Jeep Safari',
    'Canter Safari',
    'Private Photography Safari',
    'Full-Day Safari',
    'Night Buffer Safari',
    'Walking Safari'
  ];

  const slots = ['All', 'Morning', 'Afternoon', 'Full Day', 'Night'];

  const protectedAreaTypes = ['All', 'Sanctuary', 'Reserve', 'National Park'];

  const filteredSafaris = safaris.filter(s => {
    const matchesType = selectedType === 'All' || s.safariType.toLowerCase() === selectedType.toLowerCase();
    const matchesSlot = selectedSlot === 'All' || s.slot.toLowerCase() === selectedSlot.toLowerCase();
    const matchesArea = selectedArea === 'All' || s.protectedAreaType === selectedArea;
    const matchesDest = selectedDestination === 'All' || s.destinationSlug === selectedDestination;
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSlot && matchesArea && matchesDest && matchesSearch;
  });

  const getDestinationImage = (slug: string) => {
    const d = destinations.find(dest => dest.slug === slug);
    return d?.heroImage || '/assets/img/royal-bengal-prowl.jpg';
  };

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      {/* Header */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Permit and Vehicle Configurations</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-forest font-bold tracking-tight mb-4">
            Curated Safari Experiences
          </h1>
          <p className="text-forest/80 text-base sm:text-lg leading-relaxed font-sans">
            Choose from custom-modified open 4x4 safari vehicles with professional trackers, full-day dawn-to-dusk photographic permits, and serene nocturnal buffer expeditions.
          </p>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Photography, Morning..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            {/* Destination Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1.5">
                Reserve / Sanctuary
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                <option value="All">All Reserves</option>
                {destinations.map(d => (
                  <option key={d._id} value={d.slug}>{d.name} ({stateCode(d.state)})</option>
                ))}
              </select>
            </div>

            {/* Safari Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1.5">
                Safari Format
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                {safariTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Slot */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1.5">
                Time Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                {slots.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Protected Area */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-1.5">
                Protected Area
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                {protectedAreaTypes.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between pt-2 border-t border-forest/10 text-xs">
            <span className="text-forest/60">
              Showing <strong>{filteredSafaris.length}</strong> available safari packages
            </span>
            {(selectedType !== 'All' || selectedSlot !== 'All' || selectedArea !== 'All' || selectedDestination !== 'All' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedSlot('All');
                  setSelectedArea('All');
                  setSelectedDestination('All');
                  setSearchQuery('');
                }}
                className="text-earth hover:text-earth/80 font-semibold underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Safari Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-forest border-t-transparent mb-4"></div>
            <p className="font-serif text-forest text-lg">Querying department vehicle allocations...</p>
          </div>
        ) : filteredSafaris.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-forest/10 max-w-lg mx-auto">
            <Compass className="w-10 h-10 text-forest/30 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-forest mb-1">No Safari Packages Found</h3>
            <p className="text-forest/70 text-xs mb-4">Try clearing one or more filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSafaris.map(s => (
              <div 
                key={s._id}
                className="bg-white rounded-2xl overflow-hidden border border-forest/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Visual Imagery Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getDestinationImage(s.destinationSlug)}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-forest/90 backdrop-blur-sm text-sand text-[10px] font-bold uppercase tracking-wider shadow">
                      {s.safariType}
                    </span>
<span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-gold text-[10px] font-bold uppercase tracking-wider border border-gold/30 shadow">
                       {s.slot} Slot
                     </span>
                     <span className="px-2.5 py-1 rounded-md bg-sand/90 backdrop-blur-sm text-forest text-[10px] font-bold uppercase tracking-wider shadow">
                       {s.protectedAreaType}
                     </span>
                   </div>

                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center space-x-1.5 drop-shadow">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{s.destinationName} ({s.state})</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-forest mb-2 group-hover:text-gold transition">
                    {s.name}
                  </h3>

                  <p className="text-forest/70 text-xs leading-relaxed line-clamp-3 mb-4">
                    {s.description}
                  </p>

                  {/* Key specs */}
                  <div className="grid grid-cols-2 gap-2 bg-sand/40 p-3 rounded-xl border border-forest/5 mb-4 text-xs">
                    <div>
                      <span className="text-forest/50 block text-[10px] uppercase">Vehicle</span>
                      <span className="font-semibold text-forest truncate block">{s.vehicle}</span>
                    </div>
                    <div>
                      <span className="text-forest/50 block text-[10px] uppercase">Capacity</span>
                      <span className="font-semibold text-forest">Max {s.capacity} Guests</span>
                    </div>
                    <div>
                      <span className="text-forest/50 block text-[10px] uppercase">Duration</span>
                      <span className="font-semibold text-forest">{s.duration}</span>
                    </div>
                    <div>
                      <span className="text-forest/50 block text-[10px] uppercase">Zones</span>
                      <span className="font-semibold text-forest truncate block">{s.zones.join(', ')}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  {s.highlights && s.highlights.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {s.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center space-x-2 text-[11px] text-forest/80">
                          <Check className="w-3 h-3 text-gold shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer price and CTA */}
                <div className="px-6 py-4 bg-sand-light/50 border-t border-forest/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-forest/50 block">Package From</span>
                    <span className="font-serif text-xl font-bold text-forest">{inr(s.basePrice)}</span>
                    <span className="text-[10px] text-forest/50 block mt-0.5">Per person, all-inclusive</span>
                  </div>
                  <Link
                    to={`/booking?destination=${s.destinationSlug}&safari=${s.slug}`}
                    className="px-4 py-2 bg-forest text-sand rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-forest/90 transition shadow flex items-center space-x-1.5"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default SafarisPage;
