package com.example.lab_referral_service.lab_referral_service.services.interfaces;

import java.util.List;

import com.example.lab_referral_service.lab_referral_service.dtos.AnalysisTypeRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.AnalysisTypeResponseDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.LaboratoryRequestDTO;
import com.example.lab_referral_service.lab_referral_service.dtos.LaboratoryResponseDTO;

public interface ICatalogService {
    LaboratoryResponseDTO createLaboratory(LaboratoryRequestDTO dto);
    LaboratoryResponseDTO updateLaboratory(Long id, LaboratoryRequestDTO dto);
    List<LaboratoryResponseDTO> getAllLaboratories();
    void deleteLaboratory(Long id);
    AnalysisTypeResponseDTO createAnalysisType(AnalysisTypeRequestDTO dto);
    List<AnalysisTypeResponseDTO> getAllAnalysisTypes();
    void deleteAnalysisType(Long id);
}
