package com.example.lab_identity_service.lab_identity_service.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Must be a valid email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;
}
