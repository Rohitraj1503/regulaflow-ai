import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Bot, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

export default function Navbar({ onOpenCopilot }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications(false);
      setNotifications(res.data?.slice(0, 5) || []);
      const unreadRes = await api.getUnreadCount();
      setUnreadCount(unreadRes.data?.unreadCount || 0);
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setUnreadCount(0);
      loadNotifications();
    } catch (e) {}
  };

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Features', path: '/#features' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Contact', path: '/#contact' },
  ];

  const appNavLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Applications', path: '/applications/APP2025-001' },
    { name: 'Compliance', path: '/compliance' },
    { name: 'EVC Management', path: '/evc' },
    { name: 'Audit Trail', path: '/audit-trail' },
  ];

  const currentLinks = location.pathname === '/' ? publicNavLinks : (isAuthenticated ? appNavLinks : publicNavLinks);

  const handleLinkClick = (e, path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const targetId = path.substring(2);
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (path === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#08090B]/85 backdrop-blur-[18px] border-b border-white/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LEFT: RegulaFlow AI Logo & Subtitle */}
        <Link 
          to="/" 
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center shadow-glass-highlight group-hover:border-[#B9F56B]/60 transition-colors">
            <ShieldCheck className="w-6 h-6 text-[#B9F56B] stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#F5F5F5]">
                RegulaFlow <span className="text-[#B9F56B]">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-[#A5A5AD] leading-none hidden sm:block">
              Regulatory Workflow & Compliance Platform
            </p>
          </div>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          {currentLinks.map((link) => {
            const active = location.pathname === link.path && !link.path.includes('#');
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-white/[0.1] text-[#B9F56B] border border-white/20 shadow-glass-highlight font-semibold'
                    : 'text-[#A5A5AD] hover:text-[#F5F5F5] hover:bg-white/[0.06]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Regulatory Copilot Button */}
          <button
            type="button"
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#F5F5F5] text-xs font-medium transition-all shadow-glass-highlight hover:border-[#B9F56B]/40"
            title="Open Regulatory Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B9F56B]" />
            <span className="hidden sm:inline">Regulatory Copilot</span>
          </button>

          {/* Authenticated user menu vs Public login/get started */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Notification Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-[#C8CBD2] hover:text-white transition-all shadow-glass-highlight"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B9F56B] text-[#08090B] text-[9px] font-bold flex items-center justify-center shadow-lime-glow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#111215]/95 backdrop-blur-[20px] border border-white/20 rounded-2xl shadow-2xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-semibold text-[#F5F5F5]">Regulatory Alerts</span>
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#B9F56B] hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="py-2 flex flex-col gap-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#A5A5AD] text-center py-4">No new alerts</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                            <span className="font-medium text-[#F5F5F5] block">{n.title}</span>
                            <p className="text-[11px] text-[#A5A5AD] mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile button */}
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs text-[#F5F5F5] font-medium hidden md:flex items-center gap-1.5"
              >
                <span>Dashboard</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-[#A5A5AD] hover:text-[#FB7185] transition-all shadow-glass-highlight"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs text-[#C8CBD2] hover:text-white hover:bg-white/[0.06] border border-transparent font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="btn-lime px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lime-glow"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.06] border border-white/15 text-[#F5F5F5] hover:bg-white/[0.1]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 animate-fade-in">
          {currentLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => handleLinkClick(e, link.path)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#A5A5AD] hover:bg-white/[0.06] hover:text-[#F5F5F5] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-3 py-2 rounded-xl btn-lime text-xs font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
