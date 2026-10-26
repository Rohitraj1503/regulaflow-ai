package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "regulatory_documents")
public class RegulatoryDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "regulation_code", nullable = false, length = 100)
    private String regulationCode;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "document_url", length = 500)
    private String documentUrl;

    @Column(name = "published_date")
    private LocalDateTime publishedDate;

    @Column(name = "publishing_org", length = 150)
    private String publishingOrg;

    @Column(name = "source_checksum", length = 100)
    private String sourceChecksum;

    @Column(name = "retrieval_date")
    private LocalDateTime retrievalDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public RegulatoryDocument() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRegulationCode() { return regulationCode; }
    public void setRegulationCode(String regulationCode) { this.regulationCode = regulationCode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }

    public String getPublishingOrg() { return publishingOrg; }
    public void setPublishingOrg(String publishingOrg) { this.publishingOrg = publishingOrg; }

    public String getSourceChecksum() { return sourceChecksum; }
    public void setSourceChecksum(String sourceChecksum) { this.sourceChecksum = sourceChecksum; }

    public LocalDateTime getRetrievalDate() { return retrievalDate; }
    public void setRetrievalDate(LocalDateTime retrievalDate) { this.retrievalDate = retrievalDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
