package com.example.lab_identity_service.lab_identity_service.services;

import com.example.lab_identity_service.lab_identity_service.dtos.LoginDTO;
import com.example.lab_identity_service.lab_identity_service.dtos.LoginResponseDTO;
import com.example.lab_identity_service.lab_identity_service.exceptions.AuthenticationException;
import com.example.lab_identity_service.lab_identity_service.models.User;
import com.example.lab_identity_service.lab_identity_service.repositories.IUserRepository;
import com.example.lab_identity_service.lab_identity_service.security.JwtUtil;
import com.example.lab_identity_service.lab_identity_service.services.interfaces.IAuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final IUserRepository userRepository;
    
    // El método ahora devuelve el nuevo DTO
    public LoginResponseDTO login(LoginDTO loginDTO) {
        
        // Autenticación
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginDTO.getEmail(), 
                    loginDTO.getPassword()
                )
            );
        } catch (Exception e) {
            throw new AuthenticationException("Invalid email or password.");
        }

        // Obtener detalles y el ID del usuario
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new AuthenticationException("Could not find user details after successful authentication."));
        
        // Generar el JWT
        String jwtToken = jwtUtil.generateToken(userDetails, user.getId(), user.getLabId());

        // Mapear y devolver el DTO de Respuesta
        Set<String> roles = user.getRoles().stream()
            .map(r -> r.getName())
            .collect(Collectors.toSet());
            
        return LoginResponseDTO.builder()
            .accessToken(jwtToken)
            .userId(user.getId())
            .email(user.getEmail())
            .roles(roles)
            .build();
    }
}