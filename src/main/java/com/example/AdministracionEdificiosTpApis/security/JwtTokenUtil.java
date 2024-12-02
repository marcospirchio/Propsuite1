package com.example.AdministracionEdificiosTpApis.security;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.AdministracionEdificiosTpApis.data.UsuarioRepository;
import com.example.AdministracionEdificiosTpApis.model.Usuario;

@Component
public class JwtTokenUtil {
    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${jwt.secret}")
    private String secret;

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    public Claims getAllClaimsFromToken(String token) {
        byte[] apiKeySecretBytes = Base64.getDecoder().decode(secret);
        return Jwts.parser()
                   .setSigningKey(apiKeySecretBytes)
                   .parseClaimsJws(token)
                   .getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(userDetails.getUsername())
                                           .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", usuario.getRol().getNombre().toUpperCase()); // Agrega el rol al token

        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }


    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
