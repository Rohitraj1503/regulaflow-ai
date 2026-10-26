package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;

public class EvcScheduleDto {
    private Long id;
    private Long applicationId;
    private String applicationNumber;
    private String institutionName;
    private String visitType;
    private LocalDateTime scheduledDate;
    private Long leadOfficerId;
    private String leadOfficerName;
    private String committeeMembers;
    private String status;
    private String findingsSummary;
    private Integer infrastructureScore;
    private Integer facultyScore;
    private Integer labsScore;
    private String recommendation;
    private String reportFilePath;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public EvcScheduleDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public Long getLeadOfficerId() { return leadOfficerId; }
    public void setLeadOfficerId(Long leadOfficerId) { this.leadOfficerId = leadOfficerId; }

    public String getLeadOfficerName() { return leadOfficerName; }
    public void setLeadOfficerName(String leadOfficerName) { this.leadOfficerName = leadOfficerName; }

    public String getCommitteeMembers() { return committeeMembers; }
    public void setCommitteeMembers(String committeeMembers) { this.committeeMembers = committeeMembers; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFindingsSummary() { return findingsSummary; }
    public void setFindingsSummary(String findingsSummary) { this.findingsSummary = findingsSummary; }

    public Integer getInfrastructureScore() { return infrastructureScore; }
    public void setInfrastructureScore(Integer infrastructureScore) { this.infrastructureScore = infrastructureScore; }

    public Integer getFacultyScore() { return facultyScore; }
    public void setFacultyScore(Integer facultyScore) { this.facultyScore = facultyScore; }

    public Integer getLabsScore() { return labsScore; }
    public void setLabsScore(Integer labsScore) { this.labsScore = labsScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getReportFilePath() { return reportFilePath; }
    public void setReportFilePath(String reportFilePath) { this.reportFilePath = reportFilePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
