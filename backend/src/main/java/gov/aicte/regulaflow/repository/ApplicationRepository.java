package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.Application;
import gov.aicte.regulaflow.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByApplicationNumber(String applicationNumber);
    List<Application> findByInstitution(Institution institution);
    List<Application> findByInstitutionId(Long institutionId);
    List<Application> findByStatus(String status);
    List<Application> findByAssignedOfficerId(Long officerId);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countByStatusGroup();

    @Query("SELECT a.institution.region, COUNT(a) FROM Application a GROUP BY a.institution.region")
    List<Object[]> countByRegionGroup();

    @Query("SELECT a.category, COUNT(a) FROM Application a GROUP BY a.category")
    List<Object[]> countByCategoryGroup();
}
