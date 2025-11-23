package cl.duoc.analysis_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.analysis_service.models.AnalysisResult;

public interface IAnalysisResultRepository extends JpaRepository<AnalysisResult, Long>{
    Optional<AnalysisResult> findByAssignmentId(Long id);
}
