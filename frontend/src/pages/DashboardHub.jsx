import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EnterpriseLayout from '../components/EnterpriseLayout';

// 7 Dedicated Role Dashboards
import AdminDashboard from './dashboards/AdminDashboard';
import RegulatoryDashboard from './dashboards/RegulatoryDashboard';
import ScrutinyDashboard from './dashboards/ScrutinyDashboard';
import EvcDashboard from './dashboards/EvcDashboard';
import InstitutionDashboard from './dashboards/InstitutionDashboard';
import ComplianceDashboard from './dashboards/ComplianceDashboard';
import AuditorDashboard from './dashboards/AuditorDashboard';

export default function DashboardHub() {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  const role = user?.role || 'ROLE_REGULATORY_OFFICER';

  const renderDashboardByRole = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <AdminDashboard activeTab={activeTab} />;
      case 'ROLE_REGULATORY_OFFICER':
        return <RegulatoryDashboard activeTab={activeTab} />;
      case 'ROLE_SCRUTINY_OFFICER':
        return <ScrutinyDashboard activeTab={activeTab} />;
      case 'ROLE_EVC_OFFICER':
        return <EvcDashboard activeTab={activeTab} />;
      case 'ROLE_INSTITUTION_ADMIN':
        return <InstitutionDashboard activeTab={activeTab} />;
      case 'ROLE_COMPLIANCE_OFFICER':
        return <ComplianceDashboard activeTab={activeTab} />;
      case 'ROLE_AUDITOR':
        return <AuditorDashboard activeTab={activeTab} />;
      default:
        return <RegulatoryDashboard activeTab={activeTab} />;
    }
  };

  return (
    <EnterpriseLayout activeSection="dashboard">
      {renderDashboardByRole()}
    </EnterpriseLayout>
  );
}
