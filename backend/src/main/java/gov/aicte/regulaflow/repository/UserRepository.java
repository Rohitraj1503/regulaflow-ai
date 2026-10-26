package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import java.util.Collection;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<User> findByRole(String role);

    @Query("SELECT u FROM User u WHERE u.active = true AND u.role IN :roles ORDER BY u.fullName ASC")
    List<User> findEligibleOfficers(@Param("roles") Collection<String> roles);
}

