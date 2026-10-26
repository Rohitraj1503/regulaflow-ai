package gov.aicte.regulaflow.security;

import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
            throw new UsernameNotFoundException("Username or email cannot be empty");
        }
        String clean = usernameOrEmail.trim();
        Optional<User> userOpt = userRepository.findByUsername(clean)
                .or(() -> userRepository.findByEmail(clean));

        if (userOpt.isEmpty()) {
            // Support common alias names for convenience
            String lower = clean.toLowerCase();
            String aliasUsername = switch (lower) {
                case "root", "administrator" -> "admin";
                case "regulatory", "regulatory_officer" -> "reg_officer";
                case "scrutiny" -> "scrutiny_officer";
                case "evc" -> "evc_officer";
                case "institution", "institution_admin" -> "inst_admin";
                case "compliance" -> "compliance_officer";
                case "audit" -> "auditor";
                default -> null;
            };
            if (aliasUsername != null) {
                userOpt = userRepository.findByUsername(aliasUsername);
            }
        }

        if (userOpt.isEmpty()) {
            // Fallback: search ignoring case
            userOpt = userRepository.findAll().stream()
                    .filter(u -> u.getUsername().equalsIgnoreCase(clean) || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(clean)))
                    .findFirst();
        }

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found with username or email : " + clean));
        return UserPrincipal.create(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id : " + id));

        return UserPrincipal.create(user);
    }
}
