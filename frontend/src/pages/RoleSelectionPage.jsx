import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Settings, 
  UserCheck, 
  FileSearch, 
  Calendar, 
  Building2, 
  ShieldAlert, 
  FileSpreadsheet, 
  ArrowRight,
  LogOut,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';

const ROLES = [
  {
    key: 'admin',
    username: 'admin',
    role: 'ROLE_ADMIN',
    title: 'System Administrator',
    description: 'Manage users, roles, RBAC, platform configurations, and audit logs',
    icon: Settings,
    badgeColor: '#FB7185'
  },
  {
    key: 'reg_officer',
    username: 'reg_officer',
    role: 'ROLE_REGULATORY_OFFICER',
    title: 'Regulatory Officer',
    description: 'Overall approval operations, officer assignments, priority queue, and decision orders',
    icon: UserCheck,
    badgeColor: '#B9F56B'
  },
  {
    key: 'scrutiny_officer',
    username: 'scrutiny_officer',
    role: 'ROLE_SCRUTINY_OFFICER',
    title: 'Scrutiny Officer',
    description: 'Statutory document verification, deficiency notes, and resubmission review',
    icon: FileSearch,
    badgeColor: '#38BDF8'
  },
  {
    key: 'evc_officer',
    username: 'evc_officer',
    role: 'ROLE_EVC_OFFICER',
    title: 'EVC Officer',
    description: 'Expert Visit Committee scheduling, physical inspection scores, and visit reports',
    icon: Calendar,
    badgeColor: '#FBBF24'
  },
  {
    key: 'inst_admin',
    username: 'inst_admin',
    role: 'ROLE_INSTITUTION_ADMIN',
    title: 'Institution Administrator',
    description: 'Institutional application creation, document uploads, and deficiency rectifications',
    icon: Building2,
    badgeColor: '#C084FC'
  },
  {
    key: 'compliance_officer',
    username: 'compliance_officer',
    role: 'ROLE_COMPLIANCE_OFFICER',
    title: 'Compliance Officer',
    description: 'Annual statutory obligations, evidence verification, and vigilance tracking',
    icon: ShieldAlert,
    badgeColor: '#34D399'
  },
  {
    key: 'auditor',
    username: 'auditor',
    role: 'ROLE_AUDITOR',
    title: 'Read-only Auditor',
    description: 'Central vigilance immutable audit trails, workflow event inspection, and CSV exports',
    icon: FileSpreadsheet,
    badgeColor: '#94A3B8',
    fullWidth: true
  }
];

export default function RoleSelectionPage() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const authorizedRoles = [user?.role];

  const handleSelectRole = (targetRoleItem) => {
    setErrorMsg('');
    if (user?.role === targetRoleItem.role) {
      navigate('/dashboard');
      return;
    }

    // Role switching requires separate authentication
    logout();
    navigate('/login', { state: { requiredRole: targetRoleItem.role, message: `Please authenticate with ${targetRoleItem.title} credentials.` } });
  };

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F5F5F5] flex flex-col font-sans overflow-hidden">
      
      {/* Smoky ambient blurred light orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 rounded-full bg-white/[0.04] blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-20 w-[30rem] h-[30rem] rounded-full bg-[#B9F56B]/[0.03] blur-[140px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#111215]/65 backdrop-blur-[18px] relative z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-[#B9F56B] shadow-glass-highlight">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#F5F5F5]">
            RegulaFlow <span className="text-[#B9F56B]">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          {user && (
            <span className="text-[#A5A5AD] hidden sm:inline">
              Signed in as <strong className="text-[#F5F5F5]">{user.fullName}</strong> ({user.role?.replace('ROLE_', '')})
            </span>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#FB7185] hover:text-white transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col justify-center relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-[#B9F56B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Role-Based Access Control Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
            Select Your Role Workspace
          </h1>
          <p className="text-xs text-[#A5A5AD] max-w-lg mx-auto">
            Each role loads its own dedicated dashboard, specialized navigation sidebar, real-time metrics, authorized action controls, and persistent workflows.
          </p>
          {errorMsg && (
            <div className="text-xs text-[#FB7185] font-semibold">{errorMsg}</div>
          )}
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {ROLES.map((roleItem) => {
            const Icon = roleItem.icon;
            const isCurrent = user?.role === roleItem.role;
            const isAuthorized = authorizedRoles.includes(roleItem.role) || user?.role === 'ROLE_ADMIN';

            return (
              <div
                key={roleItem.key}
                onClick={() => handleSelectRole(roleItem)}
                className={`p-4 rounded-3xl bg-white/[0.03] border backdrop-blur-md cursor-pointer transition-all duration-200 group flex items-center justify-between ${
                  roleItem.fullWidth ? 'md:col-span-2' : ''
                } ${
                  isCurrent 
                    ? 'border-[#B9F56B]/60 shadow-[0_0_24px_rgba(185,245,107,0.15)] bg-white/[0.06]' 
                    : 'border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center shrink-0 shadow-glass-highlight group-hover:scale-105 transition-transform"
                    style={{ color: roleItem.badgeColor }}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-[#F5F5F5] group-hover:text-white transition-colors">
                        {roleItem.title}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#B9F56B]/20 text-[#B9F56B] border border-[#B9F56B]/30">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A5A5AD] mt-0.5 line-clamp-1">
                      {roleItem.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#A5A5AD] group-hover:text-white group-hover:translate-x-1 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-[11px] text-[#A5A5AD]">
          Connected to Spring Boot API & PostgreSQL Database • AICTE Approval Automation
        </div>
      </div>

    </div>
  );
}
