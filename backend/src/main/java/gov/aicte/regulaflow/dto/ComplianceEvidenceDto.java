package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;

public class ComplianceEvidenceDto {
    private Long id;
    private Long obligationId;
    private String documentName;
    private String filePath;
    private LocalDateTime submissionDate;
    private LocalDateTime validityStartDate;
    private LocalDateTime validityEndDate;
    private String verificationStatus;
    private String remarks;

    public ComplianceEvidenceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getObligationId() { return obligationId; }
    public void setObligationId(Long obligationId) { this.obligationId = obligationId; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public LocalDateTime getValidityStartDate() { return validityStartDate; }
    public void setValidityStartDate(LocalDateTime validityStartDate) { this.validityStartDate = validityStartDate; }

    public LocalDateTime getValidityEndDate() { return validityEndDate; }
    public void setValidityEndDate(LocalDateTime validityEndDate) { this.validityEndDate = validityEndDate; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
