package cl.duoc.analysis_service.controllers;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import cl.duoc.analysis_service.dtos.AnalysisResultRequestDTO;
import cl.duoc.analysis_service.dtos.AnalysisResultResponse;
import cl.duoc.analysis_service.services.interfaces.IAnalysisResultService;

@RestController
@RequestMapping("/api/v1/analysis-results")
public class AnalysisResultController {
    @Autowired
    private IAnalysisResultService analysisResultService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnalysisResultResponse>> getAllAnalysisResults() {
        List<AnalysisResultResponse> analysisResults = analysisResultService.getAllAnalysisResults();
        return new ResponseEntity<>(analysisResults, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResultResponse> getAnalysisResultById(@PathVariable Long id) {
        AnalysisResultResponse analysisResult = analysisResultService.getAnalysisResultById(id);
        if (analysisResult != null) {
            return new ResponseEntity<>(analysisResult, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/assignment/{id}")
    public ResponseEntity<AnalysisResultResponse> getAnalysisResultByAssignmentId(@PathVariable Long id) {
        AnalysisResultResponse analysisResult = analysisResultService.getAnalysisResultByAssignmentId(id);
        if (analysisResult != null) {
            return new ResponseEntity<>(analysisResult, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<AnalysisResultResponse> createAnalysisResult(@RequestBody AnalysisResultRequestDTO analysisResult) {
        AnalysisResultResponse createdAnalysisResult = analysisResultService.createAnalysisResult(analysisResult);
        return new ResponseEntity<>(createdAnalysisResult, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalysisResultResponse> updateAnalysisResult(@PathVariable Long id, @RequestBody AnalysisResultRequestDTO analysisResult) {
        AnalysisResultResponse updatedAnalysisResult = analysisResultService.updateAnalysisResult(id, analysisResult);
        if (updatedAnalysisResult != null) {
            return new ResponseEntity<>(updatedAnalysisResult, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAnalysisResult(@PathVariable Long id) {
        analysisResultService.deleteAnalysisResult(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
