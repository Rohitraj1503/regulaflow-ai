package gov.aicte.regulaflow.security;

import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Temporary development password-reset utility.
 * Scoped strictly to 'dev' profile.
 * Assigns short development passwords to the 7 core role accounts using BCryptPasswordEncoder.
 */
@Component
@Profile("dev")
@Order(1)
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(
        name = "app.dev.reset-passwords", 
        havingValue = "true"
)
public class DevelopmentPasswordResetUtility implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DevelopmentPasswordResetUtility.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevelopmentPasswordResetUtility(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, String> devCredentials = new LinkedHashMap<>();
        devCredentials.put("admin", "Admin@123");
        devCredentials.put("reg_officer", "Reg@123");
        devCredentials.put("scrutiny_officer", "Scrutiny@123");
        devCredentials.put("evc_officer", "Evc@123");
        devCredentials.put("inst_admin", "Inst@123");
        devCredentials.put("compliance_officer", "Compliance@123");
        devCredentials.put("auditor", "Audit@123");

        logger.info("Executing development password reset for {} accounts...", devCredentials.size());

        for (Map.Entry<String, String> entry : devCredentials.entrySet()) {
            String username = entry.getKey();
            String rawPassword = entry.getValue();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalStateException("Target development account missing: " + username));

            // Generate BCrypt hash using the configured PasswordEncoder
            String encodedHash = passwordEncoder.encode(rawPassword);

            // Verify hash compatibility
            if (!passwordEncoder.matches(rawPassword, encodedHash)) {
                throw new IllegalStateException("PasswordEncoder verification failed for account: " + username);
            }

            // Update only the password field
            user.setPassword(encodedHash);
            userRepository.save(user);

            logger.info("Successfully updated development password hash for account '{}' (User ID: {})", username, user.getId());
        }

        logger.info("All 7 development accounts successfully updated and verified against PasswordEncoder.");
    }
}
