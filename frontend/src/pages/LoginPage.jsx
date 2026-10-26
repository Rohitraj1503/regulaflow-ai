import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import WelcomeCharacterLeft from '../components/illustrations/WelcomeCharacterLeft';
import WelcomeCharacterRight from '../components/illustrations/WelcomeCharacterRight';
import LoginBackgroundShapes from '../components/illustrations/LoginBackgroundShapes';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Scale,
  FileCheck,
  ClipboardCheck,
  History,
  GraduationCap,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

const PORTAL_CONFIGS = {
  admin: {
    slug: 'admin',
    title: 'System Administrator Portal',
    subtitle: 'Platform governance, security oversight, user provisioning and audit logs',
    expectedRole: 'ROLE_ADMIN',
    badge: 'Level 4 Clearance',
    badgeColor: 'border-[#FB7185]/40 text-[#FB7185] bg-[#FB7185]/10',
    icon: ShieldAlert
  },
  'regulatory-officer': {
    slug: 'regulatory-officer',
    title: 'Regulatory Operations Authority',
    subtitle: 'Jurisdictional review, officer assignment and statutory approval decisions',
    expectedRole: 'ROLE_REGULATORY_OFFICER',
    badge: 'Regional Bureau',
    badgeColor: 'border-[#B9F56B]/40 text-[#B9F56B] bg-[#B9F56B]/10',
    icon: Scale
  },
  'scrutiny-officer': {
    slug: 'scrutiny-officer',
    title: 'Scrutiny & Evaluation Desk',
    subtitle: 'Document verification, APH clause compliance and deficiency notices',
    expectedRole: 'ROLE_SCRUTINY_OFFICER',
    badge: 'Scrutiny Committee',
    badgeColor: 'border-cyan-400/40 text-cyan-400 bg-cyan-400/10',
    icon: FileCheck
  },
  'evc-officer': {
    slug: 'evc-officer',
    title: 'Expert Visit Committee (EVC)',
    subtitle: 'Physical & virtual campus infrastructure inspection and digital scorecards',
    expectedRole: 'ROLE_EVC_OFFICER',
    badge: 'Inspection Delegation',
    badgeColor: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
    icon: ShieldCheck
  },
  institution: {
    slug: 'institution',
    title: 'Technical Institution Portal',
    subtitle: 'Extension of Approval (EoA), intake expansion, document filing and deficiency rectification',
    expectedRole: 'ROLE_INSTITUTION',
    badge: 'Approved Technical Institute',
    badgeColor: 'border-emerald-400/40 text-emerald-400 bg-emerald-400/10',
    icon: GraduationCap
  },
  'compliance-officer': {
    slug: 'compliance-officer',
    title: 'Compliance & Vigilance Bureau',
    subtitle: 'Mandatory disclosures, statutory returns, fire safety NOCs and cadre ratio audit',
    expectedRole: 'ROLE_COMPLIANCE_OFFICER',
    badge: 'Vigilance Cell',
    badgeColor: 'border-purple-400/40 text-purple-400 bg-purple-400/10',
    icon: ClipboardCheck
  },
  auditor: {
    slug: 'auditor',
    title: 'Oversight & Audit Console',
    subtitle: 'Read-only immutable audit trail and compliance verification ledger',
    expectedRole: 'ROLE_AUDITOR',
    badge: 'Independent Oversight',
    badgeColor: 'border-[#C8CBD2]/40 text-[#C8CBD2] bg-white/[0.08]',
    icon: History
  }
};

export default function LoginPage() {
  const { roleSlug } = useParams();
  const portal = roleSlug ? PORTAL_CONFIGS[roleSlug] : null;

  // Credential inputs start completely empty — no auto-filling or hardcoded demo values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Reset error state on portal route change
  useEffect(() => {
    setError('');
  }, [roleSlug]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }

    const res = await login(username.trim(), password);
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
      return;
    }

    const loggedUser = res.user;

    // If accessing a specific role portal, enforce role verification
    if (portal && loggedUser) {
      const isRoleAllowed = 
        loggedUser.role === portal.expectedRole ||
        (portal.expectedRole === 'ROLE_INSTITUTION' && (loggedUser.role === 'ROLE_INSTITUTION_ADMIN' || loggedUser.role === 'ROLE_INSTITUTION')) ||
        loggedUser.role === 'ROLE_ADMIN' ||
        (loggedUser.authorizedRoles && (
          loggedUser.authorizedRoles.includes(portal.expectedRole) ||
          (portal.expectedRole === 'ROLE_INSTITUTION' && loggedUser.authorizedRoles.includes('ROLE_INSTITUTION_ADMIN'))
        ));

      if (!isRoleAllowed) {
        logout();
        setError(`Access Denied: Account '${username}' does not hold clearance for the ${portal.title}. Please sign in with authorized credentials.`);
        return;
      }
    }

    // Redirect to authenticated dashboard
    navigate('/dashboard');
  };

  const IconComponent = portal?.icon || ShieldCheck;

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between px-3 sm:px-6 py-6 sm:py-8 bg-[#08090B] overflow-x-hidden">
      
      {/* Background Organic Botanical & Geometric Shapes matching Image 3 composition */}
      <LoginBackgroundShapes />

      {/* Top Header: Clean Navigation */}
      <header className="relative z-20 max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-[#A5A5AD] mb-2 sm:mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 hover:text-white transition-colors py-1.5 px-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#B9F56B]" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {portal && (
          <div className="flex items-center gap-2 py-1 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-[#A5A5AD] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B9F56B]" />
            <span className="font-medium">{portal.title}</span>
          </div>
        )}
      </header>

      {/* Main Centered Composition: Welcome Card flanked by Two Characters */}
      <main className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-center my-auto py-4 px-4 sm:px-8">
        
        {/* Stage Wrapper tightly enclosing the card so characters anchor directly to card edges */}
        <div className="relative w-full max-w-md sm:max-w-lg flex items-center justify-center">

          {/* LEFT ILLUSTRATED CHARACTER (Standing Welcoming) */}
          <div className="hidden lg:block absolute -left-44 xl:-left-52 bottom-0 w-[185px] xl:w-[215px] z-20 pointer-events-none">
            <WelcomeCharacterLeft />
          </div>

          {/* CENTRAL WELCOME & LOGIN CARD (Inspired by Image 3) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-3xl overflow-hidden border border-white/18 shadow-2xl backdrop-blur-xl relative z-10 bg-[#111215]/90"
          >
            {/* Top Section: Welcome Header matching Image 3 composition */}
            <div className="relative px-6 py-7 sm:px-8 sm:py-8 text-center overflow-hidden bg-gradient-to-b from-[#181A22] via-[#14151B] to-[#111215] border-b border-white/10">
              
              {/* Subtle ambient light glow inside welcome panel */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-36 bg-[#B9F56B]/[0.08] blur-[60px] pointer-events-none" />

              {/* Compact Characters Layout (Shown on mobile & tablet < 1024px above welcome header) */}
              <div className="flex lg:hidden items-center justify-center gap-6 mb-3">
                <div className="w-16 h-24">
                  <WelcomeCharacterLeft />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center shadow-glass-highlight">
                  <IconComponent className="w-6 h-6 text-[#B9F56B] stroke-[2.2]" />
                </div>
                <div className="w-16 h-24">
                  <WelcomeCharacterRight />
                </div>
              </div>

              {/* Desktop Emblem Icon */}
              <div className="hidden lg:flex w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 items-center justify-center mx-auto mb-3 shadow-glass-highlight">
                <IconComponent className="w-6 h-6 text-[#B9F56B] stroke-[2.2]" />
              </div>

              {/* WELCOME Header (Image 3 Style) */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#A5A5AD] uppercase">
                    RegulaFlow <span className="text-[#B9F56B]">AI</span>
                  </span>
                  {portal && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#F5F5F5] tracking-tight uppercase">
                  {portal ? portal.title : 'WELCOME BACK'}
                </h1>

                <p className="text-xs text-[#A5A5AD] max-w-sm mx-auto leading-relaxed pt-1">
                  {portal ? portal.subtitle : 'Enter your registered credentials to access your authorized regulatory workspace.'}
                </p>
              </div>
            </div>

            {/* Bottom Section: Clean Glass Login Form — No Demo Accounts */}
            <div className="p-6 sm:p-8 space-y-4">
              
              {/* Error Notice */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 rounded-2xl bg-[#FB7185]/15 border border-[#FB7185]/40 text-[#FB7185] text-xs flex items-start gap-2.5 overflow-hidden"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5 text-left">
                    Official ID / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A5A5AD] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter official username"
                      className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#F5F5F5] placeholder-[#A5A5AD]/50 focus:border-[#B9F56B] transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1.5 text-left">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A5A5AD] absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="••••••••••••"
                      className="w-full glass-input rounded-xl pl-10 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-[#F5F5F5] placeholder-[#A5A5AD]/50 focus:border-[#B9F56B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#A5A5AD] hover:text-white transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#A5A5AD]" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[#A5A5AD] hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 bg-white/[0.05] text-[#B9F56B] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember session</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Security Notice: An encrypted password reset link has been dispatched to the institution\'s officially registered nodal email on file with the Regulatory Bureau.')}
                    className="text-[#C8CBD2] hover:text-[#B9F56B] font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button with Lime Glow & Active Motion */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 sm:py-3.5 rounded-2xl btn-lime text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1 shadow-lime-glow uppercase tracking-wider"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#08090B] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Development Quick Credentials Helper */}
              <div className="pt-3 border-t border-white/10 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#A5A5AD]">
                  <span className="font-semibold text-[#F5F5F5]">Development Credentials</span>
                  <span className="font-mono text-[#B9F56B] text-[10px]">MySQL: regulaflow_db</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                  {[
                    { label: 'Admin', u: 'admin', p: 'Admin@123', color: '#FB7185' },
                    { label: 'Reg Officer', u: 'reg_officer', p: 'Reg@123', color: '#B9F56B' },
                    { label: 'Scrutiny', u: 'scrutiny_officer', p: 'Scrutiny@123', color: '#38BDF8' },
                    { label: 'EVC Expert', u: 'evc_officer', p: 'Evc@123', color: '#FBBF24' },
                    { label: 'Institution', u: 'inst_admin', p: 'Inst@123', color: '#C084FC' },
                    { label: 'Compliance', u: 'compliance_officer', p: 'Compliance@123', color: '#34D399' },
                    { label: 'Auditor', u: 'auditor', p: 'Audit@123', color: '#94A3B8' }
                  ].map(c => (
                    <button
                      key={c.u}
                      type="button"
                      onClick={() => {
                        setUsername(c.u);
                        setPassword(c.p);
                        setError('');
                      }}
                      className="px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer"
                      title={`Click to fill ${c.u} / ${c.p}`}
                    >
                      <span className="truncate text-white font-medium">{c.label}</span>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 ml-1" style={{ backgroundColor: c.color }} />
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-[#A5A5AD] text-center font-mono pt-0.5">
                  Accepted: <span className="text-[#F5F5F5]">password123</span> or <span className="text-[#B9F56B]">Role@123</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT ILLUSTRATED CHARACTER (Sitting beside laptop) */}
          <div className="hidden lg:block absolute -right-44 xl:-right-52 bottom-0 w-[195px] xl:w-[225px] z-20 pointer-events-none">
            <WelcomeCharacterRight />
          </div>

        </div>
      </main>

      {/* Footer Discreet Note */}
      <footer className="relative z-20 max-w-5xl mx-auto w-full text-center text-[11px] text-[#A5A5AD]/70 pt-2 pb-2">
        <span>Protected by enterprise role-based encryption • RegulaFlow AI Platform</span>
      </footer>

    </div>
  );
}
