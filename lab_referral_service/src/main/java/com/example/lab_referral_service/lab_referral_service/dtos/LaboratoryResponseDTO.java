package com.example.lab_referral_service.lab_referral_service.dtos;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LaboratoryResponseDTO {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String isActive;
    
    // Devolvemos solo los IDs de los análisis que realiza
    private Set<Long> analysisTypeIds; 
}