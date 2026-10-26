package gov.aicte.regulaflow.dto;

import java.util.List;

public class ImpactAnalysisResponse {
    private String baseRegulation;
    private String targetRegulation;
    private int totalChangedClauses;
    private int affectedInstitutionsCount;
    private int affectedApplicationsCount;
    private List<ClauseChangeDetail> clauseChanges;
    private List<AffectedEntityDetail> affectedEntities;
    private String executiveSummary;

    public ImpactAnalysisResponse() {}

    public String getBaseRegulation() { return baseRegulation; }
    public void setBaseRegulation(String baseRegulation) { this.baseRegulation = baseRegulation; }

    public String getTargetRegulation() { return targetRegulation; }
    public void setTargetRegulation(String targetRegulation) { this.targetRegulation = targetRegulation; }

    public int getTotalChangedClauses() { return totalChangedClauses; }
    public void setTotalChangedClauses(int totalChangedClauses) { this.totalChangedClauses = totalChangedClauses; }

    public int getAffectedInstitutionsCount() { return affectedInstitutionsCount; }
    public void setAffectedInstitutionsCount(int affectedInstitutionsCount) { this.affectedInstitutionsCount = affectedInstitutionsCount; }

    public int getAffectedApplicationsCount() { return affectedApplicationsCount; }
    public void setAffectedApplicationsCount(int affectedApplicationsCount) { this.affectedApplicationsCount = affectedApplicationsCount; }

    public List<ClauseChangeDetail> getClauseChanges() { return clauseChanges; }
    public void setClauseChanges(List<ClauseChangeDetail> clauseChanges) { this.clauseChanges = clauseChanges; }

    public List<AffectedEntityDetail> getAffectedEntities() { return affectedEntities; }
    public void setAffectedEntities(List<AffectedEntityDetail> affectedEntities) { this.affectedEntities = affectedEntities; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public static class ClauseChangeDetail {
        private String clauseNumber;
        private String title;
        private String changeType; // MODIFIED, ADDED, DELETED
        private String previousText;
        private String currentText;
        private String severity;
        private String impactExplanation;

        public ClauseChangeDetail() {}

        public String getClauseNumber() { return clauseNumber; }
        public void setClauseNumber(String clauseNumber) { this.clauseNumber = clauseNumber; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getChangeType() { return changeType; }
        public void setChangeType(String changeType) { this.changeType = changeType; }

        public String getPreviousText() { return previousText; }
        public void setPreviousText(String previousText) { this.previousText = previousText; }

        public String getCurrentText() { return currentText; }
        public void setCurrentText(String currentText) { this.currentText = currentText; }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }

        public String getImpactExplanation() { return impactExplanation; }
        public void setImpactExplanation(String impactExplanation) { this.impactExplanation = impactExplanation; }
    }

    public static class AffectedEntityDetail {
        private String entityType; // APPLICATION, INSTITUTION, OBLIGATION
        private String entityIdentifier;
        private String entityName;
        private String riskLevel; // LOW, MEDIUM, HIGH
        private String suggestedAction;

        public AffectedEntityDetail() {}

        public String getEntityType() { return entityType; }
        public void setEntityType(String entityType) { this.entityType = entityType; }

        public String getEntityIdentifier() { return entityIdentifier; }
        public void setEntityIdentifier(String entityIdentifier) { this.entityIdentifier = entityIdentifier; }

        public String getEntityName() { return entityName; }
        public void setEntityName(String entityName) { this.entityName = entityName; }

        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

        public String getSuggestedAction() { return suggestedAction; }
        public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }
    }
}
