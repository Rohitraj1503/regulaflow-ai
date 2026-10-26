package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.InstitutionImportPreviewDto;
import gov.aicte.regulaflow.dto.InstitutionImportResultDto;
import gov.aicte.regulaflow.entity.Institution;
import gov.aicte.regulaflow.entity.InstitutionImportHistory;
import gov.aicte.regulaflow.exception.ApiException;
import gov.aicte.regulaflow.repository.InstitutionImportHistoryRepository;
import gov.aicte.regulaflow.repository.InstitutionRepository;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class InstitutionImportService {

    private static final Logger logger = LoggerFactory.getLogger(InstitutionImportService.class);

    private final InstitutionRepository institutionRepository;
    private final InstitutionImportHistoryRepository importHistoryRepository;
    private final AuditService auditService;

    private static final List<String> EXPECTED_HEADERS = List.of(
            "institution_id", "institution_name", "institution_type", "state", "district",
            "city", "address", "pincode", "official_website", "aicte_approval_status",
            "academic_year", "source_name", "source_url", "source_publication_date",
            "last_verified_at", "data_quality_status"
    );

    public InstitutionImportService(InstitutionRepository institutionRepository,
                                    InstitutionImportHistoryRepository importHistoryRepository,
                                    AuditService auditService) {
        this.institutionRepository = institutionRepository;
        this.importHistoryRepository = importHistoryRepository;
        this.auditService = auditService;
    }

    public InstitutionImportPreviewDto previewCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("CSV file is empty or missing.");
        }

        InstitutionImportPreviewDto preview = new InstitutionImportPreviewDto();
        preview.setFilename(file.getOriginalFilename());
        preview.setFileSize(file.getSize());

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new ApiException("CSV file contains no content.");
            }

            List<String> headers = parseCsvLine(headerLine);
            preview.setDetectedHeaders(headers);

            boolean headerMatch = headers.size() >= EXPECTED_HEADERS.size();
            if (headerMatch) {
                for (int i = 0; i < EXPECTED_HEADERS.size(); i++) {
                    if (!EXPECTED_HEADERS.get(i).equalsIgnoreCase(headers.get(i).trim())) {
                        headerMatch = false;
                        break;
                    }
                }
            }
            preview.setHeaderValid(headerMatch);
            if (!headerMatch) {
                preview.getValidationErrors().add("Header row does not match expected schema. Found: " + headers);
            }

            int rowIdx = 1; // 1-based, header was line 1
            int validCount = 0;
            int invalidCount = 0;
            int duplicateCount = 0;
            Set<String> fileIds = new HashSet<>();
            Set<String> existingDbIds = new HashSet<>(institutionRepository.findAllAicteIds());

            String line;
            while ((line = reader.readLine()) != null) {
                rowIdx++;
                line = line.trim();
                if (line.isEmpty()) continue;

                List<String> values = parseCsvLine(line);
                if (values.size() < 4) {
                    invalidCount++;
                    if (preview.getValidationErrors().size() < 30) {
                        preview.getValidationErrors().add("Row " + rowIdx + ": Insufficient columns (found " + values.size() + ")");
                    }
                    continue;
                }

                String instId = values.get(0).trim();
                String name = values.size() > 1 ? values.get(1).trim() : "";
                String state = values.size() > 3 ? values.get(3).trim() : "";

                if (instId.isEmpty() || name.isEmpty() || state.isEmpty()) {
                    invalidCount++;
                    if (preview.getValidationErrors().size() < 30) {
                        preview.getValidationErrors().add("Row " + rowIdx + ": Missing required fields (institution_id, name, or state)");
                    }
                    continue;
                }

                if (fileIds.contains(instId) || existingDbIds.contains(instId)) {
                    duplicateCount++;
                }
                fileIds.add(instId);
                validCount++;

                // Collect up to first 20 preview rows
                if (preview.getPreviewRows().size() < 20) {
                    Map<String, String> rowMap = new LinkedHashMap<>();
                    for (int i = 0; i < Math.min(headers.size(), values.size()); i++) {
                        rowMap.put(headers.get(i), values.get(i));
                    }
                    preview.getPreviewRows().add(rowMap);
                }
            }

            preview.setTotalRows(validCount + invalidCount);
            preview.setValidRowsCount(validCount);
            preview.setInvalidRowsCount(invalidCount);
            preview.setDuplicateRowsCount(duplicateCount);

            return preview;
        } catch (Exception e) {
            logger.error("Failed to parse CSV preview: {}", e.getMessage(), e);
            throw new ApiException("Error parsing CSV preview: " + e.getMessage());
        }
    }

    @Transactional
    public InstitutionImportResultDto confirmImport(MultipartFile file, boolean updateExisting, UserPrincipal currentUser) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("CSV file is empty or missing.");
        }

        String username = currentUser != null ? currentUser.getUsername() : "SYSTEM";

        InstitutionImportHistory history = new InstitutionImportHistory();
        history.setFilename(file.getOriginalFilename());
        history.setFileSize(file.getSize());
        history.setStatus("PROCESSING");
        history.setImportedBy(username);
        history = importHistoryRepository.save(history);

        int total = 0;
        int inserted = 0;
        int updated = 0;
        int skipped = 0;
        int rejected = 0;
        List<String> errorSummaries = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new ApiException("CSV file contains no content.");
            }

            List<String> headers = parseCsvLine(headerLine);
            Map<String, Integer> colIndex = new HashMap<>();
            for (int i = 0; i < headers.size(); i++) {
                colIndex.put(headers.get(i).trim().toLowerCase(), i);
            }

            Map<String, Institution> existingMap = new HashMap<>();
            for (Institution existingInst : institutionRepository.findAll()) {
                if (existingInst.getAicteId() != null) {
                    existingMap.put(existingInst.getAicteId().trim(), existingInst);
                }
            }

            String line;
            int lineNum = 1;
            List<Institution> batchToSave = new ArrayList<>();

            while ((line = reader.readLine()) != null) {
                lineNum++;
                line = line.trim();
                if (line.isEmpty()) continue;

                total++;
                List<String> values = parseCsvLine(line);

                String instId = getValue(values, colIndex, "institution_id");
                String name = getValue(values, colIndex, "institution_name");
                String type = getValue(values, colIndex, "institution_type");
                String state = getValue(values, colIndex, "state");
                String district = getValue(values, colIndex, "district");
                String city = getValue(values, colIndex, "city");
                String address = getValue(values, colIndex, "address");
                String pincode = getValue(values, colIndex, "pincode");
                String website = getValue(values, colIndex, "official_website");
                String approvalStatus = getValue(values, colIndex, "aicte_approval_status");
                String academicYear = getValue(values, colIndex, "academic_year");
                String sourceName = getValue(values, colIndex, "source_name");
                String sourceUrl = getValue(values, colIndex, "source_url");
                String pubDateStr = getValue(values, colIndex, "source_publication_date");
                String qualityStatus = getValue(values, colIndex, "data_quality_status");

                if (instId.isEmpty() || name.isEmpty() || state.isEmpty()) {
                    rejected++;
                    if (errorSummaries.size() < 50) {
                        errorSummaries.add("Line " + lineNum + ": Missing required identifier, name, or state");
                    }
                    continue;
                }

                LocalDate pubDate = null;
                try {
                    if (!pubDateStr.isEmpty()) {
                        pubDate = LocalDate.parse(pubDateStr);
                    }
                } catch (Exception ignored) {}

                Institution existing = existingMap.get(instId);
                if (existing != null) {
                    if (updateExisting) {
                        if (!district.isEmpty()) existing.setDistrict(district);
                        if (!pincode.isEmpty()) existing.setPincode(pincode);
                        if (!website.isEmpty()) existing.setOfficialWebsite(website);
                        if (!approvalStatus.isEmpty()) existing.setAicteApprovalStatus(approvalStatus);
                        if (!academicYear.isEmpty()) existing.setAcademicYear(academicYear);
                        if (!sourceName.isEmpty()) existing.setSourceName(sourceName);
                        if (!sourceUrl.isEmpty()) existing.setSourceUrl(sourceUrl);
                        if (pubDate != null) existing.setSourcePublicationDate(pubDate);
                        if (!qualityStatus.isEmpty()) existing.setDataQualityStatus(qualityStatus);
                        existing.setImportBatchId(history.getId());
                        existing.setVerifiedAt(LocalDateTime.now());
                        existing.setUpdatedAt(LocalDateTime.now());
                        batchToSave.add(existing);
                        updated++;
                    } else {
                        skipped++;
                    }
                } else {
                    Institution inst = new Institution();
                    inst.setAicteId(instId);
                    inst.setName(name);
                    inst.setInstituteType(!type.isEmpty() ? type : "Technical Institution");
                    inst.setState(state);
                    inst.setDistrict(district);
                    inst.setCity(!city.isEmpty() ? city : (district.isEmpty() ? state : district));
                    inst.setAddress(address);
                    inst.setPincode(pincode);
                    inst.setRegion(deriveRegion(state));
                    inst.setOfficialWebsite(website);
                    inst.setAicteApprovalStatus(!approvalStatus.isEmpty() ? approvalStatus : "APPROVED");
                    inst.setAcademicYear(!academicYear.isEmpty() ? academicYear : "2024-2025");
                    inst.setSourceName(!sourceName.isEmpty() ? sourceName : "All India Council for Technical Education (AICTE)");
                    inst.setSourceUrl(!sourceUrl.isEmpty() ? sourceUrl : "https://facilities.aicte-india.org/");
                    inst.setSourcePublicationDate(pubDate != null ? pubDate : LocalDate.of(2024, 6, 30));
                    inst.setDataQualityStatus(!qualityStatus.isEmpty() ? qualityStatus : "VERIFIED");
                    inst.setStatus("ACTIVE");
                    inst.setImportBatchId(history.getId());
                    inst.setVerifiedAt(LocalDateTime.now());
                    inst.setCreatedAt(LocalDateTime.now());
                    inst.setUpdatedAt(LocalDateTime.now());
                    batchToSave.add(inst);
                    existingMap.put(instId, inst);
                    inserted++;
                }

                // Periodic batch persistence
                if (batchToSave.size() >= 500) {
                    institutionRepository.saveAll(batchToSave);
                    batchToSave.clear();
                }
            }

            if (!batchToSave.isEmpty()) {
                institutionRepository.saveAll(batchToSave);
                batchToSave.clear();
            }

            history.setTotalRows(total);
            history.setInsertedRows(inserted);
            history.setUpdatedRows(updated);
            history.setSkippedRows(skipped);
            history.setRejectedRows(rejected);
            history.setStatus("COMPLETED");
            if (!errorSummaries.isEmpty()) {
                history.setErrorSummary(String.join("\n", errorSummaries));
            }
            importHistoryRepository.save(history);

            auditService.recordEvent(
                    username,
                    currentUser != null ? currentUser.getRole() : "ADMIN",
                    "INSTITUTION_CSV_IMPORT",
                    "INSTITUTION_IMPORT_BATCH",
                    history.getId().toString(),
                    null,
                    "COMPLETED",
                    String.format("Imported %d new, updated %d, skipped %d from %s", inserted, updated, skipped, file.getOriginalFilename())
            );

            InstitutionImportResultDto result = new InstitutionImportResultDto();
            result.setBatchId(history.getId());
            result.setFilename(file.getOriginalFilename());
            result.setTotalProcessed(total);
            result.setInsertedCount(inserted);
            result.setUpdatedCount(updated);
            result.setSkippedCount(skipped);
            result.setRejectedCount(rejected);
            result.setStatus("COMPLETED");
            result.setMessage(String.format("Batch #%d completed: %d inserted, %d updated, %d skipped, %d rejected.",
                    history.getId(), inserted, updated, skipped, rejected));

            return result;
        } catch (Exception e) {
            history.setStatus("FAILED");
            history.setErrorSummary("Execution error: " + e.getMessage());
            importHistoryRepository.save(history);
            logger.error("Institution import batch failed: {}", e.getMessage(), e);
            throw new ApiException("CSV import execution failed: " + e.getMessage());
        }
    }

    public List<InstitutionImportHistory> getImportHistory() {
        return importHistoryRepository.findAllByOrderByCreatedAtDesc();
    }

    private String getValue(List<String> values, Map<String, Integer> colIndex, String key) {
        Integer idx = colIndex.get(key.toLowerCase());
        if (idx != null && idx < values.size()) {
            return values.get(idx).trim();
        }
        return "";
    }

    private String deriveRegion(String state) {
        if (state == null) return "Central";
        String s = state.toUpperCase();
        if (s.contains("MAHARASHTRA") || s.contains("GOA") || s.contains("GUJARAT") || s.contains("DAMAN")) return "Western";
        if (s.contains("DELHI") || s.contains("HARYANA") || s.contains("PUNJAB") || s.contains("CHANDIGARH") || s.contains("HIMACHAL") || s.contains("JAMMU") || s.contains("UTTAR PRADESH") || s.contains("UTTARAKHAND")) return "Northern";
        if (s.contains("KARNATAKA") || s.contains("KERALA")) return "South-Western";
        if (s.contains("TAMIL") || s.contains("ANDHRA") || s.contains("TELANGANA") || s.contains("PUDUCHERRY")) return "Southern";
        if (s.contains("WEST BENGAL") || s.contains("BIHAR") || s.contains("JHARKHAND") || s.contains("ODISHA") || s.contains("ORISSA")) return "Eastern";
        if (s.contains("RAJASTHAN")) return "North-Western";
        if (s.contains("ASSAM") || s.contains("MANIPUR") || s.contains("MEGHALAYA") || s.contains("MIZORAM") || s.contains("NAGALAND") || s.contains("TRIPURA") || s.contains("SIKKIM") || s.contains("ARUNACHAL")) return "North-Eastern";
        return "Central";
    }

    private List<String> parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        if (line == null) return result;

        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '\"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '\"') {
                    current.append('\"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString().trim());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        result.add(current.toString().trim());
        return result;
    }
}
