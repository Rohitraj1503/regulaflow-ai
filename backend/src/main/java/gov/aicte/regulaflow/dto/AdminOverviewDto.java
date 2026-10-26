package gov.aicte.regulaflow.dto;

import java.util.List;
import java.util.Map;

public class AdminOverviewDto {
    private long totalUsers;
    private long activeInstitutions;
    private Map<String, Long> roleDistribution;
    private long totalApplications;
    private Map<String, Long> applicationProcessingOverview;
    private long systemActivityCount;
    private Map<String, Long> notificationStatus;
    private Map<String, Long> complianceOverview;
    private List<AuditEventDto> recentAuditEvents;
    private long activeUsersCount;
    private long inactiveUsersCount;
    private long totalInstitutions;
    private long failedIntegrationsCount;
    private long securityEventsCount;

    public AdminOverviewDto() {}

    public long getActiveUsersCount() { return activeUsersCount; }
    public void setActiveUsersCount(long activeUsersCount) { this.activeUsersCount = activeUsersCount; }

    public long getInactiveUsersCount() { return inactiveUsersCount; }
    public void setInactiveUsersCount(long inactiveUsersCount) { this.inactiveUsersCount = inactiveUsersCount; }

    public long getTotalInstitutions() { return totalInstitutions; }
    public void setTotalInstitutions(long totalInstitutions) { this.totalInstitutions = totalInstitutions; }

    public long getFailedIntegrationsCount() { return failedIntegrationsCount; }
    public void setFailedIntegrationsCount(long failedIntegrationsCount) { this.failedIntegrationsCount = failedIntegrationsCount; }

    public long getSecurityEventsCount() { return securityEventsCount; }
    public void setSecurityEventsCount(long securityEventsCount) { this.securityEventsCount = securityEventsCount; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getActiveInstitutions() { return activeInstitutions; }
    public void setActiveInstitutions(long activeInstitutions) { this.activeInstitutions = activeInstitutions; }

    public Map<String, Long> getRoleDistribution() { return roleDistribution; }
    public void setRoleDistribution(Map<String, Long> roleDistribution) { this.roleDistribution = roleDistribution; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public Map<String, Long> getApplicationProcessingOverview() { return applicationProcessingOverview; }
    public void setApplicationProcessingOverview(Map<String, Long> applicationProcessingOverview) { this.applicationProcessingOverview = applicationProcessingOverview; }

    public long getSystemActivityCount() { return systemActivityCount; }
    public void setSystemActivityCount(long systemActivityCount) { this.systemActivityCount = systemActivityCount; }

    public Map<String, Long> getNotificationStatus() { return notificationStatus; }
    public void setNotificationStatus(Map<String, Long> notificationStatus) { this.notificationStatus = notificationStatus; }

    public Map<String, Long> getComplianceOverview() { return complianceOverview; }
    public void setComplianceOverview(Map<String, Long> complianceOverview) { this.complianceOverview = complianceOverview; }

    public List<AuditEventDto> getRecentAuditEvents() { return recentAuditEvents; }
    public void setRecentAuditEvents(List<AuditEventDto> recentAuditEvents) { this.recentAuditEvents = recentAuditEvents; }
}
