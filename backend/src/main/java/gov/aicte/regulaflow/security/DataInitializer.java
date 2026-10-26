package gov.aicte.regulaflow.security;

import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.initial-password:${ADMIN_INITIAL_PASSWORD:Admin@123}}")
    private String adminInitialPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initializeAdminUserIfMissing();
    }

    private void initializeAdminUserIfMissing() {
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@regulaflow.gov.in");
            admin.setPassword(passwordEncoder.encode(adminInitialPassword));
            admin.setFullName("Dr. Arvind Sharma");
            admin.setRole("ROLE_ADMIN");
            admin.setDepartment("AICTE HQ Administration");
            admin.setPhone("+91-11-29581001");
            admin.setActive(true);
            admin.setAuthorizedRoles("ROLE_ADMIN,ROLE_REGULATORY_OFFICER,ROLE_SCRUTINY_OFFICER,ROLE_EVC_OFFICER,ROLE_INSTITUTION,ROLE_COMPLIANCE_OFFICER,ROLE_AUDITOR");
            userRepository.save(admin);
            logger.info("Administrator account provisioned successfully with role ROLE_ADMIN.");
        }
    }
}
