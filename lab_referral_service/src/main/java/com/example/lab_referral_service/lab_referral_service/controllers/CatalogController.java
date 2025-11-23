package com.example.lab_referral_service.lab_referral_service.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.lab_referral_service.lab_referral_service.dtos.AnalysisTypeRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.AnalysisTypeResponseDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.LaboratoryRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.LaboratoryResponseDTO;
import com.example.lab_referral_service.lab_referral_service.services.interfaces.ICatalogService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
// Restringimos todo el controlador a ADMIN y TECHNICIAN
@PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIAN')")
public class CatalogController {

    private final ICatalogService catalogService;

    // ====================== LABORATORY ENDPOINTS ======================

    @PostMapping("/laboratories")
    public ResponseEntity<LaboratoryResponseDTO> createLaboratory(@Valid @RequestBody LaboratoryRequestDTO dto) {
        return new ResponseEntity<>(catalogService.createLaboratory(dto), HttpStatus.CREATED);
    }

    @GetMapping("/laboratories")
    @PreAuthorize("permitAll()") // Permitir a cualquiera ver el catálogo
    public ResponseEntity<List<LaboratoryResponseDTO>> getAllLaboratories() {
        return ResponseEntity.ok(catalogService.getAllLaboratories());
    }

    @PutMapping("/laboratories/{id}")
    public ResponseEntity<LaboratoryResponseDTO> updateLaboratory(@PathVariable Long id, @Valid @RequestBody LaboratoryRequestDTO dto) {
        return ResponseEntity.ok(catalogService.updateLaboratory(id, dto));
    }

    @DeleteMapping("/laboratories/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo el ADMIN puede eliminar laboratorios
    public ResponseEntity<Void> deleteLaboratory(@PathVariable Long id) {
        catalogService.deleteLaboratory(id);
        return ResponseEntity.noContent().build();
    }

    // ====================== ANALYSIS TYPES ENDPOINTS ======================

    @PostMapping("/analysis")
    public ResponseEntity<AnalysisTypeResponseDTO> createAnalysisType(@Valid @RequestBody AnalysisTypeRequestDTO dto) {
        return new ResponseEntity<>(catalogService.createAnalysisType(dto), HttpStatus.CREATED);
    }

    @GetMapping("/analysis")
    @PreAuthorize("permitAll()") // Permitir a cualquiera ver el catálogo
    public ResponseEntity<List<AnalysisTypeResponseDTO>> getAllAnalysisTypes() {
        return ResponseEntity.ok(catalogService.getAllAnalysisTypes());
    }

    @DeleteMapping("/analysis/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo el ADMIN puede eliminar tipos de análisis
    public ResponseEntity<Void> deleteAnalysisType(@PathVariable Long id) {
        catalogService.deleteAnalysisType(id);
        return ResponseEntity.noContent().build();
    }
}
