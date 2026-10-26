package gov.aicte.regulaflow.service;

import gov.aicte.regulaflow.dto.AuthResponse;
import gov.aicte.regulaflow.dto.LoginRequest;
import gov.aicte.regulaflow.dto.RegisterRequest;
import gov.aicte.regulaflow.dto.UserDto;
import gov.aicte.regulaflow.entity.Institution;
import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.exception.ApiException;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.InstitutionRepository;
import gov.aicte.regulaflow.repository.UserRepository;
import gov.aicte.regulaflow.security.JwtTokenProvider;
import gov.aicte.regulaflow.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       InstitutionRepository institutionRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        try {
            auditService.recordEvent(user.getUsername(), user.getRole(), "USER_LOGIN", "USER", user.getId().toString(), null, "SUCCESS", null);
        } catch (Exception e) {
            // Non-critical audit event recording failure should not block user authentication
        }

        return new AuthResponse(jwt, mapToDto(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new ApiException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ApiException("Email is already registered!");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setRole(registerRequest.getRole());
        user.setPhone(registerRequest.getPhone());
        user.setDepartment(registerRequest.getDepartment());

        if (registerRequest.getInstitutionId() != null) {
            Institution institution = institutionRepository.findById(registerRequest.getInstitutionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", registerRequest.getInstitutionId()));
            user.setInstitution(institution);
        }

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword())
        );
        String jwt = tokenProvider.generateToken(authentication);

        auditService.recordEvent(savedUser.getUsername(), savedUser.getRole(), "USER_REGISTER", "USER", savedUser.getId().toString(), null, "REGISTERED", null);

        return new AuthResponse(jwt, mapToDto(savedUser));
    }

    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new ApiException("No authenticated user found in security context");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        return mapToDto(user);
    }

    public UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());

        if (user.getInstitution() != null) {
            dto.setInstitutionId(user.getInstitution().getId());
            dto.setInstitutionName(user.getInstitution().getName());
            dto.setInstitutionAicteId(user.getInstitution().getAicteId());
        }

        // Each authenticated user is strictly bounded to their assigned role
        dto.setAuthorizedRoles(List.of(user.getRole()));

        return dto;
    }
}
