package com.example.lab_referral_service.lab_referral_service.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.lab_referral_service.lab_referral_service.exceptions.ExternalServiceException;
import com.example.lab_referral_service.lab_referral_service.exceptions.ResourceNotFoundException;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserServiceClient {

    @Value("${service.user.url}")
    private String userServiceUrl;

    private final RestTemplate restTemplate;

    /**
     * Valida si el ID del paciente existe llamando al Microservicio de Usuarios.
     * @param userId El ID del usuario/paciente.
     * @return true si existe.
     */
    public boolean validatePatientExists(Long userId) {
        String url = UriComponentsBuilder.fromUriString(userServiceUrl)
                .path("/api/v1/users/")
                .path(userId.toString())
                .toUriString();

        log.info("Checking user existence: GET {}", url);

        try {
            restTemplate.getForObject(url, Void.class);
            log.info("Patient ID {} successfully validated.", userId);
            return true;
            
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Patient (User ID: " + userId + ") not found in User Service.");
            
        } catch (Exception ex) {
            throw new ExternalServiceException("Error communicating with User Service: " + ex.getMessage());
        }
    }
}