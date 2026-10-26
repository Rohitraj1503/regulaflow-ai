package gov.aicte.regulaflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "regulatory_clauses")
public class RegulatoryClause {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private RegulatoryDocument document;

    @Column(name = "section_number", length = 50)
    private String sectionNumber;

    @Column(name = "clause_number", nullable = false, length = 50)
    private String clauseNumber;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "applicable_to", length = 150)
    private String applicableTo;

    @Column(name = "penalty_notes", columnDefinition = "TEXT")
    private String penaltyNotes;

    public RegulatoryClause() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RegulatoryDocument getDocument() { return document; }
    public void setDocument(RegulatoryDocument document) { this.document = document; }

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
