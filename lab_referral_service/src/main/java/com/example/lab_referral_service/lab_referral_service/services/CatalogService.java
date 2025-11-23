package com.example.lab_referral_service.lab_referral_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.lab_referral_service.lab_referral_service.dtos.AnalysisTypeRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.AnalysisTypeResponseDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.LaboratoryRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.LaboratoryResponseDTO;
import com.example.lab_referral_service.lab_referral_service.exceptions.ResourceNotFoundException;
import com.example.lab_referral_service.lab_referral_service.models.AnalysisType;
import com.example.lab_referral_service.lab_referral_service.models.Laboratory;
import com.example.lab_referral_service.lab_referral_service.repositories.IAnalysisTypeRepository;
import com.example.lab_referral_service.lab_referral_service.repositories.ILaboratoryRepository;
import com.example.lab_referral_service.lab_referral_service.services.interfaces.ICatalogService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService implements ICatalogService {

    private final ILaboratoryRepository laboratoryRepository;
    private final IAnalysisTypeRepository analysisTypeRepository;

    // ====================== LABORATORIES CRUD ======================

    @Transactional
    public LaboratoryResponseDTO createLaboratory(LaboratoryRequestDTO dto) {
        Laboratory lab = mapToLaboratoryEntity(dto);
        // Lógica: La asignación de análisis al laboratorio (lab.setAnalysisTypes)
        // se maneja típicamente en un método PUT/UPDATE.
        return mapToLaboratoryResponse(laboratoryRepository.save(lab));
    }

    @Transactional(readOnly = true)
    public List<LaboratoryResponseDTO> getAllLaboratories() {
        return laboratoryRepository.findAll().stream()
                .map(this::mapToLaboratoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LaboratoryResponseDTO updateLaboratory(Long id, LaboratoryRequestDTO dto) {
        Laboratory lab = laboratoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratory not found with ID: " + id));

        // Actualizar campos básicos
        lab.setName(dto.getName());
        lab.setAddress(dto.getAddress());
        lab.setIsActive(dto.getIsActive());

        // Manejo de la relación Many-to-Many (si se pasan IDs de análisis en el DTO)
        if (dto.getAnalysisTypeIds() != null) {
            List<AnalysisType> analyses = analysisTypeRepository.findAllById(dto.getAnalysisTypeIds());
            if (analyses.size() != dto.getAnalysisTypeIds().size()) {
                 throw new ResourceNotFoundException("One or more Analysis IDs were not found.");
            }
            lab.setAnalysisTypes(analyses.stream().collect(Collectors.toSet()));
        }

        return mapToLaboratoryResponse(laboratoryRepository.save(lab));
    }

    @Transactional
    public void deleteLaboratory(Long id) {
        if (!laboratoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Laboratory not found with ID: " + id);
        }
        laboratoryRepository.deleteById(id);
    }

    // ====================== ANALYSIS TYPES CRUD ======================

    @Transactional
    public AnalysisTypeResponseDTO createAnalysisType(AnalysisTypeRequestDTO dto) {
        AnalysisType analysis = mapToAnalysisTypeEntity(dto);
        return mapToAnalysisTypeResponse(analysisTypeRepository.save(analysis));
    }

    @Transactional(readOnly = true)
    public List<AnalysisTypeResponseDTO> getAllAnalysisTypes() {
        return analysisTypeRepository.findAll().stream()
                .map(this::mapToAnalysisTypeResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAnalysisType(Long id) {
        if (!analysisTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Analysis Type not found with ID: " + id);
        }
        // NOTA: Si este análisis está asignado a un Laboratorio (LAB_ANALYSIS), 
        // la relación se eliminará en cascada por la configuración JPA.
        analysisTypeRepository.deleteById(id);
    }

    // ====================== MAPPERS ======================
    
    // ====================== LABORATORIES MAPPERS ======================

    /**
     * Mapea LaboratoryRequestDTO a la entidad Laboratory.
     */
    private Laboratory mapToLaboratoryEntity(LaboratoryRequestDTO dto) {
        return Laboratory.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : "Y")
                .build();
    }

    /**
     * Mapea la entidad Laboratory a LaboratoryResponseDTO.
     */
    private LaboratoryResponseDTO mapToLaboratoryResponse(Laboratory entity) {
        Set<Long> analysisIds = entity.getAnalysisTypes() != null
                ? entity.getAnalysisTypes().stream().map(AnalysisType::getId).collect(Collectors.toSet())
                : Set.of();

        return LaboratoryResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .isActive(entity.getIsActive())
                .analysisTypeIds(analysisIds)
                .build();
    }

    // ====================== ANALYSIS TYPES MAPPERS ======================

    /**
     * Mapea AnalysisTypeRequestDTO a la entidad AnalysisType.
     */
    private AnalysisType mapToAnalysisTypeEntity(AnalysisTypeRequestDTO dto) {
        return AnalysisType.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .build();
    }

    /**
     * Mapea la entidad AnalysisType a AnalysisTypeResponseDTO.
     */
    private AnalysisTypeResponseDTO mapToAnalysisTypeResponse(AnalysisType entity) {
        return AnalysisTypeResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .basePrice(entity.getBasePrice())
                .build();
    }
}
