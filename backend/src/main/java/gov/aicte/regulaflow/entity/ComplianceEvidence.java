package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_evidence")
public class ComplianceEvidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "obligation_id", nullable = false)
    private ComplianceObligation obligation;

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate = LocalDateTime.now();

    @Column(name = "validity_start_date")
    private LocalDateTime validityStartDate;

    @Column(name = "validity_end_date")
    private LocalDateTime validityEndDate;

    @Column(name = "verification_status", length = 50)
    private String verificationStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public ComplianceEvidence() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ComplianceObligation getObligation() { return obligation; }
    public void setObligation(ComplianceObligation obligation) { this.obligation = obligation; }

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
