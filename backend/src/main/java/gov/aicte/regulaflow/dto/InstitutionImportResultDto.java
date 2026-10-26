package gov.aicte.regulaflow.dto;

import java.time.LocalDateTime;

public class InstitutionImportResultDto {
    private Long batchId;
    private String filename;
    private int totalProcessed;
    private int insertedCount;
    private int updatedCount;
    private int skippedCount;
    private int rejectedCount;
    private String status;
    private String message;
    private LocalDateTime importTimestamp = LocalDateTime.now();

    public InstitutionImportResultDto() {}

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public int getTotalProcessed() { return totalProcessed; }
    public void setTotalProcessed(int totalProcessed) { this.totalProcessed = totalProcessed; }

    public int getInsertedCount() { return insertedCount; }
    public void setInsertedCount(int insertedCount) { this.insertedCount = insertedCount; }

    public int getUpdatedCount() { return updatedCount; }
    public void setUpdatedCount(int updatedCount) { this.updatedCount = updatedCount; }

    public int getSkippedCount() { return skippedCount; }
    public void setSkippedCount(int skippedCount) { this.skippedCount = skippedCount; }

    public int getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(int rejectedCount) { this.rejectedCount = rejectedCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getImportTimestamp() { return importTimestamp; }
    public void setImportTimestamp(LocalDateTime importTimestamp) { this.importTimestamp = importTimestamp; }
}
