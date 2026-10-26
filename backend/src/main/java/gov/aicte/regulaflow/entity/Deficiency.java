package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deficiencies")
public class Deficiency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "clause_reference", length = 100)
    private String clauseReference;

    @Column(name = "issue_description", nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    @Column(length = 100)
    private String category; // FACULTY_NORMS, INFRASTRUCTURE_SAFETY, LAND_TITLE, FINANCIAL_STABILITY

    @Column(length = 30)
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(length = 50)
    private String status = "OPEN"; // OPEN, ADDRESSED, WAIVED

    @Column(name = "response_remarks", columnDefinition = "TEXT")
    private String responseRemarks;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Deficiency() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

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
