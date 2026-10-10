import React, { useState, useEffect } from 'react';
import { Search, UserCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/api';
import { User } from '../../types';
import { useToast } from '../../components/common/Toast';

type Traveler = User & { isActive?: boolean; _id?: string; createdAt?: string };

export const AdminTravelersPage: React.FC = () => {
  const { error } = useToast();
  const [users, setUsers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setUsers(await adminService.getUsers('customer'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      setSavingId(id);
      await adminService.updateUserRole(id, undefined, isActive);
      await fetchUsers();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update traveler.');
    } finally {
      setSavingId(null);
    }
  };

  const term = search.trim().toLowerCase();
  const filtered = term
    ? users.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone || '').toLowerCase().includes(term))
    : users;

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-forest">Travelers</h2>
            <p className="text-forest/60 text-xs">
              Registered customer accounts. Read-only record — disabled accounts can no longer sign in.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-forest/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Name, email, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-sand/30 border border-forest/15 rounded-xl text-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-forest/60 text-xs">
            <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading travelers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-forest/50 text-xs flex flex-col items-center gap-2">
            <UserCheck className="w-8 h-8 text-forest/30" />
            No traveler accounts match the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-sand/30 border-b border-forest/10 text-forest/60 uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-semibold">Traveler</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5 text-forest/80">
                {filtered.map(u => {
                  const id = u._id || u.id;
                  const saving = savingId === id;
                  return (
                    <tr key={id} className="hover:bg-sand/10 transition">
                      <td className="p-4">
                        <strong className="text-forest block">{u.name}</strong>
                      </td>
                      <td className="p-4">
                        <span className="text-forest/70 text-[11px] block">{u.email}</span>
                        <span className="text-forest/50 text-[11px] block">
                          {u.phone || 'No phone'} • {u.country || 'India'}
                        </span>
                      </td>
                      <td className="p-4 text-forest/60">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-forest">
                          <input
                            type="checkbox"
                            disabled={saving}
                            checked={u.isActive ?? true}
                            onChange={e => toggleActive(id, e.target.checked)}
                            className="w-4 h-4 accent-forest"
                          />
                          {u.isActive === false ? 'Disabled' : 'Enabled'}
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminTravelersPage;
