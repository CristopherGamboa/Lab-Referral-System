package cl.duoc.analysis_service.services;
    
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.duoc.analysis_service.dtos.AnalysisResultRequestDTO;
import cl.duoc.analysis_service.dtos.AnalysisResultResponse;
import cl.duoc.analysis_service.exceptions.ResourceNotFoundException;
import cl.duoc.analysis_service.models.AnalysisResult;
import cl.duoc.analysis_service.repositories.IAnalysisResultRepository;
import cl.duoc.analysis_service.services.interfaces.IAnalysisResultService;

@Service
public class AnalysisResultService implements IAnalysisResultService {

    @Autowired
    private IAnalysisResultRepository analysisResultRepository;

    @Override
    public List<AnalysisResultResponse> getAllAnalysisResults() {
        return analysisResultRepository.findAll()
            .stream()
            .map(this::mapToDTO)
            .toList();
    }

    @Override
    public AnalysisResultResponse getAnalysisResultById(Long id) {
        Optional<AnalysisResult> analysisResult = analysisResultRepository.findById(id);
        
        if (!analysisResult.isPresent())
            throw new ResourceNotFoundException("Analysis result not found");

        return mapToDTO(analysisResult.get());
    }

    @Override
    public AnalysisResultResponse getAnalysisResultByAssignmentId(Long id) {
        Optional<AnalysisResult> analysisResult = analysisResultRepository.findByAssignmentId(id);
        
        if (!analysisResult.isPresent())
            throw new ResourceNotFoundException("Analysis result not found");

        return mapToDTO(analysisResult.get());
    }

    @Override
    public AnalysisResultResponse createAnalysisResult(AnalysisResultRequestDTO analysisResult) {
        AnalysisResult response = analysisResultRepository.save(mapToEntity(analysisResult));

        return mapToDTO(response);
    }

    @Override
    public AnalysisResultResponse updateAnalysisResult(Long id, AnalysisResultRequestDTO analysisResult) {
        if (analysisResultRepository.existsById(id)) {
            AnalysisResult entity = mapToEntity(analysisResult);

            entity.setId(id);
            return mapToDTO(analysisResultRepository.save(entity));
        }
        return null;
    }

    @Override
    public void deleteAnalysisResult(Long id) {
        analysisResultRepository.deleteById(id);
    }

    private AnalysisResultResponse mapToDTO(AnalysisResult analysisResult) {
        return AnalysisResultResponse.builder()
                .id(analysisResult.getId())
                .analysisType(analysisResult.getAnalysisType())
                .patientId(analysisResult.getPatientId())
                .assignmentId(analysisResult.getAssignmentId())
                .technicianId(analysisResult.getTechnicianId())
                .result(analysisResult.getResult())
                .analysisDate(analysisResult.getAnalysisDate())
                .notes(analysisResult.getNotes())
                .build();
    }
    
    private AnalysisResult mapToEntity(AnalysisResultRequestDTO analysisResult) {
        return AnalysisResult.builder()
                .analysisType(analysisResult.getAnalysisType())
                .patientId(analysisResult.getPatientId())
                .assignmentId(analysisResult.getAssignmentId())
                .technicianId(analysisResult.getTechnicianId())
                .result(analysisResult.getResult())
                .notes(analysisResult.getNotes())
                .analysisDate(analysisResult.getAnalysisDate())
                .build();
    }
}
