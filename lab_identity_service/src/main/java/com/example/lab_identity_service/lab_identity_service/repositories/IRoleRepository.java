package com.example.lab_identity_service.lab_identity_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lab_identity_service.lab_identity_service.models.Role;

public interface IRoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(String name);
}
