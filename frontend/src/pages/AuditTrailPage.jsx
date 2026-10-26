import React, { useState, useEffect } from 'react';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { 
  Lock, 
  Download, 
  Search, 
  Clock, 
  User, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';

export default function AuditTrailPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAuditEvents();
  }, []);

  const loadAuditEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditEvents();
      setEvents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.action?.toLowerCase().includes(term) ||
      e.actorUsername?.toLowerCase().includes(term) ||
      e.entityId?.toLowerCase().includes(term) ||
      e.actorRole?.toLowerCase().includes(term)
    );
  });

  const handleExportCsv = () => {
    window.open(api.getAuditCsvExportUrl(), '_blank');
  };

  return (
    <EnterpriseLayout activeSection="audit">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B9F56B] shadow-[0_0_8px_#B9F56B]"></span>
              <span className="text-xs font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">Central Vigilance Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1">
              Immutable Audit & Accountability Trail
            </h1>
            <p className="text-xs text-[#A5A5AD]">
              Append-only cryptographic event logging capturing every state transition, actor role, timestamp, and IP address.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="btn-lime px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lime-glow transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Audit Ledger</span>
            </button>
          </div>
        </div>

        {/* Search Filter Bar */}
        <div className="p-4 rounded-3xl glass-card flex items-center gap-3">
          <Search className="w-4 h-4 text-[#A5A5AD]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor username, application ID, action or role..."
            className="w-full bg-transparent border-none text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none"
          />
        </div>

        {/* Audit Table */}
        <div className="glass-card rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A5A5AD] font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Actor / Username</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Target Entity</th>
                  <th className="py-3 px-3">Transition</th>
                  <th className="py-3 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-[#A5A5AD]">
                      No audit events matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3.5 px-3 font-mono text-[#A5A5AD]">
                        {new Date(evt.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#F5F5F5]">
                        {evt.actorUsername}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-[#C8CBD2] border border-white/10">
                          {evt.actorRole?.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-[#B9F56B]">
                        {evt.action}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#F5F5F5]">
                        {evt.entityId}
                      </td>
                      <td className="py-3.5 px-3 text-[#A5A5AD] font-mono text-[11px]">
                        {evt.previousState ? `${evt.previousState} → ${evt.newState}` : evt.newState}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#A5A5AD]">
                        {evt.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </EnterpriseLayout>
  );
}
