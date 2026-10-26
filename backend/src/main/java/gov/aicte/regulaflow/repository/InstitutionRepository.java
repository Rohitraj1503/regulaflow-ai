package gov.aicte.regulaflow.repository;

import gov.aicte.regulaflow.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    Optional<Institution> findByAicteId(String aicteId);
    boolean existsByAicteId(String aicteId);
    List<Institution> findByRegion(String region);
    List<Institution> findByState(String state);
    List<Institution> findByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT i.aicteId FROM Institution i WHERE i.aicteId IS NOT NULL")
    List<String> findAllAicteIds();

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Institution i WHERE i.aicteId IN :aicteIds")
    List<Institution> findAllByAicteIdIn(@org.springframework.data.repository.query.Param("aicteIds") java.util.Collection<String> aicteIds);
}
