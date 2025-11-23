package com.example.lab_referral_service.lab_referral_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "LABORATORIES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Laboratory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LAB_ID")
    private Long id;

    @Column(name = "NAME", unique = true, nullable = false)
    private String name;

    @Column(name = "ADDRESS", nullable = false)
    private String address;

    @Column(name = "PHONE", length = 20)
    private String phone;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "IS_ACTIVE", length = 1, nullable = false)
    private String isActive;
    
    // Relación Many-to-Many con AnalysisType (a través de LAB_ANALYSIS)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "LAB_ANALYSIS",
        joinColumns = @JoinColumn(name = "LAB_ID"),
        inverseJoinColumns = @JoinColumn(name = "ANALYSIS_ID")
    )
    private Set<AnalysisType> analysisTypes;
}
