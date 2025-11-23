package com.example.lab_referral_service.lab_referral_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ANALYSIS_TYPES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ANALYSIS_ID")
    private Long id;

    @Column(name = "NAME", unique = true, nullable = false)
    private String name;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Column(name = "BASE_PRICE", precision = 10, scale = 2, nullable = false)
    private BigDecimal basePrice;
}