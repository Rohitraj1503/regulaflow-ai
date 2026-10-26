package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.ApplicationDto;
import gov.aicte.regulaflow.dto.OfficerDto;
import gov.aicte.regulaflow.entity.Application;
import gov.aicte.regulaflow.entity.Institution;
import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.exception.ApiException;
import gov.aicte.regulaflow.repository.*;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationWorkflowServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private InstitutionRepository institutionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkflowHistoryRepository workflowHistoryRepository;

    @Mock
    private DeficiencyRepository deficiencyRepository;

    @Mock
    private ApplicationDocumentRepository documentRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ApplicationWorkflowService workflowService;

    private UserPrincipal adminPrincipal;
    private UserPrincipal regOfficerPrincipal;
    private UserPrincipal instAdminPrincipal;
    private Application testApp;
    private Institution testInst;
    private User activeRegOfficer;
    private User inactiveOfficer;
    private User auditorUser;

    @BeforeEach
    void setUp() {
        adminPrincipal = new UserPrincipal(1L, "admin", "admin@aicte.gov", "pass", "Dr. Arvind Sharma", "ROLE_ADMIN", null, true, Collections.emptyList());
        regOfficerPrincipal = new UserPrincipal(2L, "reg_officer", "reg@aicte.gov", "pass", "Rajesh K. Verma", "ROLE_REGULATORY_OFFICER", null, true, Collections.emptyList());
        instAdminPrincipal = new UserPrincipal(5L, "inst_admin", "inst@univ.edu", "pass", "Institution Admin", "ROLE_INSTITUTION_ADMIN", 1L, true, Collections.emptyList());

        testInst = new Institution();
        testInst.setId(1L);
        testInst.setName("Apex Institute of Technology");
        testInst.setAicteId("AICTE-1-10029381");
        testInst.setRegion("Northern");

        testApp = new Application();
        testApp.setId(10L);
        testApp.setApplicationNumber("APP-2026-001");
        testApp.setInstitution(testInst);
        testApp.setStatus("SUBMITTED");
        testApp.setCategory("EXTENSION_OF_APPROVAL");
        testApp.setAcademicYear("2026-27");

        activeRegOfficer = new User();
        activeRegOfficer.setId(2L);
        activeRegOfficer.setUsername("reg_officer");
        activeRegOfficer.setFullName("Rajesh K. Verma");
        activeRegOfficer.setEmail("regulatory.officer@regulaflow.gov.in");
        activeRegOfficer.setRole("ROLE_REGULATORY_OFFICER");
        activeRegOfficer.setDepartment("Approval Bureau");
        activeRegOfficer.setActive(true);

        inactiveOfficer = new User();
        inactiveOfficer.setId(20L);
        inactiveOfficer.setUsername("inactive_off");
        inactiveOfficer.setFullName("Inactive Officer");
        inactiveOfficer.setEmail("inactive@regulaflow.gov.in");
        inactiveOfficer.setRole("ROLE_REGULATORY_OFFICER");
        inactiveOfficer.setActive(false);

        auditorUser = new User();
        auditorUser.setId(30L);
        auditorUser.setUsername("auditor");
        auditorUser.setFullName("Kavita Menon");
        auditorUser.setEmail("auditor@audit.gov.in");
        auditorUser.setRole("ROLE_AUDITOR");
        auditorUser.setActive(true);
    }

    @Test
    @DisplayName("getEligibleOfficers returns only active officers with eligible desk roles")
    void testGetEligibleOfficers() {
        when(userRepository.findEligibleOfficers(ApplicationWorkflowService.ELIGIBLE_OFFICER_ROLES))
                .thenReturn(List.of(activeRegOfficer));

        List<OfficerDto> result = workflowService.getEligibleOfficers();

        assertNotNull(result);
        assertEquals(1, result.size());
        OfficerDto dto = result.get(0);
        assertEquals(2L, dto.getId());
        assertEquals("Rajesh K. Verma", dto.getFullName());
        assertEquals("Approval Bureau", dto.getDepartment());
        assertEquals("ROLE_REGULATORY_OFFICER", dto.getRole());
        assertTrue(dto.getActive());

        verify(userRepository).findEligibleOfficers(ApplicationWorkflowService.ELIGIBLE_OFFICER_ROLES);
    }

    @Test
    @DisplayName("assignOfficer successfully assigns an eligible active officer")
    void testAssignOfficerSuccess() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(testApp));
        when(userRepository.findById(2L)).thenReturn(Optional.of(activeRegOfficer));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ApplicationDto result = workflowService.assignOfficer(10L, 2L, regOfficerPrincipal);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals(2L, result.getAssignedOfficerId());
        assertEquals("Rajesh K. Verma", result.getAssignedOfficerName());

        verify(applicationRepository).save(testApp);
        verify(workflowHistoryRepository).save(any());
        verify(auditService).recordEvent(eq("reg_officer"), eq("ROLE_REGULATORY_OFFICER"), eq("ASSIGN_OFFICER"),
                eq("APPLICATION"), eq("APP-2026-001"), any(), eq("Rajesh K. Verma"), anyString());
        verify(notificationService).sendNotification(eq(2L), anyString(), anyString(), eq("ASSIGNMENT"), eq("HIGH"), eq("APP-2026-001"), eq("APPLICATION"));
    }

    @Test
    @DisplayName("assignOfficer throws AccessDeniedException when caller is not regulatory officer or admin")
    void testAssignOfficerUnauthorizedCaller() {
        assertThrows(AccessDeniedException.class, () ->
                workflowService.assignOfficer(10L, 2L, instAdminPrincipal));
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("assignOfficer throws ApiException when application is in DRAFT status")
    void testAssignOfficerDraftApplicationFails() {
        testApp.setStatus("DRAFT");
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(testApp));

        ApiException ex = assertThrows(ApiException.class, () ->
                workflowService.assignOfficer(10L, 2L, regOfficerPrincipal));
        assertTrue(ex.getMessage().contains("cannot be assigned to a desk officer until submitted"));
    }

    @Test
    @DisplayName("assignOfficer throws ApiException when selected officer is inactive")
    void testAssignOfficerInactiveOfficerFails() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(testApp));
        when(userRepository.findById(20L)).thenReturn(Optional.of(inactiveOfficer));

        ApiException ex = assertThrows(ApiException.class, () ->
                workflowService.assignOfficer(10L, 20L, regOfficerPrincipal));
        assertTrue(ex.getMessage().contains("inactive or disabled"));
    }

    @Test
    @DisplayName("assignOfficer throws ApiException when selected officer has ineligible role (e.g. auditor)")
    void testAssignOfficerIneligibleRoleFails() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(testApp));
        when(userRepository.findById(30L)).thenReturn(Optional.of(auditorUser));

        ApiException ex = assertThrows(ApiException.class, () ->
                workflowService.assignOfficer(10L, 30L, regOfficerPrincipal));
        assertTrue(ex.getMessage().contains("does not hold an eligible regulatory processing role"));
    }
}
