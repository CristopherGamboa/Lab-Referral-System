package com.example.lab_referral_service.lab_referral_service.config;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import java.io.IOException;

public class RestTemplateAuthInterceptor implements ClientHttpRequestInterceptor {

    private final String serviceToken; 

    public RestTemplateAuthInterceptor(String serviceToken) {
        this.serviceToken = serviceToken;
    }

    @Override
    public ClientHttpResponse intercept(
        HttpRequest request, byte[] body, ClientHttpRequestExecution execution) 
        throws IOException {
        
        request.getHeaders().set("Authorization", "Bearer " + serviceToken);
        return execution.execute(request, body);
    }
}
