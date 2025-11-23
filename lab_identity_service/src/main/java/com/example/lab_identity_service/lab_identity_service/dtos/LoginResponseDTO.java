package com.example.lab_identity_service.lab_identity_service.dtos;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String accessToken;
    private Long userId;
    private String email;
    private Set<String> roles;
}
