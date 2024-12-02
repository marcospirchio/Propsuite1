package com.example.AdministracionEdificiosTpApis.security;

import com.example.AdministracionEdificiosTpApis.security.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                // Validar y obtener información del token
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);

                // Extraer las reclamaciones del token (por ejemplo, rol)
                Claims claims = jwtTokenUtil.getAllClaimsFromToken(jwtToken);
                String role = claims.get("role", String.class);

                // Configurar las autoridades para Spring Security
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(username, "", authorities);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Establecer la autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (ExpiredJwtException e) {
                logger.warn("El token JWT ha expirado: " + e.getMessage(), e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("El token ha expirado. Por favor, inicia sesión de nuevo.");
                return;
            } catch (IllegalArgumentException e) {
                logger.error("Error al obtener el usuario del token JWT: " + e.getMessage(), e);
            } catch (Exception e) {
                logger.error("Error inesperado al procesar el token JWT", e);
            }
        } else if (requestTokenHeader != null) {
            logger.warn("El token no comienza con 'Bearer '");
        }

        // Continuar con la cadena de filtros
        chain.doFilter(request, response);
    }


}
