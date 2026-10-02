import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  TreePine, 
  Heart, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ResponsibleTourismPage: React.FC = () => {
  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Conservation First Policy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-forest font-bold tracking-tight mb-6">
            The Shutter And Stripes Responsible Tourism Charter
          </h1>
          <p className="text-forest/80 text-lg sm:text-xl leading-relaxed font-sans max-w-2xl mx-auto">
            Tourism in tiger habitats is a privilege, not an entitlement. We believe that every safari must generate measurable benefits for the jungle, its apex predators, and surrounding forest villages.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <Camera className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest">
              1. Non-Intrusive Wildlife Photography
            </h2>
            <p className="text-forest/70 text-sm leading-relaxed">
              We prohibit the use of playback animal calls to provoke reactions, artificial flash at dawn or dusk, and drones anywhere near reserve perimeters.
            </p>
            <ul className="space-y-2 text-xs text-forest/80 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>20-meter minimum buffer from any predator.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Jeep engines cut off immediately during animal crossings.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Zero blocking of animal migration routes between waterholes.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <Users className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest">
              2. Fair Tribal Compensation
            </h2>
            <p className="text-forest/70 text-sm leading-relaxed">
              Forest guides and drivers are often the lowest-compensated tier in conventional safari operations. We guarantee direct wages 25% above official department base rates.
            </p>
            <ul className="space-y-2 text-xs text-forest/80 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Direct wire payouts without middlemen commissions.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Annual gear provisioning: binoculars, field uniforms, field guides.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>English and scientific terminology training workshops.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <TreePine className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest">
              3. Zero Single-Use Plastics
            </h2>
            <p className="text-forest/70 text-sm leading-relaxed">
              Discarded plastic bottles and wrappers are lethal hazards to herbivores like chital and sambar. All Shutter And Stripes safaris operate with copper and steel flasks.
            </p>
            <ul className="space-y-2 text-xs text-forest/80 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Insulated steel canisters provided at every morning departure.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Reusable canvas packaging for bush breakfast snacks.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Mandatory vehicle litter bag for immediate pack-in, pack-out.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest/15 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest">
              4. NTCA and Forest Department Alignment
            </h2>
            <p className="text-forest/70 text-sm leading-relaxed">
              We respect carrying capacity quotas established by the National Tiger Conservation Authority. We do not lobby for unauthorized extra vehicle permits into fragile core zones.
            </p>
            <ul className="space-y-2 text-xs text-forest/80 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Equal promotion of buffer zones to relieve pressure on core habitats.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Strict adherence to 20 km/h forest speed restrictions.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                <span>Immediate reporting of injured wildlife or snare traps to rangers.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* The Pledge Banner */}
        <div className="bg-forest text-sand p-8 sm:p-12 rounded-3xl text-center max-w-3xl mx-auto space-y-4">
          <Heart className="w-10 h-10 text-gold mx-auto" />
          <h2 className="font-serif text-3xl font-bold">The Traveler's Sacred Pledge</h2>
          <p className="text-sand/80 text-sm sm:text-base leading-relaxed italic font-serif">
            "I step into the forest as a guest in another creature's sovereign home. I will honor silence, celebrate the smallest insect alongside the tiger, leave no trace of my passing, and respect the ancient wisdom of my tribal guides."
          </p>
          <div className="pt-4">
            <Link
              to="/destinations"
              className="px-6 py-3 bg-gold text-forest rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gold/90 transition inline-block shadow-lg"
            >
              Explore Conscious Safaris
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ResponsibleTourismPage;
