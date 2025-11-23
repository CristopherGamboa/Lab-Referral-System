package com.example.lab_referral_service.lab_referral_service.dtos;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentRequestDTO {

    @NotNull(message = "Patient User ID is required")
    @Min(value = 1, message = "Patient User ID must be positive")
    private Long patientUserId; // ID del usuario del Microservicio 1

    @NotNull(message = "Laboratory ID is required")
    private Long labId;

    @NotNull(message = "Analysis ID is required")
    private Long analysisId;

    @FutureOrPresent(message = "Appointment date must be now or in the future")
    private ZonedDateTime appointmentDate;

    @Pattern(regexp = "PENDING|SCHEDULED|IN_PROGRESS|COMPLETED|CANCELED", 
             message = "Invalid status value")
    private String status;
}
