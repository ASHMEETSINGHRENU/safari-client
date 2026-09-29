import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Camera, 
  ShieldCheck, 
  TreePine, 
  Heart, 
  Users, 
  Sparkles, 
  ArrowRight,
  Eye,
  Quote
} from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-6">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>The Shutter And Stripes Ethos</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-forest font-bold tracking-tight mb-6 leading-tight">
            Born in the Dust & Sal Valleys of Central India
          </h1>
          <p className="text-forest/80 text-lg sm:text-xl leading-relaxed font-sans max-w-2xl mx-auto">
            We are not a booking aggregator. We are wildlife chroniclers, naturalists, and photographers dedicated to the living legacy of the Royal Bengal Tiger across Madhya Pradesh and Maharashtra.
          </p>
        </div>

        {/* Hero Full-width Vignette */}
        <div className="mt-12 rounded-3xl overflow-hidden border border-forest/15 shadow-2xl relative h-[500px]">
          <img
            src="/assets/img/bengal-tiger-portrait.jpg"
            alt="Bengal Tiger in Central India"
            className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-sand max-w-2xl">
            <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2 drop-shadow">
              Our Guiding Tenet
            </span>
            <p className="font-serif text-2xl sm:text-3xl italic text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              "The jungle reveals its secrets only to those who possess the patience to listen and the humility to wait."
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY OF THE STRIPED MONARCH */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-earth font-bold text-xs uppercase tracking-widest">
              <TreePine className="w-4 h-4 text-gold" />
              <span>Section II — The Sovereign of the Canopy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-forest font-bold leading-tight">
              Honoring the Apex of the Forest Ecosystem
            </h2>
            <p className="text-forest/80 text-base leading-relaxed font-sans">
              To look upon a tiger in its natural habitat is an indelible human experience. Yet for decades, safari tourism has often treated the animal as an item on a checklist. We founded Shutter And Stripes to dismantle that mentality.
            </p>
            <p className="text-forest/80 text-base leading-relaxed font-sans">
              We do not treat the jungle as an amusement park. We measure a safari’s success not by the velocity of a chase, but by the understanding gained: the acoustic language of the deer's alarm call, the scent marks left upon ancient trunks, and the delicate equilibrium sustained by top predators.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-xl relative">
            <Quote className="w-12 h-12 text-gold/30 absolute top-6 right-6" />
            <h3 className="font-serif text-2xl font-bold text-forest mb-4">
              What We Never Guarantee
            </h3>
            <p className="text-forest/80 text-sm leading-relaxed mb-6 font-sans">
              We will never guarantee a tiger sighting. The wilderness is untamed and sovereign. What we do guarantee is deep naturalist expertise, ethical positioning, official Forest Department compliance, and an experience that honors your time and the jungle's sanctity.
            </p>
            <div className="p-4 bg-sand rounded-2xl border border-forest/10 flex items-center space-x-3 text-xs font-semibold text-forest">
              <ShieldCheck className="w-5 h-5 text-forest shrink-0" />
              <span>Strict compliance with NTCA (National Tiger Conservation Authority) norms.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE CAMERA AS AN INSTRUMENT OF EMPATHY */}
      <section className="bg-forest text-sand py-24 mb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center space-x-2 text-gold text-xs font-bold uppercase tracking-widest mb-3">
              <Camera className="w-4 h-4" />
              <span>Section III — Photography Philosophy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4">
              The Camera as an Instrument of Empathy
            </h2>
            <p className="text-sand/80 text-base sm:text-lg leading-relaxed font-sans">
              Photography is our lens into conservation. We reject reckless vehicle positioning, flash strobes in twilight, and crowding around animals. We celebrate contextual storytelling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-sand/15 p-8 rounded-2xl backdrop-blur-sm">
              <span className="text-gold font-serif text-3xl font-bold block mb-2">01</span>
              <h3 className="font-serif text-xl font-bold mb-3">Context Over Close-Up</h3>
              <p className="text-sand/70 text-xs sm:text-sm leading-relaxed">
                A tiger in its majestic habitat—framing the sal forest, the mist, the riverbeds—tells a far deeper ecological story than an intrusive portrait with a cropped horizon.
              </p>
            </div>

            <div className="bg-white/5 border border-sand/15 p-8 rounded-2xl backdrop-blur-sm">
              <span className="text-gold font-serif text-3xl font-bold block mb-2">02</span>
              <h3 className="font-serif text-xl font-bold mb-3">Natural Light Exclusively</h3>
              <p className="text-sand/70 text-xs sm:text-sm leading-relaxed">
                Zero artificial flash or spotlights in core areas. We train travelers to read dawn and dusk illumination, dust scattering, and rim lighting with high-performance primes and zoom lenses.
              </p>
            </div>

            <div className="bg-white/5 border border-sand/15 p-8 rounded-2xl backdrop-blur-sm">
              <span className="text-gold font-serif text-3xl font-bold block mb-2">03</span>
              <h3 className="font-serif text-xl font-bold mb-3">Patience Over Pursuit</h3>
              <p className="text-sand/70 text-xs sm:text-sm leading-relaxed">
                Rather than burning petrol racing between gates, we study territorial movements, station ourselves silently by water bodies, and let the wild emerge naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 14 BASTIONS OF CENTRAL INDIA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 text-earth font-bold text-xs uppercase tracking-widest mb-3">
            <TreePine className="w-4 h-4 text-gold" />
            <span>Section IV — Geography & Focus</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest font-bold leading-tight mb-4">
            Why Only Madhya Pradesh & Maharashtra?
          </h2>
          <p className="text-forest/80 text-base leading-relaxed font-sans">
            Central India and the northern Western Ghats hold the most vital gene pool of Panthera tigris tigris in the world. By hyper-focusing exclusively on these 14 reserves, we maintain intimate relationships with local forest rangers, village eco-development committees, and certified naturalists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-forest text-sand text-xs font-bold rounded-full uppercase tracking-wider">
                Madhya Pradesh
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest">The Tiger State</h3>
            </div>
            <p className="text-forest/70 text-sm leading-relaxed mb-6">
              Home to nearly 800 wild tigers across Kanha's sprawling grasslands, Bandhavgarh's fortress cliffs, Pench's teak hills, and Panna's remarkable conservation revival.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Kanha', 'Bandhavgarh', 'Pench (MP)', 'Satpura', 'Panna', 'Sanjay Dubri', 'Madhav'].map((name, i) => (
                <span key={i} className="px-3 py-1 bg-sand rounded-lg text-forest font-semibold border border-forest/10">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-earth text-sand text-xs font-bold rounded-full uppercase tracking-wider">
                Maharashtra
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest">The Sahyadri & Vidarbha Bastions</h3>
            </div>
            <p className="text-forest/70 text-sm leading-relaxed mb-6">
              From Tadoba's legendary dry deciduous valleys to the mist of Melghat and the biodiversity of Sahyadri. A dynamic terrain of community reserves and buffer stewardship.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Tadoba', 'Pench (MH)', 'Melghat', 'Navegaon-Nagzira', 'Sahyadri', 'Bor', 'Umred Karhandla'].map((name, i) => (
                <span key={i} className="px-3 py-1 bg-sand rounded-lg text-forest font-semibold border border-forest/10">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE GUILD OF LOCAL NATURALISTS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-forest/15 h-96">
            <img
              src="/assets/img/tadoba-str-guide.jpg"
              alt="Local Naturalist in Forest"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-earth font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4 text-gold" />
              <span>Section V — Community Empowerment</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-forest font-bold leading-tight">
              The Guild of Indigenous Trackers & Naturalists
            </h2>
            <p className="text-forest/80 text-base leading-relaxed font-sans">
              The true custodians of these forests are the Gond, Baiga, and Korku tribal communities whose ancestors walked beside tigers for millennia. Every safari booked through Shutter And Stripes directly enlists and compensates trained local guides and drivers.
            </p>
            <p className="text-forest/80 text-base leading-relaxed font-sans">
              They read pugmarks dried by the sun, distinguish between the distress bark of a sambar and the casual chitter of a langur, and bring the jungle alive with unwritten oral history.
            </p>
            <div className="pt-2">
              <Link
                to="/responsible-tourism"
                className="inline-flex items-center space-x-2 text-forest font-bold text-xs uppercase tracking-wider hover:text-gold transition"
              >
                <span>Read our Community Benefit Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ETHICAL CODE OF CONDUCT */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-sand-light p-8 sm:p-12 rounded-3xl border border-forest/15">
          <div className="max-w-2xl mb-8">
            <h2 className="font-serif text-3xl font-bold text-forest mb-2">
              The Shutter And Stripes Field Code
            </h2>
            <p className="text-forest/70 text-sm">
              Non-negotiable ethical agreements upheld on every expedition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-forest/10 space-y-2">
              <span className="font-serif text-2xl font-bold text-forest block">20m</span>
              <h4 className="font-bold text-forest text-sm">Minimum Stand-off</h4>
              <p className="text-forest/70 text-xs leading-relaxed">
                Vehicles must maintain at least 20 meters from any moving predator without blocking paths.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-forest/10 space-y-2">
              <span className="font-serif text-2xl font-bold text-forest block">0 dB</span>
              <h4 className="font-bold text-forest text-sm">Engine Silence</h4>
              <p className="text-forest/70 text-xs leading-relaxed">
                Engines are cut when stationary at animal sightings. Whispers only; no standing on seats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-forest/10 space-y-2">
              <span className="font-serif text-2xl font-bold text-forest block">100%</span>
              <h4 className="font-bold text-forest text-sm">Zero Plastic Left</h4>
              <p className="text-forest/70 text-xs leading-relaxed">
                All vehicles carry metal flasks. Single-use plastics are strictly prohibited inside reserves.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-forest/10 space-y-2">
              <span className="font-serif text-2xl font-bold text-forest block">Fair</span>
              <h4 className="font-bold text-forest text-sm">Direct Driver Wages</h4>
              <p className="text-forest/70 text-xs leading-relaxed">
                Drivers and guides are paid directly with transparent premiums above statutory base rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8. CALL TO EXPEDITION */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest text-sand p-10 sm:p-16 rounded-3xl relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="relative z-10 space-y-6">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">
              Join the Expedition
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to Experience the Forest as It Was Meant to Be?
            </h2>
            <p className="text-sand/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Explore our 14 destinations, inspect verified permit slots, or consult with our lead naturalists for a tailored multi-reserve safari.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/destinations"
                className="w-full sm:w-auto px-8 py-3.5 bg-gold text-forest rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gold/90 transition shadow-lg"
              >
                Discover the 14 Reserves
              </Link>
              <Link
                to="/booking"
                className="w-full sm:w-auto px-8 py-3.5 border border-sand/30 text-sand rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-white/10 transition"
              >
                Open Booking Wizard
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
export default OurStoryPage;
