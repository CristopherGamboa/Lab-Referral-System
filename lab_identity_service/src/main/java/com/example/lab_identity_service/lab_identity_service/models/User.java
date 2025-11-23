package com.example.lab_identity_service.lab_identity_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "USERS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long id;

    @Column(name = "FULL_NAME", nullable = false)
    private String fullName;

    @Column(name = "EMAIL", unique = true, nullable = false)
    private String email;

    @Column(name = "PASSWORD_HASH", nullable = false)
    private String passwordHash;

    @Column(name = "IS_ACTIVE", length = 1, nullable = false)
    private String isActive; // 'Y' or 'N'

    @Column(name = "CREATED_AT", nullable = false)
    private ZonedDateTime createdAt;

    // Relación Many-to-Many con la tabla USER_ROLE
    @ManyToMany(fetch = FetchType.EAGER) // Carga EAGER para roles en seguridad
    @JoinTable(
        name = "USER_ROLE",
        joinColumns = @JoinColumn(name = "USER_ID"),
        inverseJoinColumns = @JoinColumn(name = "ROLE_ID")
    )
    private Set<Role> roles = new HashSet<>();

    @Column(name = "LAB_ID", nullable = true)
    private Long labId;
}
