package com.example.lab_referral_service.lab_referral_service.security;

import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Primary // Asegura que Spring use esta implementación por defecto
public class DummyUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Lanza una excepción para evitar que alguien intente iniciar sesión aquí.
        throw new UnsupportedOperationException("User lookup is handled by the Identity Service, not the Assignment Service.");
    }
}
