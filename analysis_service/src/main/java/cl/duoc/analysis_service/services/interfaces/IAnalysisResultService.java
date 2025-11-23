package cl.duoc.analysis_service.services.interfaces;

import java.util.List;

import cl.duoc.analysis_service.dtos.AnalysisResultRequestDTO;
import cl.duoc.analysis_service.dtos.AnalysisResultResponse;

public interface IAnalysisResultService {
    List<AnalysisResultResponse> getAllAnalysisResults();
    AnalysisResultResponse getAnalysisResultById(Long id);
    AnalysisResultResponse getAnalysisResultByAssignmentId(Long id);
    AnalysisResultResponse createAnalysisResult(AnalysisResultRequestDTO analysisResult);
    AnalysisResultResponse updateAnalysisResult(Long id, AnalysisResultRequestDTO analysisResult);
    void deleteAnalysisResult(Long id);
}
