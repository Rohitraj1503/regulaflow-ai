import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  ShieldAlert, 
  BookOpen, 
  Sparkles, 
  Bell, 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  Search, 
  ChevronDown, 
  LogOut, 
  Menu, 
  X,
  User,
  Building2,
  CheckCircle2,
  Users,
  FileSearch,
  Check,
  ChevronRight,
  Layers,
  FileCheck,
  Clock,
  ExternalLink,
  Sliders,
  Activity
} from 'lucide-react';

export default function EnterpriseLayout({ children, activeSection = 'dashboard' }) {
  const { user, switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [switching, setSwitching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const [nRes, uRes] = await Promise.all([
        api.getNotifications().catch(() => ({ data: [] })),
        api.getUnreadCount().catch(() => ({ data: { unreadCount: 0 } }))
      ]);
      if (nRes && nRes.data) {
        setNotifications(nRes.data);
      } else {
        setNotifications([]);
      }
      if (uRes && uRes.data && uRes.data.unreadCount !== undefined) {
        setUnreadCount(uRes.data.unreadCount);
      }
    } catch (e) {
      console.error(e);
      setNotifications([]);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead().catch(() => {});
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  // Authenticated persona information
  const currentRole = user?.role || 'ROLE_REGULATORY_OFFICER';
  const authorizedRoles = [currentRole];

  const roleMeta = {
    ROLE_ADMIN: { title: 'System Administrator', short: 'Admin', color: '#FB7185' },
    ROLE_REGULATORY_OFFICER: { title: 'Regulatory Officer', short: 'Reg Officer', color: '#B9F56B' },
    ROLE_SCRUTINY_OFFICER: { title: 'Scrutiny Officer', short: 'Scrutiny', color: '#38BDF8' },
    ROLE_EVC_OFFICER: { title: 'EVC Officer', short: 'EVC Officer', color: '#FBBF24' },
    ROLE_INSTITUTION_ADMIN: { title: 'Institution Admin', short: 'Institution', color: '#C084FC' },
    ROLE_COMPLIANCE_OFFICER: { title: 'Compliance Officer', short: 'Compliance', color: '#34D399' },
    ROLE_AUDITOR: { title: 'Read-only Auditor', short: 'Auditor', color: '#94A3B8' },
  };

  const currentRoleInfo = roleMeta[currentRole] || { title: 'Officer', short: 'Officer', color: '#B9F56B' };

  const handleSwitchUser = () => {
    setRoleSwitcherOpen(false);
    logout();
    navigate('/login');
  };

  // 7 Dedicated Role-Specific Sidebar Navigation Menus matching exact specifications
  const getNavLinks = () => {
    switch (currentRole) {
      case 'ROLE_ADMIN':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'users', label: 'User & Role Management', path: '/dashboard?tab=users', icon: Users },
          { key: 'departments', label: 'Department Management', path: '/dashboard?tab=departments', icon: Layers },
          { key: 'institutions', label: 'Institution Management', path: '/dashboard?tab=institutions', icon: Building2 },
          { key: 'workflows', label: 'Workflow Configuration', path: '/dashboard?tab=workflows', icon: Sliders },
          { key: 'rules', label: 'Regulatory Rule Configuration', path: '/dashboard?tab=rules', icon: BookOpen },
          { key: 'audit', label: 'System Audit Logs', path: '/audit-trail', icon: FileSpreadsheet },
          { key: 'health', label: 'System Health & Integrations', path: '/dashboard?tab=health', icon: Activity },
          { key: 'settings', label: 'Settings', path: '/dashboard?tab=settings', icon: Settings },
        ];

      case 'ROLE_REGULATORY_OFFICER':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'assigned', label: 'Assigned Applications', path: '/dashboard?tab=assigned', icon: FileText },
          { key: 'status', label: 'Application Status', path: '/dashboard?tab=status', icon: Clock },
          { key: 'pending', label: 'Pending Regulatory Actions', path: '/dashboard?tab=pending', icon: ShieldCheck },
          { key: 'decision-queue', label: 'Decision Queue', path: '/dashboard?tab=decision-queue', icon: CheckCircle2 },
          { key: 'clarifications', label: 'Clarifications', path: '/dashboard?tab=clarifications', icon: ShieldAlert },
          { key: 'notifications', label: 'Regulatory Notifications', path: '/dashboard?tab=notifications', icon: Bell, badgeCount: unreadCount },
          { key: 'reports', label: 'Reports', path: '/knowledge-graph', icon: BarChart3 },
        ];

      case 'ROLE_SCRUTINY_OFFICER':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'assigned', label: 'Assigned Applications', path: '/dashboard?tab=assigned', icon: FileText },
          { key: 'pending-docs', label: 'Pending Document Verification', path: '/dashboard?tab=pending-docs', icon: FileSearch },
          { key: 'incomplete', label: 'Incomplete Applications', path: '/dashboard?tab=incomplete', icon: Clock },
          { key: 'deficiencies', label: 'Deficiencies', path: '/dashboard?tab=deficiencies', icon: ShieldAlert },
          { key: 'resubmitted', label: 'Resubmitted Applications', path: '/dashboard?tab=resubmitted', icon: CheckCircle2 },
          { key: 'completed', label: 'Completed Reviews', path: '/dashboard?tab=completed', icon: FileCheck },
        ];

      case 'ROLE_EVC_OFFICER':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'assigned', label: 'Assigned Inspections', path: '/dashboard?tab=assigned', icon: Calendar },
          { key: 'schedule', label: 'Inspection Schedule', path: '/dashboard?tab=schedule', icon: Clock },
          { key: 'pending-reports', label: 'Pending Reports', path: '/dashboard?tab=pending-reports', icon: FileSearch },
          { key: 'submitted-reports', label: 'Submitted Reports', path: '/dashboard?tab=submitted-reports', icon: FileCheck },
          { key: 'history', label: 'Inspection History', path: '/dashboard?tab=history', icon: FileSpreadsheet },
        ];

      case 'ROLE_INSTITUTION_ADMIN':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'profile', label: 'Institution Profile', path: '/dashboard?tab=profile', icon: Building2 },
          { key: 'my-applications', label: 'My Applications', path: '/dashboard?tab=my-applications', icon: FileText },
          { key: 'new-application', label: '+ New Application', path: '/dashboard?tab=new-application', icon: FileText, highlight: true },
          { key: 'documents', label: 'Required Documents', path: '/dashboard?tab=documents', icon: BookOpen },
          { key: 'deficiencies', label: 'Deficiencies & Corrections', path: '/dashboard?tab=deficiencies', icon: ShieldAlert },
          { key: 'notifications', label: 'Notifications', path: '/dashboard?tab=notifications', icon: Bell, badgeCount: unreadCount },
          { key: 'history', label: 'Submission History', path: '/dashboard?tab=history', icon: Clock },
        ];

      case 'ROLE_COMPLIANCE_OFFICER':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'obligations', label: 'Compliance Obligations', path: '/dashboard?tab=obligations', icon: ShieldAlert },
          { key: 'evidence', label: 'Evidence Review', path: '/dashboard?tab=evidence', icon: FileCheck },
          { key: 'deadlines', label: 'Upcoming Deadlines', path: '/dashboard?tab=deadlines', icon: Calendar },
          { key: 'overdue', label: 'Overdue Items', path: '/dashboard?tab=overdue', icon: Clock },
          { key: 'corrective-actions', label: 'Corrective Actions', path: '/dashboard?tab=corrective-actions', icon: CheckCircle2 },
          { key: 'reports', label: 'Compliance Reports', path: '/dashboard?tab=reports', icon: BarChart3 },
        ];

      case 'ROLE_AUDITOR':
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'audit-trail', label: 'Audit Trail', path: '/dashboard?tab=audit-trail', icon: FileSpreadsheet },
          { key: 'application-history', label: 'Application History', path: '/dashboard?tab=application-history', icon: FileText },
          { key: 'doc-history', label: 'Document Verification History', path: '/dashboard?tab=doc-history', icon: FileSearch },
          { key: 'workflow-transitions', label: 'Workflow Transitions', path: '/dashboard?tab=workflow-transitions', icon: ShieldCheck },
          { key: 'decision-history', label: 'Decision History', path: '/dashboard?tab=decision-history', icon: CheckCircle2 },
          { key: 'compliance-audit', label: 'Compliance Audit', path: '/dashboard?tab=compliance-audit', icon: ShieldAlert },
          { key: 'export-reports', label: 'Export Reports', path: '/dashboard?tab=export-reports', icon: BarChart3 },
        ];

      default:
        return [
          { key: 'overview', label: 'Overview', path: '/dashboard?tab=overview', icon: LayoutDashboard },
          { key: 'applications', label: 'Applications', path: '/dashboard?tab=assigned', icon: FileText },
          { key: 'reports', label: 'Reports', path: '/knowledge-graph', icon: BarChart3 },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F5F5F5] flex font-sans overflow-hidden">
      
      {/* Ambient smoky blurred glass light orbs */}
      <div className="fixed top-12 left-44 w-96 h-96 rounded-full bg-white/[0.03] blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-20 w-[30rem] h-[30rem] rounded-full bg-[#B9F56B]/[0.025] blur-[140px] pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/3 w-80 h-80 rounded-full bg-white/[0.02] blur-[100px] pointer-events-none"></div>

      {/* Desktop Left Sidebar (Translucent Dark Glass) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111215]/80 backdrop-blur-[20px] border-r border-white/10 shrink-0 select-none z-30">
        
        {/* Brand */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-[#B9F56B] shadow-glass-highlight group-hover:border-[#B9F56B]/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#B9F56B] stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#F5F5F5] flex items-center gap-1.5">
                RegulaFlow <span className="text-[#B9F56B]">AI</span>
              </span>
              <div className="text-[10px] text-[#A5A5AD] font-medium leading-none">
                {currentRoleInfo.title}
              </div>
            </div>
          </Link>
        </div>

        {/* Current Active Role Indicator */}
        <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full shadow-[0_0_8px]" 
              style={{ backgroundColor: currentRoleInfo.color, boxShadow: `0 0 8px ${currentRoleInfo.color}` }}
            ></span>
            <span className="text-xs font-semibold text-[#F5F5F5] truncate">
              {currentRoleInfo.title}
            </span>
          </div>
        </div>

        {/* Role-Specific Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const [linkPathOnly, linkQuery] = link.path.split('?');
            const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';
            const linkTab = linkQuery ? new URLSearchParams(`?${linkQuery}`).get('tab') : null;
            const isActive = location.pathname === linkPathOnly && (
              linkTab ? currentTab === linkTab : (!location.search || currentTab === 'overview')
            );
            return (
              <Link
                key={link.key}
                to={link.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-[#B9F56B] border border-white/20 shadow-glass-highlight font-semibold'
                    : link.highlight
                    ? 'bg-[#B9F56B] text-[#08090B] hover:bg-[#A5EA54] font-bold shadow-lime-glow'
                    : 'text-[#A5A5AD] hover:text-[#F5F5F5] hover:bg-white/[0.05] hover:border-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9F56B]' : link.highlight ? 'text-[#08090B]' : 'text-[#C8CBD2]'}`} />
                  <span>{link.label}</span>
                </div>

                {link.badgeCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/[0.12] text-[#F5F5F5] border border-white/20 text-[10px] font-bold flex items-center justify-center">
                    {link.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Platform Info */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] text-[11px] text-[#A5A5AD] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#C8CBD2]">SIH 2026 Engine</span>
            <span className="text-[10px] font-mono text-[#B9F56B] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9F56B]"></span>
              Live v2.1
            </span>
          </div>

          <div className="w-full py-1.5 px-3 rounded-xl bg-white/[0.03] text-[#A5A5AD] text-[10px] font-mono text-center border border-white/10">
            RBAC Enforcement: ACTIVE
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-[#111215]/75 backdrop-blur-[20px] border-b border-white/10 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.06] border border-white/15 text-[#F5F5F5]"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Search bar & Breadcrumbs */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-[#A5A5AD] absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${currentRoleInfo.title} records...`}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-[#F5F5F5] placeholder-[#A5A5AD] focus:outline-none focus:border-[#B9F56B]/60 transition-all"
              />
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            
            {/* Top Navigation Persona Badge & Scope Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold transition-all shadow-glass-highlight"
                title="Current Authenticated Persona & Scope"
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: currentRoleInfo.color }}
                ></span>
                <span className="hidden md:inline text-[#F5F5F5]">{currentRoleInfo.short}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#A5A5AD] transition-transform duration-200 ${roleSwitcherOpen ? 'rotate-180 text-[#B9F56B]' : ''}`} />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#111215]/95 backdrop-blur-[20px] border border-white/20 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in text-left">
                  <div className="pb-2 border-b border-white/10 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white uppercase tracking-wider">Active Persona</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#B9F56B]/15 text-[#B9F56B] border border-[#B9F56B]/30">
                      AUTHENTICATED
                    </span>
                  </div>

                  <div className="py-2 space-y-1.5">
                    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: currentRoleInfo.color }}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{currentRoleInfo.title}</div>
                        <div className="text-[10px] text-[#A5A5AD] font-mono truncate">@{user?.username} • {user?.department || 'AICTE Bureau'}</div>
                      </div>
                      <Check className="w-4 h-4 text-[#B9F56B] shrink-0" />
                    </div>

                    {currentRole === 'ROLE_ADMIN' && (
                      <Link
                        to="/dashboard?tab=users"
                        onClick={() => setRoleSwitcherOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/[0.03] hover:bg-white/[0.08] text-[#F5F5F5] border border-white/10 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#B9F56B]" />
                          <span>User & Role Governance</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#A5A5AD]" />
                      </Link>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="text-[10px] text-[#A5A5AD] px-1 leading-relaxed">
                      Role switching without valid credentials is prohibited. Each persona requires separate authentication.
                    </div>
                    <button
                      onClick={handleSwitchUser}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FB7185]/10 hover:bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out & Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gemini AI Copilot button */}
            <Link
              to="/copilot"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#F5F5F5] text-xs font-medium transition-all shadow-glass-highlight"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B9F56B]" />
              <span>Gemini AI</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white/[0.06] border border-white/15 text-[#C8CBD2] hover:text-white hover:bg-white/[0.1] transition-all shadow-glass-highlight"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B9F56B] text-[#08090B] text-[9px] font-bold flex items-center justify-center shadow-lime-glow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111215]/95 backdrop-blur-[20px] border border-white/20 rounded-2xl shadow-2xl p-3.5 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <span className="text-xs font-semibold text-[#F5F5F5]">Regulatory Notifications</span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-[#B9F56B] cursor-pointer hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="py-2 space-y-2 text-xs max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-[#A5A5AD]">
                        <Bell className="w-5 h-5 mx-auto mb-1.5 opacity-40 text-[#A5A5AD]" />
                        <div className="text-xs font-semibold text-[#F5F5F5]">No notifications</div>
                        <div className="text-[10px] text-[#A5A5AD]">Workflow events and status changes will appear here</div>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors">
                          <div className="font-semibold text-[#F5F5F5]">{n.title}</div>
                          <div className="text-[11px] text-[#A5A5AD]">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
              >
                <div 
                  className="w-8 h-8 rounded-xl bg-white/[0.1] border border-white/20 font-bold text-xs flex items-center justify-center shadow-glass-highlight"
                  style={{ color: currentRoleInfo.color }}
                >
                  {user?.fullName ? user.fullName[0] : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-[#F5F5F5] leading-tight">
                    {user?.fullName || 'User'}
                  </div>
                  <div className="text-[10px] text-[#A5A5AD] leading-tight">
                    {currentRoleInfo.title}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A5A5AD]" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111215]/95 backdrop-blur-[20px] border border-white/20 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-white/10 text-xs">
                    <div className="font-bold text-[#F5F5F5]">{user?.fullName || 'User'}</div>
                    <div className="text-[11px] text-[#A5A5AD] truncate">{user?.email || 'officer@regulaflow.gov.in'}</div>
                    <div className="text-[10px] font-mono text-[#B9F56B] mt-0.5">{currentRoleInfo.title}</div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/select-role"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#A5A5AD] hover:text-white hover:bg-white/[0.06]"
                    >
                      <User className="w-3.5 h-3.5 text-[#B9F56B]" />
                      <span>Switch Role</span>
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#A5A5AD] hover:text-white hover:bg-white/[0.06]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C8CBD2]" />
                      <span>Public Landing Page</span>
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#FB7185] hover:bg-white/[0.06]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#111215]/95 backdrop-blur-[20px] border-r border-white/15 flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-bold text-base text-[#F5F5F5]">RegulaFlow <span className="text-[#B9F56B]">AI</span></span>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-[#A5A5AD]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const [linkPathOnly, linkQuery] = link.path.split('?');
                const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';
                const linkTab = linkQuery ? new URLSearchParams(`?${linkQuery}`).get('tab') : null;
                const isActive = location.pathname === linkPathOnly && (
                  linkTab ? currentTab === linkTab : (!location.search || currentTab === 'overview')
                );
                return (
                  <Link
                    key={link.key}
                    to={link.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/[0.1] text-[#B9F56B] border border-white/20 font-bold'
                        : link.highlight
                        ? 'bg-[#B9F56B] text-[#08090B] font-bold'
                        : 'text-[#A5A5AD] hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9F56B]' : link.highlight ? 'text-[#08090B]' : 'text-[#C8CBD2]'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badgeCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-white/[0.15] text-[#F5F5F5] text-[10px] font-bold flex items-center justify-center">
                        {link.badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

    </div>
  );
}
