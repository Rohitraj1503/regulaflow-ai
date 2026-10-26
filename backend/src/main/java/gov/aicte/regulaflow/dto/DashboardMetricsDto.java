package gov.aicte.regulaflow.dto;

import java.util.Map;
import java.util.List;

public class DashboardMetricsDto {
    private long totalApplications;
    private long pendingApplications;
    private long underScrutinyCount;
    private long deficiencyNotedCount;
    private long evcScheduledCount;
    private long approvedCount;
    private long rejectedCount;
    private long overdueCount;
    private double averageProcessingDays;

    private Map<String, Long> stageWisePendency;
    private Map<String, Long> regionWisePendency;
    private Map<String, Long> categoryWiseDistribution;
    private Map<String, Long> ageingBuckets;
    private List<WorkflowHistoryDto> recentActivities;

    public DashboardMetricsDto() {}

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getPendingApplications() { return pendingApplications; }
    public void setPendingApplications(long pendingApplications) { this.pendingApplications = pendingApplications; }

    public long getUnderScrutinyCount() { return underScrutinyCount; }
    public void setUnderScrutinyCount(long underScrutinyCount) { this.underScrutinyCount = underScrutinyCount; }

    public long getDeficiencyNotedCount() { return deficiencyNotedCount; }
    public void setDeficiencyNotedCount(long deficiencyNotedCount) { this.deficiencyNotedCount = deficiencyNotedCount; }

    public long getEvcScheduledCount() { return evcScheduledCount; }
    public void setEvcScheduledCount(long evcScheduledCount) { this.evcScheduledCount = evcScheduledCount; }

    public long getApprovedCount() { return approvedCount; }
    public void setApprovedCount(long approvedCount) { this.approvedCount = approvedCount; }

    public long getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(long rejectedCount) { this.rejectedCount = rejectedCount; }

    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }

    public double getAverageProcessingDays() { return averageProcessingDays; }
    public void setAverageProcessingDays(double averageProcessingDays) { this.averageProcessingDays = averageProcessingDays; }

    public Map<String, Long> getStageWisePendency() { return stageWisePendency; }
    public void setStageWisePendency(Map<String, Long> stageWisePendency) { this.stageWisePendency = stageWisePendency; }

    public Map<String, Long> getRegionWisePendency() { return regionWisePendency; }
    public void setRegionWisePendency(Map<String, Long> regionWisePendency) { this.regionWisePendency = regionWisePendency; }

    public Map<String, Long> getCategoryWiseDistribution() { return categoryWiseDistribution; }
    public void setCategoryWiseDistribution(Map<String, Long> categoryWiseDistribution) { this.categoryWiseDistribution = categoryWiseDistribution; }

    public Map<String, Long> getAgeingBuckets() { return ageingBuckets; }
    public void setAgeingBuckets(Map<String, Long> ageingBuckets) { this.ageingBuckets = ageingBuckets; }

    public List<WorkflowHistoryDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<WorkflowHistoryDto> recentActivities) { this.recentActivities = recentActivities; }
}
