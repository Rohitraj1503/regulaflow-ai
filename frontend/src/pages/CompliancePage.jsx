import React, { useState, useEffect } from 'react';
import EnterpriseLayout from '../components/EnterpriseLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  XCircle,
  Eye,
  Check,
  Building2,
  FileText
} from 'lucide-react';

export default function CompliancePage() {
  const { user } = useAuth();
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('All Institutions');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState(''); // 'review' | 'verify'
  const [actionNotes, setActionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 5 Status Metric Pills in Glassmorphism Theme
  const metricPills = [
    { label: 'Verified', count: 612, trend: '+8%', color: '#B9F56B', bg: 'bg-[#B9F56B]/15 border-[#B9F56B]/40 text-[#B9F56B]' },
    { label: 'Pending', count: 210, trend: '-2%', color: '#C8CBD2', bg: 'bg-white/[0.08] border-white/20 text-[#F5F5F5]' },
    { label: 'Overdue', count: 96, trend: '+14%', color: '#FB7185', bg: 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]' },
    { label: 'Rejected', count: 36, trend: '-5%', color: '#8A8D96', bg: 'bg-white/[0.05] border-white/10 text-[#A5A5AD]' },
    { label: 'Due Soon', count: 24, trend: '7%', color: '#B9F56B', bg: 'bg-[#B9F56B]/10 border-[#B9F56B]/30 text-[#B9F56B]' },
  ];

  // Obligations data
  const complianceRecords = [
    {
      id: 1,
      institution: 'ABC Engineering College',
      obligation: 'Submit Affidavit',
      dueDate: '20 Aug 2025',
      status: 'Pending',
      statusBadge: 'bg-white/[0.06] text-[#C8CBD2] border-white/15',
      action: 'Review',
      reviewer: 'R. Sharma'
    },
    {
      id: 2,
      institution: 'XYZ Institute of Technology',
      obligation: 'Building Completion Certificate',
      dueDate: '15 Aug 2025',
      status: 'Overdue',
      statusBadge: 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30',
      action: 'Review',
      reviewer: 'P. Verma'
    },
    {
      id: 3,
      institution: 'Global Tech University',
      obligation: 'Faculty Appointment Letters',
      dueDate: '25 Aug 2025',
      status: 'Verified',
      statusBadge: 'bg-[#B9F56B]/15 text-[#B9F56B] border-[#B9F56B]/30',
      action: 'Verify',
      reviewer: 'S. Khan'
    },
    {
      id: 4,
      institution: 'Sunrise Engineering',
      obligation: 'Lease Agreement Renewal',
      dueDate: '18 Aug 2025',
      status: 'Due Soon',
      statusBadge: 'bg-white/[0.08] text-[#F5F5F5] border-white/20',
      action: 'Review',
      reviewer: 'A. Mehta'
    },
    {
      id: 5,
      institution: 'PQR Institute',
      obligation: 'Equipment Purchase Proof',
      dueDate: '30 Aug 2025',
      status: 'Pending',
      statusBadge: 'bg-white/[0.06] text-[#C8CBD2] border-white/15',
      action: 'Review',
      reviewer: 'R. Sharma'
    }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAction = (item, mode) => {
    setSelectedItem(item);
    setModalMode(mode);
    setActionNotes('');
  };

  const handleConfirmAction = (e) => {
    e.preventDefault();
    if (modalMode === 'verify') {
      showToast(`Compliance verified for ${selectedItem.institution} • ${selectedItem.obligation}`);
    } else {
      showToast(`Review findings logged for ${selectedItem.institution}.`);
    }
    setModalMode('');
  };

  return (
    <EnterpriseLayout activeSection="compliance">
      <div className="space-y-6">
        
        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-[#B9F56B]/40 text-[#B9F56B] text-xs flex items-center justify-between shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B9F56B]" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-white hover:text-[#B9F56B]">✕</button>
          </div>
        )}

        {/* Top Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">Compliance Monitoring</h1>
            <p className="text-xs text-[#A5A5AD]">Track mandatory AICTE undertakings, affidavits, lease deeds and safety certificates</p>
          </div>

          {/* Filters Matching Glassmorphism Direction */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="glass-input rounded-2xl px-3.5 py-2 text-xs text-[#F5F5F5]"
            >
              <option value="All Institutions">All Institutions</option>
              <option value="ABC Engineering College">ABC Engineering College</option>
              <option value="XYZ Institute of Technology">XYZ Institute of Technology</option>
              <option value="Global Tech University">Global Tech University</option>
              <option value="Sunrise Engineering">Sunrise Engineering</option>
              <option value="PQR Institute">PQR Institute</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input rounded-2xl px-3.5 py-2 text-xs text-[#F5F5F5]"
            >
              <option value="All Status">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Due Soon">Due Soon</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search obligations..."
                className="glass-input rounded-2xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-[#A5A5AD]"
              />
            </div>
          </div>
        </div>

        {/* 5 Status Metric Pills in Translucent Charcoal Glass */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {metricPills.map((pill) => (
            <div
              key={pill.label}
              className="p-4 rounded-3xl glass-card flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-[#A5A5AD]">{pill.label}</span>
                <div className="text-2xl font-bold text-[#F5F5F5] font-mono mt-0.5">{pill.count}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pill.bg}`}>
                {pill.trend}
              </span>
            </div>
          ))}
        </div>

        {/* Main Obligations Data Table */}
        <div className="p-6 rounded-3xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A5A5AD] uppercase text-[10px] font-mono tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Obligation</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {complianceRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#F5F5F5]">
                      {rec.institution}
                    </td>
                    <td className="py-3.5 px-4 text-[#F5F5F5]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#C8CBD2] shrink-0" />
                        <span>{rec.obligation}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#A5A5AD]">
                      {rec.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${rec.statusBadge}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAction(rec, rec.action.toLowerCase())}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          rec.action === 'Verify'
                            ? 'btn-lime shadow-lime-glow'
                            : 'glass-button'
                        }`}
                      >
                        {rec.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Review / Verify Modal */}
      {modalMode && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 space-y-4 border-white/20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-[#F5F5F5] capitalize">{modalMode} Compliance Obligation</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedItem.institution}</p>
              </div>
              <button onClick={() => setModalMode('')} className="text-[#A5A5AD] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A5A5AD]">Obligation:</span>
                  <span className="text-[#F5F5F5] font-medium">{selectedItem.obligation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A5A5AD]">Due Date:</span>
                  <span className="text-[#F5F5F5] font-mono">{selectedItem.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A5A5AD]">Assigned Reviewer:</span>
                  <span className="text-[#B9F56B]">{selectedItem.reviewer}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Official Review Notes</label>
                <textarea
                  rows="3"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Record verification checklist observations..."
                  className="w-full glass-input rounded-2xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalMode('')}
                  className="px-4 py-2 rounded-xl glass-button text-xs text-[#A5A5AD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-lime text-xs font-bold"
                >
                  {modalMode === 'verify' ? 'Confirm Verification' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </EnterpriseLayout>
  );
}
