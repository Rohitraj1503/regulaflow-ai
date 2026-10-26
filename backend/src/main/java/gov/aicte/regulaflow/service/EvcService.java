package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.EvcCreateRequest;
import gov.aicte.regulaflow.dto.EvcReportRequest;
import gov.aicte.regulaflow.dto.EvcScheduleDto;
import gov.aicte.regulaflow.entity.Application;
import gov.aicte.regulaflow.entity.EvcSchedule;
import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.exception.ApiException;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.ApplicationRepository;
import gov.aicte.regulaflow.repository.EvcScheduleRepository;
import gov.aicte.regulaflow.repository.UserRepository;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EvcService {

    private final EvcScheduleRepository evcScheduleRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public EvcService(EvcScheduleRepository evcScheduleRepository,
                      ApplicationRepository applicationRepository,
                      UserRepository userRepository,
                      NotificationService notificationService,
                      AuditService auditService) {
        this.evcScheduleRepository = evcScheduleRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public EvcScheduleDto scheduleEvc(EvcCreateRequest request, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        User leadOfficer = userRepository.findById(request.getLeadOfficerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getLeadOfficerId()));

        // Conflict of interest check: lead officer cannot belong to target institution
        if (leadOfficer.getInstitution() != null &&
                Objects.equals(leadOfficer.getInstitution().getId(), application.getInstitution().getId())) {
            throw new ApiException("Conflict of Interest: Lead Officer cannot belong to the applicant institution!");
        }

        EvcSchedule evc = new EvcSchedule();
        evc.setApplication(application);
        evc.setVisitType(request.getVisitType());
        evc.setScheduledDate(request.getScheduledDate());
        evc.setLeadOfficer(leadOfficer);
        evc.setCommitteeMembers(request.getCommitteeMembers() != null ? request.getCommitteeMembers() : leadOfficer.getFullName() + " (Lead Expert)");
        evc.setStatus("SCHEDULED");

        EvcSchedule saved = evcScheduleRepository.save(evc);

        // Update application status to EVC_SCHEDULED
        application.setStatus("EVC_SCHEDULED");
        applicationRepository.save(application);

        // Notify lead officer
        notificationService.sendNotification(leadOfficer.getId(),
                "EVC Inspection Assignment",
                "You have been designated Lead Officer for inspection of " + application.getInstitution().getName() + " on " + request.getScheduledDate().toString(),
                "EVC_UPDATE", "WARNING", saved.getId().toString(), "EVC");

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "SCHEDULE_EVC",
                "EVC", saved.getId().toString(), null, "SCHEDULED", null);

        return mapToDto(saved);
    }

    @Transactional
    public EvcScheduleDto submitEvcReport(Long evcId, EvcReportRequest request, UserPrincipal currentUser) {
        EvcSchedule evc = evcScheduleRepository.findById(evcId)
                .orElseThrow(() -> new ResourceNotFoundException("EvcSchedule", "id", evcId));

        evc.setFindingsSummary(request.getFindingsSummary());
        evc.setInfrastructureScore(request.getInfrastructureScore());
        evc.setFacultyScore(request.getFacultyScore());
        evc.setLabsScore(request.getLabsScore());
        evc.setRecommendation(request.getRecommendation());
        evc.setReportFilePath(request.getReportFilePath());
        evc.setStatus("COMPLETED");
        evc.setCompletedAt(LocalDateTime.now());

        EvcSchedule saved = evcScheduleRepository.save(evc);

        // Update application status to EVC_COMPLETED
        Application app = evc.getApplication();
        app.setStatus("EVC_COMPLETED");
        applicationRepository.save(app);

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "SUBMIT_EVC_REPORT",
                "EVC", saved.getId().toString(), "SCHEDULED", "COMPLETED", null);

        return mapToDto(saved);
    }

    public List<EvcScheduleDto> getAllEvcSchedules() {
        return evcScheduleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EvcScheduleDto getEvcById(Long id) {
        EvcSchedule evc = evcScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EvcSchedule", "id", id));
        return mapToDto(evc);
    }

    private EvcScheduleDto mapToDto(EvcSchedule evc) {
        EvcScheduleDto dto = new EvcScheduleDto();
        dto.setId(evc.getId());
        dto.setApplicationId(evc.getApplication().getId());
        dto.setApplicationNumber(evc.getApplication().getApplicationNumber());
        dto.setInstitutionName(evc.getApplication().getInstitution().getName());
        dto.setVisitType(evc.getVisitType());
        dto.setScheduledDate(evc.getScheduledDate());
        dto.setLeadOfficerId(evc.getLeadOfficer().getId());
        dto.setLeadOfficerName(evc.getLeadOfficer().getFullName());
        dto.setCommitteeMembers(evc.getCommitteeMembers());
        dto.setStatus(evc.getStatus());
        dto.setFindingsSummary(evc.getFindingsSummary());
        dto.setInfrastructureScore(evc.getInfrastructureScore());
        dto.setFacultyScore(evc.getFacultyScore());
        dto.setLabsScore(evc.getLabsScore());
        dto.setRecommendation(evc.getRecommendation());
        dto.setReportFilePath(evc.getReportFilePath());
        dto.setCreatedAt(evc.getCreatedAt());
        dto.setCompletedAt(evc.getCompletedAt());
        return dto;
    }
}
