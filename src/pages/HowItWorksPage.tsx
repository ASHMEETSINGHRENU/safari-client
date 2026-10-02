import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Reserve and Safari Category',
      desc: 'Browse our reserves across Madhya Pradesh and Maharashtra. Select between classic Open Safari Jeeps, full-day dawn-to-dusk photographic permits, or serene buffer night drives.'
    },
    {
      num: '02',
      title: 'Submit Traveler ID Verification',
      desc: 'Under strict NTCA guidelines, safari permits are non-transferable and require authentic government identification (Aadhaar / Voter ID / Passport for foreign nationals).'
    },
    {
      num: '03',
      title: 'Official Department Permit Issuance',
      desc: 'Our team secures official state forest department quota permits for your chosen gate and zone, locking in your vehicle allotment and official entry pass.'
    },
    {
      num: '04',
      title: 'Dedicated Tracker and Safari Vehicle Allocation',
      desc: 'We match your vehicle with an experienced local tribal naturalist and certified driver, ensuring your 4x4 safari vehicle is equipped with photo bean-bag rests.'
    },
    {
      num: '05',
      title: 'Gate Check-in and Forest Entry',
      desc: 'On safari morning, your driver arrives at your lodge 30 minutes prior to gate opening. Present your original ID at the forest checkpoint, and enter as the dawn mist clears.'
    },
    {
      num: '06',
      title: 'Ethical Tracking and Silent Observation',
      desc: 'Experience pure tracking based on pugmarks, bird alarms, and deer distress calls. Engines cut during sightings to ensure animal peace and prime audio recording.'
    }
  ];

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Permit and Expedition Protocol</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest font-bold tracking-tight mb-4">
            How Safari Booking Works
          </h1>
          <p className="text-forest/80 text-base sm:text-lg leading-relaxed font-sans">
            Indian tiger reserves maintain stringent carrying capacities and identity checks. Here is a clear, transparent walkthrough of how your expedition is secured and executed.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-3xl border border-forest/10 shadow-sm relative group hover:border-gold/40 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-4xl font-bold text-gold/60 block mb-4 group-hover:text-gold transition">
                  {s.num}
                </span>
                <h3 className="font-serif text-xl font-bold text-forest mb-2">
                  {s.title}
                </h3>
                <p className="text-forest/70 text-xs sm:text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-forest/5 flex items-center text-xs font-semibold text-forest/40 group-hover:text-forest transition">
                <span>Phase {s.num}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Essential Rules Callout */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-forest/15 shadow-sm max-w-4xl mx-auto mb-20 space-y-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-earth" />
            <h2 className="font-serif text-2xl font-bold text-forest">
              Crucial Forest Department Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-forest/80 leading-relaxed font-sans">
            <div className="space-y-2">
              <strong className="text-forest block font-semibold">1. Original ID is Mandatory:</strong>
              The name and document number on your booking permit must strictly match your physical ID card carried during the safari. Gate officers will reject discrepancies.
            </div>
            <div className="space-y-2">
              <strong className="text-forest block font-semibold">2. Zone Lock-in:</strong>
              Once issued, safari permits cannot be altered to a different zone or gate. We advise consulting our naturalists before confirming core versus buffer preferences.
            </div>
            <div className="space-y-2">
              <strong className="text-forest block font-semibold">3. Non-Transferable:</strong>
              Tiger safari permits cannot be resold or transferred to another traveler's name under NTCA regulations.
            </div>
            <div className="space-y-2">
              <strong className="text-forest block font-semibold">4. Wednesday Afternoon Closure:</strong>
              Most core zones across Madhya Pradesh tiger reserves remain closed to tourists on Wednesday afternoons for park rest and patrol.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h3 className="font-serif text-3xl font-bold text-forest">Begin Your Safari Application</h3>
          <p className="text-forest/70 text-sm">
            Launch our interactive booking wizard to secure your permits with zero upfront payment stress.
          </p>
          <div className="pt-2">
            <Link
              to="/booking"
              className="px-8 py-3.5 bg-forest text-sand rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-forest/90 transition shadow-lg inline-flex items-center space-x-2"
            >
              <span>Launch Booking Wizard</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default HowItWorksPage;
