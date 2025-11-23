package com.example.lab_referral_service.lab_referral_service.dtos;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisTypeRequestDTO {

    @NotBlank(message = "Analysis name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private BigDecimal basePrice;
}