package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;

public class DeficiencyDto {
    private Long id;
    private Long applicationId;
    private String applicationNumber;
    private String clauseReference;
    private String issueDescription;
    private String category;
    private String severity;
    private String status;
    private String responseRemarks;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;

    public DeficiencyDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public String getClauseReference() { return clauseReference; }
    public void setClauseReference(String clauseReference) { this.clauseReference = clauseReference; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResponseRemarks() { return responseRemarks; }
    public void setResponseRemarks(String responseRemarks) { this.responseRemarks = responseRemarks; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
