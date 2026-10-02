import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { cmsService } from '../../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await cmsService.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Could not subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-forest text-sand pt-16 pb-10 border-t-2 border-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-sand/15">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/assets/logo/logo.png" alt="Shutter and Stripes" className="h-11 w-auto object-contain shrink-0" />
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-sand block">
                  SHUTTER <span className="text-gold font-normal lowercase">and</span> STRIPES
                </span>
                <span className="text-[10px] tracking-widest-safari uppercase text-sand/70 block mt-0.5">
                  Guided By Locals • Inspired By Nature
                </span>
              </div>
            </div>

            <p className="text-sand/80 text-sm leading-relaxed max-w-sm">
              Dedicated to ethical, low-impact wildlife expeditions across the legendary tiger heartlands of Madhya Pradesh and Maharashtra. Championing local naturalist mastery and responsible conservation photography.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-sand/80">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-2 bg-sand/5 rounded-full hover:bg-sand/10" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-2 bg-sand/5 rounded-full hover:bg-sand/10" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-2 bg-sand/5 rounded-full hover:bg-sand/10" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 1: Destinations */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold mb-4 uppercase tracking-wider text-xs">
              Reserves and Parks
            </h4>
            <ul className="space-y-2.5 text-sm text-sand/80">
              <li><Link to="/destinations/tadoba-andhari" className="hover:text-gold transition-colors">Tadoba-Andhari (MH)</Link></li>
              <li><Link to="/destinations/bandhavgarh" className="hover:text-gold transition-colors">Bandhavgarh (MP)</Link></li>
              <li><Link to="/destinations/kanha" className="hover:text-gold transition-colors">Kanha National Park (MP)</Link></li>
              <li><Link to="/destinations/pench-mp" className="hover:text-gold transition-colors">Pench (Madhya Pradesh)</Link></li>
              <li><Link to="/destinations/pench-mh" className="hover:text-gold transition-colors">Pench (Maharashtra)</Link></li>
              <li><Link to="/destinations/satpura" className="hover:text-gold transition-colors">Satpura Wilderness (MP)</Link></li>
              <li><Link to="/destinations" className="text-gold hover:underline flex items-center gap-1 text-xs pt-1">View All Reserves →</Link></li>
            </ul>
          </div>

          {/* Column 2: Navigation and Discovery */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold mb-4 uppercase tracking-wider text-xs">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-sand/80">
              <li><Link to="/safaris" className="hover:text-gold transition-colors">Safari Packages</Link></li>
              <li><Link to="/map" className="hover:text-gold transition-colors">Interactive Reserve Map</Link></li>
              <li><Link to="/compare" className="hover:text-gold transition-colors">Compare Reserves</Link></li>
              <li><Link to="/how-it-works" className="hover:text-gold transition-colors">How Booking Works</Link></li>
              <li><Link to="/our-story" className="hover:text-gold transition-colors">Our Story and Philosophy</Link></li>
              <li><Link to="/journal" className="hover:text-gold transition-colors">Wildlife Journal</Link></li>
              <li><Link to="/gallery" className="hover:text-gold transition-colors">Photography Showcase</Link></li>
              <li><Link to="/responsible-tourism" className="hover:text-gold transition-colors">Ethical Tourism Rules</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter and Inquiries */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold mb-4 uppercase tracking-wider text-xs">
              Wildlife Gazette
            </h4>
            <p className="text-xs text-sand/75 mb-3 leading-relaxed">
              Seasonal tracking notes, permit opening alerts, and conservation updates delivered monthly.
            </p>
            {subscribed ? (
              <div className="bg-sand/10 border border-gold/40 text-gold text-xs p-3 rounded flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Thank you. You are subscribed to the Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-forest-deep border border-sand/25 rounded px-3 py-2 text-xs text-sand placeholder-sand/50 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 p-1 bg-gold text-forest rounded hover:bg-gold-light transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && (
                  <p role="alert" className="text-[11px] text-red-300 leading-snug">{error}</p>
                )}
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-sand/15 text-xs text-sand/70 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>+91 (0) 712 258 4930</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>concierge@shutterandstripes.com</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <span>Civil Lines, Nagpur, MH (Central India)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand/60 gap-4">
          <p>
            © {new Date().getFullYear()} SHUTTER AND STRIPES Expeditions Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/faqs" className="hover:text-gold transition-colors">FAQs</Link>
            <Link to="/contact" className="hover:text-gold transition-colors">Contact Concierge</Link>
            <Link to="/responsible-tourism" className="hover:text-gold transition-colors">Park Guidelines</Link>
            <Link to="/about" className="hover:text-gold transition-colors">About Company</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
