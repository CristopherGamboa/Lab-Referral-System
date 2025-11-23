package com.example.lab_referral_service.lab_referral_service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.example.lab_referral_service.lab_referral_service.config.RestTemplateAuthInterceptor;

@SpringBootApplication
public class LabReferralServiceApplication {
	@Value("${service.user.internal-auth-token}")
    private String internalServiceToken;

	public static void main(String[] args) {
		SpringApplication.run(LabReferralServiceApplication.class, args);
	}

	@Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        // Añadir el interceptor para inyectar el token JWT
        restTemplate.setInterceptors(Collections.singletonList(
            new RestTemplateAuthInterceptor(internalServiceToken)
        ));
        return restTemplate;
    }
}
