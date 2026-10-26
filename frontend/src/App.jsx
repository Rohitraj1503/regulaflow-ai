import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CopilotDrawer from './components/CopilotDrawer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import DashboardHub from './pages/DashboardHub';
import RegulatoryDashboard from './pages/RegulatoryDashboard';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import CopilotPage from './pages/CopilotPage';
import InstitutionPortal from './pages/InstitutionPortal';
import EvcManagementPage from './pages/EvcManagementPage';
import CompliancePage from './pages/CompliancePage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import ImpactAnalysisPage from './pages/ImpactAnalysisPage';
import AuditTrailPage from './pages/AuditTrailPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function MainLayout() {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const location = useLocation();

  // Paths that use dedicated view layouts (enterprise portals and immersive animated login)
  const dedicatedPaths = [
    '/login',
    '/dashboard',
    '/applications',
    '/compliance',
    '/evc',
    '/copilot',
    '/institution',
    '/select-role',
    '/audit-trail',
    '/knowledge-graph',
    '/change-impact'
  ];

  const isDedicatedView = dedicatedPaths.some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#B9F56B] selection:text-[#08090B]">
      
      {/* Show Public Navbar only on public non-dedicated views (like Landing Page) */}
      {!isDedicatedView && (
        <Navbar onOpenCopilot={() => setIsCopilotOpen(true)} />
      )}

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname.startsWith('/login') ? 'login' : location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            <Routes location={location}>
              {/* 1. Public Landing Page */}
              <Route path="/" element={<LandingPage onOpenCopilot={() => setIsCopilotOpen(true)} />} />
          
          {/* 2. Login & Authentication (General & Role-Specific Portals) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:roleSlug" element={<LoginPage />} />
          
          {/* 3. Role Directory */}
          <Route 
            path="/select-role" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <RoleSelectionPage />
              </ProtectedRoute>
            } 
          />

          {/* 4. Role-Based Dynamic Dashboard Hub (7 distinct dashboards) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardHub />
              </ProtectedRoute>
            } 
          />

          {/* 5. Application Details Workspace */}
          <Route 
            path="/applications/:id" 
            element={
              <ProtectedRoute>
                <ApplicationDetailsPage />
              </ProtectedRoute>
            } 
          />

          {/* 6. Compliance Monitoring */}
          <Route 
            path="/compliance" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_COMPLIANCE_OFFICER', 'ROLE_ADMIN', 'ROLE_REGULATORY_OFFICER']}>
                <CompliancePage />
              </ProtectedRoute>
            } 
          />

          {/* 7. EVC Management */}
          <Route 
            path="/evc" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_EVC_OFFICER', 'ROLE_ADMIN', 'ROLE_REGULATORY_OFFICER']}>
                <EvcManagementPage />
              </ProtectedRoute>
            } 
          />

          {/* 8. AI Copilot (Regulatory Assistant) */}
          <Route 
            path="/copilot" 
            element={
              <ProtectedRoute>
                <CopilotPage />
              </ProtectedRoute>
            } 
          />

          {/* 9. Institution Portal */}
          <Route 
            path="/institution" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_INSTITUTION_ADMIN', 'ROLE_ADMIN']}>
                <InstitutionPortal />
              </ProtectedRoute>
            } 
          />

          {/* Secondary Auxiliary Pages */}
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/change-impact" element={<ImpactAnalysisPage />} />
          <Route 
            path="/audit-trail" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_AUDITOR', 'ROLE_ADMIN', 'ROLE_REGULATORY_OFFICER']}>
                <AuditTrailPage />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Footer */}
      {!isDedicatedView && (
        <footer className="border-t border-white/10 bg-[#111215]/90 backdrop-blur-[18px] pt-10 pb-8 px-4 text-xs text-[#A5A5AD]">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              
              {/* Brand and Description */}
              <div className="space-y-1.5 max-w-md text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#B9F56B] shadow-[0_0_8px_#B9F56B]"></span>
                  </div>
                  <span className="text-[#F5F5F5] font-bold text-sm tracking-tight">
                    RegulaFlow <span className="text-[#B9F56B]">AI</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#A5A5AD] leading-relaxed">
                  An intelligent regulatory workflow platform for institutional applications, document scrutiny, and continuous compliance monitoring.
                </p>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
                <a 
                  href="/#about" 
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="hover:text-white transition-colors"
                >
                  About
                </a>
                <a 
                  href="/#features" 
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
                <a 
                  href="/#how-it-works" 
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
                <a 
                  href="/#contact" 
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={() => alert('Privacy Policy (Draft): RegulaFlow AI processes application data in accordance with institutional data protection standards and role-based access controls.')}
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </button>
                <button
                  type="button"
                  onClick={() => alert('Terms of Service (Draft): Access to regulatory workflows is subject to institutional authorization and compliance verification.')}
                  className="hover:text-white transition-colors"
                >
                  Terms
                </button>
              </div>

            </div>

            {/* Bottom Row: Unobtrusive Disclaimer & Discreet Project Notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#A5A5AD]/80 text-center sm:text-left">
              <p>
                RegulaFlow AI is an independent regulatory workflow and compliance management platform inspired by publicly available AICTE documentation. It is not an official AICTE service.
              </p>
              <div className="font-mono text-[10px] text-[#C8CBD2]/60 shrink-0">
                SIH 2026 • Problem Statement SIH26262
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Copilot Drawer for Public Pages */}
      <CopilotDrawer 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
