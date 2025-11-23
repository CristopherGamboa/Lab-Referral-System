package com.example.lab_referral_service.lab_referral_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    // Clave secreta definida en application.properties
    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        // La clave se decodifica desde la base64 (si se configura así el secreto)
        // Usamos Decoders.BASE64.decode para mayor robustez
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    // ============== MÉTODOS DE EXTRACCIÓN ==============

    // Obtiene todos los claims del token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Método genérico para extraer un claim específico (subject, expiration, etc.)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae el 'subject' (email) del token. Necesario para JwtAuthenticationFilter.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extrae el ID del usuario (clave custom)
    public Long extractUserId(String token) {
        // Los claims custom son tratados como objetos en la interfaz Claims
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    // ============== MÉTODOS DE VALIDACIÓN ==============

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token) {
        try {
            // Intentar parsear y verificar la firma. Esto lanzará excepción si falla.
            extractAllClaims(token); 
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public Collection<? extends GrantedAuthority> extractAuthorities(String token) {
        String rolesString = extractClaim(token, claims -> claims.get("roles", String.class));
        if (rolesString == null) {
            return Collections.emptyList();
        }
        return Arrays.stream(rolesString.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}