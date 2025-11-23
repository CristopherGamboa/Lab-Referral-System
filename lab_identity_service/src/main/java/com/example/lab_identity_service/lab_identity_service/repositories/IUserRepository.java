package com.example.lab_identity_service.lab_identity_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lab_identity_service.lab_identity_service.models.User;

public interface IUserRepository extends JpaRepository<User, Long> 
{
    Optional<User> findByEmail(String email);
}
