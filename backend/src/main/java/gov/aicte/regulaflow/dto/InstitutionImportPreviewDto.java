package gov.aicte.regulaflow.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InstitutionImportPreviewDto {
    private String filename;
    private long fileSize;
    private int totalRows;
    private int validRowsCount;
    private int invalidRowsCount;
    private int duplicateRowsCount;
    private boolean headerValid;
    private List<String> detectedHeaders = new ArrayList<>();
    private List<Map<String, String>> previewRows = new ArrayList<>();
    private List<String> validationErrors = new ArrayList<>();

    public InstitutionImportPreviewDto() {}

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }

    public int getValidRowsCount() { return validRowsCount; }
    public void setValidRowsCount(int validRowsCount) { this.validRowsCount = validRowsCount; }

    public int getInvalidRowsCount() { return invalidRowsCount; }
    public void setInvalidRowsCount(int invalidRowsCount) { this.invalidRowsCount = invalidRowsCount; }

    public int getDuplicateRowsCount() { return duplicateRowsCount; }
    public void setDuplicateRowsCount(int duplicateRowsCount) { this.duplicateRowsCount = duplicateRowsCount; }

    public boolean isHeaderValid() { return headerValid; }
    public void setHeaderValid(boolean headerValid) { this.headerValid = headerValid; }

    public List<String> getDetectedHeaders() { return detectedHeaders; }
    public void setDetectedHeaders(List<String> detectedHeaders) { this.detectedHeaders = detectedHeaders; }

    public List<Map<String, String>> getPreviewRows() { return previewRows; }
    public void setPreviewRows(List<Map<String, String>> previewRows) { this.previewRows = previewRows; }

    public List<String> getValidationErrors() { return validationErrors; }
    public void setValidationErrors(List<String> validationErrors) { this.validationErrors = validationErrors; }
}
