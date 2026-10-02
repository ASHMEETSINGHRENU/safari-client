import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  MapPin, 
  Compass, 
  MessageSquare, 
  TrendingUp, 
  IndianRupee, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService, bookingService } from '../../services/api';
import { Booking } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, bookingsData] = await Promise.all([
          adminService.getStats(),
          bookingService.getAllAdmin({ search: '' })
        ]);
        setStats(statsData.stats);
        setRecentBookings(bookingsData.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-forest/15 shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold text-forest/60 tracking-wider block">
              Total Permits Issued
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-forest">
                {stats?.bookings?.total || 0}
              </span>
              <BookOpen className="w-6 h-6 text-gold" />
            </div>
            <div className="text-[11px] text-forest/70 pt-1 flex items-center space-x-1">
              <span className="text-emerald-700 font-bold">{stats?.bookings?.confirmed || 0} Confirmed</span>
              <span>•</span>
              <span className="text-amber-700 font-bold">{stats?.bookings?.pending || 0} Pending</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-forest/15 shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold text-forest/60 tracking-wider block">
              Total Pipeline Revenue
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-forest">
                ₹{(stats?.bookings?.revenue || 0).toLocaleString('en-IN')}
              </span>
              <IndianRupee className="w-6 h-6 text-gold" />
            </div>
            <span className="text-[11px] text-forest/50 block pt-1">
              Calculated across confirmed and paid permits
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-forest/15 shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold text-forest/60 tracking-wider block">
              Protected Reserves
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-forest">
                {stats?.destinations || 14}
              </span>
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <span className="text-[11px] text-forest/70 block pt-1">
              7 Madhya Pradesh • 7 Maharashtra
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-forest/15 shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold text-forest/60 tracking-wider block">
              Customer Inquiries
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-forest">
                {stats?.inquiries?.total || 0}
              </span>
              <MessageSquare className="w-6 h-6 text-gold" />
            </div>
            <span className="text-[11px] text-amber-700 font-bold block pt-1">
              {stats?.inquiries?.new || 0} Unread Dispatches
            </span>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/bookings"
            className="bg-white p-6 rounded-2xl border border-forest/10 shadow-sm hover:border-gold/50 transition group flex items-center justify-between"
          >
            <div>
              <h3 className="font-serif text-lg font-bold text-forest group-hover:text-gold transition">
                Manage Permits and Bookings
              </h3>
              <p className="text-xs text-forest/60 mt-1">Review traveler IDs, confirm payments, update statuses</p>
            </div>
            <ArrowRight className="w-5 h-5 text-forest/40 group-hover:text-gold transition shrink-0 ml-4" />
          </Link>

          <Link
            to="/admin/destinations"
            className="bg-white p-6 rounded-2xl border border-forest/10 shadow-sm hover:border-gold/50 transition group flex items-center justify-between"
          >
            <div>
              <h3 className="font-serif text-lg font-bold text-forest group-hover:text-gold transition">
                Reserve Capacities and Zones
              </h3>
              <p className="text-xs text-forest/60 mt-1">Adjust starting prices, permits availability, and guidelines</p>
            </div>
            <ArrowRight className="w-5 h-5 text-forest/40 group-hover:text-gold transition shrink-0 ml-4" />
          </Link>

          <Link
            to="/admin/cms"
            className="bg-white p-6 rounded-2xl border border-forest/10 shadow-sm hover:border-gold/50 transition group flex items-center justify-between"
          >
            <div>
              <h3 className="font-serif text-lg font-bold text-forest group-hover:text-gold transition">
                CMS and Brand Story
              </h3>
              <p className="text-xs text-forest/60 mt-1">Update editorial statements, ethics charter, and site settings</p>
            </div>
            <ArrowRight className="w-5 h-5 text-forest/40 group-hover:text-gold transition shrink-0 ml-4" />
          </Link>
        </div>

        {/* Recent Bookings Feed */}
        <div className="bg-white p-8 rounded-3xl border border-forest/15 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-forest/10 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Recent Permit Applications
              </h2>
              <p className="text-forest/60 text-xs">
                Real-time stream of incoming traveler safari permits
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold uppercase tracking-wider text-earth hover:underline flex items-center space-x-1"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-forest/60 text-xs">Loading bookings stream...</div>
          ) : recentBookings.length === 0 ? (
            <div className="py-12 text-center text-forest/50 text-xs">No bookings recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-forest/10 text-forest/50 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Ref #</th>
                    <th className="pb-3 font-semibold">Traveler</th>
                    <th className="pb-3 font-semibold">Destination</th>
                    <th className="pb-3 font-semibold">Safari Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5 text-forest/80">
                  {recentBookings.map(b => (
                    <tr key={b._id} className="hover:bg-sand/20 transition">
                      <td className="py-4 font-mono font-bold text-forest">{b.bookingRef}</td>
                      <td className="py-4">
                        <div className="font-semibold text-forest">{b.customerInfo.fullName}</div>
                        <div className="text-forest/50 text-[11px]">{b.customerInfo.phone}</div>
                      </td>
                      <td className="py-4 font-medium">{b.destinationName}</td>
                      <td className="py-4">{new Date(b.safariDate).toLocaleDateString()} ({b.slot})</td>
                      <td className="py-4 font-bold text-forest">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'confirmed' || b.bookingStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.bookingStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          to={`/admin/bookings?search=${b.bookingRef}`}
                          className="px-3 py-1 bg-forest/10 text-forest rounded-lg hover:bg-forest hover:text-sand transition font-semibold text-[11px]"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
export default AdminDashboardPage;
