package cl.duoc.analysis_service.dtos;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResultResponse {
    private Long id;
    private String analysisType;
    private Long patientId;
    private Long assignmentId;
    private Long technicianId;
    private String result;
    private ZonedDateTime analysisDate;
    private String notes;
}
