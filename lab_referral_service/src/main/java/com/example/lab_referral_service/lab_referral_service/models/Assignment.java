package com.example.lab_referral_service.lab_referral_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "ASSIGNMENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSIGNMENT_ID")
    private Long id;

    // Clave foránea LÓGICA al Microservicio 1 (USERS)
    @Column(name = "PATIENT_USER_ID", nullable = false)
    private Long patientUserId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LAB_ID", nullable = false)
    private Laboratory laboratory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ANALYSIS_ID", nullable = false)
    private AnalysisType analysisType;

    @Column(name = "REQUEST_DATE", nullable = false)
    private ZonedDateTime requestDate;

    @Column(name = "APPOINTMENT_DATE")
    private ZonedDateTime appointmentDate;

    // PENDING, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELED
    @Column(name = "STATUS", length = 20, nullable = false)
    private String status; 
}