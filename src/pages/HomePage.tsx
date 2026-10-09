import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, MapPin, BookOpen, 
  Search, Users, Award, HeartHandshake, Eye, Sparkles, Check
} from 'lucide-react';
import { Destination, GalleryItem } from '../types';
import { destinationService, cmsService } from '../services/api';
import { SplashScreen, SPLASH_SEEN_KEY } from '../components/SplashScreen';
import { stateCode, YEARS_OF_EXPERIENCE, inr, packageFromOf } from '../lib/site';

// lucide dropped brand icons; inline the mark once and reuse it on the tour cards.
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem(SPLASH_SEEN_KEY) === '1'
  );

  // Hero Slider State
  const HERO_SLIDES = [
    '/assets/img/Hero/hero-1.webp',
    '/assets/img/Hero/hero-2.webp',
    '/assets/img/Hero/hero-3.webp',
    '/assets/img/Hero/hero-4.webp',
    '/assets/img/Hero/hero-5.webp',
    '/assets/img/Hero/hero-7.webp',
    '/assets/img/Hero/hero-8.webp',
    '/assets/img/Hero/hero-9.webp',
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setHeroIndex(i => (i + 1) % HERO_SLIDES.length),
      4000
    );
    return () => window.clearInterval(id);
  }, []);

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

  // Fixed-date group departures (from Upcoming Tours). Posters live in /assets/img/tours/;
  // each card links to its Instagram post and to the booking flow via `dest`.
  const UPCOMING_TOURS = [
    {
      slug: 'tadoba-andhari',
      dest: 'tadoba-andhari',
      title: 'Tadoba-Andhari Tiger Reserve',
      tagline: 'The Tigress Trails & Valentine Canopy Escape',
      highlights: ['2 Nights / 3 Days', '4 Safaris (Core & Buffer)', 'AC transfers from Nagpur', 'Max 6 pax', 'All Meals'],
      dates: [
        { label: '15–17 Jan', note: 'The Tigress Trails · Women-Only' },
        { label: '22–24 Jan' },
        { label: '29–31 Jan' },
        { label: '5–7 Feb' },
        { label: '12–14 Feb', note: 'The Valentine Canopy Escape · Luxury stay' },
        { label: '19–21 Feb' },
      ],
      poster: '/assets/img/tours/tadoba-andhari.jpg',
      instagram: 'https://www.instagram.com/',
    },
    {
      slug: 'pench-mh',
      dest: 'pench-mh',
      title: 'Pench Tiger Reserve — Maharashtra',
      tagline: 'The Kipling Corridor',
      highlights: ['2 Nights / 3 Days', '4 Safaris (Core & Buffer)', 'Transfers from Nagpur', 'Max 6 pax', 'All Meals'],
      dates: [
        { label: '13–15 Nov' },
        { label: '20–22 Nov' },
        { label: '27–29 Nov' },
      ],
      poster: '/assets/img/tours/pench-mh.jpg',
      instagram: 'https://www.instagram.com/',
    },
    {
      slug: 'umred-karhandla',
      dest: 'umred-karhandla',
      title: 'Umred-Karhandla Wildlife Sanctuary',
      tagline: 'The Tigress Trails · Women-Only Departure',
      highlights: ['2 Nights / 3 Days', '4 Safaris (Core & Buffer)', 'Transfers from Nagpur', 'Max 6 pax', 'All Meals'],
      dates: [
        { label: '23–25 Dec', note: 'The Tigress Trails · Women-Only' },
        { label: '2–4 Jan 2026' },
        { label: '8–10 Jan 2026' },
      ],
      poster: '/assets/img/tours/umred-karhandla.jpg',
      instagram: 'https://www.instagram.com/',
    },
    {
      slug: 'tadoba-full-day',
      dest: 'tadoba-andhari',
      title: 'Tadoba-Andhari — Full Day Safari',
      tagline: 'Dawn to dusk in the core and buffer',
      highlights: ['Full Day Safari (Core & Buffer)', 'Group of 3–4 people', 'All Meals & Transportation', 'Well-guided jungle tours', 'Accommodation'],
      dates: [
        { label: 'Jan – Mar 2027' },
      ],
      poster: '/assets/img/tours/tadoba-full-day.jpg',
      instagram: 'https://www.instagram.com/',
    },
  ];

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
      <section className="relative flex items-end sm:items-center justify-center overflow-hidden w-full min-h-[88vh] sm:min-h-[520px] sm:aspect-video">
        {/* Full-bleed crossfade slider, 4s interval */}
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={i !== heroIndex}
              className={`absolute inset-0 w-full h-full object-cover brightness-[1.02] contrast-[1.03] transition-opacity duration-[1200ms] ease-in-out ${
                i === heroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Left-side subtle scrim for text legibility, leaving the rest of the frame completely clear and vibrant */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent w-full lg:w-3/5 pointer-events-none" />
          
          {/* Subtle top header shade */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none" />

          {/* Seamless bottom fade into page body */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-sand via-sand/25 to-transparent pointer-events-none" />
        </div>

        {/* Slide indicators (Bottom Right) */}
        <div className="absolute bottom-16 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-sand/30 shadow-xl">
          {HERO_SLIDES.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === heroIndex ? 'w-6 bg-gold' : 'w-1.5 bg-sand/50 hover:bg-sand/80'
              }`}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === heroIndex}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:py-24 text-sand w-full">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              GUIDED BY LOCALES. <br />
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
      <section className="relative z-20 -mt-12 max-w-6xl mx-auto px-4 sm:px-6">
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-forest text-sand p-4 sm:p-6 rounded-2xl shadow-2xl border border-gold/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          {/* State */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest-safari text-gold mb-1.5">
              State Territory
            </label>
            <select
              value={searchState}
              onChange={(e) => setSearchState(e.target.value)}
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
              {destinations.map(d => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({stateCode(d.state)})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest-safari text-gold mb-1.5">
              Expedition Date
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full bg-forest-deep border border-sand/20 rounded-lg p-2.5 text-xs text-sand focus:outline-none focus:border-gold"
            />
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
          <div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map(d => (
              <div 
                key={d.slug}
                className="bg-sand rounded-xl overflow-hidden border border-forest/20 shadow-md group flex flex-col justify-between hover:shadow-xl transition-all"
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
                    <p className="text-xs text-forest/70 line-clamp-2 leading-relaxed">
                      {d.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-forest/10 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-forest/60 block">Packages From</span>
                    <span className="font-serif text-base font-bold text-forest">{inr(packageFromOf(d))}</span>
                  </div>
                  <Link 
                    to={`/destinations/${d.slug}`}
                    className="p-2 bg-forest text-sand rounded hover:bg-gold hover:text-forest transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {UPCOMING_TOURS.map(tour => (
              <article
                key={tour.slug}
                className="bg-forest rounded-2xl overflow-hidden border border-sand/15 shadow-lg flex flex-col hover:border-gold/50 transition-colors"
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

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <ul className="space-y-1.5">
                    {tour.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-[11px] text-sand/80 leading-snug">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

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
                      to={`/booking?destination=${tour.dest}`}
                      className="flex-1 text-center py-2.5 px-3 bg-gold text-forest font-bold rounded text-xs hover:bg-gold-light transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Reserve Seat</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Award className="w-5 h-5" />, title: `${YEARS_OF_EXPERIENCE}+ Years of Field Expertise`, desc: 'Son of the Soil. Our founder began tracking in these forests as a boy — 15+ years of raw field experience, not textbook knowledge.' },
              { icon: <BookOpen className="w-5 h-5" />, title: 'The Jungle is a Classroom', desc: 'Naturalist-led safaris where every drive teaches ecology, behavior and conservation. We slow down so the forest can speak.' },
              { icon: <Users className="w-5 h-5" />, title: 'Unmatched Local Elite Talent', desc: 'Handpicked local guides and naturalists — the elite talent of each reserve, vetted for instinct, ethics and storytelling.' },
              { icon: <HeartHandshake className="w-5 h-5" />, title: 'The 1% Community Pledge', desc: '1% of all bookings is contributed to the welfare of the local community and nature preservation, transparently.' },
              { icon: <Eye className="w-5 h-5" />, title: 'Consent-Driven Photography', desc: 'Wildlife first, shutter second. We photograph on the animal’s terms — no baiting, no harassment, no cornering.' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Custom-Designed Experiences', desc: 'Every journey is co-designed around your pace, interests and comfort — from first-time families to serious photographers.' },
            ].map(usp => (
              <div key={usp.title} className="bg-sand rounded-2xl border border-forest/15 p-6 shadow-sm hover:shadow-xl transition-all space-y-3">
                <div className="w-11 h-11 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0">
                  {usp.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-forest">{usp.title}</h3>
                <p className="text-xs text-forest/80 leading-relaxed">{usp.desc}</p>
              </div>
            ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'DISCOVER', desc: 'Explore reserves across MP and Maharashtra, examining seasonal tiger activity and zone terrain.' },
              { num: '02', title: 'CHOOSE', desc: 'Compare morning vs. afternoon slots, private photography setups, and experienced local naturalists.' },
              { num: '03', title: 'PLAN', desc: 'Select preferred dates, verify core vs. buffer quota, and configure your vehicle and guest count.' },
              { num: '04', title: 'BOOK', desc: 'Submit traveler government ID proof for official Forest Department permit allocation.' },
              { num: '05', title: 'EXPERIENCE', desc: 'Arrive for your dawn briefing at the reserve as the first rays break through the sal trees.' }
            ].map((step, idx) => (
              <div key={step.num} className="bg-forest-deep p-6 rounded-xl border border-sand/15 relative space-y-3">
                <span className="font-serif text-3xl font-bold text-gold/40 block">
                  {step.num}
                </span>
                <h3 className="font-serif text-base font-bold text-sand">{step.title}</h3>
                <p className="text-xs text-sand/75 leading-relaxed">{step.desc}</p>
              </div>
            ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(item => (
              <div key={item._id} className="relative rounded-2xl overflow-hidden group border border-sand/15 aspect-[4/3] shadow-lg">
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
              </div>
            ))}
          </div>
        </div>
      </section>

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
