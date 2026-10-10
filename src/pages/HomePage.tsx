import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, MapPin, BookOpen, 
  Search, Users, Award, HeartHandshake, Eye, Sparkles, Calendar
} from 'lucide-react';
import { Destination, GalleryItem } from '../types';
import { destinationService, cmsService } from '../services/api';
import { SplashScreen, SPLASH_SEEN_KEY } from '../components/SplashScreen';
import { SafariCalendar } from '../components/SafariCalendar';
import { stateCode, YEARS_OF_EXPERIENCE, inr, packageFromOf } from '../lib/site';
import { UPCOMING_TOURS } from '../lib/upcomingTours';
import InstagramIcon from '../components/InstagramIcon';
import { Carousel } from '../components/Carousel';
import { GalleryLightbox } from '../components/GalleryLightbox';

// On mobile the card sections loop continuously; at sm the track dissolves
// (display:contents) so the same cards flow into the grid laid out by the
// parent. The second copy is hidden at sm so the grid isn't doubled.
const Marquee: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="marquee-track flex w-max sm:contents">
    {children}
    <div className="contents sm:hidden" aria-hidden="true">{children}</div>
  </div>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeGallery, setActiveGallery] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem(SPLASH_SEEN_KEY) === '1'
  );

  // Hero Slider State
  const HERO_SLIDES_DESKTOP = [
    '/assets/img/Hero/hero-1.webp',
    '/assets/img/Hero/hero-2.webp',
    '/assets/img/Hero/hero-3.webp',
    '/assets/img/Hero/hero-4.webp',
    '/assets/img/Hero/hero-5.webp',
    '/assets/img/Hero/hero-7.webp',
    '/assets/img/Hero/hero-8.webp',
    '/assets/img/Hero/hero-9.webp',
  ];

  // Mobile curated collection: only perfectly-centered, uncropped subjects that look stunning in portrait full-screen
  const HERO_SLIDES_MOBILE = [
    '/assets/img/Hero/hero-1.webp',
    '/assets/img/Hero/hero-8.webp',
    '/assets/img/Hero/hero-9.webp',
  ];

  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const heroSlides = isMobile ? HERO_SLIDES_MOBILE : HERO_SLIDES_DESKTOP;
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    setHeroIndex(0);
  }, [isMobile]);

  useEffect(() => {
    const id = window.setInterval(
      () => setHeroIndex(i => (i + 1) % heroSlides.length),
      4000
    );
    return () => window.clearInterval(id);
  }, [heroSlides.length]);

  useEffect(() => {
    Promise.all([
      destinationService.getAll(),
      cmsService.getGallery({ isFeatured: true })
    ]).then(([dests, gal]) => {
      setDestinations(dests);
      setGallery(gal.slice(0, 6));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Package finder state
  const [searchState, setSearchState] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState('2');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDestination) {
      navigate(`/booking?destination=${searchDestination}`);
    } else {
      navigate(searchState ? `/destinations?state=${searchState}` : '/destinations');
    }
  };

  // Hand-picked spotlight order + marketing copy for the homepage rail.
  const featuredDestinations = [
    { slug: 'tadoba-andhari', name: 'Tadoba-Andhari', tagline: 'The Sighting Capital' },
    { slug: 'pench-mh', name: 'Pench', tagline: 'The Kipling Corridor' },
    { slug: 'kanha', name: 'Kanha', tagline: 'The Sal Forest Kingdom' },
    { slug: 'bandhavgarh', name: 'Bandhavgarh', tagline: 'The Fort of Tigers' },
  ]
    .map(f => {
      const d = destinations.find(x => x.slug === f.slug);
      return d ? { ...d, name: f.name, tagline: f.tagline } : null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <div className="bg-sand text-forest min-h-screen">
      {!splashDone && (
        <SplashScreen
          getVideo={() => null}
          onDone={() => {
            sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
            setSplashDone(true);
          }}
        />
      )}
      
      {/* 01. HERO IMAGE SLIDER */}
      <section className="relative flex items-end sm:items-center justify-center overflow-hidden w-full h-[100vh] h-[100dvh] max-h-[100vh] max-h-[100dvh] sm:h-auto sm:max-h-none sm:min-h-[520px] sm:aspect-video">
        {/* Full-bleed crossfade slider, 4s interval */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={i !== (heroIndex % heroSlides.length)}
              className={`absolute inset-0 w-full h-full object-cover brightness-[1.02] contrast-[1.03] transition-opacity duration-[1200ms] ease-in-out ${
                i === (heroIndex % heroSlides.length) ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Left-side subtle scrim for text legibility, leaving the rest of the frame completely clear and vibrant */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent w-full lg:w-3/5 pointer-events-none" />
          
          {/* Subtle top header shade */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none" />

          {/* Seamless bottom fade into page body */}
          <div className="absolute bottom-0 inset-x-0 h-10 sm:h-28 bg-gradient-to-t from-sand/40 sm:from-sand via-sand/10 sm:via-sand/25 to-transparent pointer-events-none" />
        </div>

        {/* Slide indicators (Bottom Right) */}
        <div className="absolute bottom-16 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-sand/30 shadow-xl">
          {heroSlides.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === (heroIndex % heroSlides.length) ? 'w-6 bg-gold' : 'w-1.5 bg-sand/50 hover:bg-sand/80'
              }`}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === (heroIndex % heroSlides.length)}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:py-24 text-sand w-full">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              GUIDED BY LOCALS. <br />
              <span className="italic font-normal text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">INSPIRED BY NATURE.</span>
            </h1>

            <p className="text-xs sm:text-base text-sand font-normal leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Step into the wild with people who know it from the inside. Immersive, expert-led wildlife journeys across the forests of Maharashtra and Madhya Pradesh.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/booking" 
                className="px-6 py-3.5 bg-gold text-forest font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all shadow-xl flex items-center gap-2"
              >
                <span>Customize My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/destinations" 
                className="px-6 py-3.5 bg-black/40 backdrop-blur-md border border-sand/40 text-sand font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-black/60 transition-colors flex items-center gap-2 shadow-lg"
              >
                <MapPin className="w-4 h-4 text-gold" />
                <span>Explore Reserves</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 02. PACKAGE FINDER */}
      <section className="relative z-20 mt-4 sm:-mt-12 max-w-6xl mx-auto px-4 sm:px-6">
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-forest text-sand p-4 sm:p-6 rounded-2xl shadow-2xl border border-gold/30 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end"
        >
          {/* State */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest-safari text-gold mb-1.5">
              State Territory
            </label>
            <select
              value={searchState}
              onChange={(e) => { setSearchState(e.target.value); setSearchDestination(''); }}
              className="w-full bg-forest-deep border border-sand/20 rounded-lg p-2.5 text-xs text-sand focus:outline-none focus:border-gold"
            >
              <option value="">All States</option>
              {[...new Set(destinations.map(d => d.state))].map(s => (
                <option key={s} value={s.toLowerCase().replace(/\s+/g, '-')}>
                  {s} ({destinations.filter(d => d.state === s).length})
                </option>
              ))}
            </select>
          </div>

          {/* Reserve */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest-safari text-gold mb-1.5">
              Tiger Reserve
            </label>
            <select
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="w-full bg-forest-deep border border-sand/20 rounded-lg p-2.5 text-xs text-sand focus:outline-none focus:border-gold"
            >
              <option value="">Any Reserve</option>
              {(searchState ? destinations.filter(d => d.state.toLowerCase().replace(/\s+/g, '-') === searchState) : destinations).map(d => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({stateCode(d.state)})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold tracking-widest-safari text-gold mb-1.5">
              Expedition Date
            </label>
            <button
              type="button"
              onClick={() => setShowCalendar(o => !o)}
              className="w-full bg-forest-deep border border-sand/20 rounded-lg p-2.5 text-xs text-left focus:outline-none focus:border-gold flex items-center justify-between gap-2"
            >
              <span className={searchDate ? 'text-sand' : 'text-sand/50'}>
                {searchDate
                  ? new Date(searchDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Select date'}
              </span>
              <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
            </button>
            {showCalendar && (
              <>
                <button
                  type="button"
                  aria-label="Close calendar"
                  onClick={() => setShowCalendar(false)}
                  className="fixed inset-0 z-30 cursor-default"
                />
                <div className="absolute z-40 mt-2 left-0 w-[19rem] max-w-[calc(100vw-2rem)]">
                  <SafariCalendar
                    value={searchDate}
                    onSelect={(iso) => { setSearchDate(iso); setShowCalendar(false); }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Guests */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest-safari text-gold mb-1.5">
              Guests
            </label>
            <select
              value={searchGuests}
              onChange={(e) => setSearchGuests(e.target.value)}
              className="w-full bg-forest-deep border border-sand/20 rounded-lg p-2.5 text-xs text-sand focus:outline-none focus:border-gold"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="4">4 Guests</option>
              <option value="6">Private Safari Jeep (6 Guests)</option>
            </select>
          </div>

          {/* Submit CTA */}
          <div className="col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="w-full py-3 bg-gold text-forest font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-gold-light transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find My Package</span>
            </button>
          </div>
        </form>
      </section>

      {/* 04. FEATURED DESTINATIONS */}
      <section className="py-16 bg-sand-warm border-y border-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] tracking-widest-safari uppercase text-earth font-bold block">
                Sanctuary Spotlights
              </span>
              <h2 className="font-serif text-3xl font-bold text-forest mt-1">
                Premier Tiger Reserves
              </h2>
            </div>
            <Link 
              to="/destinations" 
              className="text-xs font-bold uppercase tracking-wider text-earth hover:text-forest flex items-center gap-1.5"
            >
              <span>View All Reserves</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Carousel
            label="Premier tiger reserves"
            trackClassName="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:snap-none"
          >
            {featuredDestinations.map(d => (
              <Link
                key={d.slug}
                to={`/destinations/${d.slug}`}
                className="snap-start shrink-0 w-[85%] sm:w-auto bg-sand rounded-xl overflow-hidden border border-forest/20 shadow-md group flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={d.heroImage} 
                      alt={d.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-sand text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20 shadow">
                      {d.state}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-sand/95 backdrop-blur-sm text-forest text-[10px] font-bold px-2.5 py-1 rounded-md shadow">
                      {d.availability}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-earth uppercase font-semibold tracking-wider block">
                      {d.tagline}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-forest leading-snug line-clamp-1">
                      {d.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-forest/10 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-forest/60 block">Packages From</span>
                    <span className="font-serif text-base font-bold text-forest">{inr(packageFromOf(d))}</span>
                  </div>
                  <span className="p-2 bg-forest text-sand rounded group-hover:bg-gold group-hover:text-forest transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* 04c. UPCOMING TOURS */}
      <section className="py-20 bg-forest-deep text-sand border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] tracking-widest-safari uppercase text-gold font-bold block">
                The Safari Calendar · Limited Seats
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand mt-1">
                Upcoming Tours
              </h2>
              <p className="text-xs text-sand/70 leading-relaxed mt-2 max-w-xl">
                Fixed-date group departures and themed escapes &mdash; small groups, confirmed permits, and every seat booked with the forest department in advance.
              </p>
            </div>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-gold hover:text-gold-light flex items-center gap-1.5 shrink-0"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow the Tours</span>
            </a>
          </div>

          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {UPCOMING_TOURS.map(tour => (
              <article
                key={tour.slug}
                className="snap-start shrink-0 w-[85vw] sm:w-auto bg-forest rounded-2xl overflow-hidden border border-sand/15 shadow-lg flex flex-col hover:border-gold/50 transition-colors"
              >
                {/* Poster — drop the image in /assets/img/tours/; tapping opens the Instagram post */}
                <a
                  href={tour.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${tour.title} on Instagram`}
                  className="relative block aspect-[3/4] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-muted to-forest-deep" />
                  <img
                    src={tour.poster}
                    alt={`${tour.title} poster`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-gold text-forest text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                    Upcoming Tour
                  </span>
                  <span className="absolute top-3 right-3 bg-black/55 backdrop-blur-sm text-sand p-1.5 rounded-full border border-white/20">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </span>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="font-serif text-lg font-bold text-sand leading-snug">{tour.title}</h3>
                    <p className="text-[11px] text-gold uppercase tracking-wider font-semibold mt-0.5">{tour.tagline}</p>
                  </div>
                </a>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-sand/50 uppercase font-bold tracking-wider block">Departure Dates</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tour.dates.map(d => (
                        <span
                          key={d.label}
                          title={d.note}
                          className="text-[10px] font-medium text-sand bg-forest-deep/70 border border-sand/15 rounded px-2 py-1"
                        >
                          {d.label}{d.note ? ' ★' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/upcoming-tours/${tour.slug}`}
                      className="flex-1 text-center py-2.5 px-3 bg-gold text-forest font-bold rounded text-xs hover:bg-gold-light transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={tour.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View this tour on Instagram"
                      className="p-2.5 bg-forest-deep border border-sand/20 text-sand rounded hover:text-gold hover:border-gold/50 transition-colors"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04b. WHY TRAVEL WITH US */}
      <section className="py-20 bg-sand-warm border-y border-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] tracking-widest-safari uppercase text-earth font-bold block">
              Why Travel With Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              What Sets Us Apart
            </h2>
            <p className="text-xs text-forest/70 leading-relaxed">
              The jungle is a classroom, not a checklist. Everything we do is built on local mastery, respect, and ecological familiarity.
            </p>
          </div>

          <div className="overflow-hidden sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <Marquee>
            {[
              { icon: <Award className="w-5 h-5" />, title: `${YEARS_OF_EXPERIENCE}+ Years of Field Expertise`, desc: 'Son of the Soil. Our founder began tracking in these forests as a boy — 15+ years of raw field experience, not textbook knowledge.' },
              { icon: <BookOpen className="w-5 h-5" />, title: 'The Jungle is a Classroom', desc: 'Naturalist-led safaris where every drive teaches ecology, behavior and conservation. We slow down so the forest can speak.' },
              { icon: <Users className="w-5 h-5" />, title: 'Unmatched Local Elite Talent', desc: 'Handpicked local guides and naturalists — the elite talent of each reserve, vetted for instinct, ethics and storytelling.' },
              { icon: <HeartHandshake className="w-5 h-5" />, title: 'The 1% Community Pledge', desc: '1% of all bookings is contributed to the welfare of the local community and nature preservation, transparently.' },
              { icon: <Eye className="w-5 h-5" />, title: 'Consent-Driven Photography', desc: 'Wildlife first, shutter second. We photograph on the animal’s terms — no baiting, no harassment, no cornering.' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Custom-Designed Experiences', desc: 'Every journey is co-designed around your pace, interests and comfort — from first-time families to serious photographers.' },
            ].map(usp => (
              <div key={usp.title} className="shrink-0 mr-6 w-[85vw] sm:mr-0 sm:w-auto bg-sand rounded-2xl border border-forest/15 p-6 shadow-sm hover:shadow-xl transition-all space-y-3">
                <div className="w-11 h-11 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0">
                  {usp.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-forest">{usp.title}</h3>
                <p className="text-xs text-forest/80 leading-relaxed">{usp.desc}</p>
              </div>
            ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 05. HOW IT WORKS */}
      <section className="py-20 bg-forest text-sand border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] tracking-widest-safari uppercase text-gold font-bold block">
              The Journey to the Forest
            </span>
            <h2 className="font-serif text-3xl font-bold text-sand">
              How It Works
            </h2>
            <p className="text-xs text-sand/70">
              A seamless, transparent pathway from discovery to the morning forest briefing.
            </p>
          </div>

          <div className="overflow-hidden sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-6">
            <Marquee>
            {[
              { num: '01', title: 'DISCOVER', desc: 'Explore reserves across MP and Maharashtra, examining seasonal tiger activity and zone terrain.' },
              { num: '02', title: 'CHOOSE', desc: 'Compare morning vs. afternoon slots, private photography setups, and experienced local naturalists.' },
              { num: '03', title: 'PLAN', desc: 'Select preferred dates, verify core vs. buffer quota, and configure your vehicle and guest count.' },
              { num: '04', title: 'BOOK', desc: 'Submit traveler government ID proof for official Forest Department permit allocation.' },
              { num: '05', title: 'EXPERIENCE', desc: 'Arrive for your dawn briefing at the reserve as the first rays break through the sal trees.' }
            ].map((step, idx) => (
              <div key={step.num} className="shrink-0 mr-6 w-[85vw] sm:mr-0 sm:w-auto bg-forest-deep p-6 rounded-xl border border-sand/15 relative space-y-3">
                <span className="font-serif text-3xl font-bold text-gold/40 block">
                  {step.num}
                </span>
                <h3 className="font-serif text-base font-bold text-sand">{step.title}</h3>
                <p className="text-xs text-sand/75 leading-relaxed">{step.desc}</p>
              </div>
            ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 07. WILDLIFE PHOTOGRAPHY GALLERY PREVIEW */}
      <section className="py-20 bg-forest-deep text-sand border-y border-sand/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] tracking-widest-safari uppercase text-gold font-bold block">
                Visual Chronicles
              </span>
              <h2 className="font-serif text-3xl font-bold text-sand mt-1">
                The Master Gallery
              </h2>
            </div>
            <Link 
              to="/gallery" 
              className="text-xs font-bold uppercase tracking-wider text-gold hover:underline flex items-center gap-1.5"
            >
              <span>Explore Complete Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-hidden sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <Marquee>
            {gallery.map(item => (
              <button
                type="button"
                key={item._id}
                onClick={() => setActiveGallery(item)}
                className="shrink-0 mr-6 w-[85vw] sm:mr-0 sm:w-auto relative rounded-2xl overflow-hidden group border border-sand/15 aspect-[4/3] shadow-lg text-left cursor-pointer"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-sand space-y-0.5">
                  <span className="text-[10px] text-gold uppercase tracking-wider font-bold block drop-shadow">
                    {item.animal} • {item.destinationName}
                  </span>
                  <h4 className="font-serif text-sm font-bold truncate text-white drop-shadow">{item.title}</h4>
                  <span className="text-[10px] text-sand/80 block drop-shadow">{item.photographer}</span>
                </div>
              </button>
            ))}
            </Marquee>
          </div>
        </div>
      </section>

      <GalleryLightbox
        items={gallery}
        activeItem={activeGallery}
        onClose={() => setActiveGallery(null)}
        onChange={setActiveGallery}
      />

      {/* 08. FINAL BOOKING CTA */}
      <section className="py-24 bg-forest text-sand relative overflow-hidden border-t-2 border-gold/40">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/img/Hero/hero-3.webp" 
            alt="Forest Canopy Wilderness" 
            className="w-full h-full object-cover brightness-[0.25] contrast-[1.05]" 
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <span className="text-xs uppercase tracking-widest-safari text-gold font-bold block drop-shadow">
            Begin Your Wilderness Chapter
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            The Forests of Central India Await.
          </h2>
          <p className="text-xs sm:text-sm text-sand/90 max-w-xl mx-auto leading-relaxed drop-shadow">
            Reserve official Forest Department permits across Bandhavgarh, Kanha, Tadoba, Pench, and beyond with transparent pricing and specialist naturalists.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              to="/booking" 
              className="px-8 py-3.5 bg-gold text-forest font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-light transition-all shadow-xl"
            >
              Book Your Expedition
            </Link>
            <Link 
              to="/compare" 
              className="px-6 py-3.5 bg-black/40 backdrop-blur-md border border-sand/30 text-sand text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black/60 transition-colors shadow-lg"
            >
              Compare Sanctuaries
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
