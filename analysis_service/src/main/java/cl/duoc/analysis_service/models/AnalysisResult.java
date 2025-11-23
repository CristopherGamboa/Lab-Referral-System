package cl.duoc.analysis_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "ANALYSIS_RESULTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "PATIENT_ID")
    private Long patientId;
    @Column(name = "ANALYSIS_TYPE")
    private String analysisType;
    @Column(name = "TECHNICIAN_ID")
    private Long technicianId;
    @Column(name = "ASSIGNMENT_ID")
    private Long assignmentId;
    @Column(name = "RESULT")
    private String result;
    @Column(name = "ANALYSIS_DATE")
    private ZonedDateTime analysisDate;
    @Column(name = "NOTES")
    private String notes;
}
