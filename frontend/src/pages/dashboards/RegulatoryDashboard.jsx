import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Eye, 
  Filter,
  Sparkles,
  RefreshCw,
  Building2,
  Users,
  ShieldCheck,
  Check,
  X,
  FileSearch,
  Bell,
  BarChart3,
  Search,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function RegulatoryDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(activeTab);
  const [metrics, setMetrics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  // Modals & form state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [officersLoading, setOfficersLoading] = useState(false);
  const [officersError, setOfficersError] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');
  const [transitionRemarks, setTransitionRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    fetchRegulatoryData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadEligibleOfficers = async () => {
    setOfficersLoading(true);
    setOfficersError(null);
    try {
      const res = await api.getEligibleOfficers();
      const list = res?.data || [];
      setOfficers(list);
      return list;
    } catch (err) {
      console.error('Failed to load eligible officers:', err);
      setOfficersError('Unable to load officers. Please try again.');
      return [];
    } finally {
      setOfficersLoading(false);
    }
  };

  const openAssignModal = async (app) => {
    setSelectedApp(app);
    setSelectedOfficerId(app.assignedOfficerId ? String(app.assignedOfficerId) : '');
    setAssignModalOpen(true);
    await loadEligibleOfficers();
  };

  const fetchRegulatoryData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, uRes] = await Promise.all([
        api.getDashboardMetrics().catch(() => null),
        api.getApplications().catch(() => ({ data: [] })),
        api.getEligibleOfficers().catch(() => ({ data: [] }))
      ]);

      if (mRes && mRes.data) setMetrics(mRes.data);
      if (aRes && aRes.data) setApplications(aRes.data);
      if (uRes && uRes.data) {
        setOfficers(uRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    if (!selectedApp || !selectedOfficerId || isAssigning) return;
    setIsAssigning(true);
    try {
      const res = await api.assignOfficer(selectedApp.id, parseInt(selectedOfficerId));
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? res.data : a));
      setAssignModalOpen(false);
      const officerName = res.data?.assignedOfficerName || 'qualified officer';
      showToast(`Assigned ${selectedApp.applicationNumber} to ${officerName}!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Officer assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleWorkflowTransition = async (e) => {
    e.preventDefault();
    if (!selectedApp || !targetStatus) return;
    try {
      const res = await api.transitionWorkflow(selectedApp.id, {
        targetStatus,
        remarks: transitionRemarks
      });
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? res.data : a));
      setTransitionModalOpen(false);
      setTransitionRemarks('');
      showToast(`Application transitioned to ${targetStatus}`);
      fetchRegulatoryData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Workflow transition failed');
    }
  };

  // 5 Specific Metrics Mandated by the Regulatory Officer Specification
  // 1. Applications assigned to the officer
  const assignedToMe = applications.filter(a => a.assignedOfficerId === user?.id || !a.assignedOfficerId);
  // 2. Applications awaiting action
  const awaitingAction = applications.filter(a => ['SUBMITTED', 'UNDER_SCRUTINY', 'RE_SCRUTINY', 'EVC_COMPLETED'].includes(a.status));
  // 3. Applications returned for clarification
  const clarificationsList = applications.filter(a => a.status === 'DEFICIENCY_NOTED');
  // 4. Applications approaching deadlines (overdue or SLA near)
  const approachingDeadlines = applications.filter(a => a.slaDueDate && new Date(a.slaDueDate) <= new Date(Date.now() + 7 * 24 * 3600 * 1000) && !['APPROVED', 'REJECTED'].includes(a.status));
  // 5. Applications awaiting an authorized decision (e.g. Scrutiny and EVC completed or ready for final order)
  const decisionQueue = applications.filter(a => ['EVC_COMPLETED', 'UNDER_SCRUTINY'].includes(a.status));

  // Filtered applications based on current search & category
  const getDisplayApplications = () => {
    let list = applications;
    if (tab === 'assigned') {
      list = assignedToMe;
    } else if (tab === 'pending') {
      list = awaitingAction;
    } else if (tab === 'decision-queue') {
      list = decisionQueue;
    } else if (tab === 'clarifications') {
      list = clarificationsList;
    }

    return list.filter(a => {
      const matchSearch = (a.applicationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.institution?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.academicYear || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === 'ALL' || a.category === filterCategory;
      return matchSearch && matchCat;
    });
  };

  const displayList = getDisplayApplications();

  // Status chart
  const stageChartData = metrics?.stageWisePendency
    ? Object.entries(metrics.stageWisePendency).map(([k, v]) => ({
        name: k.replace(/_/g, ' '),
        value: v
      }))
    : [
        { name: 'Under Scrutiny', value: applications.filter(a => a.status === 'UNDER_SCRUTINY').length },
        { name: 'Clarifications', value: clarificationsList.length },
        { name: 'EVC Scheduled', value: applications.filter(a => a.status === 'EVC_SCHEDULED').length },
        { name: 'Decision Queue', value: decisionQueue.length }
      ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]';
      case 'REJECTED':
        return 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]';
      case 'DEFICIENCY_NOTED':
        return 'bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]';
      case 'EVC_SCHEDULED':
        return 'bg-[#C084FC]/15 border-[#C084FC]/40 text-[#C084FC]';
      default:
        return 'bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]';
    }
  };

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
            <span className="w-2.5 h-2.5 rounded-full bg-[#B9F56B] shadow-[0_0_10px_#B9F56B]"></span>
            <span className="text-xs font-mono text-[#B9F56B] uppercase tracking-wider font-bold">
              Bureau of Regulatory Approvals • AICTE Headquarters
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            Regulatory Officer Queue & Coordination
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Institutional approval caseload, scrutiny/inspection orchestration, and statutory decision queue
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setRefreshing(true); fetchRegulatoryData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh Caseload"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 5 Specific Regulatory Officer Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Applications Assigned */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Assigned to Officer</span>
            <FileText className="w-4 h-4 text-[#B9F56B] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">{assignedToMe.length}</div>
          <div className="text-[10px] text-[#B9F56B] mt-0.5">Active caseload</div>
        </div>

        {/* Metric 2: Applications Awaiting Action */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Awaiting Action</span>
            <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#38BDF8] mt-1.5">{awaitingAction.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">In workflow stages</div>
        </div>

        {/* Metric 3: Returned for Clarification */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Clarifications</span>
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FBBF24] mt-1.5">{clarificationsList.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Deficiencies noted</div>
        </div>

        {/* Metric 4: Approaching Deadlines */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Critical SLA</span>
            <ShieldAlert className="w-4 h-4 text-[#FB7185] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#FB7185] mt-1.5">{approachingDeadlines.length}</div>
          <div className="text-[10px] text-[#FB7185] mt-0.5">≤ 7 Days remaining</div>
        </div>

        {/* Metric 5: Awaiting Authorized Decision */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Decision Queue</span>
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">{decisionQueue.length}</div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Ready for order</div>
        </div>
      </div>

      {/* Role-Specific Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'assigned', label: 'Assigned Applications', icon: FileText, count: assignedToMe.length },
          { key: 'status', label: 'Application Status', icon: Clock },
          { key: 'pending', label: 'Pending Regulatory Actions', icon: ShieldCheck, count: awaitingAction.length },
          { key: 'decision-queue', label: 'Decision Queue', icon: CheckCircle2, count: decisionQueue.length },
          { key: 'clarifications', label: 'Clarifications', icon: AlertTriangle, count: clarificationsList.length },
          { key: 'notifications', label: 'Regulatory Notifications', icon: Bell },
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                active 
                  ? 'bg-white/[0.1] text-[#B9F56B] border border-white/20 shadow-glass-highlight font-bold'
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

      {/* TAB: OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stage-wise Pendency */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F5F5F5]">Workflow Stage Pendency</h3>
              <span className="text-[11px] font-mono text-[#B9F56B]">2026-27 Stream</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageChartData}>
                  <XAxis dataKey="name" tick={{ fill: '#A5A5AD', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#A5A5AD', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111215', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#B9F56B' }}
                  />
                  <Bar dataKey="value" fill="#B9F56B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLA Distribution */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3">
            <h3 className="text-sm font-bold text-[#F5F5F5] flex items-center justify-between">
              <span>Statutory SLA Compliance</span>
              <span className="text-xs text-[#34D399] font-mono">30-Day Legal Limit</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Applications within standard SLA (≤ 15 days)</span>
                <span className="font-bold text-[#34D399]">{applications.length - approachingDeadlines.length}</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Applications approaching deadline (16 - 30 days)</span>
                <span className="font-bold text-[#FBBF24]">{approachingDeadlines.length}</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A5A5AD]">Awaiting Scrutiny Officer Allocation</span>
                <span className="font-bold text-[#38BDF8]">
                  {applications.filter(a => !a.assignedOfficerId).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {tab === 'notifications' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-[#F5F5F5]">Regulatory Notifications & System Dispatches</h3>
          <p className="text-[11px] text-[#A5A5AD]">Live notices sent to colleges and assigned officers</p>
          <div className="space-y-2 text-xs pt-2">
            {[
              { title: 'Deficiency Notice Issued', inst: 'Apex Institute of Technology', date: 'Today, 11:30 AM', type: 'DEFICIENCY' },
              { title: 'EVC Visit Scheduled', inst: 'Western College of Engineering', date: 'Yesterday, 04:15 PM', type: 'EVC' },
              { title: 'Document Rectification Received', inst: 'National Polytechnic College', date: '2 days ago', type: 'RECTIFICATION' }
            ].map((n, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{n.title}</div>
                  <div className="text-[11px] text-[#A5A5AD]">{n.inst}</div>
                </div>
                <span className="text-[10px] text-[#C8CBD2] font-mono">{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CASSETTE / QUEUE TABLE FOR ASSIGNED, STATUS, PENDING, DECISION QUEUE, CLARIFICATIONS */}
      {['overview', 'assigned', 'status', 'pending', 'decision-queue', 'clarifications'].includes(tab) && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">
                {tab === 'decision-queue' ? 'Executive Decision Queue' :
                 tab === 'clarifications' ? 'Applications Returned for Clarification' :
                 tab === 'pending' ? 'Pending Regulatory Actions' :
                 tab === 'assigned' ? 'Applications Assigned to Officer' :
                 'Regulatory Processing Caseload'}
              </h3>
              <p className="text-[11px] text-[#A5A5AD]">
                Inspect scrutiny findings, coordinate committee inspections, and record regulatory decisions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/[0.05] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="EXTENSION_OF_APPROVAL">Extension of Approval</option>
                <option value="NEW_INSTITUTION">New Institution</option>
                <option value="INCREASE_IN_INTAKE">Increase in Intake</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Application No. & Institution</th>
                  <th className="py-3 px-4">Category & Session</th>
                  <th className="py-3 px-4">Current Workflow Stage</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4">SLA Due Date</th>
                  <th className="py-3 px-4 text-right">Regulatory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayList.map(app => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#F5F5F5]">{app.applicationNumber}</div>
                      <div className="text-[10px] text-[#A5A5AD]">{app.institution?.name || 'Institution'}</div>
                    </td>
                    <td className="py-3 px-4 text-[#C8CBD2]">
                      <div>{app.category?.replace(/_/g, ' ')}</div>
                      <div className="text-[10px] text-[#A5A5AD] font-mono">{app.academicYear}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#C8CBD2]">
                      {app.assignedOfficerName ? (
                        <div className="flex items-center gap-1.5 text-[#38BDF8]">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{app.assignedOfficerName}</span>
                        </div>
                      ) : (
                        <span className="text-[#FB7185] font-mono text-[10px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#A5A5AD] font-mono text-[11px]">
                      {app.slaDueDate ? new Date(app.slaDueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Assign Officer button */}
                      <button
                        onClick={() => openAssignModal(app)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] text-[#C8CBD2] hover:text-white"
                      >
                        Assign
                      </button>

                      {/* Transition / Decision button */}
                      <button
                        onClick={() => { setSelectedApp(app); setTargetStatus('APPROVED'); setTransitionModalOpen(true); }}
                        className="px-2.5 py-1 rounded-lg bg-[#B9F56B]/10 hover:bg-[#B9F56B]/20 border border-[#B9F56B]/30 text-[11px] font-bold text-[#B9F56B]"
                      >
                        Record Decision
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Officer Modal */}
      {assignModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Assign Desk Officer</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedApp.applicationNumber}</p>
              </div>
              <button 
                onClick={() => setAssignModalOpen(false)} 
                className="text-[#A5A5AD] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignOfficer} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1.5 font-medium">Select Qualified Officer</label>
                {officersLoading ? (
                  <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#A5A5AD] text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#B9F56B]" />
                    <span>Loading eligible officers...</span>
                  </div>
                ) : officersError ? (
                  <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-xl space-y-1.5">
                    <p className="text-[#FB7185] text-xs">{officersError}</p>
                    <button
                      type="button"
                      onClick={loadEligibleOfficers}
                      className="text-[11px] text-[#B9F56B] underline hover:text-[#A5EA54] flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry loading
                    </button>
                  </div>
                ) : officers.length === 0 ? (
                  <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl text-[#A5A5AD] text-xs">
                    No eligible active officers found.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedOfficerId}
                    onChange={(e) => setSelectedOfficerId(e.target.value)}
                    className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#B9F56B]/50 transition-colors"
                  >
                    <option value="">-- Choose Officer --</option>
                    {officers.map(off => (
                      <option key={off.id} value={off.id}>
                        {off.fullName || off.username}{off.department ? ` — ${off.department}` : (off.role ? ` (${off.role.replace('ROLE_', '').replace(/_/g, ' ')})` : '')}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2] hover:bg-white/[0.1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedOfficerId || officersLoading || isAssigning || !!officersError || officers.length === 0}
                  className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  {isAssigning && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Decision / Workflow Transition Modal */}
      {transitionModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Record Regulatory Decision</h3>
                <p className="text-xs text-[#A5A5AD]">{selectedApp.applicationNumber} • {selectedApp.institution?.name}</p>
              </div>
              <button onClick={() => setTransitionModalOpen(false)} className="text-[#A5A5AD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWorkflowTransition} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Target Regulatory Decision / Status</label>
                <select
                  required
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="APPROVED">APPROVE — Grant Extension / New Approval</option>
                  <option value="REJECTED">REJECT — Deficiencies Unresolved</option>
                  <option value="EVC_SCHEDULED">SCHEDULE EVC — Mandatory Physical Site Visit</option>
                  <option value="DEFICIENCY_NOTED">RETURN FOR CLARIFICATION — Issue Deficiency</option>
                </select>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Official Findings & Regulatory Remarks</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record justification based on Scrutiny report, EVC findings, and APH 2026-27 norms..."
                  value={transitionRemarks}
                  onChange={(e) => setTransitionRemarks(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTransitionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54]"
                >
                  Sign & Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
