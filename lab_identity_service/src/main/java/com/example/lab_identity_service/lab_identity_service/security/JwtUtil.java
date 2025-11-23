package com.example.lab_identity_service.lab_identity_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    // Clave secreta definida en application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Tiempo de expiración definido en application.properties (en milisegundos)
    @Value("${jwt.expiration}")
    private long expiration; 

    // ============== MÉTODOS DE GENERACIÓN ==============

    private Key getSigningKey() {
        // Usamos Decoders.BASE64.decode para mayor robustez
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Genera un token JWT incluyendo roles y el ID del usuario en los claims.
     */
    public String generateToken(UserDetails userDetails, Long userId, Long labId) {
        
        // Obtener roles en formato String, separados por coma (ej: "ROLE_ADMIN,ROLE_PATIENT")
        String roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("userId", userId); // ID del usuario, crucial para otros microservicios
        claims.put("labId", labId);
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername()) // El email del usuario
                .setIssuedAt(now) 
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
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

    /**
     * Valida si el token es válido para el usuario dado.
     * @param token El token a validar.
     * @param userDetails Los detalles del usuario (obtenidos del DB).
     * @return true si es válido.
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}