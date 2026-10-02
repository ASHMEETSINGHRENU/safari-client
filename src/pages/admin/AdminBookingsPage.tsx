import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Eye, 
  X, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { bookingService } from '../../services/api';
import { Booking } from '../../types';

export const AdminBookingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllAdmin({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined
      });
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusUpdate = async (id: string, bookingStatus?: string, paymentStatus?: string) => {
    try {
      setUpdatingId(id);
      await bookingService.updateStatus(id, { bookingStatus, paymentStatus });
      await fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header and Toolbar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Safari Permits and Bookings Ledger
              </h2>
              <p className="text-forest/60 text-xs">
                Official register of traveler applications, ID verification, and permit allotment
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ref #, traveler name, phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 w-64"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-forest text-sand rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-forest/10 text-xs">
            {['all', 'pending', 'confirmed', 'paid', 'cancelled', 'completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-semibold transition whitespace-nowrap ${
                  statusFilter === st 
                    ? 'bg-forest text-sand' 
                    : 'text-forest/70 hover:bg-sand/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border border-forest/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-forest/60 text-xs">
              <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading permit registers...
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-forest/50 text-xs">
              No safari permits match the current criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-sand/30 border-b border-forest/10 text-forest/60 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Ref #</th>
                    <th className="p-4 font-semibold">Traveler and ID</th>
                    <th className="p-4 font-semibold">Destination / Safari</th>
                    <th className="p-4 font-semibold">Date and Zone</th>
                    <th className="p-4 font-semibold">Tariff</th>
                    <th className="p-4 font-semibold">Booking Status</th>
                    <th className="p-4 font-semibold">Payment</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5 text-forest/80">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-sand/10 transition">
                      <td className="p-4 font-mono font-bold text-forest">
                        {b.bookingRef}
                      </td>
                      <td className="p-4">
                        <strong className="text-forest block">{b.customerInfo.fullName}</strong>
                        <div className="text-forest/60 text-[11px]">{b.customerInfo.email}</div>
                        <div className="text-forest/50 text-[10px]">{b.customerInfo.idType}: {b.customerInfo.idNumber}</div>
                      </td>
                      <td className="p-4">
                        <strong className="text-forest block">{b.destinationName}</strong>
                        <span className="text-earth text-[11px] font-medium">{b.safariName}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{new Date(b.safariDate).toLocaleDateString()}</div>
                        <div className="text-forest/60 text-[11px]">{b.slot} • {b.zone}</div>
                        <div className="text-forest/50 text-[10px]">{b.guests.adults}A, {b.guests.children}C</div>
                      </td>
                      <td className="p-4 font-serif font-bold text-sm text-forest">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <select
                          disabled={updatingId === b._id}
                          value={b.bookingStatus}
                          onChange={e => handleStatusUpdate(b._id, e.target.value, undefined)}
                          className="px-2.5 py-1 rounded-lg border border-forest/20 text-xs font-semibold bg-white text-forest focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          disabled={updatingId === b._id}
                          value={b.paymentStatus}
                          onChange={e => handleStatusUpdate(b._id, undefined, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-forest/20 text-xs font-semibold bg-white text-forest focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg bg-sand hover:bg-forest hover:text-sand text-forest transition"
                          title="View Full Application"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Inspection Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-forest/20 p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-forest/10 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">Permit Application Dossier</h3>
                  <span className="font-mono text-xs text-forest/60">Booking Reference: {selectedBooking.bookingRef}</span>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 rounded-full text-forest/40 hover:text-forest"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-sand/30 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-forest/50 block">Customer Information</span>
                  <div className="font-bold text-forest text-sm">{selectedBooking.customerInfo.fullName}</div>
                  <div>Email: {selectedBooking.customerInfo.email}</div>
                  <div>Phone: {selectedBooking.customerInfo.phone}</div>
                  <div>Country: {selectedBooking.customerInfo.country}</div>
                  <div>ID Type: {selectedBooking.customerInfo.idType}</div>
                  <div>ID Number: <strong>{selectedBooking.customerInfo.idNumber}</strong></div>
                </div>

                <div className="p-4 bg-sand/30 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-forest/50 block">Expedition Details</span>
                  <div className="font-bold text-forest text-sm">{selectedBooking.destinationName}</div>
                  <div>Safari: {selectedBooking.safariName}</div>
                  <div>Date: {new Date(selectedBooking.safariDate).toDateString()}</div>
                  <div>Slot: {selectedBooking.slot}</div>
                  <div>Zone: {selectedBooking.zone}</div>
                  <div>Vehicle: {selectedBooking.vehicleType}</div>
                  <div>Guests: {selectedBooking.guests.adults} Adults, {selectedBooking.guests.children} Children</div>
                  <div>Naturalist Requested: {selectedBooking.naturalistRequested ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div className="p-4 bg-sand/20 rounded-xl text-xs">
                  <strong className="block text-forest mb-1 font-semibold">Special Requests / Photo Gear Notes:</strong>
                  <p className="text-forest/80 italic">{selectedBooking.specialRequests}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-forest/10 text-xs">
                <div>
                  <span className="text-forest/60 block">Total Tariff:</span>
                  <span className="font-serif text-2xl font-bold text-forest">₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-forest/20 text-forest rounded-xl font-semibold hover:bg-sand transition flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-5 py-2 bg-forest text-sand rounded-xl font-bold uppercase tracking-wider hover:bg-forest/90 transition shadow"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
export default AdminBookingsPage;
