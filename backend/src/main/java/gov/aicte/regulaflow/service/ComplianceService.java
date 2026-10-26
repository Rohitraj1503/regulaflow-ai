package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.ComplianceEvidenceDto;
import gov.aicte.regulaflow.dto.ComplianceObligationDto;
import gov.aicte.regulaflow.dto.EvidenceSubmitRequest;
import gov.aicte.regulaflow.dto.EvidenceVerificationRequest;
import gov.aicte.regulaflow.entity.ComplianceEvidence;
import gov.aicte.regulaflow.entity.ComplianceObligation;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.ComplianceEvidenceRepository;
import gov.aicte.regulaflow.repository.ComplianceObligationRepository;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplianceService {

    private final ComplianceObligationRepository obligationRepository;
    private final ComplianceEvidenceRepository evidenceRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ComplianceService(ComplianceObligationRepository obligationRepository,
                             ComplianceEvidenceRepository evidenceRepository,
                             AuditService auditService,
                             NotificationService notificationService) {
        this.obligationRepository = obligationRepository;
        this.evidenceRepository = evidenceRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<ComplianceObligationDto> getObligations(UserPrincipal currentUser, Long institutionId) {
        List<ComplianceObligation> obligations;

        if ("ROLE_INSTITUTION_ADMIN".equals(currentUser.getRole())) {
            obligations = obligationRepository.findByInstitutionId(currentUser.getInstitutionId());
        } else if (institutionId != null) {
            obligations = obligationRepository.findByInstitutionId(institutionId);
        } else {
            obligations = obligationRepository.findAll();
        }

        return obligations.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public ComplianceEvidenceDto submitEvidence(EvidenceSubmitRequest request, UserPrincipal currentUser) {
        ComplianceObligation obligation = obligationRepository.findById(request.getObligationId())
                .orElseThrow(() -> new ResourceNotFoundException("ComplianceObligation", "id", request.getObligationId()));

        ComplianceEvidence evidence = new ComplianceEvidence();
        evidence.setObligation(obligation);
        evidence.setDocumentName(request.getDocumentName());
        evidence.setFilePath(request.getFilePath() != null ? request.getFilePath() : "/uploads/" + request.getDocumentName());
        evidence.setValidityStartDate(request.getValidityStartDate());
        evidence.setValidityEndDate(request.getValidityEndDate());
        evidence.setRemarks(request.getRemarks());
        evidence.setVerificationStatus("PENDING");

        ComplianceEvidence saved = evidenceRepository.save(evidence);

        obligation.setStatus("SUBMITTED");
        obligationRepository.save(obligation);

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "SUBMIT_COMPLIANCE_EVIDENCE",
                "COMPLIANCE_EVIDENCE", saved.getId().toString(), "PENDING", "SUBMITTED", null);

        return mapEvidenceToDto(saved);
    }

    @Transactional
    public ComplianceEvidenceDto verifyEvidence(Long evidenceId, EvidenceVerificationRequest request, UserPrincipal currentUser) {
        ComplianceEvidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("ComplianceEvidence", "id", evidenceId));

        evidence.setVerificationStatus(request.getStatus());
        evidence.setRemarks(request.getRemarks());
        ComplianceEvidence saved = evidenceRepository.save(evidence);

        ComplianceObligation obligation = evidence.getObligation();
        if ("APPROVED".equals(request.getStatus())) {
            obligation.setStatus("VERIFIED");
            obligation.setLastVerifiedAt(LocalDateTime.now());
            obligation.setVerifiedById(currentUser.getId());
        } else if ("REJECTED".equals(request.getStatus())) {
            obligation.setStatus("PENDING");
        }
        obligationRepository.save(obligation);

        auditService.recordEvent(currentUser.getUsername(), currentUser.getRole(), "VERIFY_COMPLIANCE_EVIDENCE",
                "COMPLIANCE_EVIDENCE", saved.getId().toString(), "PENDING", request.getStatus(), null);

        return mapEvidenceToDto(saved);
    }

    private ComplianceObligationDto mapToDto(ComplianceObligation ob) {
        ComplianceObligationDto dto = new ComplianceObligationDto();
        dto.setId(ob.getId());
        dto.setInstitutionId(ob.getInstitution().getId());
        dto.setInstitutionName(ob.getInstitution().getName());
        dto.setObligationTitle(ob.getObligationTitle());
        dto.setRegulatoryClause(ob.getRegulatoryClause());
        dto.setFrequency(ob.getFrequency());
        dto.setDeadline(ob.getDeadline());
        dto.setStatus(ob.getStatus());
        dto.setLastVerifiedAt(ob.getLastVerifiedAt());
        dto.setVerifiedById(ob.getVerifiedById());

        LocalDateTime now = LocalDateTime.now();
        if (ob.getDeadline() != null) {
            long days = Duration.between(now, ob.getDeadline()).toDays();
            dto.setDaysRemaining(days);
            dto.setIsOverdue(days < 0 && !"VERIFIED".equals(ob.getStatus()));
        }

        List<ComplianceEvidenceDto> evidences = evidenceRepository.findByObligationId(ob.getId()).stream()
                .map(this::mapEvidenceToDto)
                .collect(Collectors.toList());
        dto.setEvidences(evidences);

        return dto;
    }

    private ComplianceEvidenceDto mapEvidenceToDto(ComplianceEvidence ev) {
        ComplianceEvidenceDto dto = new ComplianceEvidenceDto();
        dto.setId(ev.getId());
        dto.setObligationId(ev.getObligation().getId());
        dto.setDocumentName(ev.getDocumentName());
        dto.setFilePath(ev.getFilePath());
        dto.setSubmissionDate(ev.getSubmissionDate());
        dto.setValidityStartDate(ev.getValidityStartDate());
        dto.setValidityEndDate(ev.getValidityEndDate());
        dto.setVerificationStatus(ev.getVerificationStatus());
        dto.setRemarks(ev.getRemarks());
        return dto;
    }
}
