package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.User;
import gov.aicte.regulaflow.service.ApplicationWorkflowService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("findEligibleOfficers returns real active regulatory, scrutiny, and evc officers from MySQL and excludes admin, inst_admin, and auditor")
    void testFindEligibleOfficersAgainstActualDatabase() {
        List<User> officers = userRepository.findEligibleOfficers(ApplicationWorkflowService.ELIGIBLE_OFFICER_ROLES);

        assertNotNull(officers);
        assertFalse(officers.isEmpty(), "Should find eligible officers in the seeded MySQL database");

        for (User officer : officers) {
            assertTrue(officer.getActive(), "Every returned officer must be active");
            assertTrue(ApplicationWorkflowService.ELIGIBLE_OFFICER_ROLES.contains(officer.getRole()),
                    "Every returned officer must hold an eligible regulatory processing role");
            assertNotEquals("ROLE_ADMIN", officer.getRole(), "Admins should be excluded from officer list");
            assertNotEquals("ROLE_INSTITUTION_ADMIN", officer.getRole(), "Institution admins should be excluded");
            assertNotEquals("ROLE_AUDITOR", officer.getRole(), "Auditors should be excluded");
        }

        // Verify known seeded officers exist
        boolean hasRajeshVerma = officers.stream().anyMatch(o -> "Rajesh K. Verma".equals(o.getFullName()));
        boolean hasSunitaDeshmukh = officers.stream().anyMatch(o -> "Prof. Sunita Deshmukh".equals(o.getFullName()));
        boolean hasVikramadityaRao = officers.stream().anyMatch(o -> "Dr. Vikramaditya Rao".equals(o.getFullName()));

        assertTrue(hasRajeshVerma, "Should contain Rajesh K. Verma (ROLE_REGULATORY_OFFICER)");
        assertTrue(hasSunitaDeshmukh, "Should contain Prof. Sunita Deshmukh (ROLE_SCRUTINY_OFFICER)");
        assertTrue(hasVikramadityaRao, "Should contain Dr. Vikramaditya Rao (ROLE_EVC_OFFICER)");
    }
}
