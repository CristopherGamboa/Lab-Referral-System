package com.example.lab_identity_service.lab_identity_service.security;

import com.example.lab_identity_service.lab_identity_service.models.User;
import com.example.lab_identity_service.lab_identity_service.repositories.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscar el usuario por email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Mapear los roles a GrantedAuthorities
        Collection<? extends GrantedAuthority> authorities = user.getRoles().stream()
                // Spring Security requiere el prefijo "ROLE_"
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName())) 
                .collect(Collectors.toList());

        // Devolver un objeto UserDetails de Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(), // Usa el hash almacenado
                user.getIsActive().equals("Y"), // Habilitado si está activo
                true, // Cuenta no expirada
                true, // Credenciales no expiradas
                true, // Cuenta no bloqueada
                authorities // Roles/Autoridades
        );
    }
}
