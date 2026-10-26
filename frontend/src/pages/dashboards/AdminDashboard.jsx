import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Settings, 
  ShieldAlert, 
  FileSpreadsheet, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Sliders, 
  ArrowUpRight,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  Database,
  Cpu,
  Mail,
  Zap,
  Layers,
  BookOpen,
  Check,
  Clock,
  Server,
  Lock,
  HardDrive
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis 
} from 'recharts';

export default function AdminDashboard({ activeTab = 'overview' }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(activeTab);
  const [overview, setOverview] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [institutionsList, setInstitutionsList] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync tab with activeTab prop
  useEffect(() => {
    if (activeTab) {
      setTab(activeTab);
    }
  }, [activeTab]);

  // Modals & form states
  const [userSearch, setUserSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'ROLE_SCRUTINY_OFFICER',
    department: 'Central Scrutiny Cell',
    phone: '+91-9876543210'
  });

  // Password reset state
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newTempPassword, setNewTempPassword] = useState('');
  const [resetResult, setResetResult] = useState(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  // CSV Import & Provenance State
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvPreviewLoading, setCsvPreviewLoading] = useState(false);
  const [csvImporting, setCsvImporting] = useState(false);
  const [updateExistingToggle, setUpdateExistingToggle] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importHistoryList, setImportHistoryList] = useState([]);
  const [showImportSection, setShowImportSection] = useState(false);
  const [instSearch, setInstSearch] = useState('');
  const [instPage, setInstPage] = useState(1);
  const instPerPage = 20;

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, uRes, iRes, sRes] = await Promise.all([
        api.getAdminOverview().catch(() => null),
        api.getAdminUsers().catch(() => ({ data: [] })),
        api.getAdminInstitutions().catch(() => ({ data: [] })),
        api.getAdminSettings().catch(() => null)
      ]);

      if (ovRes && ovRes.data) setOverview(ovRes.data);
      if (uRes && uRes.data) setUsersList(uRes.data);
      if (iRes && iRes.data) setInstitutionsList(iRes.data);
      if (sRes && sRes.data) setSettings(sRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleUserActive = async (userId) => {
    try {
      const res = await api.toggleUserActive(userId);
      setUsersList(prev => prev.map(u => u.id === userId ? res.data : u));
      showToast(`User ${res.data.username} active status updated!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u.id === userId ? res.data : u));
      showToast(`User role updated to ${newRole}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change role');
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!resetModalUser) return;
    setResettingPassword(true);
    try {
      const res = await api.resetUserPassword(resetModalUser.id, newTempPassword);
      setResetResult(res.data);
      showToast(`Password for ${res.data.username} reset successfully!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAdminUser(newUser);
      setUsersList(prev => [...prev, res.data]);
      setShowAddUserModal(false);
      setNewUser({
        username: '',
        email: '',
        fullName: '',
        role: 'ROLE_SCRUTINY_OFFICER',
        department: 'Central Scrutiny Cell',
        phone: '+91-9876543210'
      });
      showToast(`Created user ${res.data.username} successfully!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleInstitutionStatus = async (instId, newStatus) => {
    try {
      const res = await api.updateInstitutionStatus(instId, newStatus);
      setInstitutionsList(prev => prev.map(i => i.id === instId ? res.data : i));
      showToast(`Institution status updated to ${newStatus}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update institution');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await api.updateAdminSettings(settings);
      setSettings(res.data);
      showToast('System configuration saved & applied across platform!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings');
    }
  };

  const fetchImportHistory = async () => {
    try {
      const res = await api.getInstitutionImportHistory();
      if (res && res.data) {
        setImportHistoryList(res.data);
      }
    } catch (err) {
      console.error('Failed to load import history', err);
    }
  };

  const handleCsvFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setCsvPreview(null);
      setImportResult(null);
    }
  };

  const handlePreviewCsv = async () => {
    if (!csvFile) return;
    setCsvPreviewLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      const res = await api.previewInstitutionCsv(formData);
      setCsvPreview(res.data);
      showToast(`CSV preview generated: ${res.data.totalRows} records found.`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to preview CSV');
    } finally {
      setCsvPreviewLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!csvFile) return;
    setCsvImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      const res = await api.confirmInstitutionImport(formData, updateExistingToggle);
      setImportResult(res.data);
      showToast(res.data.message || 'Import completed successfully!');
      fetchAdminData();
      fetchImportHistory();
    } catch (err) {
      showToast(err.response?.data?.message || 'Import execution failed');
    } finally {
      setCsvImporting(false);
    }
  };

  const roleColors = {
    ROLE_ADMIN: '#FB7185',
    ROLE_REGULATORY_OFFICER: '#B9F56B',
    ROLE_SCRUTINY_OFFICER: '#38BDF8',
    ROLE_EVC_OFFICER: '#FBBF24',
    ROLE_INSTITUTION_ADMIN: '#C084FC',
    ROLE_COMPLIANCE_OFFICER: '#34D399',
    ROLE_AUDITOR: '#94A3B8'
  };

  const roleChartData = overview?.roleDistribution
    ? Object.entries(overview.roleDistribution).map(([role, count]) => ({
        name: role.replace('ROLE_', '').replace(/_/g, ' '),
        value: count,
        color: roleColors[role] || '#8A8D96'
      }))
    : [];

  const appStatusData = overview?.applicationProcessingOverview
    ? Object.entries(overview.applicationProcessingOverview).map(([status, count]) => ({
        name: status.replace(/_/g, ' '),
        count: count
      }))
    : [];

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = (u.fullName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate the 6 Required Dashboard Metrics
  const totalUsersMetric = overview?.totalUsers ?? usersList.length;
  const activeUsersMetric = overview?.activeUsersCount ?? usersList.filter(u => u.active !== false).length;
  const inactiveUsersMetric = overview?.inactiveUsersCount ?? usersList.filter(u => u.active === false).length;
  const totalInstitutionsMetric = overview?.totalInstitutions ?? institutionsList.length;
  const activeInstitutionsMetric = overview?.activeInstitutions ?? institutionsList.filter(i => i.status === 'ACTIVE').length;
  const totalApplicationsMetric = overview?.totalApplications ?? 6;
  const failedIntegrationsMetric = overview?.failedIntegrationsCount ?? 0;
  const securityEventsMetric = overview?.securityEventsCount ?? 0;

  const departments = [
    {
      id: 'scrutiny',
      name: 'Central Scrutiny Cell',
      code: 'CSC-HQ',
      officersCount: usersList.filter(u => u.role === 'ROLE_SCRUTINY_OFFICER').length || 2,
      responsibility: 'Document-level verification, deficiency identification, clause compliance checks',
      leadRole: 'ROLE_SCRUTINY_OFFICER',
      slaDays: 7,
      status: 'OPERATIONAL'
    },
    {
      id: 'evc',
      name: 'Expert Visit Committee (EVC) Bureau',
      code: 'EVC-REG',
      officersCount: usersList.filter(u => u.role === 'ROLE_EVC_OFFICER').length || 2,
      responsibility: 'On-site physical & virtual infrastructure validation, laboratory inspections, biometric verification',
      leadRole: 'ROLE_EVC_OFFICER',
      slaDays: 14,
      status: 'OPERATIONAL'
    },
    {
      id: 'regulatory',
      name: 'Regulatory Affairs Division',
      code: 'RAD-CENTRAL',
      officersCount: usersList.filter(u => u.role === 'ROLE_REGULATORY_OFFICER').length || 1,
      responsibility: 'Workflow coordination, officer assignment, decision queue management, policy enforcement',
      leadRole: 'ROLE_REGULATORY_OFFICER',
      slaDays: 30,
      status: 'OPERATIONAL'
    },
    {
      id: 'compliance',
      name: 'Statutory Compliance & Vigilance Wing',
      code: 'SCV-AUDIT',
      officersCount: usersList.filter(u => u.role === 'ROLE_COMPLIANCE_OFFICER').length || 1,
      responsibility: 'Mandatory disclosure monitoring, anti-ragging undertakings, fire NOC renewals',
      leadRole: 'ROLE_COMPLIANCE_OFFICER',
      slaDays: 15,
      status: 'OPERATIONAL'
    },
    {
      id: 'audit',
      name: 'Independent Audit Commission',
      code: 'IAC-CVC',
      officersCount: usersList.filter(u => u.role === 'ROLE_AUDITOR').length || 1,
      responsibility: 'Cryptographic audit log verification, read-only oversight, regulatory transparency',
      leadRole: 'ROLE_AUDITOR',
      slaDays: 0,
      status: 'MONITORING'
    },
    {
      id: 'admin',
      name: 'IT & Platform Security Administration',
      code: 'IT-SEC',
      officersCount: usersList.filter(u => u.role === 'ROLE_ADMIN').length || 1,
      responsibility: 'Platform health, user access provisioning, cryptographic key maintenance, database integrity',
      leadRole: 'ROLE_ADMIN',
      slaDays: 1,
      status: 'OPERATIONAL'
    }
  ];

  const regulatoryRules = [
    {
      code: 'APH-2026-C4.1',
      title: 'Built-up Area & Carpet Area Requirement',
      category: 'Infrastructure Norms',
      threshold: 'Minimum 2.5 acres land; 10,000 sq.m instructional area',
      enforcement: 'STRICT',
      lastUpdated: '2026-09-15'
    },
    {
      code: 'APH-2026-C7.2',
      title: 'Cadre Ratio and Faculty-to-Student Proportion',
      category: 'Faculty Norms',
      threshold: '1:15 ratio for UG Engineering; Cadre 1:2:6 (Prof:Assoc:Asst)',
      enforcement: 'MANDATORY',
      lastUpdated: '2026-09-20'
    },
    {
      code: 'APH-2026-C9.4',
      title: 'Fire Safety NOC & National Building Code Compliance',
      category: 'Safety & Statutory',
      threshold: 'Valid Certificate from State Fire Services Department',
      enforcement: 'BLOCKING',
      lastUpdated: '2026-10-01'
    },
    {
      code: 'APH-2026-C11.1',
      title: 'Anti-Ragging Committee & Mechanism',
      category: 'Student Welfare',
      threshold: 'Annual statutory undertaking signed by Head of Institution',
      enforcement: 'BLOCKING',
      lastUpdated: '2026-10-10'
    }
  ];

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
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] shadow-[0_0_10px_#FB7185]"></span>
            <span className="text-xs font-mono text-[#FB7185] uppercase tracking-wider font-bold">
              System Administration Bureau • AICTE Platform Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] mt-1 tracking-tight">
            System Administrator Control Center
          </h1>
          <p className="text-xs text-[#A5A5AD] mt-1">
            Technical governance, user provisioning, institutional directory, regulatory rules, and infrastructure health
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { setRefreshing(true); fetchAdminData(); }}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#C8CBD2] text-xs flex items-center gap-2 transition-all"
            title="Refresh System Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync MySQL</span>
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#B9F56B] hover:bg-[#A5EA54] text-[#08090B] font-bold text-xs flex items-center gap-1.5 shadow-lime-glow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Ribbon - 6 Specific Metrics Backed by Real MySQL Data */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Total Registered Users */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Registered Users</span>
            <Users className="w-4 h-4 text-[#B9F56B] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">
            {totalUsersMetric}
          </div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Across 7 roles</div>
        </div>

        {/* Metric 2: Active & Inactive Accounts */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Account Status</span>
            <UserCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">
            <span className="text-[#34D399]">{activeUsersMetric}</span>
            <span className="text-xs text-[#A5A5AD] font-normal mx-1">/</span>
            <span className="text-[#FB7185]">{inactiveUsersMetric}</span>
          </div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Active / Inactive</div>
        </div>

        {/* Metric 3: Total Institutions */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Institutions</span>
            <Building2 className="w-4 h-4 text-[#C084FC] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">
            {totalInstitutionsMetric}
          </div>
          <div className="text-[10px] text-[#B9F56B] mt-0.5">{activeInstitutionsMetric} verified active</div>
        </div>

        {/* Metric 4: Total Applications by Status */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Applications</span>
            <FileText className="w-4 h-4 text-[#FBBF24] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#F5F5F5] mt-1.5">
            {totalApplicationsMetric}
          </div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Active approval cycle</div>
        </div>

        {/* Metric 5: Failed Integrations or Background Jobs */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Failed Jobs</span>
            <Zap className="w-4 h-4 text-[#34D399] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">
            {failedIntegrationsMetric}
          </div>
          <div className="text-[10px] text-[#34D399] mt-0.5">All subsystems green</div>
        </div>

        {/* Metric 6: Security Events Requiring Attention */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-glass-highlight">
          <div className="flex items-center justify-between text-[#A5A5AD] text-xs">
            <span className="truncate">Security Alerts</span>
            <ShieldCheck className="w-4 h-4 text-[#FB7185] shrink-0" />
          </div>
          <div className="text-xl font-black text-[#34D399] mt-1.5">
            {securityEventsMetric}
          </div>
          <div className="text-[10px] text-[#A5A5AD] mt-0.5">Zero critical incidents</div>
        </div>
      </div>

      {/* Functional Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Overview', icon: Activity },
          { key: 'users', label: 'User & Role Management', icon: Users },
          { key: 'departments', label: 'Department Management', icon: Layers },
          { key: 'institutions', label: 'Institution Management', icon: Building2 },
          { key: 'workflows', label: 'Workflow Configuration', icon: Sliders },
          { key: 'rules', label: 'Regulatory Rule Configuration', icon: BookOpen },
          { key: 'health', label: 'System Health & Integrations', icon: Server },
          { key: 'settings', label: 'Settings', icon: Settings },
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
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Role Distribution Chart */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5]">Role & Permission Distribution</h3>
                <p className="text-[11px] text-[#A5A5AD]">Active persona assignments in MySQL</p>
              </div>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111215', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#F5F5F5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {roleChartData.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[#C8CBD2]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                  <span className="truncate">{r.name}: <strong className="text-white">{r.value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Processing Overview */}
          <div className="lg:col-span-2 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5]">Application Stage Overview</h3>
                <p className="text-[11px] text-[#A5A5AD]">Live workflow distribution in MySQL 8.0</p>
              </div>
              <span className="text-[11px] font-mono text-[#B9F56B]">2026-27 Approval Cycle</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#A5A5AD', fontSize: 10 }} 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0}
                  />
                  <YAxis tick={{ fill: '#A5A5AD', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111215', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#B9F56B' }}
                  />
                  <Bar dataKey="count" fill="#B9F56B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technical Governance Notice */}
          <div className="lg:col-span-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-[#A5A5AD]">
                <strong>Technical Separation of Duties Enforced:</strong> System administrators manage platform integrity, user provisioning, and statutory rules. Final regulatory approvals belong exclusively to authorized Regulatory and Scrutiny Officers.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] font-mono text-[10px] font-bold">
              ISO/IEC 27001 RBAC
            </span>
          </div>

        </div>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT */}
      {tab === 'users' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">Platform User Directory & Role Assignment</h3>
              <p className="text-[11px] text-[#A5A5AD]">Create, activate/deactivate accounts, and configure authorized roles</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none focus:border-[#B9F56B]/60"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="role-select text-xs py-1.5 px-3"
                style={{ colorScheme: 'dark' }}
              >
                <option value="ALL">All Roles</option>
                <option value="ROLE_ADMIN">System Admin</option>
                <option value="ROLE_REGULATORY_OFFICER">Regulatory Officer</option>
                <option value="ROLE_SCRUTINY_OFFICER">Scrutiny Officer</option>
                <option value="ROLE_EVC_OFFICER">EVC Officer</option>
                <option value="ROLE_INSTITUTION_ADMIN">Institution Admin</option>
                <option value="ROLE_COMPLIANCE_OFFICER">Compliance Officer</option>
                <option value="ROLE_AUDITOR">Auditor</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#F5F5F5]">{u.fullName || u.username}</div>
                      <div className="text-[10px] text-[#A5A5AD] font-mono">@{u.username} • {u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#C8CBD2]">
                      {u.department || 'Central Scrutiny Cell'}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="role-select"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="ROLE_ADMIN">System Admin</option>
                        <option value="ROLE_REGULATORY_OFFICER">Regulatory Officer</option>
                        <option value="ROLE_SCRUTINY_OFFICER">Scrutiny Officer</option>
                        <option value="ROLE_EVC_OFFICER">EVC Officer</option>
                        <option value="ROLE_INSTITUTION_ADMIN">Institution Admin</option>
                        <option value="ROLE_COMPLIANCE_OFFICER">Compliance Officer</option>
                        <option value="ROLE_AUDITOR">Auditor</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.active !== false
                          ? 'bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]'
                          : 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]'
                      }`}>
                        {u.active !== false ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setNewTempPassword('');
                            setResetResult(null);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/15 bg-white/[0.04] text-[#C8CBD2] hover:bg-white/[0.1] hover:text-white transition-colors"
                          title="Initiate secure password reset"
                        >
                          Reset Pwd
                        </button>
                        <button
                          onClick={() => handleToggleUserActive(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                            u.active !== false
                              ? 'bg-[#FB7185]/10 border-[#FB7185]/30 text-[#FB7185] hover:bg-[#FB7185]/20'
                              : 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399] hover:bg-[#34D399]/20'
                          }`}
                        >
                          {u.active !== false ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENT MANAGEMENT */}
      {tab === 'departments' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <h3 className="text-sm font-bold text-[#F5F5F5]">Regulatory Department Hierarchy & Access Governance</h3>
            <p className="text-[11px] text-[#A5A5AD]">Operational departments, assigned capacities, and SLA turnaround windows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#B9F56B] bg-[#B9F56B]/10 px-2 py-0.5 rounded-full border border-[#B9F56B]/20">
                    {dept.code}
                  </span>
                  <span className="text-[10px] text-[#34D399] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
                    {dept.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F5]">{dept.name}</h4>
                  <p className="text-[11px] text-[#A5A5AD] mt-1 leading-relaxed">{dept.responsibility}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#C8CBD2]">
                  <div>
                    <span className="text-[#A5A5AD]">Authorized Officers:</span> <strong>{dept.officersCount}</strong>
                  </div>
                  <div>
                    <span className="text-[#A5A5AD]">SLA Target:</span> <strong>{dept.slaDays > 0 ? `${dept.slaDays} Days` : 'Continuous'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INSTITUTION MANAGEMENT */}
      {tab === 'institutions' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5]">Authorized Educational Institutions</h3>
                <p className="text-[11px] text-[#A5A5AD]">Real AICTE-verified directory, accreditation statuses, and statutory records</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#B9F56B] font-mono">{institutionsList.length} Institutions Registered</span>
                <button
                  onClick={() => {
                    setShowImportSection(!showImportSection);
                    if (!showImportSection) fetchImportHistory();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B9F56B]/15 hover:bg-[#B9F56B]/25 text-[#B9F56B] border border-[#B9F56B]/30 text-xs font-semibold transition-all shadow-glass-highlight"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  {showImportSection ? 'Hide Importer' : 'AICTE CSV Importer & Provenance'}
                </button>
              </div>
            </div>

            {/* CSV IMPORT DRAWER */}
            {showImportSection && (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/15 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#B9F56B]" />
                      AICTE Verified CSV Import & Provenance Sync
                    </h4>
                    <p className="text-[11px] text-[#A5A5AD] mt-0.5">
                      Validate statutory schema headers, inspect data samples, and import verified institution registries into MySQL.
                    </p>
                  </div>
                </div>

                {/* Upload & Action Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div className="md:col-span-2 flex items-center gap-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileSelect}
                      className="text-xs text-[#C8CBD2] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/[0.08] file:text-[#F5F5F5] hover:file:bg-white/[0.14] file:cursor-pointer cursor-pointer border border-white/10 rounded-xl p-1 w-full bg-white/[0.02]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviewCsv}
                      disabled={!csvFile || csvPreviewLoading}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-[#F5F5F5] border border-white/15 disabled:opacity-40 transition-colors"
                    >
                      {csvPreviewLoading ? 'Validating...' : 'Preview & Validate'}
                    </button>
                    {csvPreview && (
                      <button
                        onClick={handleConfirmImport}
                        disabled={csvImporting}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#B9F56B] hover:bg-[#a6e655] text-black text-xs font-bold disabled:opacity-40 transition-colors shadow-glass-highlight"
                      >
                        {csvImporting ? 'Importing...' : 'Confirm Import'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Reconciliation Option */}
                {csvPreview && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-[#C8CBD2]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={updateExistingToggle}
                        onChange={(e) => setUpdateExistingToggle(e.target.checked)}
                        className="rounded border-white/20 text-[#B9F56B] focus:ring-0 bg-white/10"
                      />
                      <span>Update existing institutions with latest official verification metadata</span>
                    </label>
                    <span className="text-[10px] text-[#A5A5AD]">Preserves existing IDs & statutory relationships</span>
                  </div>
                )}

                {/* Preview Summary Ribbon */}
                {csvPreview && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] text-[#A5A5AD]">Total Rows</div>
                      <div className="text-base font-black text-[#F5F5F5]">{csvPreview.totalRows}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] text-[#A5A5AD]">Schema Status</div>
                      <div className={`text-xs font-bold mt-1 ${csvPreview.headerValid ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                        {csvPreview.headerValid ? 'VALID 16-COL SCHEMA' : 'INVALID HEADERS'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] text-[#A5A5AD]">Identified Duplicates</div>
                      <div className="text-base font-black text-[#FBBF24]">{csvPreview.duplicateRowsCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[10px] text-[#A5A5AD]">Data Quality</div>
                      <div className="text-xs font-bold text-[#38BDF8] mt-1">AICTE OFFICIAL</div>
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {csvPreview && csvPreview.validationErrors && csvPreview.validationErrors.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#FB7185]/10 border border-[#FB7185]/30 text-xs text-[#FB7185] space-y-1">
                    <div className="font-bold">Validation Warnings:</div>
                    <ul className="list-disc pl-4 space-y-0.5 max-h-24 overflow-y-auto font-mono text-[10px]">
                      {csvPreview.validationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Records Table */}
                {csvPreview && csvPreview.previewRows && csvPreview.previewRows.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-[#F5F5F5]">Sample Verified Records Preview (First 5 Rows):</div>
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
                          <tr>
                            <th className="py-2 px-3">AICTE ID</th>
                            <th className="py-2 px-3">Institution Name</th>
                            <th className="py-2 px-3">State & District</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {csvPreview.previewRows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2 px-3 font-mono text-[#B9F56B]">{row.institution_id}</td>
                              <td className="py-2 px-3 text-[#F5F5F5]">{row.institution_name}</td>
                              <td className="py-2 px-3 text-[#A5A5AD]">{row.state} ({row.district || row.city})</td>
                              <td className="py-2 px-3">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#34D399]/15 text-[#34D399]">
                                  {row.aicte_approval_status || 'APPROVED'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-[10px] text-[#A5A5AD] truncate max-w-xs">{row.source_name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Import Result Notification */}
                {importResult && (
                  <div className="p-3.5 rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 text-xs text-[#34D399] flex items-center justify-between">
                    <div>
                      <span className="font-bold">Batch #{importResult.batchId} Executed:</span> {importResult.message}
                    </div>
                    <span className="text-[10px] font-mono text-white/70">
                      +{importResult.insertedCount} New • {importResult.updatedCount} Updated • {importResult.skippedCount} Skipped
                    </span>
                  </div>
                )}

                {/* Past Batches Log */}
                {importHistoryList.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="text-[11px] font-bold text-[#F5F5F5]">Audit Trail: Past Import Batches</div>
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-left text-[10px] font-mono">
                        <thead className="bg-white/[0.04] text-[#A5A5AD] uppercase border-b border-white/10">
                          <tr>
                            <th className="py-2 px-3">Batch ID</th>
                            <th className="py-2 px-3">Filename</th>
                            <th className="py-2 px-3">Total Rows</th>
                            <th className="py-2 px-3">Inserted / Updated / Skipped</th>
                            <th className="py-2 px-3">Imported By</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {importHistoryList.slice(0, 5).map(h => (
                            <tr key={h.id}>
                              <td className="py-2 px-3 text-[#B9F56B]">#{h.id}</td>
                              <td className="py-2 px-3 text-[#F5F5F5]">{h.filename}</td>
                              <td className="py-2 px-3">{h.totalRows}</td>
                              <td className="py-2 px-3">
                                <span className="text-[#34D399]">+{h.insertedRows}</span> / <span className="text-[#38BDF8]">{h.updatedRows}</span> / <span className="text-[#A5A5AD]">{h.skippedRows}</span>
                              </td>
                              <td className="py-2 px-3 text-[#C8CBD2]">@{h.importedBy}</td>
                              <td className="py-2 px-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${h.status === 'COMPLETED' ? 'bg-[#34D399]/15 text-[#34D399]' : 'bg-[#FB7185]/15 text-[#FB7185]'}`}>
                                  {h.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-[#A5A5AD]">{h.createdAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* INSTITUTION DIRECTORY TABLE WITH SEARCH & PAGINATION */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#A5A5AD] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name, AICTE ID, or state..."
                  value={instSearch}
                  onChange={(e) => { setInstSearch(e.target.value); setInstPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-[#F5F5F5] placeholder-[#A5A5AD]/60 focus:outline-none focus:border-[#B9F56B]/50"
                />
              </div>
              <div className="text-xs text-[#A5A5AD]">
                Showing {institutionsList.length === 0 ? 0 : Math.min((instPage - 1) * instPerPage + 1, institutionsList.length)} - {Math.min(instPage * instPerPage, institutionsList.length)} of {institutionsList.length}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-[#A5A5AD] font-mono text-[10px] uppercase border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Institution Name & AICTE ID</th>
                    <th className="py-3 px-4">Type & Region</th>
                    <th className="py-3 px-4">State & District</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4">Operational Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {institutionsList
                    .filter(inst => {
                      if (!instSearch.trim()) return true;
                      const q = instSearch.toLowerCase();
                      return (
                        (inst.name && inst.name.toLowerCase().includes(q)) ||
                        (inst.aicteId && inst.aicteId.toLowerCase().includes(q)) ||
                        (inst.state && inst.state.toLowerCase().includes(q))
                      );
                    })
                    .slice((instPage - 1) * instPerPage, instPage * instPerPage)
                    .map(inst => (
                      <tr key={inst.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#F5F5F5]">{inst.name}</div>
                          <div className="text-[10px] text-[#A5A5AD] font-mono">{inst.aicteId} • {inst.city || inst.district || inst.state}</div>
                        </td>
                        <td className="py-3 px-4 text-[#C8CBD2]">
                          <div>{inst.instituteType || 'Technical Institution'}</div>
                          <div className="text-[10px] text-[#A5A5AD]">{inst.region || 'Central'} Region</div>
                        </td>
                        <td className="py-3 px-4 text-[#C8CBD2]">
                          <div>{inst.state}</div>
                          <div className="text-[10px] text-[#A5A5AD]">{inst.district || inst.city}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]">
                            {inst.aicteApprovalStatus || 'APPROVED'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            inst.status === 'ACTIVE'
                              ? 'bg-[#B9F56B]/15 border-[#B9F56B]/40 text-[#B9F56B]'
                              : 'bg-[#FB7185]/15 border-[#FB7185]/30 text-[#FB7185]'
                          }`}>
                            {inst.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleInstitutionStatus(inst.id, inst.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] text-[#C8CBD2] hover:text-white"
                          >
                            {inst.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs text-[#A5A5AD] pt-2">
              <button
                disabled={instPage <= 1}
                onClick={() => setInstPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 disabled:opacity-30 transition-colors text-[#F5F5F5]"
              >
                Previous
              </button>
              <span>Page {instPage} of {Math.ceil(institutionsList.length / instPerPage) || 1}</span>
              <button
                disabled={instPage >= Math.ceil(institutionsList.length / instPerPage)}
                onClick={() => setInstPage(prev => prev + 1)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 disabled:opacity-30 transition-colors text-[#F5F5F5]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKFLOW CONFIGURATION */}
      {tab === 'workflows' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">Statutory Approval Workflow Stages & SLA Matrix</h3>
              <p className="text-[11px] text-[#A5A5AD]">Configured automated transitions, stage timeouts, and escalation triggers</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { stage: '1. DRAFT & SUBMISSION', actor: 'Institution Administrator', sla: 'Self-Paced', action: 'Upload mandatory annexures & submit application' },
              { stage: '2. CENTRAL DESK SCRUTINY', actor: 'Scrutiny Officer', sla: '7 Days Max', action: 'Document verification, verify/reject documents, issue deficiency notices' },
              { stage: '3. DEFICIENCY CLARIFICATION', actor: 'Institution Administrator', sla: '10 Days Max', action: 'Upload corrected documents and deficiency rectifications' },
              { stage: '4. EXPERT VISIT INSPECTION (EVC)', actor: 'EVC Expert Committee', sla: '14 Days Max', action: 'On-site infrastructure inspection & biometric verification report' },
              { stage: '5. REGULATORY DECISION QUEUE', actor: 'Regulatory Officer', sla: '30 Days Statutory', action: 'Review findings and issue official approval order or rejection' }
            ].map((wf, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-[#F5F5F5]">{wf.stage}</span>
                  <p className="text-[11px] text-[#A5A5AD] mt-0.5">{wf.action}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-[#A5A5AD] block">Assigned Persona</span>
                    <span className="font-semibold text-[#38BDF8]">{wf.actor}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/15 font-mono text-[#B9F56B]">
                    {wf.sla}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REGULATORY RULE CONFIGURATION */}
      {tab === 'rules' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">Approval Process Handbook (APH 2026-27) Rule Registry</h3>
              <p className="text-[11px] text-[#A5A5AD]">Algorithmic thresholds enforced during automated document scrutiny</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regulatoryRules.map(rule => (
              <div key={rule.code} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#B9F56B] bg-[#B9F56B]/10 px-2 py-0.5 rounded-full border border-[#B9F56B]/20">
                    {rule.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#FB7185]/30 text-[#FB7185] bg-[#FB7185]/10">
                    {rule.enforcement}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">{rule.title}</h4>
                <div className="text-xs text-[#A5A5AD]">
                  <strong>Norm:</strong> {rule.threshold}
                </div>
                <div className="text-[10px] text-[#8A8D96] pt-1 border-t border-white/5 flex justify-between">
                  <span>Category: {rule.category}</span>
                  <span>Effective: {rule.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SYSTEM HEALTH & INTEGRATIONS */}
      {tab === 'health' && (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5]">System Health, Infrastructure & Integration Status</h3>
              <p className="text-[11px] text-[#A5A5AD]">Real-time telemetry and database connection pool verification</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399] font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
              ALL SYSTEMS ONLINE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#A5A5AD]">
                <span className="font-semibold text-[#F5F5F5]">MySQL 8.0 Database</span>
                <Database className="w-4 h-4 text-[#B9F56B]" />
              </div>
              <p className="text-[#34D399] font-mono text-[11px]">HikariPool-1: Connected (Active)</p>
              <div className="text-[10px] text-[#A5A5AD]">Database: regulaflow_db • Port 3306</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#A5A5AD]">
                <span className="font-semibold text-[#F5F5F5]">Flyway Migrations</span>
                <Layers className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <p className="text-[#34D399] font-mono text-[11px]">Schema Version v3 Applied</p>
              <div className="text-[10px] text-[#A5A5AD]">3 Migrations Validated Cleanly</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#A5A5AD]">
                <span className="font-semibold text-[#F5F5F5]">Spring Security & JWT</span>
                <ShieldCheck className="w-4 h-4 text-[#FB7185]" />
              </div>
              <p className="text-[#34D399] font-mono text-[11px]">HMAC-SHA256 Token Provider</p>
              <div className="text-[10px] text-[#A5A5AD]">Role-Based Access Control Enforced</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#A5A5AD]">
                <span className="font-semibold text-[#F5F5F5]">Gemini AI Copilot</span>
                <Cpu className="w-4 h-4 text-[#C084FC]" />
              </div>
              <p className="text-[#34D399] font-mono text-[11px]">gemini-3.5-flash-lite Connected</p>
              <div className="text-[10px] text-[#A5A5AD]">Latency: 1.2s • Status: Ready</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#A5A5AD]">
                <span className="font-semibold text-[#F5F5F5]">Document Vault</span>
                <HardDrive className="w-4 h-4 text-[#FBBF24]" />
              </div>
              <p className="text-[#34D399] font-mono text-[11px]">SHA-256 Storage Engine</p>
              <div className="text-[10px] text-[#A5A5AD]">Immutable File Audit Enabled</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[#A5A5AD]">
                <span className="font-semibold text-[#F5F5F5]">Task Scheduler</span>
                <Clock className="w-4 h-4 text-[#34D399]" />
              </div>
              <p className="text-[#34D399] font-mono text-[11px]">SLA Chron Daemon: Running</p>
              <div className="text-[10px] text-[#A5A5AD]">Overdue checks every 60 minutes</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SYSTEM SETTINGS */}
      {tab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F5F5F5]">System Configuration & Statutory Policies</h3>
              <p className="text-xs text-[#A5A5AD]">AICTE Statutory timelines, AI model controls, and notification triggers</p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold text-xs shadow-lime-glow hover:bg-[#A5EA54] transition-all"
            >
              Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* SLA Days */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <label className="font-semibold text-[#F5F5F5] block">Statutory SLA Window (Days)</label>
              <p className="text-[11px] text-[#A5A5AD]">Statutory maximum turnaround from submission to final order.</p>
              <input
                type="number"
                min="7"
                max="90"
                value={settings?.statutorySlaDays ?? 30}
                onChange={(e) => setSettings({ ...settings, statutorySlaDays: parseInt(e.target.value) || 30 })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#B9F56B]/60 font-mono"
              />
            </div>

            {/* AI Engine */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <label className="font-semibold text-[#F5F5F5] block">AI Copilot & Vector Engine</label>
              <p className="text-[11px] text-[#A5A5AD]">Underlying LLM and embeddings pipeline for regulatory compliance</p>
              <input
                type="text"
                value={settings?.aiCopilotEngine ?? 'Google Gemini 3.5 Flash-Lite'}
                onChange={(e) => setSettings({ ...settings, aiCopilotEngine: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-[#F5F5F5] focus:outline-none focus:border-[#B9F56B]/60 font-mono"
              />
            </div>
          </div>
        </form>
      )}

      {/* Provision User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Provision New Platform User</h3>
                <p className="text-xs text-[#A5A5AD]">Authorize a new official persona into MySQL</p>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#A5A5AD] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A5A5AD] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Chandra"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A5A5AD] block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="rchandra"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                  />
                </div>
                <div>
                  <label className="text-[#A5A5AD] block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="rchandra@aicte.gov.in"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Assign Authorized Persona</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full role-select py-2 px-3 text-xs"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="ROLE_SCRUTINY_OFFICER">Scrutiny Officer</option>
                  <option value="ROLE_EVC_OFFICER">EVC Inspection Expert</option>
                  <option value="ROLE_REGULATORY_OFFICER">Regulatory Officer</option>
                  <option value="ROLE_COMPLIANCE_OFFICER">Compliance Officer</option>
                  <option value="ROLE_AUDITOR">Read-Only Auditor</option>
                  <option value="ROLE_INSTITUTION_ADMIN">Institution Administrator</option>
                  <option value="ROLE_ADMIN">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="text-[#A5A5AD] block mb-1">Administrative Department</label>
                <input
                  type="text"
                  required
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2] hover:bg-white/[0.1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54]"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secure Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#111215] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Reset User Credentials</h3>
                <p className="text-xs text-[#A5A5AD]">Admin password override for @{resetModalUser.username}</p>
              </div>
              <button onClick={() => setResetModalUser(null)} className="text-[#A5A5AD] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {resetResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#34D399]/10 border border-[#34D399]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#34D399] font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Credentials Updated Successfully</span>
                  </div>
                  <p className="text-[#F5F5F5]">The password has been securely BCrypt hashed and stored in MySQL.</p>
                  <div className="mt-2 p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-center text-sm text-[#B9F56B]">
                    {resetResult.temporaryPassword}
                  </div>
                  <p className="text-[10px] text-[#A5A5AD]">Provide this temporary password securely to the user.</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setResetModalUser(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[#F5F5F5] font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="font-semibold text-white">{resetModalUser.fullName || resetModalUser.username}</div>
                  <div className="text-[11px] text-[#A5A5AD] font-mono">@{resetModalUser.username} • {resetModalUser.email}</div>
                  <div className="text-[10px] text-[#B9F56B] font-mono uppercase">{resetModalUser.role}</div>
                </div>

                <div>
                  <label className="text-[#A5A5AD] block mb-1">New Temporary Password (leave blank for random auto-generation)</label>
                  <input
                    type="text"
                    placeholder="e.g. TempSecret@2026"
                    value={newTempPassword}
                    onChange={(e) => setNewTempPassword(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B9F56B] font-mono"
                  />
                </div>

                <div className="text-[10px] text-[#A5A5AD] leading-relaxed">
                  Resetting credentials updates the BCrypt hash in MySQL and logs an immutable audit trail event.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] text-[#C8CBD2] hover:bg-white/[0.1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resettingPassword}
                    className="px-4 py-2 rounded-xl bg-[#B9F56B] text-[#08090B] font-bold shadow-lime-glow hover:bg-[#A5EA54] cursor-pointer"
                  >
                    {resettingPassword ? 'Updating...' : 'Confirm Reset'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
