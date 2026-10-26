package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ComplianceObligationDto {
    private Long id;
    private Long institutionId;
    private String institutionName;
    private String obligationTitle;
    private String regulatoryClause;
    private String frequency;
    private LocalDateTime deadline;
    private String status;
    private LocalDateTime lastVerifiedAt;
    private Long verifiedById;
    private Long daysRemaining;
    private Boolean isOverdue;
    private List<ComplianceEvidenceDto> evidences;

    public ComplianceObligationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInstitutionId() { return institutionId; }
    public void setInstitutionId(Long institutionId) { this.institutionId = institutionId; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getObligationTitle() { return obligationTitle; }
    public void setObligationTitle(String obligationTitle) { this.obligationTitle = obligationTitle; }

    public String getRegulatoryClause() { return regulatoryClause; }
    public void setRegulatoryClause(String regulatoryClause) { this.regulatoryClause = regulatoryClause; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(LocalDateTime lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }

    public Long getVerifiedById() { return verifiedById; }
    public void setVerifiedById(Long verifiedById) { this.verifiedById = verifiedById; }

    public Long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }

    public Boolean getIsOverdue() { return isOverdue; }
    public void setIsOverdue(Boolean isOverdue) { this.isOverdue = isOverdue; }

    public List<ComplianceEvidenceDto> getEvidences() { return evidences; }
    public void setEvidences(List<ComplianceEvidenceDto> evidences) { this.evidences = evidences; }
}
