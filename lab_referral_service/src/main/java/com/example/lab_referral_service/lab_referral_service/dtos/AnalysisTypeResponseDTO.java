package com.example.lab_referral_service.lab_referral_service.dtos;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisTypeResponseDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
}
