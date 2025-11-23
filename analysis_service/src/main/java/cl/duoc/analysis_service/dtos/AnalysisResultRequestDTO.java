package cl.duoc.analysis_service.dtos;

import java.time.ZonedDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResultRequestDTO {
    @NotNull(message = "The analysis type cannot be null")
    private String analysisType;
    @NotNull(message = "The assignment ID cannot be null")
    private Long assignmentId;
    @NotNull(message = "The patient ID cannot be null")
    private Long patientId;
    @NotNull(message = "The technician ID cannot be null")
    private Long technicianId;
    @NotNull(message = "The result cannot be null")
    private String result;
    @NotNull(message = "The analysis date cannot be null")
    private ZonedDateTime analysisDate;
    @NotNull(message = "The notes cannot be null")
    private String notes;
}
