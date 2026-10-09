import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, ArrowRight, MapPin, BookOpen, 
  Search, Users, Award, HeartHandshake, Eye, Sparkles
} from 'lucide-react';
import { Destination, GalleryItem } from '../types';
import { destinationService, cmsService } from '../services/api';
import { SplashScreen, SPLASH_SEEN_KEY } from '../components/SplashScreen';
import { stateCode, YEARS_OF_EXPERIENCE, inr, packageFromOf } from '../lib/site';

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

  const featuredDestinations = destinations.slice(0, 4);

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
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
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
        <div className="absolute bottom-16 right-6 sm:right-10 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-sand/30 shadow-xl">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-sand w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-gold/50 text-gold text-xs font-bold tracking-widest-safari uppercase shadow-lg">
              <Compass className="w-3.5 h-3.5" />
              <span>Madhya Pradesh &amp; Maharashtra &middot; {YEARS_OF_EXPERIENCE}+ Years in the Field</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              GUIDED BY LOCALES. <br />
              <span className="italic font-normal text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">INSPIRED BY NATURE.</span>
            </h1>

            <p className="text-sm sm:text-base text-sand font-normal leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
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

      {/* 04b. WHY TRAVEL WITH US */}
      <section className="py-20 bg-sand-warm border-y border-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] tracking-widest-safari uppercase text-earth font-bold block">
              Why Travel With Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              SIX REASONS TO TRAVEL WITH US
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
              A seamless, transparent pathway from discovery to the morning gate briefing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'DISCOVER', desc: 'Explore reserves across MP and Maharashtra, examining seasonal tiger activity and zone terrain.' },
              { num: '02', title: 'CHOOSE', desc: 'Compare morning vs. afternoon slots, private photography setups, and experienced local naturalists.' },
              { num: '03', title: 'PLAN', desc: 'Select preferred dates, verify core vs. buffer quota, and configure your vehicle and guest count.' },
              { num: '04', title: 'BOOK', desc: 'Submit traveler government ID proof for official Forest Department permit allocation.' },
              { num: '05', title: 'EXPERIENCE', desc: 'Arrive at the reserve gate for your dawn briefing as the first rays break through the sal trees.' }
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

      {/* 06. OUR STORY HOMEPAGE PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sand-warm rounded-2xl border border-forest/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl">
          <div className="lg:col-span-6 relative min-h-[420px]">
            <img 
              src="/assets/img/tadoba-guide-briefing.jpg" 
              alt="Naturalist in Tadoba with bird field guide"
              className="w-full h-full object-cover brightness-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-forest/90 backdrop-blur-md p-3.5 rounded-xl text-xs text-sand border border-sand/20 shadow-lg">
              <span className="text-gold font-bold block text-xs uppercase">Field Guiding Master</span>
              Generations of indigenous forest instincts passed down on the trails of Vidarbha.
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4 flex flex-col flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest-safari text-earth-dark">
                <HeartHandshake className="w-4 h-4" />
                <span>The Story of Shutter and Stripes</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
                Where Photography Meets Forest Wisdom
              </h2>
              <p className="font-serif italic text-earth-dark text-base sm:text-lg">
                Inspired by Nature · Guided by Locals
              </p>
              <p className="text-xs sm:text-sm text-forest/95 leading-relaxed">
                Shutter and Stripes was founded on a simple truth: that genuine wildlife encounters require stillness, respect, and deep ecological familiarity.
              </p>
<div className="flex-1 flex items-center justify-center">
                <div className="px-8 py-6 bg-forest-deep rounded-xl border border-gold/30 shadow-md">
                  <img src="/assets/logo/logo.png" alt="Shutter and Stripes" className="h-42 w-auto object-contain" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-sand rounded-xl border border-forest/10 shadow-sm">
                  <strong className="text-xs font-serif text-forest block">SHUTTER</strong>
                  <span className="text-xs sm:text-sm text-forest/90">Observing without disturbing; patient framing of wildlife behavior.</span>
                </div>
                <div className="p-3.5 bg-sand rounded-xl border border-forest/10 shadow-sm">
                  <strong className="text-xs font-serif text-forest block">STRIPES</strong>
                  <span className="text-xs sm:text-sm text-forest/90">The living pulse of the Royal Bengal Tiger and Central India's forests.</span>
                </div>
              </div>
              <div className="p-4 bg-forest-deep rounded-xl border border-gold/30 shadow-sm text-center">
                  <strong className="text-xs sm:text-sm font-serif text-gold block uppercase tracking-wider">The 1% Community Pledge</strong>
                  <span className="text-xs sm:text-sm text-sand block">1% of all bookings is contributed to the welfare of the local community and nature preservation.</span>
                </div>
            </div>

            <div>
              <Link 
                to="/our-story"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest text-sand text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-forest-light transition-all shadow-md"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            </div>
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
            src="/assets/img/forest-canopy-sunbeams.jpg" 
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
