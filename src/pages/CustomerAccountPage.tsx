import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Clock, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  Printer,
  X,
  Heart,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService, destinationService, authService } from '../services/api';
import { Booking, Destination } from '../types';

export const CustomerAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'saved'>('bookings');
  const [selectedBookingForVoucher, setSelectedBookingForVoucher] = useState<Booking | null>(null);

  // Profile edit form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'India');
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/account');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCountry(user.country || 'India');
    }
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you wish to request cancellation of this safari permit? Forest department cancellation deductions apply.')) {
      return;
    }
    try {
      await bookingService.cancel(id);
      const updated = await bookingService.getMyBookings();
      setBookings(updated);
      alert('Safari booking cancelled successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cancellation could not be processed.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileMsg(null);
      await authService.updateProfile({ name, phone, country });
      await refreshUser();
      setProfileMsg({ text: 'Profile details updated successfully.', type: 'success' });
    } catch (err: any) {
      setProfileMsg({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    }
  };

  const printVoucher = () => {
    window.print();
  };

  if (!user) return null;

  return (
    <div className="bg-sand min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-forest text-gold flex items-center justify-center font-serif text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-forest/10 text-forest text-[10px] font-bold uppercase tracking-wider">
                  {user.role === 'customer' ? 'Traveler' : user.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-forest/60 text-xs mt-1">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/booking"
              className="px-5 py-2.5 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition shadow flex items-center space-x-1.5"
            >
              <Compass className="w-4 h-4 text-gold" />
              <span>Book Safari</span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-2.5 rounded-xl border border-forest/20 text-forest hover:bg-forest/5 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-forest/15 space-x-6 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 transition relative ${
              activeTab === 'bookings'
                ? 'text-forest border-b-2 border-forest font-bold'
                : 'text-forest/60 hover:text-forest'
            }`}
          >
            My Safari Permits ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition relative ${
              activeTab === 'profile'
                ? 'text-forest border-b-2 border-forest font-bold'
                : 'text-forest/60 hover:text-forest'
            }`}
          >
            Personal and ID Profile
          </button>
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-serif text-forest text-sm">Querying official permit vouchers...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-forest/10 space-y-4">
                <Compass className="w-12 h-12 text-forest/30 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-forest">No Safari Permits on Record</h3>
                <p className="text-forest/70 text-xs max-w-md mx-auto">
                  You have not submitted any safari permit requests yet. Explore our reserves to schedule your first expedition.
                </p>
                <div className="pt-2">
                  <Link
                    to="/destinations"
                    className="px-6 py-2.5 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider inline-block shadow"
                  >
                    Browse Reserves
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div 
                    key={b._id}
                    className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-sand px-2.5 py-1 rounded-md text-forest border border-forest/10">
                          Ref: {b.bookingRef}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === 'confirmed' || b.bookingStatus === 'paid'
                            ? 'bg-emerald-600 text-white'
                            : b.bookingStatus === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : b.bookingStatus === 'alternative_suggested'
                            ? 'bg-blue-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}>
                          {b.bookingStatus.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sand text-forest">
                          Payment: {b.paymentStatus.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-forest">
                        {b.destinationName}
                      </h3>
                      <p className="text-xs text-gold font-semibold uppercase tracking-wider">
                        {b.safariName}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sand/30 p-3 rounded-xl border border-forest/5 text-xs">
                        <div>
                          <span className="text-forest/50 block text-[10px] uppercase">Safari Date</span>
                          <span className="font-semibold text-forest">
                            {new Date(b.safariDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-forest/50 block text-[10px] uppercase">Time Slot</span>
                          <span className="font-semibold text-forest">{b.slot}</span>
                        </div>
                        <div>
                          <span className="text-forest/50 block text-[10px] uppercase">Zone</span>
                          <span className="font-semibold text-forest">{b.zone}</span>
                        </div>
                        <div>
                          <span className="text-forest/50 block text-[10px] uppercase">Party</span>
                          <span className="font-semibold text-forest">{b.guests.adults} Adults {b.guests.children > 0 && `• ${b.guests.children} Children`}</span>
                        </div>
                      </div>

                      {b.suggestion?.destinationSlug && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                          <strong className="block text-blue-900">Our team suggested an alternative</strong>
                          <span className="text-blue-900/80">
                            {b.suggestion.destinationName}
                            {b.suggestion.packageLabel ? ` · ${b.suggestion.packageLabel}` : ''} — your requested date isn't available.
                          </span>
                          {b.suggestion.message && <p className="italic text-blue-900/80">{b.suggestion.message}</p>}
                          <Link
                            to={`/booking?destination=${b.suggestion.destinationSlug}`}
                            className="inline-block mt-1 px-3 py-1.5 bg-forest text-sand rounded-lg font-semibold hover:bg-forest/90 transition"
                          >
                            Book This Instead
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="lg:text-right shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-forest/10 flex lg:flex-col items-center lg:items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-forest/50 block">Total Tariff</span>
                        <span className="font-serif text-2xl font-bold text-forest">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        {(b.bookingStatus === 'confirmed' || b.bookingStatus === 'paid' || b.bookingStatus === 'completed') && (
                          <button
                            onClick={() => setSelectedBookingForVoucher(b)}
                            className="px-4 py-2 bg-sand border border-forest/20 text-forest rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-forest hover:text-sand transition flex items-center space-x-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Voucher</span>
                          </button>
                        )}
                        {b.bookingStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="px-3 py-2 text-earth hover:text-red-700 text-xs font-semibold underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white p-8 rounded-3xl border border-forest/15 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-forest mb-2">
              Identity and Contact Details
            </h3>
            <p className="text-forest/60 text-xs mb-6">
              Ensure your name matches your government identification exactly for smooth gate verification.
            </p>

            {profileMsg && (
              <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 mb-6 ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                  Full Name (As on ID)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 bg-sand/10 border border-forest/10 rounded-xl text-xs text-forest/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                  Country of Residence
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition shadow"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Voucher Modal */}
        {selectedBookingForVoucher && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div id="permit-receipt" className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-forest/20 p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-forest/10 pb-4">
                <div className="flex items-center space-x-3">
                  <img src="/assets/logo/logo.png" alt="Shutter and Stripes" className="h-10 w-auto" />
                  <div>
                    <h4 className="font-serif font-bold text-forest text-lg">Official Permit Voucher</h4>
                    <span className="font-mono text-xs text-forest/60">Ref: {selectedBookingForVoucher.bookingRef}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBookingForVoucher(null)}
                  className="p-1 rounded-full text-forest/50 hover:text-forest print:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans text-forest/80">
                <div className="p-4 bg-sand/40 rounded-xl border border-forest/10 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest/50 block">Primary Traveler</span>
                    <strong className="text-forest text-sm">{selectedBookingForVoucher.customerInfo.fullName}</strong>
                    <div className="text-forest/60 mt-0.5">{selectedBookingForVoucher.customerInfo.idType}: {selectedBookingForVoucher.customerInfo.idNumber}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest/50 block">Contact</span>
                    <div>{selectedBookingForVoucher.customerInfo.email}</div>
                    <div>{selectedBookingForVoucher.customerInfo.phone}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest/50 block">Sanctuary</span>
                    <span className="font-bold text-forest">{selectedBookingForVoucher.destinationName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest/50 block">Safari Format</span>
                    <span className="font-bold text-forest">{selectedBookingForVoucher.safariName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest/50 block">Expedition Date</span>
                    <span className="font-bold text-forest">{new Date(selectedBookingForVoucher.safariDate).toDateString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest/50 block">Time Slot and Zone</span>
                    <span className="font-bold text-forest">{selectedBookingForVoucher.slot} • {selectedBookingForVoucher.zone} Zone</span>
                  </div>
                </div>

                <div className="p-4 bg-forest/5 rounded-xl border border-forest/10 space-y-1 text-[11px]">
                  <strong className="text-forest block">Mandatory Gate Check Protocol:</strong>
                  <p>
                    1. Carry the original physical ID ({selectedBookingForVoucher.customerInfo.idType}) recorded above. Digital copies or screenshots are not recognized at forest gates.
                  </p>
                  <p>
                    2. Arrive at the entry gate 30 minutes before official dawn/dusk gate opening.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-forest/10 print:hidden">
                <button
                  onClick={printVoucher}
                  className="px-5 py-2.5 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition shadow flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4 text-gold" />
                  <span>Print Voucher</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default CustomerAccountPage;
