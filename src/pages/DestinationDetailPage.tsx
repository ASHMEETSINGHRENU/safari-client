import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Compass, 
  Camera, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  ChevronDown,
  Star,
  TreePine,
  Clock,
  Users,
  Mail
} from 'lucide-react';
import { destinationService, safariService } from '../services/api';
import { Destination, Safari } from '../types';
import { stateBadgeClass, stateCode, isPrimeZone, inr, packageFromOf, packagesOf, enquiryMailto } from '../lib/site';
import PackageTiers from '../components/packages/PackageTiers';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [safaris, setSafaris] = useState<Safari[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // MOM: How To Reach and Rules removed. How It Works + package enquiry via email covers this.
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'safaris' | 'faqs'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [primeOnly, setPrimeOnly] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const [destData, safariData] = await Promise.all([
          destinationService.getBySlug(slug),
          safariService.getAll({ destinationSlug: slug })
        ]);
        setDestination(destData);
        setSafaris(safariData);
      } catch (err: any) {
        setError(err.message || 'Reserve details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination?.name,
        text: destination?.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-sand min-h-screen pt-36 pb-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-forest text-lg">Retrieving reserve telemetry and forest records...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="bg-sand min-h-screen pt-36 pb-20 container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-forest/10 shadow-sm">
          <AlertCircle className="w-12 h-12 text-earth mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-forest mb-2">Reserve Not Found</h2>
          <p className="text-forest/70 text-sm mb-6">
            The reserve you are seeking does not exist or may have been updated.
          </p>
          <Link
            to="/destinations"
            className="px-6 py-2.5 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider inline-block"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const primeZones = destination.zones.filter(isPrimeZone);
  const visibleZones = primeOnly ? primeZones : destination.zones;

  return (
    <div className="bg-sand min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[72vh] min-h-[520px] max-h-[720px] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover brightness-[1.02] contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

        {/* Top Badges and Actions */}
        <div className="absolute top-28 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-sand/90 drop-shadow">
              <Link to="/destinations" className="hover:text-gold transition">Reserves</Link>
              <span>/</span>
              <span className="text-gold">{destination.state}</span>
              <span>/</span>
              <span className="text-sand">{destination.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-sand text-xs font-medium hover:bg-black/70 transition flex items-center space-x-1.5 border border-white/20 shadow"
              >
                <Share2 className="w-3.5 h-3.5 text-gold" />
                <span>{copied ? 'Copied Link!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Bottom Banner Content */}
        <div className="absolute bottom-10 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-md ${stateBadgeClass(destination.state)}`}>
                  {destination.state}
                </span>
                <span className="px-3 py-1 rounded-full bg-gold/90 text-forest text-xs font-bold uppercase tracking-wider shadow">
                  {destination.availability}
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-3 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                {destination.name}
              </h1>
              <p className="text-sand text-lg sm:text-xl font-light italic mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                "{destination.tagline}"
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/55 backdrop-blur-md p-4 rounded-2xl border border-sand/20 max-w-4xl shadow-2xl">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-sand/70 block">Core and Buffer Area</span>
                <span className="font-serif text-xl font-bold text-sand">{destination.areaSqKm} km²</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-sand/70 block">Headline Species</span>
                <span className="font-serif text-xl font-bold text-gold">
                  {destination.headlineSpecies || destination.tigerCount}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-sand/70 block">Prime Season</span>
                <span className="font-serif text-xl font-bold text-sand truncate block">{destination.bestTimeToVisit}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-sand/70 block">Package From</span>
                <span className="font-serif text-xl font-bold text-sand">{inr(packageFromOf(destination))}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left / Center: Detailed Information (2 cols) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section Navigation Tabs */}
            <div className="flex border-b border-forest/15 overflow-x-auto space-x-6 text-sm font-semibold tracking-wider uppercase">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition relative whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-forest border-b-2 border-forest font-bold'
                    : 'text-forest/60 hover:text-forest'
                }`}
              >
                Overview and Habitat
              </button>
              <button
                onClick={() => setActiveTab('zones')}
                className={`pb-3 transition relative whitespace-nowrap ${
                  activeTab === 'zones'
                    ? 'text-forest border-b-2 border-forest font-bold'
                    : 'text-forest/60 hover:text-forest'
                }`}
              >
                Zones and Gates ({primeZones.length || destination.zones.length})
              </button>
              <button
                onClick={() => setActiveTab('safaris')}
                className={`pb-3 transition relative whitespace-nowrap ${
                  activeTab === 'safaris'
                    ? 'text-forest border-b-2 border-forest font-bold'
                    : 'text-forest/60 hover:text-forest'
                }`}
              >
                Safari Packages ({safaris.length})
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`pb-3 transition relative whitespace-nowrap ${
                  activeTab === 'faqs'
                    ? 'text-forest border-b-2 border-forest font-bold'
                    : 'text-forest/60 hover:text-forest'
                }`}
              >
                FAQs
              </button>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                {destination.editorialQuote && (
                  <blockquote className="border-l-4 border-gold pl-6 py-2 bg-sand-light/60 rounded-r-2xl text-forest italic text-base sm:text-lg leading-relaxed font-serif">
                    "{destination.editorialQuote}"
                  </blockquote>
                )}

                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest mb-4">
                    Natural History and Landscape
                  </h3>
                  <div className="prose prose-forest text-forest/80 leading-relaxed text-sm sm:text-base space-y-4 font-sans">
                    {destination.fullDesc.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Wildlife Highlights Cards */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest mb-4 flex items-center space-x-2">
                    <TreePine className="w-5 h-5 text-forest" />
                    <span>Key Resident Fauna and Co-predators</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {destination.wildlifeHighlights.map((animal, i) => (
                      <div key={i} className="bg-white p-3.5 rounded-xl border border-forest/10 flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-xs font-semibold text-forest">{animal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photography Brief */}
                <div className="bg-forest text-sand p-6 sm:p-8 rounded-2xl border border-gold/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Camera className="w-6 h-6 text-gold" />
                    <h3 className="font-serif text-xl font-bold">Field Photography Notes</h3>
                  </div>
                  <p className="text-sand/80 text-xs sm:text-sm leading-relaxed mb-4">
                    Recommended Focal Lengths: <strong>100-400mm / 500mm prime</strong>. Early morning tracks frequently encounter low ambient canopy light; high ISO performance and fast f/2.8 or f/4 glass is recommended. Bean bags are available on Shutter And Stripes customized safari jeeps.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <span className="text-gold font-bold block mb-1">Morning Light</span>
                      <span className="text-sand/80">Soft directional illumination through dust particles and bamboo canopy.</span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <span className="text-gold font-bold block mb-1">Evening Light</span>
                      <span className="text-sand/80">Golden-hour rim lighting at waterholes and open savannah clearings.</span>
                    </div>
                  </div>
                </div>

                {/* Gallery Preview */}
                {destination.galleryImages && destination.galleryImages.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold text-forest mb-4">
                      Reserve Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      {destination.galleryImages.map((img, idx) => (
                        <div key={idx} className="h-56 rounded-2xl overflow-hidden border border-forest/15 shadow-md group">
                          <img
                            src={img}
                            alt={`${destination.name} gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ZONES and GATES — prime first */}
            {activeTab === 'zones' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest flex items-center gap-2">
                      <Star className="w-5 h-5 text-gold" />
                      Prime Zones and Gates
                    </h3>
                    <p className="text-forest/70 text-xs mt-1">
                      The zones we rate highest for sightings, each with independent gates, vehicle limits, and territorial boundaries.
                    </p>
                  </div>

                  {primeZones.length < destination.zones.length && (
                    <div className="flex space-x-1.5 bg-sand-light p-1 rounded-xl border border-forest/10 text-xs">
                      <button
                        onClick={() => setPrimeOnly(true)}
                        className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition ${
                          primeOnly ? 'bg-forest text-sand' : 'text-forest/70 hover:text-forest'
                        }`}
                      >
                        Prime ({primeZones.length})
                      </button>
                      <button
                        onClick={() => setPrimeOnly(false)}
                        className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition ${
                          !primeOnly ? 'bg-forest text-sand' : 'text-forest/70 hover:text-forest'
                        }`}
                      >
                        All ({destination.zones.length})
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {visibleZones.map((zone, i) => (
                    <div 
                      key={i} 
                      className={`bg-white p-6 rounded-2xl border shadow-sm hover:border-gold/40 transition ${
                        isPrimeZone(zone) ? 'border-gold/50' : 'border-forest/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            zone.type === 'core' 
                              ? 'bg-forest text-sand' 
                              : 'bg-earth text-sand'
                          }`}>
                            {zone.type}
                          </span>
                          {isPrimeZone(zone) && (
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-forest flex items-center gap-1">
                              <Star className="w-3 h-3" /> Prime
                            </span>
                          )}
                          <h4 className="font-serif text-xl font-bold text-forest">
                            {zone.name}
                          </h4>
                        </div>
                        {zone.vehicleQuotaPerDay && (
                          <span className="text-xs text-forest/60 font-medium">
                            Quota: <strong>{zone.vehicleQuotaPerDay}</strong> jeeps / day
                          </span>
                        )}
                      </div>

                      {zone.highlight && (
                        <p className="text-gold font-medium text-xs mb-2">
                          Key Characteristic: {zone.highlight}
                        </p>
                      )}

                      {zone.description && (
                        <p className="text-forest/70 text-xs sm:text-sm mb-4 leading-relaxed">
                          {zone.description}
                        </p>
                      )}

                      <div className="pt-3 border-t border-forest/10 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                          Accessible Gates:
                        </span>
                        {zone.gates.length > 0 ? zone.gates.map((g, gIdx) => (
                          <span 
                            key={gIdx}
                            className="px-2.5 py-1 bg-sand rounded-lg text-xs font-medium text-forest border border-forest/10"
                          >
                            {g} Gate
                          </span>
                        )) : (
                          <span className="text-xs text-forest/50 italic">On request</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SAFARIS */}
            {activeTab === 'safaris' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest">
                      Available Safari Slots and Packages
                    </h3>
                    <p className="text-forest/70 text-xs mt-1">
                      Includes official permit fees, registered open safari vehicle, forest driver, and authorized naturalist.
                    </p>
                  </div>
                </div>

                {safaris.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-forest/10">
                    <p className="text-forest/70 text-sm mb-4">Safaris for this destination are currently managed via custom permit booking.</p>
                    <Link
                      to={`/booking?destination=${destination.slug}`}
                      className="px-6 py-2.5 bg-forest text-sand rounded-xl text-xs uppercase font-bold tracking-wider inline-block"
                    >
                      Book Custom Permit
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {safaris.map(s => (
                      <div 
                        key={s._id}
                        className="bg-white p-6 rounded-2xl border border-forest/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded bg-sand text-forest text-[10px] font-bold uppercase tracking-wider">
                              {s.safariType}
                            </span>
                            <span className="px-2.5 py-0.5 rounded bg-forest/10 text-forest text-[10px] font-bold uppercase tracking-wider">
                              {s.slot} Slot
                            </span>
                          </div>
                          <h4 className="font-serif text-xl font-bold text-forest">{s.name}</h4>
                          <p className="text-forest/70 text-xs line-clamp-2 leading-relaxed">{s.description}</p>
                          
                          <div className="flex flex-wrap gap-3 text-xs text-forest/60 pt-2">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-gold" />
                              <span>{s.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3.5 h-3.5 text-gold" />
                              <span>Max {s.capacity} Guests</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-gold" />
                              <span>Zones: {s.zones.join(', ')}</span>
                            </span>
                          </div>
                        </div>

                        <div className="md:text-right shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-forest/10 flex md:flex-col items-center md:items-end justify-between">
                          <div className="text-center">
                            <span className="text-[10px] uppercase tracking-wider text-forest/50 block">Package From</span>
                            <span className="font-serif text-2xl font-bold text-forest">{inr(s.basePrice)}</span>
                            <span className="text-[10px] text-forest/50 block mt-0.5">All-inclusive, per person</span>
                          </div>
                          <Link
                            to={`/booking?destination=${destination.slug}&safari=${s.slug}`}
                            className="mt-3 px-5 py-2.5 bg-forest text-sand rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-forest/90 transition shadow inline-block"
                          >
                            Reserve Seat
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WHOLE PACKAGES */}
            {packagesOf(destination).length > 0 && (
              <div className="mt-12 animate-fadeIn">
                <h3 className="font-serif text-2xl font-bold text-forest mb-2">
                  Whole Packages
                </h3>
                <p className="text-sm text-forest/60 mb-6 max-w-2xl">
                  Every package below is all-inclusive: park permits, safari vehicle, guide and
                  applicable forest dues are bundled in. Nothing is charged separately on the day.
                </p>
                <PackageTiers destination={destination} />
              </div>
            )}

            {/* TAB: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-serif text-2xl font-bold text-forest mb-4">
                  Frequently Asked Questions for {destination.name}
                </h3>
                {destination.faqs.map((faq, i) => (
                  <div 
                    key={i}
                    className="bg-white rounded-xl border border-forest/10 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-sand/30 transition"
                    >
                      <span className="font-serif font-bold text-forest text-sm sm:text-base">
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-forest transition-transform ${
                        openFaq === i ? 'rotate-180 text-gold' : ''
                      }`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-forest/80 leading-relaxed border-t border-forest/5">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Sticky Booking Widget Card (1 col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-xl space-y-6">
              
              <div className="border-b border-forest/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                  Verified Booking Portal
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest">
                  Reserve {destination.name}
                </h3>
                <p className="text-forest/60 text-xs mt-1">
                  100% official forest department registered slots.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-sand p-3.5 rounded-xl border border-forest/10 flex items-center justify-between">
                  <span className="text-forest/70 font-medium">Availability:</span>
                  <span className="font-bold text-forest uppercase">{destination.availability}</span>
                </div>

                <div className="bg-sand-light p-3.5 rounded-xl border border-gold/40">
                  <span className="text-forest/70 font-medium block text-[11px] uppercase tracking-wider">Packages From</span>
                  <span className="font-serif font-bold text-forest text-xl">{inr(packageFromOf(destination))}</span>
                  <span className="text-forest/50 text-[10px] block">Per person, all-inclusive</span>
                </div>

                <div className="bg-sand p-3.5 rounded-xl border border-forest/10 flex items-center justify-between">
                  <span className="text-forest/70 font-medium">Forest Territory:</span>
                  <span className="font-bold text-forest">{destination.state} ({stateCode(destination.state)})</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/booking?destination=${destination.slug}`}
                  className="w-full py-3.5 bg-forest text-sand rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 hover:bg-forest/90 transition shadow-lg"
                >
                  <span>Start Booking Wizard</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
                <p className="text-center text-[10px] text-forest/50 mt-2">
                  No payment charged during initial verification.
                </p>
              </div>

              {/* Quick Inquiry CTA — package enquiries handled by email per MOM */}
              <div className="pt-4 border-t border-forest/10">
                <p className="text-xs text-forest/70 mb-3">
                  Need a customized multi-park safari or photography vehicle with bean bags?
                </p>
                <a
                  href={enquiryMailto(
                    `Package Enquiry — ${destination.name}`,
                    `Reserve: ${destination.name} (${destination.state})\n\nI'd like to discuss:\n`
                  )}
                  className="w-full py-2.5 border border-forest/30 text-forest rounded-xl font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-forest hover:text-sand transition"
                >
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  Email a Package Enquiry
                </a>
              </div>

              {/* Guaranteed Protection Note */}
              <div className="bg-forest/5 p-4 rounded-xl border border-forest/10 text-[11px] text-forest/70 leading-relaxed">
                <strong className="text-forest block mb-1">Ethical Wildlife Charter:</strong>
                Shutter And Stripes operates under strict NTCA protocols. We respect safe distances, preserve silence, and do not compromise animal behavior for photographs.
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
export default DestinationDetailPage;
