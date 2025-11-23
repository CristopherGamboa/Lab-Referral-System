package com.example.lab_identity_service.lab_identity_service.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {

    @NotBlank(message = "Full name cannot be empty")
    @Size(max = 100, message = "Full name must be less than 100 characters")
    private String fullName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Must be a valid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])\\S+$", 
             message = "Password must contain letters, numbers, and special characters")
    private String password; // Se usará para generar el passwordHash

    @NotEmpty(message = "User must have at least one role assigned")
    private String role; 

    @Pattern(regexp = "[YN]", message = "IsActive must be 'Y' or 'N'")
    private String isActive;

    private Long LabId;
}