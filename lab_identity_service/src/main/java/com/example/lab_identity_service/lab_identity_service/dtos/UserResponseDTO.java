package com.example.lab_identity_service.lab_identity_service.dtos;

import lombok.*;
import java.time.ZonedDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Long id;
    private String fullName;
    private String email;
    private Set<String> roles;
    private String isActive;
    private ZonedDateTime createdAt;
    private Long labId;
}