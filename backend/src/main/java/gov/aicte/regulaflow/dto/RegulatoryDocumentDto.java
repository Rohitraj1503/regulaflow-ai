package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RegulatoryDocumentDto {
    private Long id;
    private String title;
    private String regulationCode;
    private String category;
    private String academicYear;
    private String version;
    private Boolean isActive;
    private String summary;
    private String documentUrl;
    private LocalDateTime publishedDate;
    private List<RegulatoryClauseDto> clauses;

    public RegulatoryDocumentDto() {}

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

    public List<RegulatoryClauseDto> getClauses() { return clauses; }
    public void setClauses(List<RegulatoryClauseDto> clauses) { this.clauses = clauses; }
}
