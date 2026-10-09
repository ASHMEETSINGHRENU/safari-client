import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService } from '../../services/api';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

type TeamMember = User & { isActive?: boolean; _id?: string };

const ROLES = ['super_admin', 'booking_manager', 'content_manager'];

const emptyForm = { name: '', email: '', password: '', phone: '', country: 'India', role: 'booking_manager' };

export const AdminTeamPage: React.FC = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [adding, setAdding] = useState(false);

  const fetchUsers = async () => {
    try {
      setUsers(await adminService.getUsers('team'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const update = async (id: string, role: string, isActive: boolean) => {
    try {
      setSavingId(id);
      await adminService.updateUserRole(id, role, isActive);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update team member.');
    } finally {
      setSavingId(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdding(true);
      await adminService.createUser(form);
      setForm({ ...emptyForm });
      setShowAdd(false);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add team member.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-forest">Team Members</h2>
            <p className="text-forest/60 text-xs">
              Roles decide which console modules a person can open. Booking Managers handle leads; Content Managers handle the website.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(s => !s)}
            className="px-4 py-2 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition shadow flex items-center gap-1.5 self-start"
          >
            {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAdd ? 'Cancel' : 'Add Team Member'}</span>
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-sand/30 rounded-2xl border border-forest/10 text-xs">
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 border border-forest/20 rounded-lg bg-white text-forest"
            />
            <input
              required
              type="email"
              placeholder="Email (login)"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="px-3 py-2 border border-forest/20 rounded-lg bg-white text-forest"
            />
            <input
              required
              type="password"
              minLength={8}
              placeholder="Temporary password (min 8)"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="px-3 py-2 border border-forest/20 rounded-lg bg-white text-forest"
            />
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="px-3 py-2 border border-forest/20 rounded-lg bg-white text-forest"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r.replace('_', ' ')}</option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 border border-forest/20 rounded-lg bg-white text-forest"
            />
            <input
              placeholder="Country"
              value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })}
              className="px-3 py-2 border border-forest/20 rounded-lg bg-white text-forest"
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={adding}
                className="px-5 py-2 bg-forest text-sand rounded-lg font-semibold hover:bg-forest/90 transition disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Create Team Member'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-16 text-center text-forest/60 text-xs">
            <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading team...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-sand/30 border-b border-forest/10 text-forest/60 uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-semibold">Member</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5 text-forest/80">
                {users.map(u => {
                  const id = u._id || u.id;
                  const isSelf = id === (me?._id || me?.id);
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
                      <td className="p-4">
                        <select
                          disabled={saving || isSelf}
                          value={u.role}
                          onChange={e => update(id, e.target.value, u.isActive ?? true)}
                          className="px-2.5 py-1 rounded-lg border border-forest/20 text-xs font-semibold bg-white text-forest focus:outline-none disabled:opacity-50"
                          title={isSelf ? 'You cannot change your own role here.' : undefined}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-forest">
                          <input
                            type="checkbox"
                            disabled={saving || isSelf}
                            checked={u.isActive ?? true}
                            onChange={e => update(id, u.role, e.target.checked)}
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

        <p className="text-[11px] text-forest/50 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          Super Admin has full access; Booking Manager handles leads; Content Manager handles the website. Your own role is locked to prevent lockouts.
        </p>
      </div>
    </AdminLayout>
  );
};
export default AdminTeamPage;
