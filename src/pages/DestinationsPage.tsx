import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  ArrowRight, 
  SlidersHorizontal,
  Scale,
  X,
  Calendar,
  Sparkles,
  TreePine,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { destinationService } from '../services/api';
import { Destination } from '../types';
import { stateBadgeClass, isCoreState, CORE_STATES, YEARS_OF_EXPERIENCE, packageFromOf, inr } from '../lib/site';
import PackageTiers from '../components/packages/PackageTiers';
import { useToast } from '../components/common/Toast';

// ponytail: 8 per page = two rows of 4 on desktop.
const PAGE_SIZE = 8;

export const DestinationsPage: React.FC = () => {
  const { info } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const stateParam = searchParams.get('state') || 'All';
  const [selectedState, setSelectedState] = useState<string>(stateParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');

  // Comparison tray state
  const [compareList, setCompareList] = useState<string[]>([]);

  // Pagination — page lives in the URL so it survives refresh/back.
  const pageParam = Number(searchParams.get('page') || 1);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getAll();
        setDestinations(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch destinations.');
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Sync state param
  useEffect(() => {
    if (stateParam !== selectedState && stateParam !== 'All') {
      setSelectedState(stateParam);
    }
  }, [stateParam]);

  // Any filter change resets to the first page.
  useEffect(() => {
    if (searchParams.get('page')) {
      searchParams.delete('page');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, searchQuery]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state === 'All') {
      searchParams.delete('state');
    } else {
      searchParams.set('state', state);
    }
    setSearchParams(searchParams);
  };

  const toggleCompare = (slug: string) => {
    if (compareList.includes(slug)) {
      setCompareList(compareList.filter(s => s !== slug));
    } else {
      if (compareList.length >= 3) {
        info('You can compare up to 3 reserves at a time.');
        return;
      }
      setCompareList([...compareList, slug]);
    }
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesState = selectedState === 'All' || dest.state.toLowerCase() === selectedState.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.wildlifeHighlights.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesState && matchesSearch;
  });

  const pageCount = Math.max(1, Math.ceil(filteredDestinations.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(Number.isFinite(pageParam) ? pageParam : 1, 1), pageCount);
  const pagedDestinations = filteredDestinations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (n: number) => {
    const next = Math.min(Math.max(n, 1), pageCount);
    searchParams.set('page', String(next));
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ponytail: states derived from data, core states first. New states need zero code change.
  const states = [...new Set(destinations.map(d => d.state))]
    .sort((a, b) => {
      const aCore = CORE_STATES.indexOf(a);
      const bCore = CORE_STATES.indexOf(b);
      if (aCore === -1 && bCore === -1) return a.localeCompare(b);
      if (aCore === -1) return 1;
      if (bCore === -1) return -1;
      return aCore - bCore;
    });
  const coreCount = destinations.filter(d => isCoreState(d.state)).length;
  const total = destinations.length;
  const expanding = states.length > CORE_STATES.length;

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      {/* Header Banner */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>The Central India and Beyond</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-forest font-bold tracking-tight mb-4">
            Tiger Reserves and Wildlife Sanctuaries
          </h1>
          <p className="text-forest/80 text-lg leading-relaxed font-sans max-w-3xl">
            {total || 'Our'} distinct ecosystems{expanding ? ' across India' : ' across Madhya Pradesh and Maharashtra'}&mdash;from the sal valleys of Kanha and the crags of Bandhavgarh, to the bamboo glades of Tadoba and the mist of Melghat.
            {' '}Each one mapped by our naturalists over {YEARS_OF_EXPERIENCE}+ years of field work. Explore natural history, prime zones, and package rates with no middleman.
          </p>
        </div>

        {/* State Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-forest/10">
          <div className="bg-sand-light/60 p-4 rounded-xl border border-forest/10">
            <span className="block text-2xl font-serif font-bold text-forest">{total}</span>
            <span className="text-xs uppercase font-medium tracking-wider text-forest/70">Total Reserves</span>
          </div>
          <div className="bg-sand-light/60 p-4 rounded-xl border border-forest/10">
            <span className="block text-2xl font-serif font-bold text-forest">{coreCount}</span>
            <span className="text-xs uppercase font-medium tracking-wider text-forest/70">Core Region (MP and MH)</span>
          </div>
          <div className="bg-sand-light/60 p-4 rounded-xl border border-forest/10">
            <span className="block text-2xl font-serif font-bold text-forest">{states.length}</span>
            <span className="text-xs uppercase font-medium tracking-wider text-forest/70">States Covered</span>
          </div>
          <div className="bg-sand-light/60 p-4 rounded-xl border border-forest/10">
            <span className="block text-2xl font-serif font-bold text-forest">{YEARS_OF_EXPERIENCE}+</span>
            <span className="text-xs uppercase font-medium tracking-wider text-forest/70">Years in the Field</span>
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 lg:sticky lg:top-20 z-20">
        <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-md border border-forest/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-4">
          
          {/* State Tabs — generated from data, core states first */}
          <div className="flex items-center space-x-2 bg-sand/60 p-1.5 rounded-xl border border-forest/10 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleStateChange('All')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                selectedState === 'All'
                  ? 'bg-forest text-sand shadow-sm'
                  : 'text-forest/70 hover:text-forest hover:bg-forest/5'
              }`}
            >
              All ({total})
            </button>
            {states.map(state => (
              <button
                key={state}
                onClick={() => handleStateChange(state)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedState === state
                    ? 'bg-forest text-sand shadow-sm'
                    : 'text-forest/70 hover:text-forest hover:bg-forest/5'
                }`}
              >
                {state} ({destinations.filter(d => d.state === state).length})
              </button>
            ))}
          </div>

          {/* Search + controls — single row on mobile, right-aligned on desktop */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 lg:flex-1 lg:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="w-4 h-4 text-forest/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reserves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-sand/40 border border-forest/15 rounded-xl text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center space-x-1 bg-sand/60 p-1 rounded-xl border border-forest/10 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-forest text-sand' : 'text-forest/60 hover:text-forest'
                  }`}
                  title="Grid View"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`p-1.5 sm:p-2 rounded-lg transition ${
                    viewMode === 'detailed' ? 'bg-forest text-sand' : 'text-forest/60 hover:text-forest'
                  }`}
                  title="List View"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-forest border-t-transparent mb-4"></div>
            <p className="font-serif text-forest text-lg">Surveying forest corridors...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl max-w-lg mx-auto">
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-forest text-sand rounded-xl text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="py-20 text-center bg-sand-light/50 rounded-2xl border border-forest/10 max-w-2xl mx-auto">
            <Compass className="w-12 h-12 text-forest/30 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-forest font-bold mb-2">No Reserves Match Your Search</h3>
            <p className="text-forest/70 text-sm mb-6">
              Try adjusting your search criteria or resetting filters to view all reserves.
            </p>
            <button
              onClick={() => {
                setSelectedState('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-forest text-sand rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-forest/90 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" 
            : "space-y-6"
          }>
            {pagedDestinations.map(dest => {
              const isComparing = compareList.includes(dest.slug);

              if (viewMode === 'detailed') {
                return (
                  <div 
                    key={dest._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-forest/10 flex flex-col md:flex-row group"
                  >
                    <div className="md:w-2/5 relative overflow-hidden min-h-[260px]">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow ${
                          stateBadgeClass(dest.state)
                        }`}>
                          {dest.state}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-serif text-2xl font-bold text-forest">
                            {dest.name}
                          </h3>
                          <button
                            onClick={() => toggleCompare(dest.slug)}
                            className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition ${
                              isComparing 
                                ? 'bg-gold text-forest border-gold' 
                                : 'border-forest/20 text-forest/70 hover:border-forest hover:text-forest'
                            }`}
                            title="Add to compare"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                          </button>
                        </div>
                        
                        <p className="text-gold font-medium text-xs tracking-wider uppercase mb-3">
                          {dest.tagline}
                        </p>
                        
                        <p className="text-forest/70 text-sm leading-relaxed mb-4 line-clamp-2">
                          {dest.shortDesc}
                        </p>

                        <div className="grid grid-cols-3 gap-3 py-3 border-y border-forest/10 mb-4 text-xs">
                          <div>
                            <span className="text-forest/50 block">Territory</span>
                            <span className="font-semibold text-forest">{dest.areaSqKm} km²</span>
                          </div>
                          <div>
                            <span className="text-forest/50 block">Headline</span>
                            <span className="font-semibold text-forest truncate block">
                              {dest.headlineSpecies || dest.tigerCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-forest/50 block">Best Months</span>
                            <span className="font-semibold text-forest truncate block">{dest.bestTimeToVisit.split(',')[0]}</span>
                          </div>
                        </div>

                        {/* Wildlife tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {dest.wildlifeHighlights.slice(0, 4).map((animal, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-sand text-forest/80 font-medium">
                              {animal}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-forest/10">
                        <PackageTiers destination={dest} variant="card" />
                        <div className="flex items-end justify-between gap-3 mt-4">
                          <div>
                            <span className="text-[11px] text-forest/60 uppercase tracking-wider block">Packages From</span>
                            <span className="font-serif text-xl font-bold text-forest">{inr(packageFromOf(dest))}</span>
                          </div>
                          <div className="flex space-x-3">
                            <Link
                              to={`/destinations/${dest.slug}`}
                              className="px-4 py-2 border border-forest/30 text-forest rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-forest hover:text-sand transition"
                            >
                              View Destination
                            </Link>
                            <Link
                              to={`/booking?destination=${dest.slug}`}
                              className="px-5 py-2 bg-forest text-sand rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-forest/90 transition shadow"
                            >
                              Book Safari
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                }

              // Standard Grid Card
              return (
                <div
                  key={dest._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-forest/10 flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-md ${
                        stateBadgeClass(dest.state)
                      }`}>
                        {dest.state}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCompare(dest.slug)}
                      className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition ${
                        isComparing
                          ? 'bg-gold text-forest shadow'
                          : 'bg-black/50 text-sand hover:bg-black/70'
                      }`}
                      title="Add to compare"
                    >
                      <Scale className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-serif text-2xl font-bold mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {dest.name}
                      </h3>
                      <p className="text-sand text-xs line-clamp-1 italic drop-shadow">
                        {dest.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-forest/70 text-xs line-clamp-3 leading-relaxed mb-4">
                        {dest.shortDesc}
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-forest/10 mb-4 text-center">
                        <div className="border-r border-forest/10 pr-1">
                          <span className="text-[10px] text-forest/50 uppercase block">Area</span>
                          <span className="font-semibold text-forest text-xs">{dest.areaSqKm} km²</span>
                        </div>
                        <div className="border-r border-forest/10 px-1">
                          <span className="text-[10px] text-forest/50 uppercase block">Headline</span>
                          <span className="font-semibold text-forest text-xs truncate block">
                            {dest.headlineSpecies || dest.tigerCount}
                          </span>
                        </div>
                        <div className="pl-1">
                          <span className="text-[10px] text-forest/50 uppercase block">Zones</span>
                          <span className="font-semibold text-forest text-xs">{dest.zones.length} Zones</span>
                        </div>
                      </div>

                      {/* Wildlife highlights */}
                      <div className="mb-4">
                        <span className="text-[10px] uppercase font-bold text-forest/50 tracking-wider block mb-1.5">
                          Fauna Highlights
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {dest.wildlifeHighlights.slice(0, 3).map((w, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-sand text-forest font-medium">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-forest/50 uppercase tracking-wider block">Packages From</span>
                        <span className="font-serif text-lg font-bold text-forest">{inr(packageFromOf(dest))}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/destinations/${dest.slug}`}
                          className="p-2.5 rounded-xl border border-forest/20 text-forest hover:bg-forest hover:text-sand transition"
                          title="View Details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/booking?destination=${dest.slug}`}
                          className="px-3.5 py-2 bg-forest text-sand rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-forest/90 transition shadow"
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pageCount > 1 && (
            <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Reserve pages">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-forest/20 text-forest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest hover:text-sand transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  aria-current={n === currentPage ? 'page' : undefined}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                    n === currentPage
                      ? 'bg-forest text-sand shadow-sm'
                      : 'border border-forest/20 text-forest hover:bg-forest/5'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="p-2 rounded-xl border border-forest/20 text-forest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest hover:text-sand transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
          </>
        )}
      </section>

      {/* Floating Comparison Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-forest text-sand px-6 py-4 rounded-2xl shadow-2xl border border-gold/30 flex items-center space-x-6 max-w-xl w-[90%]">
          <div className="flex items-center space-x-3 flex-1 overflow-hidden">
            <Scale className="w-5 h-5 text-gold shrink-0" />
            <div className="truncate">
              <span className="text-xs uppercase font-bold tracking-wider text-gold block">
                Comparing {compareList.length} of 3 Reserves
              </span>
              <span className="text-xs text-sand/80 truncate block">
                {compareList.map(s => destinations.find(d => d.slug === s)?.name || s).join(', ')}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-sand/60 hover:text-sand underline"
            >
              Clear
            </button>
            <Link
              to={`/compare?reserves=${compareList.join(',')}`}
              className="px-4 py-2 bg-gold text-forest rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gold/90 transition shadow"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default DestinationsPage;
