package com.example.lab_identity_service.lab_identity_service.controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lab_identity_service.lab_identity_service.dtos.LoginDTO;
import com.example.lab_identity_service.lab_identity_service.dtos.LoginResponseDTO;
import com.example.lab_identity_service.lab_identity_service.services.interfaces.IAuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService; 

    /**
     * Endpoint público para iniciar sesión.
     * @param loginDTO Email y contraseña del usuario.
     * @return ResponseEntity con el token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticateUser(@Valid @RequestBody LoginDTO loginDTO) {
        LoginResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
}
