import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NetworkGlobe3D from '../components/NetworkGlobe3D';
import { 
  ShieldCheck, 
  Bot, 
  ArrowRight, 
  Layers, 
  FileSearch, 
  Calendar, 
  Lock, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Send,
  FileCheck,
  Scale,
  ClipboardCheck,
  History
} from 'lucide-react';

export default function LandingPage({ onOpenCopilot }) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    institution: '',
    subject: 'Application Workflow Inquiry',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSuccess(true);
      setTimeout(() => {
        setContactSuccess(false);
        setContactForm({
          name: '',
          email: '',
          institution: '',
          subject: 'Application Workflow Inquiry',
          message: ''
        });
      }, 5000);
    }, 600);
  };

  const workflowSteps = [
    {
      step: '01',
      title: 'Configure',
      desc: 'Set up institution details, application categories, and applicable requirements.'
    },
    {
      step: '02',
      title: 'Submit',
      desc: 'Create an application and provide the required information and documents.'
    },
    {
      step: '03',
      title: 'Review',
      desc: 'Authorized officers scrutinize submissions, request clarifications, and complete applicable review stages.'
    },
    {
      step: '04',
      title: 'Track',
      desc: 'Monitor application progress, compliance obligations, deadlines, and recorded decisions.'
    }
  ];

  return (
    <div className="relative space-y-16 lg:space-y-20 pb-20 overflow-hidden">
      
      {/* Subtle ambient smoky glow orbs */}
      <div className="ambient-orb top-16 left-10 w-96 h-96 bg-white/[0.03] blur-[140px] pointer-events-none"></div>
      <div className="ambient-orb top-80 right-16 w-[28rem] h-[28rem] bg-[#B9F56B]/[0.025] blur-[150px] pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-10 px-4 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-[#B9F56B] text-[11px] font-mono uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9F56B] shadow-[0_0_6px_#B9F56B]"></span>
              INTELLIGENT REGULATORY OPERATIONS
            </div>

            <div className="space-y-2.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F5F5] leading-tight">
                RegulaFlow <span className="text-[#B9F56B]">AI</span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-[#C8CBD2] leading-snug">
                Streamline Approvals. Simplify Compliance. Make Better Decisions.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#A5A5AD] leading-relaxed">
              An intelligent regulatory workflow platform for institutional applications, document scrutiny, compliance tracking, and evidence-grounded regulatory assistance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/dashboard"
                className="btn-lime px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lime-glow"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenCopilot}
                className="glass-button px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all text-[#F5F5F5] hover:text-[#B9F56B]"
              >
                <Bot className="w-4 h-4 text-[#B9F56B]" />
                <span>Ask Regulatory Copilot</span>
              </button>
            </div>

            {/* 3 Compact Feature Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass-card p-3 rounded-2xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/[0.08] border border-white/15 text-[#B9F56B] flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#F5F5F5] leading-tight">
                  Configurable Approval Workflows
                </span>
              </div>

              <div className="glass-card p-3 rounded-2xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/[0.08] border border-white/15 text-[#C8CBD2] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#F5F5F5] leading-tight">
                  Continuous Compliance Monitoring
                </span>
              </div>

              <div 
                className="glass-card p-3 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:border-[#B9F56B]/40 transition-colors" 
                onClick={onOpenCopilot}
              >
                <div className="w-7 h-7 rounded-xl bg-white/[0.08] border border-white/15 text-[#B9F56B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#F5F5F5] leading-tight">
                  AI-Assisted Regulatory Intelligence
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Topology Network Illustration */}
          <div className="lg:col-span-6">
            <NetworkGlobe3D />
          </div>

        </div>
      </section>

      {/* 2. ACCESS YOUR WORKSPACE */}
      <section className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">Access Your Workspace</h2>
            <p className="text-xs sm:text-sm text-[#A5A5AD]">
              Sign in to continue to your authorized regulatory workspace.
            </p>
          </div>
          <Link
            to="/login"
            className="btn-lime px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lime-glow shrink-0"
          >
            <span>Continue to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. ABOUT SECTION (#about) */}
      <section id="about" className="max-w-7xl mx-auto px-4 space-y-6 relative z-10 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[11px] font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">
            ABOUT REGULAFLOW AI
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
            Designed for Transparent Regulatory Workflows
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A5AD] leading-relaxed pt-1">
            RegulaFlow AI brings application processing, document scrutiny, compliance obligations, and regulatory information into one structured workspace. It helps institutions and authorized officers track responsibilities, manage evidence, and maintain a clear history of actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="glass-card p-6 rounded-3xl border-white/10 space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/15 text-[#B9F56B] flex items-center justify-center shadow-glass-highlight">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F5F5]">Structured Workflows</h3>
            <p className="text-xs text-[#A5A5AD] leading-relaxed">
              Standardize application stages from draft submission to review, clarification notices, inspection, and authorized determination with predictable stage transitions.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/10 space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/15 text-[#B9F56B] flex items-center justify-center shadow-glass-highlight">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F5F5]">Evidence-Based Compliance</h3>
            <p className="text-xs text-[#A5A5AD] leading-relaxed">
              Maintain centralized verification of mandatory institutional disclosures, land documents, building safety certifications, and faculty cadre requirements.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/10 space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/15 text-[#B9F56B] flex items-center justify-center shadow-glass-highlight">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F5F5]">Traceable Decisions</h3>
            <p className="text-xs text-[#A5A5AD] leading-relaxed">
              Record authorized decisions and scrutiny notes in an immutable audit log, preserving complete transparency and accountability across all stakeholder actions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION (#features) */}
      <section id="features" className="max-w-7xl mx-auto px-4 space-y-6 relative z-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
            Core Regulatory Management Modules
          </h2>
          <p className="text-xs text-[#A5A5AD]">
            Integrated modules connecting institutions, scrutinizers, inspection committees, and regulatory officers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          <FeatureCard 
            icon={FileSearch}
            title="Approval Workflow Management"
            desc="Track application stages, assignments, scrutiny, clarification, resubmission, and authorized decisions."
            link="/dashboard"
          />
          <FeatureCard 
            icon={FileCheck}
            title="Document and Deficiency Management"
            desc="Organize documents, manage versions, record deficiencies, and track corrective submissions."
            link="/applications/APP2025-001"
          />
          <FeatureCard 
            icon={ClipboardCheck}
            title="Compliance Monitoring"
            desc="Track obligations, deadlines, evidence, verification, and overdue actions."
            link="/compliance"
          />
          <FeatureCard 
            icon={Calendar}
            title="Inspection Management"
            desc="Schedule and document inspections when required by the configured workflow."
            link="/evc"
          />
          <FeatureCard 
            icon={Bot}
            title="Regulatory Intelligence Copilot"
            desc="Retrieve information from authorized regulatory documents and present answers with source references."
            action={onOpenCopilot}
          />
          <FeatureCard 
            icon={History}
            title="Audit Trail and Reporting"
            desc="Review workflow history, permitted reports, and recorded actions in a cryptographically secured log."
            link="/audit-trail"
          />
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION (#how-it-works) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 space-y-6 relative z-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">
            WORKFLOW OVERVIEW
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
            How RegulaFlow AI Operates
          </h2>
          <p className="text-xs text-[#A5A5AD]">
            A structured four-step approach to institutional regulatory lifecycle management.
          </p>
        </div>

        {/* 4 Steps: Horizontal on Desktop, Vertical on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {workflowSteps.map((ws) => (
            <div 
              key={ws.step} 
              className="p-5 rounded-3xl glass-card space-y-3 border-white/10 text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black font-mono text-[#B9F56B]/70 block">
                  {ws.step}
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5] mt-1">{ws.title}</h3>
                <p className="text-xs text-[#A5A5AD] leading-relaxed mt-2">{ws.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <p className="text-[11px] text-[#A5A5AD]/80 font-mono">
            * Actual workflow stages depend on the configured application type and applicable regulatory requirements.
          </p>
        </div>
      </section>

      {/* 6. CONTACT SECTION (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 space-y-6 relative z-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-mono text-[#B9F56B] uppercase tracking-wider font-semibold">
            GET IN TOUCH
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
            Contact & Institutional Support
          </h2>
          <p className="text-xs text-[#A5A5AD]">
            Submit inquiries or connect with the regulatory platform support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-[#F5F5F5]">Support & Inquiries</h3>
              <p className="text-xs text-[#A5A5AD] leading-relaxed">
                Institutional representatives can reach out for technical guidance regarding application filings, document scrutiny status, or compliance returns.
              </p>
              
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B9F56B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5F5F5] block">Headquarters:</strong>
                    <span className="text-[#A5A5AD]">Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B9F56B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5F5F5] block">Electronic Desk:</strong>
                    <span className="text-[#A5A5AD]">support@regulaflow.gov.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B9F56B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F5F5F5] block">Helpdesk Line:</strong>
                    <span className="text-[#A5A5AD]">+91 11 2958 1000 (Mon - Fri, 09:30 - 18:00 IST)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-3xl text-left space-y-2">
              <h4 className="text-xs font-bold text-[#F5F5F5]">Authorized Portal Access</h4>
              <p className="text-[11px] text-[#A5A5AD]">
                Need to access your assigned role workspace? Sign in directly to your authorized portal.
              </p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-1.5 text-xs text-[#B9F56B] font-semibold hover:underline pt-1"
              >
                <span>Go to Portal Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 text-left">
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-[#F5F5F5]">Send an Inquiry</h3>
              
              {contactSuccess && (
                <div className="p-3.5 rounded-2xl bg-[#B9F56B]/15 border border-[#B9F56B]/40 text-[#B9F56B] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Inquiry submitted successfully. A confirmation message has been recorded.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full glass-input rounded-xl p-2.5 text-xs text-white placeholder-[#A5A5AD]/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. contact@institution.edu"
                      className="w-full glass-input rounded-xl p-2.5 text-xs text-white placeholder-[#A5A5AD]/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Institution Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.institution}
                      onChange={(e) => setContactForm({ ...contactForm, institution: e.target.value })}
                      placeholder="e.g. ABC College of Engineering"
                      className="w-full glass-input rounded-xl p-2.5 text-xs text-white placeholder-[#A5A5AD]/60"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Subject Area</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="Application Workflow Inquiry">Application Workflow Inquiry</option>
                      <option value="Document Scrutiny Status">Document Scrutiny Status</option>
                      <option value="Compliance Obligation Question">Compliance Obligation Question</option>
                      <option value="Inspection Coordination">Inspection Coordination</option>
                      <option value="General Platform Feedback">General Platform Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5F5F5] mb-1">Message</label>
                  <textarea
                    rows="4"
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide relevant details regarding your inquiry..."
                    className="w-full glass-input rounded-xl p-2.5 text-xs text-white placeholder-[#A5A5AD]/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="btn-lime px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lime-glow transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contactSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, link, action }) {
  const content = (
    <div className="glass-card p-6 rounded-3xl border-white/10 hover:border-white/25 transition-all group h-full flex flex-col justify-between text-left">
      <div>
        <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-[#B9F56B] group-hover:scale-105 transition-transform mb-4 shadow-glass-highlight">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#B9F56B] transition-colors">{title}</h3>
        <p className="text-xs text-[#A5A5AD] leading-relaxed mt-2">{desc}</p>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-[#C8CBD2] font-semibold group-hover:text-[#B9F56B] group-hover:translate-x-1 transition-all">
        <span>Explore Module</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  if (action) {
    return <button type="button" onClick={action} className="text-left w-full h-full">{content}</button>;
  }
  return <Link to={link} className="block h-full">{content}</Link>;
}
