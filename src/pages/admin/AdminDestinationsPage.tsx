import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  X, 
  IndianRupee,
  Layers
} from 'lucide-react';
import { stateBadgeClass, inr, packageFromOf } from '../../lib/site';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { destinationService } from '../../services/api';
import { Destination } from '../../types';
import { useToast } from '../../components/common/Toast';

export const AdminDestinationsPage: React.FC = () => {
  const { success, error } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setDestinations(await destinationService.getAllAdmin());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleUpdateAvailability = async (id: string, availability: string) => {
    try {
      await destinationService.update(id, { availability: availability as any });
      await fetchDestinations();
    } catch (err: any) {
      error('Failed to update availability.');
    }
  };

  const handleTogglePublished = async (id: string, isPublished: boolean) => {
    try {
      await destinationService.update(id, { isPublished });
      await fetchDestinations();
      success(isPublished ? 'Reserve is now visible on the public site.' : 'Reserve hidden from the public site.');
    } catch (err: any) {
      error('Failed to update visibility.');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    try {
      setSaving(true);
      await destinationService.update(editingDest._id, {
        tagline: editingDest.tagline,
        startingPrice: editingDest.startingPrice,
        packages: editingDest.packages,
        headlineSpecies: editingDest.headlineSpecies ?? '',
        availability: editingDest.availability,
        tigerCount: editingDest.tigerCount
      });
      setEditingDest(null);
      await fetchDestinations();
    } catch (err: any) {
      error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header and Search */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-forest">
              Reserves and Sanctuary Management
            </h2>
            <p className="text-forest/60 text-xs">
              Manage live permit quotas, package rates, and field parameters for all reserves
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reserve name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-forest/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-forest/60 text-xs">
              Loading destinations...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-sand/30 border-b border-forest/10 text-forest/60 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Reserve Name</th>
                    <th className="p-4 font-semibold">State</th>
                    <th className="p-4 font-semibold">Tigers Est.</th>
                    <th className="p-4 font-semibold">Zones</th>
                    <th className="p-4 font-semibold">Starting Rate</th>
                    <th className="p-4 font-semibold">Permit Availability</th>
                    <th className="p-4 font-semibold">Public Site</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5 text-forest/80">
                  {filtered.map(d => (
                    <tr key={d._id} className="hover:bg-sand/10 transition">
                      <td className="p-4">
                        <strong className="text-forest text-sm block">{d.name}</strong>
                        <span className="text-[11px] text-gold italic">{d.tagline}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase ${stateBadgeClass(d.state)}`}>
                          {d.state}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-forest">{d.tigerCount}</td>
                      <td className="p-4">{d.zones.length} Zones</td>
                      <td className="p-4 font-serif font-bold text-sm text-forest">
                        {inr(packageFromOf(d))}
                      </td>
                      <td className="p-4">
                        <select
                          value={d.availability}
                          onChange={e => handleUpdateAvailability(d._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-forest/20 text-xs font-semibold bg-white text-forest focus:outline-none"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="FEW PERMITS">FEW PERMITS</option>
                          <option value="LIMITED">LIMITED</option>
                          <option value="SOLD OUT">SOLD OUT</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(d._id, !d.isPublished)}
                          title={d.isPublished ? 'Visible on the public site — click to hide' : 'Hidden from the public site — click to show'}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition flex items-center space-x-1 ${
                            d.isPublished
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-forest/10 text-forest/50 hover:bg-forest/20'
                          }`}
                        >
                          {d.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{d.isPublished ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditingDest(d)}
                          className="px-3 py-1.5 bg-sand hover:bg-forest hover:text-sand text-forest rounded-lg font-semibold text-xs transition flex items-center space-x-1 ml-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingDest && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-forest/20 p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-forest/10 pb-4">
                <h3 className="font-serif text-2xl font-bold text-forest">
                  Edit {editingDest.name}
                </h3>
                <button
                  onClick={() => setEditingDest(null)}
                  className="p-1 rounded-full text-forest/40 hover:text-forest"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editingDest.tagline}
                    onChange={e => setEditingDest({ ...editingDest, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-forest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                      Budget Package Floor (₹)
                    </label>
                    <input
                      type="number"
                      value={editingDest.startingPrice}
                      onChange={e => setEditingDest({ ...editingDest, startingPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-forest"
                    />
                    <p className="text-[10px] text-forest/50 mt-1">
                      Sort floor only. Tiers come from the Content Master via the seed or
                      sync:editorial script.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                      Headline Species
                    </label>
                    <input
                      type="text"
                      placeholder="Blank = Tiger count"
                      value={editingDest.headlineSpecies ?? ''}
                      onChange={e => setEditingDest({ ...editingDest, headlineSpecies: e.target.value })}
                      className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-forest/70 mb-1.5">
                      Tiger Count Estimate
                    </label>
                    <input
                      type="text"
                      value={editingDest.tigerCount}
                      onChange={e => setEditingDest({ ...editingDest, tigerCount: e.target.value })}
                      className="w-full px-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-forest"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-forest/10">
                  <button
                    type="button"
                    onClick={() => setEditingDest(null)}
                    className="px-4 py-2 border border-forest/20 text-forest rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-forest text-sand rounded-xl font-bold uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
export default AdminDestinationsPage;
