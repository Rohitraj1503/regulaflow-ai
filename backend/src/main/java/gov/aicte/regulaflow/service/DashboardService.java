package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.DashboardMetricsDto;
import gov.aicte.regulaflow.dto.WorkflowHistoryDto;
import gov.aicte.regulaflow.entity.Application;
import gov.aicte.regulaflow.entity.WorkflowHistory;
import gov.aicte.regulaflow.repository.ApplicationRepository;
import gov.aicte.regulaflow.repository.WorkflowHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;

    public DashboardService(ApplicationRepository applicationRepository,
                            WorkflowHistoryRepository workflowHistoryRepository) {
        this.applicationRepository = applicationRepository;
        this.workflowHistoryRepository = workflowHistoryRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDto getDashboardMetrics() {
        List<Application> allApps = applicationRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        long total = allApps.size();
        long pending = 0;
        long scrutiny = 0;
        long deficiency = 0;
        long evc = 0;
        long approved = 0;
        long rejected = 0;
        long overdue = 0;
        long totalProcessingDaysSum = 0;
        long processedAppsCount = 0;

        Map<String, Long> stageWise = new LinkedHashMap<>();
        Map<String, Long> regionWise = new LinkedHashMap<>();
        Map<String, Long> categoryWise = new LinkedHashMap<>();

        long bucketLess7 = 0;
        long bucket8to15 = 0;
        long bucket16to30 = 0;
        long bucketOver30 = 0;

        for (Application app : allApps) {
            String status = app.getStatus();
            stageWise.put(status, stageWise.getOrDefault(status, 0L) + 1);

            String region = app.getInstitution() != null ? app.getInstitution().getRegion() : "Unknown";
            regionWise.put(region, regionWise.getOrDefault(region, 0L) + 1);

            String cat = app.getCategory();
            categoryWise.put(cat, categoryWise.getOrDefault(cat, 0L) + 1);

            if ("APPROVED".equals(status)) {
                approved++;
                if (app.getSubmissionDate() != null && app.getApprovalDate() != null) {
                    totalProcessingDaysSum += Duration.between(app.getSubmissionDate(), app.getApprovalDate()).toDays();
                    processedAppsCount++;
                }
            } else if ("REJECTED".equals(status)) {
                rejected++;
            } else if (!"DRAFT".equals(status)) {
                pending++;
                if ("UNDER_SCRUTINY".equals(status) || "RE_SCRUTINY".equals(status)) scrutiny++;
                if ("DEFICIENCY_NOTED".equals(status)) deficiency++;
                if ("EVC_SCHEDULED".equals(status)) evc++;

                if (app.getSlaDueDate() != null && now.isAfter(app.getSlaDueDate())) {
                    overdue++;
                }

                if (app.getSubmissionDate() != null) {
                    long age = Duration.between(app.getSubmissionDate(), now).toDays();
                    if (age <= 7) bucketLess7++;
                    else if (age <= 15) bucket8to15++;
                    else if (age <= 30) bucket16to30++;
                    else bucketOver30++;
                }
            }
        }

        Map<String, Long> ageingBuckets = new LinkedHashMap<>();
        ageingBuckets.put("< 7 Days", bucketLess7);
        ageingBuckets.put("8 - 15 Days", bucket8to15);
        ageingBuckets.put("16 - 30 Days", bucket16to30);
        ageingBuckets.put("> 30 Days (Critical)", bucketOver30);

        List<WorkflowHistoryDto> recent = workflowHistoryRepository.findAll().stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .map(this::mapHistoryToDto)
                .collect(Collectors.toList());

        DashboardMetricsDto dto = new DashboardMetricsDto();
        dto.setTotalApplications(total);
        dto.setPendingApplications(pending);
        dto.setUnderScrutinyCount(scrutiny);
        dto.setDeficiencyNotedCount(deficiency);
        dto.setEvcScheduledCount(evc);
        dto.setApprovedCount(approved);
        dto.setRejectedCount(rejected);
        dto.setOverdueCount(overdue);
        dto.setAverageProcessingDays(processedAppsCount > 0 ? (double) totalProcessingDaysSum / processedAppsCount : 0.0);

        dto.setStageWisePendency(stageWise);
        dto.setRegionWisePendency(regionWise);
        dto.setCategoryWiseDistribution(categoryWise);
        dto.setAgeingBuckets(ageingBuckets);
        dto.setRecentActivities(recent);

        return dto;
    }

    private WorkflowHistoryDto mapHistoryToDto(WorkflowHistory h) {
        WorkflowHistoryDto dto = new WorkflowHistoryDto();
        dto.setId(h.getId());
        dto.setApplicationId(h.getApplication().getId());
        dto.setFromStatus(h.getFromStatus());
        dto.setToStatus(h.getToStatus());
        dto.setActorId(h.getActorId());
        dto.setActorName(h.getActorName());
        dto.setActorRole(h.getActorRole());
        dto.setRemarks(h.getRemarks());
        dto.setTimestamp(h.getTimestamp());
        return dto;
    }
}
