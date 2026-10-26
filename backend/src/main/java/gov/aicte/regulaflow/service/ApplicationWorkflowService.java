package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.*;
import gov.aicte.regulaflow.entity.*;
import gov.aicte.regulaflow.exception.ApiException;
import gov.aicte.regulaflow.exception.InvalidWorkflowTransitionException;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.*;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationWorkflowService {

    private final ApplicationRepository applicationRepository;
    private final InstitutionRepository institutionRepository;
    private final UserRepository userRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;
    private final DeficiencyRepository deficiencyRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public ApplicationWorkflowService(ApplicationRepository applicationRepository,
                                      InstitutionRepository institutionRepository,
                                      UserRepository userRepository,
                                      WorkflowHistoryRepository workflowHistoryRepository,
                                      DeficiencyRepository deficiencyRepository,
                                      ApplicationDocumentRepository documentRepository,
                                      NotificationService notificationService,
                                      AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.institutionRepository = institutionRepository;
        this.userRepository = userRepository;
        this.workflowHistoryRepository = workflowHistoryRepository;
        this.deficiencyRepository = deficiencyRepository;
        this.documentRepository = documentRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public ApplicationDto createApplication(ApplicationCreateRequest request, UserPrincipal currentUser) {
        Institution institution = institutionRepository.findById(request.getInstitutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", request.getInstitutionId()));

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole()) &&
                !Objects.equals(currentUser.getInstitutionId(), institution.getId())) {
            throw new AccessDeniedException("Cannot create application for a different institution");
        }

        long appCount = applicationRepository.count() + 1;
        String appNumber = String.format("APP-2026-%04d", appCount);

        Application application = new Application();
        application.setApplicationNumber(appNumber);
        application.setInstitution(institution);
        application.setCategory(request.getCategory());
        application.setAcademicYear(request.getAcademicYear());
        application.setStatus("DRAFT");
        application.setRemarks(request.getRemarks());

        Application saved = applicationRepository.save(application);

        recordHistory(saved, null, "DRAFT", currentUser, "Application draft initiated.");
        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "CREATE_APPLICATION",
                "APPLICATION", saved.getApplicationNumber(), null, "DRAFT", null);

        return mapToDto(saved);
    }

    @Transactional
    public ApplicationDto submitApplication(Long applicationId, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (!"DRAFT".equals(application.getStatus())) {
            throw new InvalidWorkflowTransitionException(application.getStatus(), "SUBMITTED", currentUser.getRole());
        }

        application.setStatus("SUBMITTED");
        application.setSubmissionDate(LocalDateTime.now());
        application.setSlaDueDate(LocalDateTime.now().plusDays(30)); // 30-day statutory SLA

        Application saved = applicationRepository.save(application);

        recordHistory(saved, "DRAFT", "SUBMITTED", currentUser, "Application submitted for AICTE scrutiny.");
        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "SUBMIT_APPLICATION",
                "APPLICATION", saved.getApplicationNumber(), "DRAFT", "SUBMITTED", null);

        // Notify regulatory bureau
        List<User> regOfficers = userRepository.findByRole("ROLE_REGULATORY_OFFICER");
        for (User officer : regOfficers) {
            notificationService.sendNotification(officer.getId(),
                    "New Application: " + saved.getApplicationNumber(),
                    "Institution " + saved.getInstitution().getName() + " submitted " + saved.getCategory(),
                    "STATUS_CHANGE", "INFO", saved.getApplicationNumber(), "APPLICATION");
        }

        return mapToDto(saved);
    }

    @Transactional
    public ApplicationDto transitionWorkflow(Long applicationId, WorkflowTransitionRequest request, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        String currentStatus = application.getStatus();
        String targetStatus = request.getTargetStatus();
        String userRole = currentUser.getRole();

        validateTransition(currentStatus, targetStatus, userRole);

        application.setStatus(targetStatus);
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            application.setRemarks(request.getRemarks());
        }

        if (request.getAssignedOfficerId() != null) {
            User officer = userRepository.findById(request.getAssignedOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedOfficerId()));
            application.setAssignedOfficer(officer);
        }

        if ("APPROVED".equals(targetStatus)) {
            application.setApprovalDate(LocalDateTime.now());
        }

        Application saved = applicationRepository.save(application);

        // If deficiency noted, create deficiency record
        if ("DEFICIENCY_NOTED".equals(targetStatus)) {
            Deficiency deficiency = new Deficiency();
            deficiency.setApplication(saved);
            deficiency.setClauseReference(request.getDeficiencyClause() != null ? request.getDeficiencyClause() : "AICTE Regulations Norms");
            deficiency.setIssueDescription(request.getDeficiencyDescription() != null ? request.getDeficiencyDescription() : request.getRemarks());
            deficiency.setCategory(request.getDeficiencyCategory() != null ? request.getDeficiencyCategory() : "GENERAL_SCRUTINY");
            deficiency.setSeverity(request.getDeficiencySeverity() != null ? request.getDeficiencySeverity() : "MEDIUM");
            deficiency.setStatus("OPEN");
            deficiencyRepository.save(deficiency);

            // Notify institution
            notifyInstitutionUsers(saved.getInstitution().getId(),
                    "Deficiency Issued: " + saved.getApplicationNumber(),
                    "A deficiency has been raised: " + deficiency.getIssueDescription(),
                    "DEFICIENCY", "CRITICAL", saved.getApplicationNumber(), "APPLICATION");
        }

        recordHistory(saved, currentStatus, targetStatus, currentUser, request.getRemarks());
        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "TRANSITION_STAGE",
                "APPLICATION", saved.getApplicationNumber(), currentStatus, targetStatus, null);

        return mapToDto(saved);
    }

    @Transactional
    public DeficiencyDto respondToDeficiency(Long deficiencyId, DeficiencyResponseRequest request, UserPrincipal currentUser) {
        Deficiency deficiency = deficiencyRepository.findById(deficiencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Deficiency", "id", deficiencyId));

        Application application = deficiency.getApplication();

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole()) &&
                !Objects.equals(currentUser.getInstitutionId(), application.getInstitution().getId())) {
            throw new AccessDeniedException("Cannot respond to deficiency for another institution");
        }

        deficiency.setResponseRemarks(request.getResponseRemarks());
        deficiency.setStatus("ADDRESSED");
        deficiency.setResolvedAt(LocalDateTime.now());
        Deficiency saved = deficiencyRepository.save(deficiency);

        // Check if all deficiencies are addressed, then transition app to CLARIFICATION_SUBMITTED
        List<Deficiency> openDefs = deficiencyRepository.findByApplicationIdAndStatus(application.getId(), "OPEN");
        if (openDefs.isEmpty()) {
            String prevStatus = application.getStatus();
            application.setStatus("CLARIFICATION_SUBMITTED");
            applicationRepository.save(application);

            recordHistory(application, prevStatus, "CLARIFICATION_SUBMITTED", currentUser,
                    "Clarification and rectifications submitted by institution.");

            if (application.getAssignedOfficer() != null) {
                notificationService.sendNotification(application.getAssignedOfficer().getId(),
                        "Clarification Received: " + application.getApplicationNumber(),
                        "Institution has responded to all noted deficiencies.",
                        "DEFICIENCY", "INFO", application.getApplicationNumber(), "APPLICATION");
            }
        }

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "RESPOND_DEFICIENCY",
                "DEFICIENCY", deficiencyId.toString(), "OPEN", "ADDRESSED", null);

        return mapDeficiencyToDto(saved);
    }

    @Transactional
    public ApplicationDocumentDto registerDocument(Long applicationId, String docType, String docName, String filePath, Long fileSize, String checksum, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        ApplicationDocument doc = new ApplicationDocument();
        doc.setApplication(application);
        doc.setDocumentType(docType);
        doc.setDocumentName(docName);
        doc.setFilePath(filePath != null ? filePath : "/uploads/" + docName);
        doc.setFileSize(fileSize != null ? fileSize : 1024L);
        doc.setChecksum(checksum != null ? checksum : UUID.randomUUID().toString());
        doc.setStatus("PENDING");

        ApplicationDocument saved = documentRepository.save(doc);

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "UPLOAD_DOCUMENT",
                "DOCUMENT", saved.getId().toString(), null, "UPLOADED", null);

        return mapDocToDto(saved);
    }

    @Transactional
    public ApplicationDocumentDto uploadDocument(Long applicationId, MultipartFile file, String documentType, UserPrincipal currentUser) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("Uploaded file cannot be empty");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole()) &&
                !Objects.equals(currentUser.getInstitutionId(), application.getInstitution().getId())) {
            throw new AccessDeniedException("Cannot upload documents for another institution's application");
        }

        // Validate file size (max 25MB)
        long maxBytes = 25L * 1024 * 1024;
        if (file.getSize() > maxBytes) {
            throw new ApiException("File size exceeds 25MB statutory limit");
        }

        // Validate MIME type
        String contentType = file.getContentType();
        List<String> allowedTypes = Arrays.asList(
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        if (contentType == null || !allowedTypes.contains(contentType.toLowerCase())) {
            throw new ApiException("Invalid file format. Only PDF, JPG, PNG, and DOC/DOCX are permitted.");
        }

        try {
            // Compute SHA-256 hash
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(file.getBytes());
            StringBuilder hex = new StringBuilder();
            for (byte b : hashBytes) {
                hex.append(String.format("%02x", b));
            }
            String checksum = hex.toString();

            // Store file safely in uploads/documents/<applicationId>/
            Path uploadDir = Paths.get("uploads", "documents", String.valueOf(applicationId));
            Files.createDirectories(uploadDir);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
            String cleanName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
            String storageName = UUID.randomUUID().toString() + "_" + cleanName;
            Path targetPath = uploadDir.resolve(storageName);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            ApplicationDocument doc = new ApplicationDocument();
            doc.setApplication(application);
            doc.setDocumentType(documentType != null && !documentType.isBlank() ? documentType : "STATUTORY_ANNEXURE");
            doc.setDocumentName(cleanName);
            doc.setFilePath(targetPath.toString().replace('\\', '/'));
            doc.setFileSize(file.getSize());
            doc.setChecksum(checksum);
            doc.setStatus("PENDING");
            doc.setUploadedAt(LocalDateTime.now());

            ApplicationDocument saved = documentRepository.save(doc);

            auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "UPLOAD_DOCUMENT",
                    "DOCUMENT", saved.getId().toString(), null, "PENDING", null);

            // Notify assigned officer if present
            if (application.getAssignedOfficer() != null) {
                notificationService.sendNotification(application.getAssignedOfficer().getId(),
                        "New Document Uploaded: " + cleanName,
                        "Institution " + application.getInstitution().getName() + " uploaded " + doc.getDocumentType() + " for " + application.getApplicationNumber(),
                        "DOCUMENT", "INFO", application.getApplicationNumber(), "APPLICATION");
            }

            return mapDocToDto(saved);
        } catch (NoSuchAlgorithmException | IOException e) {
            throw new ApiException("Failed to store and process uploaded document: " + e.getMessage());
        }
    }

    public Resource getDocumentResource(Long applicationId, Long docId, UserPrincipal currentUser) {
        ApplicationDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicationDocument", "id", docId));

        if (!Objects.equals(doc.getApplication().getId(), applicationId)) {
            throw new ApiException("Document does not belong to application " + applicationId);
        }

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole()) &&
                !Objects.equals(currentUser.getInstitutionId(), doc.getApplication().getInstitution().getId())) {
            throw new AccessDeniedException("Access denied to view document for another institution");
        }

        try {
            Path filePath = Paths.get(doc.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File", "id", docId);
            }
        } catch (Exception e) {
            throw new ApiException("Could not read document file: " + e.getMessage());
        }
    }

    public static final Set<String> ELIGIBLE_OFFICER_ROLES = Set.of(
            "ROLE_REGULATORY_OFFICER",
            "ROLE_SCRUTINY_OFFICER",
            "ROLE_EVC_OFFICER"
    );

    public List<OfficerDto> getEligibleOfficers() {
        return userRepository.findEligibleOfficers(ELIGIBLE_OFFICER_ROLES).stream()
                .map(this::mapUserToOfficerDto)
                .collect(Collectors.toList());
    }

    private OfficerDto mapUserToOfficerDto(User u) {
        return new OfficerDto(
                u.getId(),
                u.getUsername(),
                u.getFullName(),
                u.getEmail(),
                u.getRole(),
                u.getDepartment(),
                u.getActive()
        );
    }

    @Transactional
    public ApplicationDto assignOfficer(Long applicationId, Long officerId, UserPrincipal currentUser) {
        if (currentUser == null) {
            throw new AccessDeniedException("User must be authenticated to assign officers");
        }
        if (!"ROLE_REGULATORY_OFFICER".equals(currentUser.getRole()) && !"ROLE_ADMIN".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Only regulatory officers and administrators are authorized to assign desk officers");
        }

        if (officerId == null) {
            throw new ApiException("A valid officer ID must be provided");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if ("DRAFT".equalsIgnoreCase(application.getStatus())) {
            throw new ApiException("Draft application " + application.getApplicationNumber() + " cannot be assigned to a desk officer until submitted");
        }

        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", officerId));

        if (Boolean.FALSE.equals(officer.getActive())) {
            throw new ApiException("Cannot assign inactive or disabled officer (ID: " + officerId + ")");
        }

        if (!ELIGIBLE_OFFICER_ROLES.contains(officer.getRole())) {
            throw new ApiException("Selected user (" + officer.getFullName() + ") does not hold an eligible regulatory processing role");
        }

        User previousOfficer = application.getAssignedOfficer();
        application.setAssignedOfficer(officer);
        application.setUpdatedAt(LocalDateTime.now());
        Application saved = applicationRepository.save(application);

        String prevName = previousOfficer != null ? previousOfficer.getFullName() : "None";
        String officerDept = officer.getDepartment() != null && !officer.getDepartment().isBlank()
                ? " — " + officer.getDepartment()
                : "";
        recordHistory(saved, saved.getStatus(), saved.getStatus(), currentUser,
                "Assigned to officer: " + officer.getFullName() + officerDept + " (" + officer.getRole().replace("ROLE_", "") + ")");

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "ASSIGN_OFFICER",
                "APPLICATION", saved.getApplicationNumber(), prevName, officer.getFullName(),
                "Application assigned to officer by " + currentUser.getFullName());

        notificationService.sendNotification(officer.getId(),
                "New Case Assigned: " + saved.getApplicationNumber(),
                "You have been assigned as desk officer for " + saved.getApplicationNumber() + " by " + currentUser.getFullName(),
                "ASSIGNMENT", "HIGH", saved.getApplicationNumber(), "APPLICATION");

        return mapToDto(saved);
    }

    @Transactional
    public ApplicationDocumentDto verifyDocument(Long applicationId, Long docId, String status, String deficiencyNotes, UserPrincipal currentUser) {
        ApplicationDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicationDocument", "id", docId));

        if (!Objects.equals(doc.getApplication().getId(), applicationId)) {
            throw new ApiException("Document does not belong to application " + applicationId);
        }

        String oldStatus = doc.getStatus();
        doc.setStatus(status != null ? status.toUpperCase() : "VERIFIED");
        if (deficiencyNotes != null && !deficiencyNotes.isBlank()) {
            doc.setDeficiencyNotes(deficiencyNotes);
        }
        ApplicationDocument saved = documentRepository.save(doc);

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "VERIFY_DOCUMENT",
                "DOCUMENT", saved.getId().toString(), oldStatus, saved.getStatus(),
                "Document verification completed with status: " + saved.getStatus());

        return mapDocToDto(saved);
    }

    public List<ApplicationDocumentDto> getApplicationDocuments(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId).stream()
                .map(this::mapDocToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplications(UserPrincipal currentUser, String status, String category) {
        List<Application> apps;

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole())) {
            apps = applicationRepository.findByInstitutionId(currentUser.getInstitutionId());
        } else if ("ROLE_EVC_OFFICER".equals(currentUser.getRole())) {
            apps = applicationRepository.findByStatus("EVC_SCHEDULED");
        } else {
            apps = applicationRepository.findAll();
        }

        return apps.stream()
                .filter(a -> status == null || status.isBlank() || a.getStatus().equalsIgnoreCase(status))
                .filter(a -> category == null || category.isBlank() || a.getCategory().equalsIgnoreCase(category))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(Long id, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole()) &&
                !Objects.equals(currentUser.getInstitutionId(), application.getInstitution().getId())) {
            throw new AccessDeniedException("Access denied to view this application");
        }

        return mapToDto(application);
    }

    public List<WorkflowHistoryDto> getApplicationHistory(Long applicationId) {
        return workflowHistoryRepository.findByApplicationIdOrderByTimestampDesc(applicationId).stream()
                .map(this::mapHistoryToDto)
                .collect(Collectors.toList());
    }

    public List<DeficiencyDto> getApplicationDeficiencies(Long applicationId) {
        return deficiencyRepository.findByApplicationId(applicationId).stream()
                .map(this::mapDeficiencyToDto)
                .collect(Collectors.toList());
    }

    private void validateTransition(String from, String to, String role) {
        if ("ROLE_ADMIN".equals(role)) {
            return; // Admins can override
        }

        Map<String, Set<String>> allowedTransitions = new HashMap<>();
        allowedTransitions.put("DRAFT", Set.of("SUBMITTED"));
        allowedTransitions.put("SUBMITTED", Set.of("UNDER_SCRUTINY"));
        allowedTransitions.put("UNDER_SCRUTINY", Set.of("DEFICIENCY_NOTED", "EVC_SCHEDULED", "APPROVED", "REJECTED"));
        allowedTransitions.put("DEFICIENCY_NOTED", Set.of("CLARIFICATION_SUBMITTED", "RESUBMITTED"));
        allowedTransitions.put("CLARIFICATION_SUBMITTED", Set.of("RE_SCRUTINY", "UNDER_SCRUTINY"));
        allowedTransitions.put("RESUBMITTED", Set.of("RE_SCRUTINY", "UNDER_SCRUTINY"));
        allowedTransitions.put("RE_SCRUTINY", Set.of("DEFICIENCY_NOTED", "EVC_SCHEDULED", "APPROVED", "REJECTED"));
        allowedTransitions.put("EVC_SCHEDULED", Set.of("EVC_COMPLETED"));
        allowedTransitions.put("EVC_COMPLETED", Set.of("APPROVED", "REJECTED", "DEFICIENCY_NOTED"));

        Set<String> validTargets = allowedTransitions.getOrDefault(from, Collections.emptySet());
        if (!validTargets.contains(to)) {
            throw new InvalidWorkflowTransitionException(from, to, role);
        }

        // Role-based restrictions
        if ("ROLE_INSTITUTION_ADMIN".equals(role)) {
            if (!Set.of("SUBMITTED", "CLARIFICATION_SUBMITTED", "RESUBMITTED").contains(to)) {
                throw new InvalidWorkflowTransitionException("Institutions can only submit applications or clarifications");
            }
        } else if ("ROLE_SCRUTINY_OFFICER".equals(role)) {
            if (Set.of("APPROVED", "REJECTED").contains(to)) {
                throw new InvalidWorkflowTransitionException("Only Regulatory Officers or Admins can grant final Approval or Rejection");
            }
        }
    }

    private void recordHistory(Application app, String from, String to, UserPrincipal actor, String remarks) {
        WorkflowHistory history = new WorkflowHistory();
        history.setApplication(app);
        history.setFromStatus(from);
        history.setToStatus(to);
        if (actor != null) {
            history.setActorId(actor.getId());
            history.setActorName(actor.getFullName());
            history.setActorRole(actor.getRole());
        }
        history.setRemarks(remarks);
        workflowHistoryRepository.save(history);
    }

    private void notifyInstitutionUsers(Long institutionId, String title, String msg, String type, String urgency, String refId, String refType) {
        List<User> instAdmins = userRepository.findByRole("ROLE_INSTITUTION_ADMIN").stream()
                .filter(u -> u.getInstitution() != null && Objects.equals(u.getInstitution().getId(), institutionId))
                .collect(Collectors.toList());
        for (User u : instAdmins) {
            notificationService.sendNotification(u.getId(), title, msg, type, urgency, refId, refType);
        }
    }

    private ApplicationDto mapToDto(Application a) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(a.getId());
        dto.setApplicationNumber(a.getApplicationNumber());
        dto.setInstitutionId(a.getInstitution().getId());
        dto.setInstitutionName(a.getInstitution().getName());
        dto.setInstitutionAicteId(a.getInstitution().getAicteId());
        dto.setInstitutionRegion(a.getInstitution().getRegion());
        dto.setCategory(a.getCategory());
        dto.setAcademicYear(a.getAcademicYear());
        dto.setStatus(a.getStatus());
        if (a.getAssignedOfficer() != null) {
            dto.setAssignedOfficerId(a.getAssignedOfficer().getId());
            dto.setAssignedOfficerName(a.getAssignedOfficer().getFullName());
        }
        dto.setSubmissionDate(a.getSubmissionDate());
        dto.setSlaDueDate(a.getSlaDueDate());
        dto.setApprovalDate(a.getApprovalDate());
        dto.setRemarks(a.getRemarks());

        LocalDateTime now = LocalDateTime.now();
        if (a.getSubmissionDate() != null) {
            dto.setTotalAgeingDays(Duration.between(a.getSubmissionDate(), now).toDays());
        } else {
            dto.setTotalAgeingDays(0L);
        }

        if (a.getUpdatedAt() != null) {
            dto.setDaysInCurrentStage(Duration.between(a.getUpdatedAt(), now).toDays());
        } else {
            dto.setDaysInCurrentStage(0L);
        }

        dto.setIsSlaBreached(a.getSlaDueDate() != null && now.isAfter(a.getSlaDueDate()) && !"APPROVED".equals(a.getStatus()) && !"REJECTED".equals(a.getStatus()));

        List<DeficiencyDto> defs = deficiencyRepository.findByApplicationId(a.getId()).stream()
                .map(this::mapDeficiencyToDto)
                .collect(Collectors.toList());
        dto.setDeficiencies(defs);

        List<ApplicationDocumentDto> docs = documentRepository.findByApplicationId(a.getId()).stream()
                .map(this::mapDocToDto)
                .collect(Collectors.toList());
        dto.setDocuments(docs);

        return dto;
    }

    private DeficiencyDto mapDeficiencyToDto(Deficiency d) {
        DeficiencyDto dto = new DeficiencyDto();
        dto.setId(d.getId());
        dto.setApplicationId(d.getApplication().getId());
        dto.setApplicationNumber(d.getApplication().getApplicationNumber());
        dto.setClauseReference(d.getClauseReference());
        dto.setIssueDescription(d.getIssueDescription());
        dto.setCategory(d.getCategory());
        dto.setSeverity(d.getSeverity());
        dto.setStatus(d.getStatus());
        dto.setResponseRemarks(d.getResponseRemarks());
        dto.setResolvedAt(d.getResolvedAt());
        dto.setCreatedAt(d.getCreatedAt());
        return dto;
    }

    private ApplicationDocumentDto mapDocToDto(ApplicationDocument doc) {
        ApplicationDocumentDto dto = new ApplicationDocumentDto();
        dto.setId(doc.getId());
        dto.setApplicationId(doc.getApplication().getId());
        dto.setDocumentType(doc.getDocumentType());
        dto.setDocumentName(doc.getDocumentName());
        dto.setFilePath(doc.getFilePath());
        dto.setFileSize(doc.getFileSize());
        dto.setChecksum(doc.getChecksum());
        dto.setStatus(doc.getStatus());
        dto.setDeficiencyNotes(doc.getDeficiencyNotes());
        dto.setUploadedAt(doc.getUploadedAt());
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
