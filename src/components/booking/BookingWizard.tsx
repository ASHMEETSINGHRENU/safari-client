import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Clock, Car, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight,
  Download, Sparkles, ShieldCheck
} from 'lucide-react';
import { Destination, Safari, Booking } from '../../types';
import { destinationService, safariService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { inr, tierPrice, packageFromOf } from '../../lib/site';

export const BookingWizard: React.FC<{ initialSafariSlug?: string }> = ({ initialSafariSlug }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Data sources
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [safaris, setSafaris] = useState<Safari[]>([]);

  // Booking Form State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedSafari, setSelectedSafari] = useState<Safari | null>(null);
  const [safariDate, setSafariDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('Morning');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Open 4x4 Safari Jeep');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [naturalistRequested, setNaturalistRequested] = useState<boolean>(true);
  const [selectedPackageLabel, setSelectedPackageLabel] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'India',
    idType: 'Aadhaar Card / Passport',
    idNumber: '',
    specialRequests: ''
  });

  // Load initial destinations and safaris
  useEffect(() => {
    destinationService.getAll().then(data => {
      setDestinations(data);
      const destQuery = searchParams.get('destination');
      if (destQuery) {
        const found = data.find(d => d.slug === destQuery);
        if (found) {
          setSelectedDestination(found);
          if (found.zones.length > 0) setSelectedZone(found.zones[0].name);
        }
      }
    });

    safariService.getAll().then(data => {
      setSafaris(data);
      if (initialSafariSlug) {
        const foundSafari = data.find(s => s.slug === initialSafariSlug);
        if (foundSafari) {
          setSelectedSafari(foundSafari);
          setSelectedSlot(foundSafari.slot);
        }
      }
    });
  }, [searchParams, initialSafariSlug]);

  // When destination changes, update available zones
  useEffect(() => {
    if (selectedDestination && selectedDestination.zones.length > 0 && !selectedZone) {
      setSelectedZone(selectedDestination.zones[0].name);
    }
  }, [selectedDestination]);

  // Filter safaris for chosen destination
  const availableSafaris = selectedDestination 
    ? safaris.filter(s => s.destinationSlug === selectedDestination.slug)
    : safaris;

  // Package pricing. Permits, vehicle, guide and forest dues are bundled inside the
  // package tiers \u2014 never itemised. The server recomputes this total authoritatively.
  const packages = selectedDestination?.packages ?? [];
  const selectedPackage =
    packages.find(t => t.label === selectedPackageLabel) ?? packages[0];
  const perPerson = selectedPackage?.min ?? (selectedDestination?.startingPrice ?? 0);
  const totalAmount = perPerson * Math.max(adults, 1) + Math.round(perPerson * 0.5) * children;

  const handleNext = () => {
    setError(null);
    if (step === 1 && !selectedDestination) {
      setError('Please select a tiger reserve to proceed.');
      return;
    }
    if (step === 1 && !selectedSafari) {
      // Default to first available
      if (availableSafaris.length > 0) {
        setSelectedSafari(availableSafaris[0]);
      } else {
        setError('No safari packages available for this destination.');
        return;
      }
    }
    if (step === 2 && !safariDate) {
      setError('Please select a valid safari date.');
      return;
    }
    if (step === 3 && (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone)) {
      setError('Please enter your full name, email, and contact number.');
      return;
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        destination: selectedDestination?._id,
        destinationName: selectedDestination?.name || 'Central India Reserve',
        safari: selectedSafari?._id,
        safariName: selectedSafari?.name || 'Exclusive Wilderness Safari',
        safariDate,
        slot: `${selectedSlot} Safari`,
        zone: selectedZone || 'Core Sector',
        vehicleType: selectedVehicle,
        guests: { adults, children },
        naturalistRequested,
        customerInfo,
        packageLabel: selectedPackage?.label,
        // Indicative only — the server recomputes totalAmount from seeded package data.
        totalAmount,
        specialRequests: customerInfo.specialRequests
      };

      const res = await bookingService.create(payload);
      setConfirmedBooking(res);
      setStep(5);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Safari' },
    { num: 2, title: 'Trip' },
    { num: 3, title: 'Lead' },
    { num: 4, title: 'Confirm' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-sand border-2 border-forest/20 rounded-2xl shadow-xl overflow-hidden my-8">
      {/* Stepper Header */}
      <div className="bg-forest text-sand p-6 border-b border-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] tracking-widest-safari uppercase text-gold font-bold block">
              Official Permit Allocation
            </span>
            <h2 className="font-serif text-2xl font-bold text-sand mt-0.5">
              Safari Expedition Booking
            </h2>
          </div>
          <span className="text-xs bg-gold/20 text-gold border border-gold/40 px-3 py-1 rounded-full font-bold">
            Step {step === 5 ? 4 : step} of 4
          </span>
        </div>

        {/* Step Progress Line */}
        <div className="mt-6 flex items-center justify-between relative overflow-x-auto pb-2 scrollbar-none">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sand/20 -translate-y-1/2 z-0 hidden sm:block"></div>
          {stepsList.map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center flex-shrink-0 px-2 sm:px-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                (step === s.num || (step === 5 && s.num === 4))
                  ? 'bg-gold text-forest scale-110 shadow-lg ring-2 ring-gold/40' 
                  : step > s.num || step === 5
                    ? 'bg-sand text-forest' 
                    : 'bg-forest-deep text-sand/60 border border-sand/30'
              }`}>
                {step > s.num || step === 5 ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] mt-1 hidden sm:block whitespace-nowrap ${(step === s.num || (step === 5 && s.num === 4)) ? 'text-gold font-bold' : 'text-sand/60'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Body */}
      <div className="p-6 sm:p-8 bg-sand-light min-h-[380px]">
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE SAFARI (reserve + package) */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest">1. Choose Your Reserve</h3>
              <p className="text-xs text-forest/70">Select from our {destinations.length} official reserves across {[...new Set(destinations.map(d => d.state))].join(' and ')}.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {destinations.map(d => {
                const isSelected = selectedDestination?.slug === d.slug;
                return (
                  <div
                    key={d.slug}
                    onClick={() => {
                      setSelectedDestination(d);
                      setSelectedSafari(null);
                      setSelectedPackageLabel('');
                      if (d.zones.length > 0) setSelectedZone(d.zones[0].name);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected 
                        ? 'border-forest bg-forest text-sand shadow-md' 
                        : 'border-forest/20 bg-sand hover:border-gold hover:bg-sand/60'
                    }`}
                  >
                    <img src={d.heroImage} alt={d.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
                    <div className="overflow-hidden">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-gold' : 'text-earth'}`}>
                        {d.state}
                      </span>
                      <h4 className="font-serif text-sm font-bold truncate">{d.name}</h4>
                      <span className="text-[11px] block text-sand/80">Packages from {inr(packageFromOf(d))}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedDestination && (
              <div className="space-y-3 animate-fadeIn">
                <h4 className="font-serif text-lg font-bold text-forest">2. Choose Safari &amp; Package for {selectedDestination.name}</h4>
                {availableSafaris.map(s => {
                  const isSelected = selectedSafari?.slug === s.slug;
                  return (
                    <div
                      key={s.slug}
                      onClick={() => {
                        setSelectedSafari(s);
                        setSelectedSlot(s.slot);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected 
                          ? 'border-forest bg-forest text-sand shadow-lg ring-1 ring-gold' 
                          : 'border-forest/20 bg-sand hover:border-gold'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isSelected ? 'bg-gold text-forest' : 'bg-forest/10 text-forest'}`}>
                            {s.safariType}
                          </span>
                          <span className="text-xs opacity-75">{s.duration}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold mt-1">{s.name}</h4>
                        <p className={`text-xs mt-1 max-w-lg ${isSelected ? 'text-sand/80' : 'text-forest/70'}`}>{s.description}</p>
                      </div>
                      <div className="sm:text-right sm:self-center">
                        <span className="text-xs opacity-75 block">{s.duration}</span>
                        <span className="text-[11px] opacity-70 block mt-0.5">Priced by package below</span>
                      </div>
                    </div>
                  );
                })}

                {/* Whole-package tier: accommodation, safaris, vehicle, guide and permits bundled */}
                <div className="pt-4 border-t border-forest/15 space-y-3">
                  <h4 className="font-serif font-bold text-forest text-sm">3. Choose Your All-Inclusive Package</h4>
                  {selectedDestination?.packages?.length ? (
                    <div className="space-y-2">
                      {selectedDestination.packages.map(t => {
                        const isTier = selectedPackageLabel === t.label;
                        return (
                          <div
                            key={t.label}
                            onClick={() => setSelectedPackageLabel(t.label)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isTier ? 'border-gold bg-gold/10 ring-1 ring-gold' : 'border-forest/20 bg-sand hover:border-gold/60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-forest text-sm">{t.label}</span>
                            <span className="font-serif font-bold text-forest text-sm">
                              {tierPrice(t)}
                              <span className="text-[10px] font-sans text-forest/60 ml-1">per person</span>
                            </span>
                            </div>
                            {t.includes?.length ? (
                              <p className="text-[11px] text-forest/70 mt-1">{t.includes.join(' \u00b7 ')}</p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-forest/70 bg-sand border border-forest/15 rounded-xl p-3">
                      Package tiers for this reserve are on request. Submit the booking and our team will
                      confirm the all-inclusive quote before any payment.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: TRIP DETAILS (date + zone + slot + vehicle + guests) */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-forest">Trip Details</h3>

            {/* Date */}
            <div className="bg-sand p-6 rounded-xl border border-forest/20 max-w-md">
              <label className="block text-xs font-bold text-forest mb-2">DATE OF SAFARI</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={safariDate}
                onChange={(e) => setSafariDate(e.target.value)}
                className="w-full p-3 rounded-lg border border-forest/30 bg-sand-light font-medium text-forest focus:outline-none focus:border-forest"
              />
              <p className="text-[11px] text-forest/70 mt-3 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-earth" />
                Permits are synchronized with the Forest Department booking system. Core zones in MP are closed on Wednesday afternoons.
              </p>
            </div>

            {/* Zone */}
            <div>
              <h4 className="font-bold text-forest text-sm mb-3">Safari Sector / Zone</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedDestination?.zones.map(z => {
                  const isSelected = selectedZone === z.name;
                  return (
                    <div
                      key={z.name}
                      onClick={() => setSelectedZone(z.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-forest bg-forest text-sand shadow-md' 
                          : 'border-forest/20 bg-sand hover:border-gold'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          z.type === 'core' ? 'bg-amber-600/30 text-amber-900 border border-amber-500/40' : 'bg-emerald-600/30 text-emerald-900 border border-emerald-500/40'
                        }`}>
                          {z.type.toUpperCase()} ZONE
                        </span>
                        {z.gates && z.gates.length > 0 && (
                          <span className="text-[10px] opacity-75">{z.gates[0]}</span>
                        )}
                      </div>
                      <h4 className="font-serif text-base font-bold mt-2">{z.name}</h4>
                      {z.highlight && (
                        <p className={`text-xs mt-1 ${isSelected ? 'text-sand/80' : 'text-forest/70'}`}>{z.highlight}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slot */}
            <div>
              <h4 className="font-bold text-forest text-sm mb-3">Safari Timing / Slot</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                {[
                  { slot: 'Morning', hours: '06:00 AM – 10:00 AM', desc: 'First tracks, golden dawn mist, high predator activity.' },
                  { slot: 'Afternoon', hours: '02:30 PM – 06:30 PM', desc: 'Waterhole vigilance, rim lighting, evening territorial patrols.' },
                ].map(item => {
                  const isSelected = selectedSlot === item.slot;
                  return (
                    <div
                      key={item.slot}
                      onClick={() => setSelectedSlot(item.slot)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-forest bg-forest text-sand shadow-md' 
                          : 'border-forest/20 bg-sand hover:border-gold'
                      }`}
                    >
                      <Clock className={`w-5 h-5 ${isSelected ? 'text-gold' : 'text-earth'}`} />
                      <h4 className="font-serif text-base font-bold mt-2">{item.slot} Safari</h4>
                      <span className="text-xs font-semibold block text-gold mt-0.5">{item.hours}</span>
                      <p className={`text-xs mt-1 ${isSelected ? 'text-sand/80' : 'text-forest/70'}`}>{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicle */}
            <div>
              <h4 className="font-bold text-forest text-sm mb-3">Vehicle</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Open 4x4 Safari Jeep', capacity: 'Up to 6 guests', desc: 'The gold standard of Indian jungle safaris. Open top, rugged suspension, exceptional 360-degree photography angles.' },
                  { name: 'Modified Photography Safari Vehicle', capacity: 'Up to 3 photographers', desc: 'Customized safari vehicle with beanbag railings, inverter charging ports, and low-angle vantage setups.' }
                ].map(v => {
                  const isSelected = selectedVehicle === v.name;
                  return (
                    <div
                      key={v.name}
                      onClick={() => setSelectedVehicle(v.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-forest bg-forest text-sand shadow-md' 
                          : 'border-forest/20 bg-sand hover:border-gold'
                      }`}
                    >
                      <Car className={`w-5 h-5 ${isSelected ? 'text-gold' : 'text-earth'}`} />
                      <h4 className="font-serif text-base font-bold mt-2">{v.name}</h4>
                      <span className="text-xs font-semibold text-gold block">{v.capacity}</span>
                      <p className={`text-xs mt-1 ${isSelected ? 'text-sand/80' : 'text-forest/70'}`}>{v.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guests + naturalist */}
            <div className="bg-sand p-6 rounded-xl border border-forest/20 space-y-6 max-w-lg">
              <h4 className="font-bold text-forest text-sm">Guests &amp; Naturalist</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">Adults (Age 12+)</span>
                  <span className="text-xs text-forest/70">Permit quota applies per seat</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded bg-forest text-sand font-bold"
                  >-</button>
                  <span className="font-serif text-lg font-bold w-6 text-center">{adults}</span>
                  <button 
                    onClick={() => setAdults(prev => Math.min(6, prev + 1))}
                    className="w-8 h-8 rounded bg-forest text-sand font-bold"
                  >+</button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-forest/15 pt-4">
                <div>
                  <span className="font-bold text-sm block">Children (Under 12)</span>
                  <span className="text-xs text-forest/70">Free entry under 5; permit required for 5–12</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded bg-forest text-sand font-bold"
                  >-</button>
                  <span className="font-serif text-lg font-bold w-6 text-center">{children}</span>
                  <button 
                    onClick={() => setChildren(prev => Math.min(4, prev + 1))}
                    className="w-8 h-8 rounded bg-forest text-sand font-bold"
                  >+</button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-forest/15 pt-4">
                <div>
                  <span className="font-bold text-sm block">Senior Forest Naturalist</span>
                  <span className="text-xs text-forest/70">Certified local tribal guide and pugmark tracker (+₹1,000)</span>
                </div>
                <input
                  type="checkbox"
                  checked={naturalistRequested}
                  onChange={(e) => setNaturalistRequested(e.target.checked)}
                  className="w-5 h-5 accent-forest rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LEAD TRAVELER DETAILS */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-forest">Lead Traveler and Government ID Details</h3>
            <p className="text-xs text-forest/70">State Forest Department rules mandate original photo IDs at the entry gate.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-sand p-6 rounded-xl border border-forest/20">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">FULL NAME (AS PER ID) *</label>
                <input
                  type="text"
                  required
                  value={customerInfo.fullName}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                  placeholder="e.g. Rohan Deshmukh"
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="rohan@example.com"
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">PHONE NUMBER (WITH COUNTRY CODE) *</label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">COUNTRY OF RESIDENCE</label>
                <input
                  type="text"
                  value={customerInfo.country}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">ID DOCUMENT TYPE</label>
                <select
                  value={customerInfo.idType}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, idType: e.target.value })}
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                >
                  <option value="Aadhaar Card">Aadhaar Card (Indian National)</option>
                  <option value="Passport">Passport (International National)</option>
                  <option value="Voter ID">Voter ID Card</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">ID DOCUMENT NUMBER</label>
                <input
                  type="text"
                  value={customerInfo.idNumber}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, idNumber: e.target.value })}
                  placeholder="e.g. XXXX-XXXX-4819"
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-forest mb-1">SPECIAL REQUESTS / PHOTOGRAPHY GEAR</label>
                <textarea
                  rows={2}
                  value={customerInfo.specialRequests}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, specialRequests: e.target.value })}
                  placeholder="e.g. Bringing 400mm lens, require experienced driver for lighting alignment..."
                  className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-forest">Review and Confirm Your Safari</h3>
            <div className="bg-sand p-6 rounded-xl border border-forest/20 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-forest/60 block">DESTINATION RESERVE</span>
                  <strong className="text-sm font-serif text-forest">{selectedDestination?.name} ({selectedDestination?.state})</strong>
                </div>
                <div>
                  <span className="text-forest/60 block">PACKAGE and VEHICLE</span>
                  <strong className="text-forest">{selectedSafari?.name || 'Exclusive Wilderness Safari'}</strong>
                  <span className="block text-forest/70">{selectedVehicle}</span>
                </div>
                <div>
                  <span className="text-forest/60 block">DATE and TIME</span>
                  <strong className="text-forest">{safariDate} • {selectedSlot} Slot</strong>
                </div>
                <div>
                  <span className="text-forest/60 block">ZONE ALLOCATION</span>
                  <strong className="text-earth">{selectedZone}</strong>
                </div>
                <div>
                  <span className="text-forest/60 block">TRAVELERS</span>
                  <strong className="text-forest">{adults} Adults, {children} Children</strong>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-forest/15 md:pl-6 space-y-3 text-xs">
                <h4 className="font-serif font-bold text-forest text-sm">All-Inclusive Package Quote</h4>
                {selectedPackage ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-forest/10">
                      <span>{selectedPackage.label} Package (per person)</span>
                      <span className="font-semibold">{inr(selectedPackage.min)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-forest/10">
                      <span>Travelers</span>
                      <span className="font-semibold">
                        {Math.max(adults, 1)} adult{Math.max(adults, 1) === 1 ? '' : 's'}
                        {children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : ''}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 border-b border-forest/10">
                    <span>Package rate</span>
                    <span className="font-semibold">On request</span>
                  </div>
                )}
                <p className="text-[11px] text-forest/70 leading-snug">
                  Every package includes accommodation, all safari drives, reserve permits, the
                  vehicle, and a certified local naturalist guide. There are no separate permit or
                  guide charges.
                </p>
                <div className="flex justify-between pt-2 text-sm font-bold text-forest">
                  <span>Total Payable:</span>
                  <span className="text-gold font-serif text-lg">{inr(selectedPackage ? totalAmount : null)}</span>
                </div>
                <div className="bg-forest-deep text-sand p-3 rounded text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-gold font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant Forest Department Voucher</span>
                  </div>
                  <p className="text-sand/80">Permit reference generated immediately upon submission.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION / PERMIT */}
        {step === 5 && confirmedBooking && (
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest-safari text-earth font-bold block">
                Expedition Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest mt-1">
                Your Safari is Reserved!
              </h3>
              <p className="text-xs text-forest/70 max-w-md mx-auto mt-1">
                Official Forest Permit voucher has been dispatched to <strong>{confirmedBooking.customerInfo.email}</strong>.
              </p>
            </div>

            <div className="bg-sand border-2 border-dashed border-forest/30 p-6 rounded-xl max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center border-b border-forest/15 pb-2">
                <span className="text-xs text-forest/60 font-semibold">PERMIT REFERENCE</span>
                <span className="font-mono font-bold text-base text-forest bg-sand-light px-2 py-0.5 rounded border border-forest/20">
                  {confirmedBooking.bookingRef}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <div><strong>Reserve:</strong> {confirmedBooking.destinationName}</div>
                <div><strong>Date and Slot:</strong> {confirmedBooking.safariDate} ({confirmedBooking.slot})</div>
                <div><strong>Assigned Zone:</strong> {confirmedBooking.zone}</div>
                <div><strong>Lead Traveler:</strong> {confirmedBooking.customerInfo.fullName}</div>
                <div><strong>Amount Paid:</strong> ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button 
                onClick={() => navigate('/account')}
                className="px-5 py-2.5 bg-forest text-sand text-xs font-semibold rounded hover:bg-forest-light transition-colors"
              >
                View in My Account
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-sand border border-forest/30 text-forest text-xs font-semibold rounded hover:bg-gold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print Permit Slip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      {step < 5 && (
        <div className="p-4 sm:p-6 bg-sand border-t border-forest/15 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              step === 1 ? 'opacity-40 cursor-not-allowed text-forest/50' : 'text-forest hover:bg-forest/10 border border-forest/20'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-forest text-sand text-xs font-semibold rounded hover:bg-forest-light transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={loading}
              className="px-8 py-3 bg-gold text-forest text-sm font-bold rounded hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Confirming with Reserve Gate...' : 'Confirm and Issue Permit'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};