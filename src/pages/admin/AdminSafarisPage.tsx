import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Edit3, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { stateCode } from '../../lib/site';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { safariService, destinationService } from '../../services/api';
import { Safari, Destination } from '../../types';

export const AdminSafarisPage: React.FC = () => {
  const [safaris, setSafaris] = useState<Safari[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState('All');
  const [search, setSearch] = useState('');

  const fetchSafaris = async () => {
    try {
      setLoading(true);
      const [sData, dData] = await Promise.all([
        safariService.getAll({
          destinationSlug: selectedDest === 'All' ? undefined : selectedDest,
          search: search || undefined
        }),
        destinationService.getAll()
      ]);
      setSafaris(sData);
      setDestinations(dData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafaris();
  }, [selectedDest]);

  const handleStatusChange = async (id: string, availabilityStatus: string) => {
    try {
      await safariService.update(id, { availabilityStatus: availabilityStatus as any });
      await fetchSafaris();
    } catch (err: any) {
      alert('Failed to update safari availability status.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Safari Packages and Vehicle Allocations
              </h2>
              <p className="text-forest/60 text-xs">
                Manage 42 active safari vehicle allotments, gate slots, and pricing across MP and MH
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedDest}
                onChange={e => setSelectedDest(e.target.value)}
                className="px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none"
              >
                <option value="All">All Destinations</option>
                {destinations.map(d => (
                  <option key={d._id} value={d.slug}>{d.name} ({stateCode(d.state)})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-forest/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-forest/60 text-xs">Loading safaris...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-sand/30 border-b border-forest/10 text-forest/60 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Safari Package</th>
                    <th className="p-4 font-semibold">Destination</th>
                    <th className="p-4 font-semibold">Type and Slot</th>
                    <th className="p-4 font-semibold">Vehicle and Capacity</th>
                    <th className="p-4 font-semibold">Base Price</th>
                    <th className="p-4 font-semibold">Availability Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5 text-forest/80">
                  {safaris.map(s => (
                    <tr key={s._id} className="hover:bg-sand/10 transition">
                      <td className="p-4">
                        <strong className="text-forest text-sm block">{s.name}</strong>
                        <span className="text-[11px] text-forest/60">Duration: {s.duration}</span>
                      </td>
                      <td className="p-4 font-semibold text-forest">
                        {s.destinationName}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-earth">{s.safariType}</div>
                        <div className="text-forest/60">{s.slot} Slot</div>
                      </td>
                      <td className="p-4">
                        <div>{s.vehicle}</div>
                        <div className="text-forest/50 text-[10px]">Max {s.capacity} Guests</div>
                      </td>
                      <td className="p-4 font-serif font-bold text-sm text-forest">
                        ₹{s.basePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <select
                          value={s.availabilityStatus}
                          onChange={e => handleStatusChange(s._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-forest/20 text-xs font-semibold bg-white text-forest focus:outline-none"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="FAST FILLING">FAST FILLING</option>
                          <option value="SOLD OUT">SOLD OUT</option>
                        </select>
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
export default AdminSafarisPage;
