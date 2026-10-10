import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye 
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { cmsService } from '../../services/api';
import { useToast } from '../../components/common/Toast';

export const AdminInquiriesPage: React.FC = () => {
  const { error } = useToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await cmsService.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await cmsService.updateInquiryStatus(id, status);
      await fetchInquiries();
    } catch (err: any) {
      error('Failed to update status.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest/15 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-forest">
            Traveler Inquiries and Bespoke Requests
          </h2>
          <p className="text-forest/60 text-xs mt-1">
            Incoming dispatches for photography gypsies, multi-park routing, and custom permit queries
          </p>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-3xl border border-forest/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-forest/60 text-xs">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="py-20 text-center text-forest/50 text-xs">No inquiries logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-sand/30 border-b border-forest/10 text-forest/60 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Traveler</th>
                    <th className="p-4 font-semibold">Target Reserve</th>
                    <th className="p-4 font-semibold">Subject and Message</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5 text-forest/80">
                  {inquiries.map(inq => (
                    <tr key={inq._id} className="hover:bg-sand/10 transition">
                      <td className="p-4 font-medium text-forest/60">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <strong className="text-forest block">{inq.name}</strong>
                        <div className="text-forest/60 text-[11px]">{inq.email}</div>
                        <div className="text-forest/50 text-[10px]">{inq.phone}</div>
                      </td>
                      <td className="p-4 font-semibold text-forest">
                        {inq.destination || 'Unspecified'}
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-semibold text-forest truncate">{inq.subject || 'Safari Inquiry'}</div>
                        <p className="text-forest/60 text-[11px] truncate">{inq.message}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={inq.status}
                          onChange={e => handleStatusUpdate(inq._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold focus:outline-none ${
                            inq.status === 'new' 
                              ? 'bg-amber-50 text-amber-800 border-amber-300' 
                              : inq.status === 'contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 rounded-lg bg-sand hover:bg-forest hover:text-sand text-forest transition"
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

        {/* Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-forest/20 p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-forest/10 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">Inquiry Details</h3>
                  <span className="text-forest/60 text-xs">Received {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1 rounded-full text-forest/40 hover:text-forest"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-forest/50 uppercase font-bold block">Traveler:</span>
                  <div className="font-bold text-forest text-sm">{selectedInquiry.name}</div>
                  <div className="text-forest/70">{selectedInquiry.email} • {selectedInquiry.phone}</div>
                </div>

                {selectedInquiry.destination && (
                  <div>
                    <span className="text-forest/50 uppercase font-bold block">Target Sanctuary:</span>
                    <span className="font-semibold text-forest">{selectedInquiry.destination}</span>
                  </div>
                )}

                {selectedInquiry.travelDate && (
                  <div>
                    <span className="text-forest/50 uppercase font-bold block">Estimated Dates:</span>
                    <span>{selectedInquiry.travelDate}</span>
                  </div>
                )}

                <div>
                  <span className="text-forest/50 uppercase font-bold block">Full Dispatch Message:</span>
                  <div className="p-4 bg-sand/30 rounded-xl mt-1 text-forest/80 leading-relaxed italic whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-forest/10">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-2 bg-forest text-sand rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
export default AdminInquiriesPage;
