package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;

public class ApplicationDocumentDto {
    private Long id;
    private Long applicationId;
    private String documentType;
    private String documentName;
    private String filePath;
    private Long fileSize;
    private String checksum;
    private String status;
    private String deficiencyNotes;
    private LocalDateTime uploadedAt;

    public ApplicationDocumentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeficiencyNotes() { return deficiencyNotes; }
    public void setDeficiencyNotes(String deficiencyNotes) { this.deficiencyNotes = deficiencyNotes; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
