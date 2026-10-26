package gov.aicte.regulaflow.dto;

import jakarta.validation.constraints.NotBlank;

public class WorkflowTransitionRequest {
    @NotBlank
    private String targetStatus;

    private String remarks;

    // Optional deficiency payload if transition is DEFICIENCY_NOTED
    private String deficiencyClause;
    private String deficiencyDescription;
    private String deficiencyCategory;
    private String deficiencySeverity;

    // Optional officer reassignment
    private Long assignedOfficerId;

    public WorkflowTransitionRequest() {}

    public String getTargetStatus() { return targetStatus; }
    public void setTargetStatus(String targetStatus) { this.targetStatus = targetStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getDeficiencyClause() { return deficiencyClause; }
    public void setDeficiencyClause(String deficiencyClause) { this.deficiencyClause = deficiencyClause; }

    public String getDeficiencyDescription() { return deficiencyDescription; }
    public void setDeficiencyDescription(String deficiencyDescription) { this.deficiencyDescription = deficiencyDescription; }

    public String getDeficiencyCategory() { return deficiencyCategory; }
    public void setDeficiencyCategory(String deficiencyCategory) { this.deficiencyCategory = deficiencyCategory; }

    public String getDeficiencySeverity() { return deficiencySeverity; }
    public void setDeficiencySeverity(String deficiencySeverity) { this.deficiencySeverity = deficiencySeverity; }

    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }
}
