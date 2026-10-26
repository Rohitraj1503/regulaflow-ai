package gov.aicte.regulaflow.controller;

import gov.aicte.regulaflow.entity.Institution;
import gov.aicte.regulaflow.exception.ResourceNotFoundException;
import gov.aicte.regulaflow.repository.InstitutionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/institutions")
public class InstitutionController {

    private final InstitutionRepository institutionRepository;

    public InstitutionController(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Institution>> getAllInstitutions() {
        return ResponseEntity.ok(institutionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Institution> getInstitutionById(@PathVariable Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));
        return ResponseEntity.ok(institution);
    }
}
