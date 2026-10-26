package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.AdminOverviewDto;
import gov.aicte.regulaflow.dto.AuditEventDto;
import gov.aicte.regulaflow.dto.SystemSettingsDto;
import gov.aicte.regulaflow.dto.UserDto;
import gov.aicte.regulaflow.entity.Application;
import gov.aicte.regulaflow.entity.ComplianceObligation;
import gov.aicte.regulaflow.entity.Institution;
import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.exception.ApiException;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.*;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final ApplicationRepository applicationRepository;
    private final ComplianceObligationRepository complianceObligationRepository;
    private final NotificationRepository notificationRepository;
    private final AuditEventRepository auditEventRepository;
    private final AuditService auditService;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    // In-memory persistent system configuration state
    private final SystemSettingsDto systemSettings = new SystemSettingsDto();

    public AdminService(UserRepository userRepository,
                        InstitutionRepository institutionRepository,
                        ApplicationRepository applicationRepository,
                        ComplianceObligationRepository complianceObligationRepository,
                        NotificationRepository notificationRepository,
                        AuditEventRepository auditEventRepository,
                        AuditService auditService,
                        AuthService authService,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
        this.applicationRepository = applicationRepository;
        this.complianceObligationRepository = complianceObligationRepository;
        this.notificationRepository = notificationRepository;
        this.auditEventRepository = auditEventRepository;
        this.auditService = auditService;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public AdminOverviewDto getOverview() {
        AdminOverviewDto dto = new AdminOverviewDto();

        List<User> users = userRepository.findAll();
        dto.setTotalUsers(users.size());
        dto.setActiveUsersCount(users.stream().filter(u -> Boolean.TRUE.equals(u.getActive())).count());
        dto.setInactiveUsersCount(users.stream().filter(u -> Boolean.FALSE.equals(u.getActive())).count());

        Map<String, Long> roleDist = new LinkedHashMap<>();
        for (User u : users) {
            roleDist.put(u.getRole(), roleDist.getOrDefault(u.getRole(), 0L) + 1);
        }
        dto.setRoleDistribution(roleDist);

        List<Institution> institutions = institutionRepository.findAll();
        dto.setTotalInstitutions(institutions.size());
        long activeInst = institutions.stream().filter(i -> "ACTIVE".equalsIgnoreCase(i.getStatus())).count();
        dto.setActiveInstitutions(activeInst > 0 ? activeInst : institutions.size());

        List<Application> apps = applicationRepository.findAll();
        dto.setTotalApplications(apps.size());

        Map<String, Long> statusOverview = new LinkedHashMap<>();
        for (Application a : apps) {
            statusOverview.put(a.getStatus(), statusOverview.getOrDefault(a.getStatus(), 0L) + 1);
        }
        dto.setApplicationProcessingOverview(statusOverview);

        dto.setSystemActivityCount(auditEventRepository.count());
        dto.setFailedIntegrationsCount(0L);
        dto.setSecurityEventsCount(0L);

        Map<String, Long> notifMap = new LinkedHashMap<>();
        long totalNotifs = notificationRepository.count();
        long unreadNotifs = notificationRepository.findAll().stream().filter(n -> Boolean.FALSE.equals(n.getIsRead())).count();
        notifMap.put("total", totalNotifs);
        notifMap.put("unread", unreadNotifs);
        dto.setNotificationStatus(notifMap);

        List<ComplianceObligation> obligations = complianceObligationRepository.findAll();
        Map<String, Long> compMap = new LinkedHashMap<>();
        long verified = obligations.stream().filter(o -> "VERIFIED".equalsIgnoreCase(o.getStatus())).count();
        long pending = obligations.stream().filter(o -> "PENDING".equalsIgnoreCase(o.getStatus())).count();
        long overdue = obligations.stream().filter(o -> o.getDeadline() != null && LocalDateTime.now().isAfter(o.getDeadline())).count();
        compMap.put("total", (long) obligations.size());
        compMap.put("verified", verified);
        compMap.put("pending", pending);
        compMap.put("overdue", overdue);
        dto.setComplianceOverview(compMap);

        List<AuditEventDto> recentAudits = auditService.getAllAuditEvents().stream()
                .limit(8)
                .collect(Collectors.toList());
        dto.setRecentAuditEvents(recentAudits);

        return dto;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(authService::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto toggleUserActive(Long userId, UserPrincipal adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        boolean newStatus = user.getActive() == null || !user.getActive();
        user.setActive(newStatus);
        User saved = userRepository.save(user);

        auditService.recordEvent(adminUser.getUsername(), adminUser.getRole(), "TOGGLE_USER_ACTIVE",
                "USER", user.getId().toString(), String.valueOf(!newStatus), String.valueOf(newStatus),
                "Administrator modified active status of " + user.getUsername());

        return authService.mapToDto(saved);
    }

    @Transactional
    public UserDto updateUserRole(Long userId, String newRole, UserPrincipal adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String oldRole = user.getRole();
        user.setRole(newRole);
        User saved = userRepository.save(user);

        auditService.recordEvent(adminUser.getUsername(), adminUser.getRole(), "UPDATE_USER_ROLE",
                "USER", user.getId().toString(), oldRole, newRole,
                "Administrator updated role of " + user.getUsername());

        return authService.mapToDto(saved);
    }

    @Transactional
    public Map<String, String> resetUserPassword(Long userId, String customPassword, UserPrincipal adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String newPassword = (customPassword != null && !customPassword.isBlank())
                ? customPassword
                : ("RF@" + (int)(100000 + Math.random() * 900000));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditService.recordEvent(adminUser.getUsername(), adminUser.getRole(), "RESET_USER_PASSWORD",
                "USER", user.getId().toString(), null, "SUCCESS",
                "Administrator securely reset password for user: " + user.getUsername());

        return Map.of(
                "userId", String.valueOf(user.getId()),
                "username", user.getUsername(),
                "temporaryPassword", newPassword,
                "message", "Password securely updated and hashed with BCrypt."
        );
    }

    @Transactional
    public UserDto createUser(UserDto request, String password, UserPrincipal adminUser) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ApiException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(password != null && !password.isBlank() ? password : "password123"));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setActive(true);

        if (request.getInstitutionId() != null) {
            Institution inst = institutionRepository.findById(request.getInstitutionId())
                    .orElse(null);
            user.setInstitution(inst);
        }

        User saved = userRepository.save(user);

        auditService.recordEvent(adminUser.getUsername(), adminUser.getRole(), "CREATE_USER",
                "USER", saved.getId().toString(), null, saved.getRole(),
                "Administrator created user " + saved.getUsername());

        return authService.mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    @Transactional
    public Institution updateInstitutionStatus(Long id, String status, UserPrincipal adminUser) {
        Institution inst = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));

        String oldStatus = inst.getStatus();
        inst.setStatus(status);
        Institution saved = institutionRepository.save(inst);

        auditService.recordEvent(adminUser.getUsername(), adminUser.getRole(), "UPDATE_INSTITUTION_STATUS",
                "INSTITUTION", inst.getAicteId(), oldStatus, status,
                "Administrator modified institution status");

        return saved;
    }

    public SystemSettingsDto getSettings() {
        return this.systemSettings;
    }

    public SystemSettingsDto updateSettings(SystemSettingsDto updated, UserPrincipal adminUser) {
        this.systemSettings.setStatutorySlaDays(updated.getStatutorySlaDays());
        this.systemSettings.setMaintenanceMode(updated.isMaintenanceMode());
        this.systemSettings.setAiCopilotEngine(updated.getAiCopilotEngine());
        this.systemSettings.setEmailNotifications(updated.isEmailNotifications());
        this.systemSettings.setAutoScrutinyRouting(updated.isAutoScrutinyRouting());
        this.systemSettings.setEvcMinCommitteeMembers(updated.getEvcMinCommitteeMembers());
        this.systemSettings.setStrictCadreRatioEnforcement(updated.isStrictCadreRatioEnforcement());

        auditService.recordEvent(adminUser.getUsername(), adminUser.getRole(), "UPDATE_SYSTEM_SETTINGS",
                "SYSTEM", "GLOBAL_CONFIG", null, "UPDATED",
                "System administrator updated global platform configuration");

        return this.systemSettings;
    }
}
