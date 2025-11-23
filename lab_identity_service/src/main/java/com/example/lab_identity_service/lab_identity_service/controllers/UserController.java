package com.example.lab_identity_service.lab_identity_service.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.lab_identity_service.lab_identity_service.dtos.UserRequestDTO;
import com.example.lab_identity_service.lab_identity_service.dtos.UserResponseDTO;
import com.example.lab_identity_service.lab_identity_service.services.interfaces.IUserService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    // CREATE (Crear Usuario) - SOLO ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO newUser = userService.createUser(requestDTO);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    // READ (Obtener Usuario por ID) - ACCESO RESTRINGIDO
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INTERNAL_SERVICE') or #id.toString().equals(authentication.getName())")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // READ (Obtener Usuarios) - SOLO ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllPatients() {
        List<UserResponseDTO> users = userService.getAllPatients();
        return ResponseEntity.ok(users);
    }

    // UPDATE (Modificar Usuario) - SOLO ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO updatedUser = userService.updateUser(id, requestDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE (Eliminar Usuario) - SOLO ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}