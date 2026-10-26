package gov.aicte.regulaflow.dto;

public class SystemSettingsDto {
    private int statutorySlaDays = 30;
    private boolean maintenanceMode = false;
    private String aiCopilotEngine = "Gemini 1.5 Pro + PostgreSQL pgvector RAG";
    private boolean emailNotifications = true;
    private boolean autoScrutinyRouting = true;
    private int evcMinCommitteeMembers = 3;
    private boolean strictCadreRatioEnforcement = true;

    public SystemSettingsDto() {}

    public int getStatutorySlaDays() { return statutorySlaDays; }
    public void setStatutorySlaDays(int statutorySlaDays) { this.statutorySlaDays = statutorySlaDays; }

    public boolean isMaintenanceMode() { return maintenanceMode; }
    public void setMaintenanceMode(boolean maintenanceMode) { this.maintenanceMode = maintenanceMode; }

    public String getAiCopilotEngine() { return aiCopilotEngine; }
    public void setAiCopilotEngine(String aiCopilotEngine) { this.aiCopilotEngine = aiCopilotEngine; }

    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public boolean isAutoScrutinyRouting() { return autoScrutinyRouting; }
    public void setAutoScrutinyRouting(boolean autoScrutinyRouting) { this.autoScrutinyRouting = autoScrutinyRouting; }

    public int getEvcMinCommitteeMembers() { return evcMinCommitteeMembers; }
    public void setEvcMinCommitteeMembers(int evcMinCommitteeMembers) { this.evcMinCommitteeMembers = evcMinCommitteeMembers; }

    public boolean isStrictCadreRatioEnforcement() { return strictCadreRatioEnforcement; }
    public void setStrictCadreRatioEnforcement(boolean strictCadreRatioEnforcement) { this.strictCadreRatioEnforcement = strictCadreRatioEnforcement; }
}
