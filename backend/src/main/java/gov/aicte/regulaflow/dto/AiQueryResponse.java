package gov.aicte.regulaflow.dto;

import java.util.List;

public class AiQueryResponse {
    private String query;
    private String answer;
    private double confidenceScore;
    private boolean verifiedSourceFound;
    private String interpretationNotes;
    private List<CitationDetail> citations;

    public AiQueryResponse() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }

    public boolean isVerifiedSourceFound() { return verifiedSourceFound; }
    public void setVerifiedSourceFound(boolean verifiedSourceFound) { this.verifiedSourceFound = verifiedSourceFound; }

    public String getInterpretationNotes() { return interpretationNotes; }
    public void setInterpretationNotes(String interpretationNotes) { this.interpretationNotes = interpretationNotes; }

    public List<CitationDetail> getCitations() { return citations; }
    public void setCitations(List<CitationDetail> citations) { this.citations = citations; }

    public static class CitationDetail {
        private String documentTitle;
        private String regulationCode;
        private String section;
        private String clauseNumber;
        private String exactClauseText;
        private Integer pageNumber;
        private String version;
        private String sourceUrl;
        private String publishingOrg;
        private String academicYear;

        public CitationDetail() {}

        public CitationDetail(String documentTitle, String regulationCode, String section, String clauseNumber, String exactClauseText, Integer pageNumber, String version) {
            this.documentTitle = documentTitle;
            this.regulationCode = regulationCode;
            this.section = section;
            this.clauseNumber = clauseNumber;
            this.exactClauseText = exactClauseText;
            this.pageNumber = pageNumber;
            this.version = version;
        }

        public CitationDetail(String documentTitle, String regulationCode, String section, String clauseNumber, String exactClauseText, Integer pageNumber, String version, String sourceUrl, String publishingOrg, String academicYear) {
            this.documentTitle = documentTitle;
            this.regulationCode = regulationCode;
            this.section = section;
            this.clauseNumber = clauseNumber;
            this.exactClauseText = exactClauseText;
            this.pageNumber = pageNumber;
            this.version = version;
            this.sourceUrl = sourceUrl;
            this.publishingOrg = publishingOrg;
            this.academicYear = academicYear;
        }

        public String getDocumentTitle() { return documentTitle; }
        public void setDocumentTitle(String documentTitle) { this.documentTitle = documentTitle; }

        public String getRegulationCode() { return regulationCode; }
        public void setRegulationCode(String regulationCode) { this.regulationCode = regulationCode; }

        public String getSection() { return section; }
        public void setSection(String section) { this.section = section; }

        public String getClauseNumber() { return clauseNumber; }
        public void setClauseNumber(String clauseNumber) { this.clauseNumber = clauseNumber; }

        public String getExactClauseText() { return exactClauseText; }
        public void setExactClauseText(String exactClauseText) { this.exactClauseText = exactClauseText; }

        public Integer getPageNumber() { return pageNumber; }
        public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

        public String getVersion() { return version; }
        public void setVersion(String version) { this.version = version; }

        public String getSourceUrl() { return sourceUrl; }
        public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

        public String getPublishingOrg() { return publishingOrg; }
        public void setPublishingOrg(String publishingOrg) { this.publishingOrg = publishingOrg; }

        public String getAcademicYear() { return academicYear; }
        public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    }
}
