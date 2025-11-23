package com.example.lab_referral_service.lab_referral_service.dtos;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LaboratoryRequestDTO {

    @NotBlank(message = "Laboratory name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 255)
    private String address;

    @Pattern(regexp = "^\\+?[0-9\\s]{7,20}$", message = "Invalid phone format")
    private String phone;
    
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "[YN]", message = "IsActive must be 'Y' or 'N'")
    private String isActive;
    
    // Conjunto de IDs de análisis para mapear la relación Many-to-Many
    private Set<Long> analysisTypeIds; 
}
