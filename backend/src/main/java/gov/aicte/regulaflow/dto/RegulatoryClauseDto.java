package gov.aicte.regulaflow.dto;

public class RegulatoryClauseDto {
    private Long id;
    private Long documentId;
    private String documentTitle;
    private String sectionNumber;
    private String clauseNumber;
    private String title;
    private String content;
    private String applicableTo;
    private String penaltyNotes;

    public RegulatoryClauseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public String getDocumentTitle() { return documentTitle; }
    public void setDocumentTitle(String documentTitle) { this.documentTitle = documentTitle; }

    public String getSectionNumber() { return sectionNumber; }
    public void setSectionNumber(String sectionNumber) { this.sectionNumber = sectionNumber; }

    public String getClauseNumber() { return clauseNumber; }
    public void setClauseNumber(String clauseNumber) { this.clauseNumber = clauseNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getApplicableTo() { return applicableTo; }
    public void setApplicableTo(String applicableTo) { this.applicableTo = applicableTo; }

    public String getPenaltyNotes() { return penaltyNotes; }
    public void setPenaltyNotes(String penaltyNotes) { this.penaltyNotes = penaltyNotes; }
}
