package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_obligations")
public class ComplianceObligation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(name = "obligation_title", nullable = false)
    private String obligationTitle;

    @Column(name = "regulatory_clause", nullable = false, length = 100)
    private String regulatoryClause;

    @Column(nullable = false, length = 50)
    private String frequency; // ANNUAL, BIENNIAL, ONE_TIME

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(length = 50)
    private String status = "PENDING"; // PENDING, SUBMITTED, VERIFIED, OVERDUE

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @Column(name = "verified_by_id")
    private Long verifiedById;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ComplianceObligation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
