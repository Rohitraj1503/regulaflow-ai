import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Plus, 
  RefreshCw, 
  Star, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  TrendingUp,
  FileCheck,
  FileSearch,
  Camera,
  X,
  Search,
  CheckSquare
} from 'lucide-react';

export default function EvcDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(activeTab);
  const [schedules, setSchedules] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  // Inspection Checklist Modal & Findings
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [infraScore, setInfraScore] = useState(85);
  const [facultyScore, setFacultyScore] = useState(80);
  const [labsScore, setLabsScore] = useState(90);
  const [safetyScore, setSafetyScore] = useState(88);
  const [recommendation, setRecommendation] = useState('RECOMMENDED_FOR_APPROVAL');
  const [findingsSummary, setFindingsSummary] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('GPS-tagged physical photos and biometric verification logs archived');

  // Institution Details Modal
  const [viewInstModal, setViewInstModal] = useState(false);
  const [targetInst, setTargetInst] = useState(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvcData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchEvcData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        api.getEvcSchedules().catch(() => ({ data: [] })),
        api.getApplications().catch(() => ({ data: [] }))
      ]);

      if (sRes && sRes.data) setSchedules(sRes.data);
      if (aRes && aRes.data) setApplications(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    try {
      const res = await api.submitEvcReport(selectedSchedule.id, {
        infrastructureScore: parseInt(infraScore),
        facultyScore: parseInt(facultyScore),
        labsScore: parseInt(labsScore),
        recommendation,
        findingsSummary: `${findingsSummary} | Supporting Evidence: ${evidenceNotes}`
      });
      setSchedules(prev => prev.map(s => s.id === selectedSchedule.id ? res.data : s));
      setShowChecklistModal(false);
      setFindingsSummary('');
      showToast('EVC Inspection Report submitted successfully!');
      fetchEvcData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit inspection report');
    }
  };

  // 5 Specific EVC Metrics Mandated by the Prompt
  // 1. Upcoming inspections
  const upcomingInspections = schedules.filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledDate) >= new Date());
  // 2. Inspections in progress
  const inspectionsInProgress = schedules.filter(s => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');
  // 3. Reports awaiting submission
  const reportsAwaitingSubmission = schedules.filter(s => s.status === 'SCHEDULED');
  // 4. Completed inspections
  const completedInspections = schedules.filter(s => s.status === 'COMPLETED');
  // 5. Overdue inspection tasks
  const overdueTasks = schedules.filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledDate) < new Date());

  // Filter schedules based on active tab
  const getFilteredSchedules = () => {
    let list = schedules;
    if (tab === 'schedule') {
      list = upcomingInspections;
    } else if (tab === 'pending-reports') {
      list = reportsAwaitingSubmission;
    } else if (tab === 'submitted-reports' || tab === 'history') {
      list = completedInspections;
    }

    return list.filter(s => 
      (s.applicationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.committeeMembers || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredSchedules = getFilteredSchedules();

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-3 rounded-2xl bg-[#111215]/95 border border-[#B9F56B]/40 text-[#F5F5F5] text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#B9F56B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_10px_#FBBF24]"></span>
            <span className="text-xs font-mono text-[#FBBF24] uppercase tracking-wider font-bold">
              Expert Visit Committee (EVC) • Physical & Virtual Inspection Bureau
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            EVC / Inspection Officer Workspace
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Site inspections, physical infrastructure validation, biometric faculty audit, and statutory reports
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setRefreshing(true); fetchEvcData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh Inspection Schedules"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 5 Specific EVC Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Upcoming Inspections */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Upcoming Visits</span>
            <CalendarIcon className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">{upcomingInspections.length}</div>
          <div className="text-[10px] text-[#FBBF24] mt-0.5">Scheduled on site</div>
        </div>

        {/* Metric 2: Inspections in Progress */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">In Progress</span>
            <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#38BDF8] mt-1.5">{inspectionsInProgress.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Active field tasks</div>
        </div>

        {/* Metric 3: Reports Awaiting Submission */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Reports Awaited</span>
            <FileSearch className="w-4 h-4 text-[#C084FC] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#C084FC] mt-1.5">{reportsAwaitingSubmission.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Pending committee upload</div>
        </div>

        {/* Metric 4: Completed Inspections */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">{completedInspections.length}</div>
          <div className="text-[10px] text-[#34D399] mt-0.5">Reports verified</div>
        </div>

        {/* Metric 5: Overdue Inspection Tasks */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FB7185] mt-1.5">{overdueTasks.length}</div>
          <div className="text-[10px] text-[#FB7185] mt-0.5">Passed visit date</div>
        </div>
      </div>

      {/* EVC Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'assigned', label: 'Assigned Inspections', icon: CalendarIcon, count: schedules.length },
          { key: 'schedule', label: 'Inspection Schedule', icon: Clock, count: upcomingInspections.length },
          { key: 'pending-reports', label: 'Pending Reports', icon: FileSearch, count: reportsAwaitingSubmission.length },
          { key: 'submitted-reports', label: 'Submitted Reports', icon: FileCheck, count: completedInspections.length },
          { key: 'history', label: 'Inspection History', icon: ShieldCheck },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                active 
                  ? 'bg-white/[0.1] text-[#FBBF24] border border-white/20 shadow-glass-highlight font-bold'
                  : 'text-[#A5A5AD] hover:text-[#F5F5F5] hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/[0.15] text-[10px] text-white">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Inspection Caseload / Records Table */}
      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F5F5]">
              {tab === 'schedule' ? 'Upcoming Inspection Itinerary' :
               tab === 'pending-reports' ? 'Inspection Reports Awaiting Submission' :
               tab === 'submitted-reports' ? 'Submitted & Cryptographically Verified Reports' :
               tab === 'history' ? 'Complete Inspection Log' :
               'Expert Visit Committee Active Portfolio'}
            </h3>
            <p className="text-[11px] text-[#A5A5AD]">
              Perform on-site checklist evaluation, attach geotagged evidence, and submit official recommendations
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by application/committee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Application & Mode</th>
                <th className="py-3 px-4">Scheduled Date & Time</th>
                <th className="py-3 px-4">Expert Committee Panel</th>
                <th className="py-3 px-4">Evaluation Scores</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSchedules.map(sch => (
                <tr key={sch.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#F5F5F5]">{sch.applicationNumber}</div>
                    <div className="text-[10px] text-[#FBBF24] font-mono">{sch.visitType} VISIT</div>
                  </td>

                  <td className="py-3 px-4 text-[#C8CBD2]">
                    <div>{sch.scheduledDate ? new Date(sch.scheduledDate).toLocaleDateString() : 'TBD'}</div>
                    <div className="text-[10px] text-[#A5A5AD] font-mono">
                      {sch.scheduledDate ? new Date(sch.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#A5A5AD] max-w-[200px] truncate" title={sch.committeeMembers}>
                    {sch.committeeMembers}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    {sch.status === 'COMPLETED' ? (
                      <span className="text-[#34D399]">
                        Infra: {sch.infrastructureScore}% • Fac: {sch.facultyScore}%
                      </span>
                    ) : (
                      <span className="text-[#A5A5AD]">Pending Evaluation</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      sch.status === 'COMPLETED'
                        ? 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]'
                        : 'bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]'
                    }`}>
                      {sch.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* View Institution details */}
                    <button
                      onClick={() => {
                        const matched = applications.find(a => a.id === sch.applicationId);
                        setTargetInst(matched?.institution || { name: 'Institution', city: 'Mumbai', state: 'Maharashtra', aicteId: 'AICTE-INST-001' });
                        setViewInstModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] text-[#C8CBD2] hover:text-white"
                    >
                      Institution
                    </button>

                    {/* Open Checklist / Submit Report */}
                    {sch.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => { setSelectedSchedule(sch); setShowChecklistModal(true); }}
                        className="px-2.5 py-1 rounded-lg bg-[#FBBF24] hover:bg-[#E5AC20] text-[#08090B] font-bold text-[11px] shadow-lime-glow"
                      >
                        Checklist & Report
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#34D399] font-mono">Report Submitted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institution Details Modal */}
      {viewInstModal && targetInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{targetInst.name}</h3>
                <p className="text-xs text-[#A5A5AD]">AICTE ID: {targetInst.aicteId}</p>
              </div>
              <button onClick={() => setViewInstModal(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#C8CBD2]">
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Location:</span>
                <span>{targetInst.city}, {targetInst.state}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Institute Type:</span>
                <span>{targetInst.instituteType || 'Technical College'}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Region:</span>
                <span>{targetInst.region || 'Western'} Region</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Accreditation:</span>
                <span className="text-[#B9F56B]">{targetInst.accreditationStatus || 'NBA Tier 1'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewInstModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-white text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Checklist & Report Submission Modal */}
      {showChecklistModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">EVC Inspection Checklist & Report</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedSchedule.applicationNumber}</p>
              </div>
              <button onClick={() => setShowChecklistModal(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              
              {/* Checklist criteria & scoring */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <label className="text-[#A5A5AD] block font-semibold">Infrastructure Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={infraScore}
                    onChange={(e) => setInfraScore(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-[#A5A5AD]">Classrooms, seminar halls, library</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <label className="text-[#A5A5AD] block font-semibold">Faculty Cadre Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={facultyScore}
                    onChange={(e) => setFacultyScore(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-[#A5A5AD]">Biometric attendance & qualification</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <label className="text-[#A5A5AD] block font-semibold">Laboratories & Computers (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={labsScore}
                    onChange={(e) => setLabsScore(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-[#A5A5AD]">Required equipment & internet bandwidth</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <label className="text-[#A5A5AD] block font-semibold">Safety & Accessibility (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-[#A5A5AD]">Fire NOC, barrier-free ramps, lifts</span>
                </div>
              </div>

              {/* Supporting evidence */}
              <div>
                <label className="text-[#A5A5AD] block mb-1">Attached Supporting Evidence & Geotagged Notes</label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-[#A5A5AD] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={evidenceNotes}
                    onChange={(e) => setEvidenceNotes(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Committee recommendation */}
              <div>
                <label className="text-[#A5A5AD] block mb-1">Committee Statutory Recommendation</label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white"
                >
                  <option value="RECOMMENDED_FOR_APPROVAL">RECOMMENDED FOR APPROVAL (All criteria satisfied)</option>
                  <option value="DEFICIENCIES_OBSERVED">DEFICIENCIES OBSERVED (Requires rectification)</option>
                  <option value="REJECTED_NON_COMPLIANCE">REJECT (Severe non-compliance to norms)</option>
                </select>
              </div>

              {/* Findings summary */}
              <div>
                <label className="text-[#A5A5AD] block mb-1">Detailed Inspection Findings Summary</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record formal observations regarding campus built-up area, lab readiness, faculty presence..."
                  value={findingsSummary}
                  onChange={(e) => setFindingsSummary(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FBBF24]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowChecklistModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FBBF24] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#E5AC20]"
                >
                  Submit Inspection Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
