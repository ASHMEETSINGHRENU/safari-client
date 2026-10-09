import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ShieldCheck, 
  TreePine, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Dedicated Central Indian Wild</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-forest font-bold tracking-tight mb-6">
            Preserving Wild Habitats Through Conscious Exploration
          </h1>
          <p className="text-forest/80 text-lg sm:text-xl leading-relaxed font-sans max-w-2xl mx-auto">
            Shutter And Stripes was established to reconnect discerning travelers with the untamed heart of Indian tiger country with uncompromising ethics, local tribal mentorship, and precision logistics.
          </p>
        </div>

        {/* Brand Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest">100% Legitimate Forest Permits</h3>
            <p className="text-forest/70 text-sm leading-relaxed">
              We work strictly through official State Forest Department channels and NTCA allocation mechanisms. Every entry permit bears your verified identity document.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <TreePine className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest">Eco-Centric Vehicles</h3>
            <p className="text-forest/70 text-sm leading-relaxed">
              Our registered open 4x4 safari vehicles are maintained to low-emission benchmarks, outfitted with rubber bean-bag stabilizers, and operated by drivers certified in animal behavior.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <Users className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest">Tribal Community Empowerment</h3>
            <p className="text-forest/70 text-sm leading-relaxed">
              Over 70% of our on-ground expedition payroll goes directly to indigenous guides, drivers, and local homestays ringing the buffer forests.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="bg-forest text-sand rounded-3xl p-8 sm:p-16 mb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">
                Our Genesis
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
                From Field Campfire to Full Safari Platform
              </h2>
              <p className="text-sand/80 text-sm sm:text-base leading-relaxed mb-4">
                What began as a close-knit group of wildlife photographers documenting the tigresses of Tadoba and Bandhavgarh has evolved into India's most focused safari logistics platform.
              </p>
              <p className="text-sand/80 text-sm sm:text-base leading-relaxed mb-6">
                We observed that travelers often faced opaque permit markups, rushed jeeps, and chaotic booking queues. We built Shutter And Stripes to bring transparency, calm, and reverence back to the Indian safari.
              </p>
              <Link
                to="/our-story"
                className="inline-flex items-center space-x-2 text-gold font-bold text-xs uppercase tracking-wider hover:underline"
              >
                <span>Read the complete Our Story chapter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-sand/20 h-80 sm:h-96">
              <img
                src="/assets/img/Gallary/IMG_5233.webp"
                alt="Central Indian Safari Habitat"
                className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-24">
          <div className="bg-white p-6 rounded-2xl border border-forest/10">
            <span className="font-serif text-4xl font-bold text-forest block mb-1">14</span>
            <span className="text-xs uppercase font-bold text-forest/60">Protected Sanctuaries</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-forest/10">
            <span className="font-serif text-4xl font-bold text-forest block mb-1">80+</span>
            <span className="text-xs uppercase font-bold text-forest/60">Certified Field Guides</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-forest/10">
            <span className="font-serif text-4xl font-bold text-forest block mb-1">4,200+</span>
            <span className="text-xs uppercase font-bold text-forest/60">Ethical Safaris Led</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-forest/10">
            <span className="font-serif text-4xl font-bold text-forest block mb-1">0 dB</span>
            <span className="text-xs uppercase font-bold text-forest/60">Target Noise Policy</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h3 className="font-serif text-2xl font-bold text-forest">Ready to Experience the Forest?</h3>
          <p className="text-forest/70 text-sm">
            Browse our reserves or initiate your booking permit verification today.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/destinations"
              className="px-6 py-3 bg-forest text-sand rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-forest/90 transition shadow"
            >
              Explore Reserves
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-forest/20 text-forest rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition"
            >
              Contact Our Naturalists
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AboutPage;
