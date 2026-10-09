import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight,
  Sparkles, ShieldCheck, Users
} from 'lucide-react';
import { Destination, Safari, Booking } from '../../types';
import { destinationService, safariService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { inr, tierPrice, packageFromOf, NATURALIST_FEE } from '../../lib/site';

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;


const SafariCalendar: React.FC<{ value: string; onSelect: (iso: string) => void }> = ({ value, onSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = value ? new Date(value + 'T00:00:00') : null;
  const [view, setView] = useState(() => ({ y: (picked ?? today).getFullYear(), m: (picked ?? today).getMonth() }));

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const canGoPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const shiftMonth = (delta: number) => {
    setView(v => {
      const m = v.m + delta;
      return m < 0 ? { y: v.y - 1, m: 11 } : m > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m };
    });
  };

  return (
    <div className="w-full max-w-sm bg-sand rounded-xl border border-forest/20 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-lg border border-forest/20 text-forest hover:bg-forest hover:text-sand transition-colors flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-serif font-bold text-forest text-sm">{monthLabel}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="w-8 h-8 rounded-lg border border-forest/20 text-forest hover:bg-forest hover:text-sand transition-colors flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-forest/60 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const disabled = day < today;
          const isSelected = picked && isSameDay(day, picked);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(isoOf(day))}
              className={`h-9 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-forest text-sand font-bold shadow-md'
                  : isToday
                    ? 'border border-gold text-forest'
                    : disabled
                      ? 'text-forest/25 cursor-not-allowed'
                      : 'text-forest hover:bg-gold/20'
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-forest/60 mt-3 text-center">Core zones in MP close Wednesday afternoons.</p>
    </div>
  );
};

// ponytail: sessionStorage draft so a reload or route bounce doesn't wipe wizard selections.
const DRAFT_KEY = 'bookingDraft';
const readDraft = (): any => {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
  } catch {
    return null;
  }
};

export const BookingWizard: React.FC<{ initialSafariSlug?: string }> = ({ initialSafariSlug }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [draft] = useState(readDraft);

  const [step, setStep] = useState(() => Math.min(draft?.step ?? 1, 4));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Data sources
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [safaris, setSafaris] = useState<Safari[]>([]);

  // Booking Form State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(draft?.selectedDestination ?? null);
  const [selectedSafari, setSelectedSafari] = useState<Safari | null>(draft?.selectedSafari ?? null);
  const [safariDate, setSafariDate] = useState<string>(() => {
    if (draft?.safariDate) return draft.safariDate;
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [selectedZone, setSelectedZone] = useState<string>(draft?.selectedZone ?? '');
  const [selectedVehicle, setSelectedVehicle] = useState<string>(draft?.selectedVehicle ?? 'Open 4x4 Safari Jeep');
  const [adults, setAdults] = useState<number>(draft?.adults ?? 2);
  const [children, setChildren] = useState<number>(draft?.children ?? 0);
  const [naturalistRequested, setNaturalistRequested] = useState<boolean>(draft?.naturalistRequested ?? true);
  const [selectedPackageLabel, setSelectedPackageLabel] = useState<string>(draft?.selectedPackageLabel ?? '');
  // Step 2 shows the date picker first; it collapses into a chip once confirmed.
  const [confirmed, setConfirmed] = useState(() => ({
    date: false,
    ...(draft?.confirmed ?? {})
  }));
  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'India',
    idType: 'Aadhaar Card / Passport',
    idNumber: '',
    specialRequests: ''
  });
  const [guestDetails, setGuestDetails] = useState<{ fullName: string; idType: string; idNumber: string }[]>([]);

  useEffect(() => {
    const baseAdults = Math.max(adults || 1, 1);
    const target = baseAdults + (children || 0) - 1;
    setGuestDetails(prev =>
      Array.from({ length: Math.max(target, 0) }, (_, i) =>
        prev[i] ?? { fullName: '', idType: 'Aadhaar Card', idNumber: '' }
      )
    );
  }, [adults, children]);

  useEffect(() => {
    if (confirmedBooking) {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      step, selectedDestination, selectedSafari, safariDate, selectedZone,
      selectedVehicle, adults, children, naturalistRequested,
      selectedPackageLabel, confirmed
    }));
  }, [confirmedBooking, step, selectedDestination, selectedSafari, safariDate,
      selectedZone, selectedVehicle, adults, children,
      naturalistRequested, selectedPackageLabel, confirmed]);

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
          setSelectedVehicle(foundSafari.vehicle || 'Open 4x4 Safari Jeep');
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
  const totalAmount =
    perPerson * Math.max(adults, 1) +
    Math.round(perPerson * 0.5) * children +
    (naturalistRequested ? NATURALIST_FEE : 0);

  const validateField = (key: string, value: string) => {
    if (key === 'fullName') return value.trim().length >= 3 ? '' : "Enter the traveler's full name (as per ID).";
    if (key === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.';
    if (key === 'phone') return /^\+?\d[\d\s-]{7,14}\d$/.test(value.trim()) ? '' : 'Enter a valid number with country code, e.g. +91 98765 43210.';
    if (key === 'idNumber') return value.trim().length >= 4 ? '' : "Enter the lead traveler's ID number (as per the document).";
    return '';
  };
  const showError = (key: string) => (attempted || touched[key]) && validateField(key, customerInfo[key]);
  const inputCls = (key: string, extra = '') =>
    `w-full p-2.5 rounded border text-xs focus:outline-none focus:ring-2 focus:ring-gold/40 ${extra} ${
      showError(key) ? 'border-red-500/70 bg-rose-50 text-forest' : 'border-forest/30 bg-sand-light text-forest'
    }`;
  const fieldError = (key: string) =>
    showError(key) ? (
      <p className="flex items-start gap-1 text-[11px] text-red-600 mt-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
        {validateField(key, customerInfo[key])}
      </p>
    ) : null;
  const updateGuest = (i: number, field: 'fullName' | 'idType' | 'idNumber', value: string) =>
    setGuestDetails(prev => prev.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)));
  const guestInputCls = (bad: boolean) =>
    `w-full p-2.5 rounded border text-xs focus:outline-none focus:ring-2 focus:ring-gold/40 ${
      bad ? 'border-red-500/70 bg-rose-50 text-forest' : 'border-forest/30 bg-sand-light text-forest'
    }`;
  const sanitizeInput = (key: string, value: string) => {
    if (key === 'fullName') return value.replace(/[^A-Za-z\s.'-]/g, '').slice(0, 64);
    if (key === 'email') return value.replace(/\s+/g, '').slice(0, 254);
    if (key === 'phone') return value.replace(/[^\d+\s-]/g, '').slice(0, 16);
    if (key === 'idNumber') return value.replace(/[^A-Za-z0-9]/g, '').slice(0, 20);
    return value;
  };

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
    if (step === 3) {
      const invalidLead = ['fullName', 'email', 'phone', 'idNumber'].some(k => validateField(k, customerInfo[k]));
      const invalidGuest = guestDetails.some(g => g.fullName.trim().length < 3 || g.idNumber.trim().length < 4);
      if (invalidLead || invalidGuest) {
        setAttempted(true);
        setError(invalidLead && invalidGuest
          ? 'Please fix the highlighted fields below.'
          : invalidLead
            ? 'Please fix the highlighted fields below.'
            : 'Enter the name and ID number for every traveler.');
        return;
      }
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
        zone: selectedZone || 'Core Sector',
        vehicleType: selectedVehicle,
        guests: { adults, children },
        guestDetails,
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Reserve' },
    { num: 2, title: 'Trip' },
    { num: 3, title: 'Details' },
    { num: 4, title: 'Review' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-sand border-2 border-forest/20 rounded-2xl shadow-xl overflow-hidden my-8">
      {/* Stepper Header */}
      <div className="bg-forest text-sand p-6 border-b border-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] tracking-widest-safari uppercase text-gold font-bold block">
              Booking Request
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

            {/* Reserve stage: pick a reserve, then collapse into a summary chip */}
            {!selectedDestination ? (
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
            ) : (
              <button
                type="button"
                onClick={() => { setSelectedDestination(null); setSelectedSafari(null); setSelectedPackageLabel(''); }}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 border-forest bg-forest text-sand shadow-md cursor-pointer hover:bg-forest-light transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={selectedDestination.heroImage} alt={selectedDestination.name} className="w-11 h-11 rounded-md object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedDestination.state}
                    </span>
                    <span className="font-serif text-sm font-bold block truncate">{selectedDestination.name}</span>
                    <span className="text-[11px] block text-sand/80">Packages from {inr(packageFromOf(selectedDestination))}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-gold border border-gold/40 px-2.5 py-1 rounded-lg flex-shrink-0">Change</span>
              </button>
            )}

            {/* Safari stage: pick a safari once the reserve is locked */}
            {selectedDestination && !selectedSafari && (
              <div className="space-y-3 animate-fadeIn">
                <h4 className="font-serif text-lg font-bold text-forest">2. Choose Your Safari</h4>
                {availableSafaris.map(s => {
                  return (
                    <div
                      key={s.slug}
                      onClick={() => {
                        setSelectedSafari(s);
                        setSelectedVehicle(s.vehicle || 'Open 4x4 Safari Jeep');
                      }}
                      className="p-4 rounded-xl border border-forest/20 bg-sand hover:border-gold cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest/10 text-forest">
                            {s.safariType}
                          </span>
                          <span className="text-xs opacity-75">{s.duration}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold mt-1">{s.name}</h4>
                        <p className="text-xs mt-1 max-w-lg text-forest/70">{s.description}</p>
                      </div>
                      <div className="sm:text-right sm:self-center">
                        <span className="text-xs opacity-75 block">{s.duration}</span>
                        <span className="text-[11px] opacity-70 block mt-0.5">Priced by package below</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Safari summary chip once chosen */}
            {selectedDestination && selectedSafari && (
              <>
                <button
                  type="button"
                  onClick={() => { setSelectedSafari(null); setSelectedPackageLabel(''); }}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 border-forest bg-forest text-sand shadow-md cursor-pointer hover:bg-forest-light transition-all text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold text-forest flex-shrink-0">
                      {selectedSafari.safariType}
                    </span>
                    <span className="font-serif text-sm font-bold block truncate">{selectedSafari.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gold border border-gold/40 px-2.5 py-1 rounded-lg flex-shrink-0">Change</span>
                </button>

                {/* Package stage: pick the all-inclusive tier */}
                <div className="pt-4 border-t border-forest/15 space-y-3 animate-fadeIn">
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
              </>
            )}
          </div>
        )}

        {/* STEP 2: TRIP DETAILS (date + zone + slot + vehicle + guests) */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 animate-fadeIn">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-forest">Trip Details</h3>
              {confirmed.date && (
                <span className="text-[10px] uppercase font-bold text-earth flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Arranged for your safari
                </span>
              )}
            </div>

            {/* Date: pick from calendar then collapse */}
            {!confirmed.date ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-forest">DATE OF SAFARI</label>
                <SafariCalendar
                  value={safariDate}
                  onSelect={(iso) => { setSafariDate(iso); setConfirmed(c => ({ ...c, date: true })); }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmed(c => ({ ...c, date: false }))}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 border-forest bg-forest text-sand shadow-md cursor-pointer hover:bg-forest-light transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-md bg-forest-light flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gold" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Safari Date
                    </span>
                    <span className="font-serif text-sm font-bold block truncate">
                      {new Date(safariDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-gold border border-gold/40 px-2.5 py-1 rounded-lg flex-shrink-0">Change</span>
              </button>
            )}

            {/* Sector + vehicle ride along with your safari choice — assigned, not picked */}
            {confirmed.date && (
              <div className="bg-sand p-4 rounded-xl border border-forest/20 grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-earth block">Sector / Zone</span>
                  <span className="font-serif text-sm font-bold block truncate">{selectedZone || selectedDestination?.zones[0]?.name || 'Core Sector'}</span>
                  <span className="text-[11px] text-forest/70">
                    {selectedDestination?.zones.find(z => z.name === selectedZone)?.type.toUpperCase() ?? 'CORE'} ZONE · assigned by our team
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-earth block">Vehicle</span>
                  <span className="font-serif text-sm font-bold block truncate">{selectedVehicle}</span>
                  <span className="text-[11px] text-forest/70">
                    {selectedVehicle === 'Open 4x4 Safari Jeep' ? 'Up to 6 guests' : 'Up to 3 photographers'}
                  </span>
                </div>
              </div>
            )}

            {/* Guests + naturalist — the only remaining inputs on this step */}
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

            {/* Running booking summary — what's locked in so far */}
            <aside className="bg-[#232b18] rounded-xl border border-gold/30 shadow-lg p-5 text-sand space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold">Your Booking So Far</span>
                <ShieldCheck className="w-4 h-4 text-gold/70" />
              </div>

              <div className="flex items-center gap-3 min-w-0">
                {selectedDestination ? (
                  <img src={selectedDestination.heroImage} alt={selectedDestination.name} className="w-11 h-11 rounded-md object-cover flex-shrink-0" />
                ) : (
                  <span className="w-11 h-11 rounded-md bg-forest-light flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-gold/60" />
                  </span>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold/80 block">{selectedDestination?.state ?? 'Reserve'}</span>
                  <span className="font-serif text-sm font-bold block truncate">{selectedDestination?.name ?? 'Pick a reserve in step 1'}</span>
                  {selectedDestination && (
                    <span className="text-[11px] block text-sand/70">Packages from {inr(packageFromOf(selectedDestination))}</span>
                  )}
                </div>
              </div>

              {selectedSafari && (
                <>
                  <div className="h-px bg-gold/20" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/80 block">Safari</span>
                    <span className="text-sm font-semibold block">{selectedSafari.name}</span>
                    <span className="text-xs text-sand/70">{selectedSafari.safariType} · {selectedSafari.duration}</span>
                  </div>
                </>
              )}

              <div className="h-px bg-gold/20" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold/80 block">All-Inclusive Package</span>
                {selectedPackage ? (
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold">{selectedPackage.label}</span>
                    <span className="font-serif text-sm font-bold text-gold flex-shrink-0">{tierPrice(selectedPackage)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-sand/60">Set in step 1 — pick reserve &amp; safari first.</span>
                )}
              </div>

              {confirmed.date && (
                <div className="text-xs text-sand/80 space-y-1.5 border-t border-gold/20 pt-3">
                  <span className="flex justify-between gap-2"><span className="text-sand/60">Date</span><span className="text-right">{new Date(safariDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                  <span className="flex justify-between gap-2"><span className="text-sand/60">Zone</span><span className="text-right">{selectedZone || selectedDestination?.zones[0]?.name || 'Core Sector'}</span></span>
                  <span className="flex justify-between gap-2"><span className="text-sand/60">Vehicle</span><span className="text-right">{selectedVehicle}</span></span>
                </div>
              )}
            </aside>
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
                  onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: sanitizeInput('fullName', e.target.value) })}
                  onBlur={() => setTouched(t => ({ ...t, fullName: true }))}
                  placeholder="e.g. Rohan Deshmukh"
                  className={inputCls('fullName')}
                />
                {fieldError('fullName')}
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: sanitizeInput('email', e.target.value) })}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="rohan@example.com"
                  className={inputCls('email')}
                />
                {fieldError('email')}
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">PHONE NUMBER (WITH COUNTRY CODE) *</label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: sanitizeInput('phone', e.target.value) })}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  placeholder="+91 98765 43210"
                  className={inputCls('phone')}
                />
                {fieldError('phone')}
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
                <label className="block text-xs font-bold text-forest mb-1">ID DOCUMENT NUMBER <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  value={customerInfo.idNumber}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, idNumber: sanitizeInput('idNumber', e.target.value) })}
                  onBlur={() => setTouched(t => ({ ...t, idNumber: true }))}
                  placeholder="e.g. XXXX-XXXX-4819"
                  className={inputCls('idNumber')}
                />
                {fieldError('idNumber')}
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

            {guestDetails.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-forest block">OTHER TRAVELERS (ID REQUIRED AT GATE)</span>
                  <Users className="w-4 h-4 text-forest/50" />
                </div>
                <p className="text-[11px] text-forest/70 mb-3">
                  Forest Department rules mandate original photo IDs at the entry gate for every traveler.
                </p>
                <div className="space-y-3">
                  {guestDetails.map((g, i) => {
                    const baseAdults = Math.max(adults || 1, 1);
                    const adultSlots = baseAdults - 1;
                    const isChild = i >= adultSlots;
                    const label = isChild ? `Child ${i - adultSlots + 1}` : `Adult ${i + 2}`;
                    const nameKey = `g${i}.fullName`;
                    const idKey = `g${i}.idNumber`;
                    const nameBad = (attempted || touched[nameKey]) && g.fullName.trim().length < 3;
                    const idBad = (attempted || touched[idKey]) && g.idNumber.trim().length < 4;
                    return (
                      <div key={i} className={`bg-sand-light border rounded-lg p-3 ${nameBad || idBad ? 'border-red-400/60' : 'border-forest/15'}`}>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-forest/60 mb-2 block">{label} — Full Name &amp; Govt ID</span>
                        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1.2fr_1.5fr] gap-2 items-start">
                          <div>
                            <input
                              type="text"
                              value={g.fullName}
                              placeholder="Full name (as per ID)"
                              onChange={(e) => updateGuest(i, 'fullName', sanitizeInput('fullName', e.target.value))}
                              onBlur={() => setTouched(t => ({ ...t, [nameKey]: true }))}
                              className={guestInputCls(nameBad)}
                            />
                            {nameBad && <p className="text-[11px] text-red-600 mt-1">Enter traveler's full name.</p>}
                          </div>
                          <div>
                            <select
                              value={g.idType}
                              onChange={(e) => updateGuest(i, 'idType', e.target.value)}
                              className="w-full p-2.5 rounded border border-forest/30 bg-sand-light text-xs text-forest focus:outline-none"
                            >
                              <option value="Aadhaar Card">Aadhaar Card</option>
                              <option value="Passport">Passport</option>
                              <option value="Voter ID">Voter ID</option>
                              <option value="Driving License">Driving License</option>
                            </select>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={g.idNumber}
                              placeholder="ID number"
                              onChange={(e) => updateGuest(i, 'idNumber', sanitizeInput('idNumber', e.target.value))}
                              onBlur={() => setTouched(t => ({ ...t, [idKey]: true }))}
                              className={guestInputCls(idBad)}
                            />
                            {idBad && <p className="text-[11px] text-red-600 mt-1">Enter the ID number.</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-forest">Review and Confirm Your Safari</h3>

            <div className="rounded-2xl overflow-hidden border border-gold/30 shadow-lg bg-[#232b18] text-sand">
              <div className="relative h-44">
                <img src={selectedDestination?.heroImage} alt={selectedDestination?.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#232b18] via-[#232b18]/60 to-[#232b18]/10" />
                <div className="absolute bottom-3 left-5 flex items-end gap-3 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> {selectedDestination?.state}
                    </span>
                    <h4 className="font-serif text-2xl font-bold leading-tight truncate">{selectedDestination?.name}</h4>
                    <span className="text-[11px] text-sand/70">Packages from {inr(packageFromOf(selectedDestination!))}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Safari</span>
                    <span className="text-sm font-semibold block">{selectedSafari?.name}</span>
                    <span className="text-xs text-sand/60 block">{selectedSafari?.safariType} • {selectedSafari?.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Date</span>
                    <span className="text-sm font-semibold block">
                      {safariDate ? new Date(safariDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Zone</span>
                    <span className="text-sm font-semibold block text-earth">{selectedZone || selectedDestination?.zones[0]?.name || 'Core Sector'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Vehicle</span>
                    <span className="text-sm font-semibold block">{selectedVehicle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Travelers</span>
                    <span className="text-sm font-semibold block">
                      {Math.max(adults, 1)} Adult{Math.max(adults, 1) === 1 ? '' : 's'}
                      {children > 0 ? ` • ${children} Child${children === 1 ? '' : 'ren'}` : ''}
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-3 border-t border-gold/15 pt-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Lead Traveler</span>
                    <span className="text-sm font-semibold block">{customerInfo.fullName || '—'}</span>
                    <span className="text-xs text-sand/60 block">
                      {customerInfo.email || '—'}
                      {customerInfo.phone ? `  •  ${customerInfo.phone}` : ''}
                    </span>
                  </div>

                  {guestDetails.length > 0 && (
                    <div className="col-span-2 md:col-span-3 border-t border-gold/15 pt-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold/70 block">Other Travelers</span>
                      {guestDetails.map((g, i) => (
                        <span key={i} className="text-sm font-semibold block">
                          {g.fullName || 'Unnamed'}
                          {g.idNumber ? (
                            <span className="text-xs text-sand/60 font-normal">
                              {'  '}({g.idType} • {g.idNumber})
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-black/25 rounded-xl p-4 space-y-2">
                  {selectedPackage ? (
                    <>
                      <div className="flex justify-between py-1">
                        <span className="text-xs text-sand/80">{selectedPackage.label} all-inclusive (per person)</span>
                        <span className="text-xs font-semibold">{inr(selectedPackage.min)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-xs text-sand/80">Travelers</span>
                        <span className="text-xs font-semibold">
                          {Math.max(adults, 1)} adult{Math.max(adults, 1) === 1 ? '' : 's'}
                          {children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-xs text-sand/80">Senior Forest Naturalist</span>
                        <span className="text-xs font-semibold">{naturalistRequested ? 'Included (+₹1,000)' : '—'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between py-1">
                      <span className="text-xs text-sand/80">Package rate</span>
                      <span className="text-xs font-semibold">On request</span>
                    </div>
                  )}
                  <p className="text-[11px] text-sand/60 leading-snug">
                    Accommodation, all safari drives, reserve permits, the vehicle and a certified local
                    naturalist guide are included — no separate permit or guide charges.
                  </p>
                  <div className="flex items-baseline justify-between pt-2 border-t border-gold/20">
                    <span className="text-sm font-bold">Total Payable</span>
                    <span className="font-serif text-2xl font-bold text-gold">{inr(selectedPackage ? totalAmount : null)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION / PERMIT */}
        {step === 5 && confirmedBooking && (
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto border-2 border-amber-600">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest-safari text-earth font-bold block">
                Request Received
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest mt-1">
                Your Booking Is Under Review
              </h3>
              <p className="text-xs text-forest/70 max-w-md mx-auto mt-2">
                Our team is checking availability and will call you on <strong>{confirmedBooking.customerInfo.phone}</strong> within 24 hours
                to confirm your safari. Nothing has been charged yet.
              </p>
            </div>

            <div className="max-w-md mx-auto text-left rounded-xl border border-forest/20 bg-sand p-5 space-y-2.5 text-xs text-forest">
              <div className="flex justify-between gap-2">
                <span className="text-forest/60 font-semibold">Request Ref</span>
                <span className="font-bold text-earth">{confirmedBooking.bookingRef}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-forest/60 font-semibold">Reserve</span>
                <span className="font-bold text-right">{confirmedBooking.destinationName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-forest/60 font-semibold">Safari</span>
                <span className="font-bold text-right">{confirmedBooking.safariName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-forest/60 font-semibold">Date</span>
                <span className="font-bold text-right">
                  {new Date(confirmedBooking.safariDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-forest/60 font-semibold">Package</span>
                <span className="font-bold text-right">{confirmedBooking.packageLabel || 'All-Inclusive'}</span>
              </div>
              <div className="flex justify-between gap-2 border-t border-forest/15 pt-2.5">
                <span className="text-forest/60 font-semibold">Indicative Total</span>
                <span className="font-serif font-bold text-gold">₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() =>
                  navigate(user ? '/account' : `/track?ref=${encodeURIComponent(confirmedBooking.bookingRef)}`)
                }
                className="px-5 py-2.5 bg-forest text-sand text-xs font-semibold rounded hover:bg-forest-light transition-colors"
              >
                {user ? 'View in My Account' : 'Track Your Request'}
              </button>
              <button
                onClick={() => navigate('/destinations')}
                className="px-4 py-2.5 bg-sand border border-forest/30 text-forest text-xs font-semibold rounded hover:bg-gold transition-colors"
              >
                Explore Reserves
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
              <span>{loading ? 'Submitting your request...' : 'Submit Booking Request'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
