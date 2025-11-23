package com.example.lab_referral_service.lab_referral_service.dtos;

import lombok.*;
import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentResponseDTO {

    private Long id;
    private Long patientUserId;
    private Long labId;
    private String labName; // Incluimos el nombre para mejor visualización
    private Long analysisId;
    private String analysisName; // Incluimos el nombre para mejor visualización
    private ZonedDateTime requestDate;
    private ZonedDateTime appointmentDate;
    private String status;
}