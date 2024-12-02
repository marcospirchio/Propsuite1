package com.example.AdministracionEdificiosTpApis.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.AdministracionEdificiosTpApis.security.JwtAuthenticationEntryPoint;
import com.example.AdministracionEdificiosTpApis.security.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                                           JwtRequestFilter jwtRequestFilter) throws Exception {
        http
        	.cors()
        	.and()
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas
            	.requestMatchers("/api/auth/agregarAdmin").hasAuthority("ADMIN")
            	.requestMatchers("/api/auth/**").permitAll()
           		.requestMatchers("/api/usuario/restablecerContrasena").permitAll()


                // Rutas protegidas - Usuarios
                .requestMatchers("/api/usuarios/actualizar-nombre-usuario").hasAnyAuthority("ADMIN","USUARIO")
                .requestMatchers("/api/usuarios/**").hasAuthority("ADMIN")
                

                // Rutas protegidas - Reclamos
                .requestMatchers("/api/reclamos/{id}").hasAnyAuthority("ADMIN", "USUARIO")
                .requestMatchers("/api/reclamos").hasAuthority("ADMIN")
                .requestMatchers("/api/reclamos/mis-reclamos").hasAuthority("USUARIO")
                .requestMatchers("/api/reclamos/sinUnidad").hasAuthority("USUARIO")
                .requestMatchers("/api/reclamos/conUnidad").hasAuthority("USUARIO")
                .requestMatchers("/api/reclamos/areas-comunes").hasAuthority("USUARIO")
                .requestMatchers("/api/reclamos/areas-comunes/todos").hasAuthority("ADMIN")
                .requestMatchers("/api/reclamos/mis-reclamos/filtrar").hasAuthority("USUARIO")
                .requestMatchers("/api/reclamos/estado/{estado}").hasAnyAuthority("ADMIN", "USUARIO")
                .requestMatchers("/api/reclamos/tipo/{idTipoReclamo}").hasAnyAuthority("ADMIN", "USUARIO")
                .requestMatchers("/api/reclamos/edificio/{codigoEdificio}").hasAnyAuthority("ADMIN","USUARIO")
                .requestMatchers("/api/reclamos/unidad/{codigoEdificio}/{piso}/{numero}").hasAnyAuthority("ADMIN","USUARIO")
                .requestMatchers("/api/reclamos/unidad/{idUnidad}").hasAnyAuthority("ADMIN","USUARIO")
                .requestMatchers("/api/reclamos/persona/{documentoPersona}").hasAuthority("ADMIN")

                .requestMatchers("/api/reclamos/actualizar").hasAnyAuthority("ADMIN", "USUARIO")
                .requestMatchers("/api/reclamos/estado").hasAuthority("ADMIN")
                .requestMatchers("/api/reclamos/areas-comunes").hasAuthority("USUARIO")
                .requestMatchers("/api/reclamos/areas-comunes/todos").hasAuthority("ADMIN")

                // Rutas protegidas - Tipos de reclamo
                .requestMatchers("/api/tiposReclamo/**").hasAuthority("ADMIN")

                // Rutas protegidas - Edificios
                .requestMatchers("/api/edificios/**").hasAuthority("ADMIN")

                // Rutas protegidas - Unidades
                .requestMatchers("/api/unidades/**").hasAuthority("ADMIN")

                // Rutas protegidas - Personas
                .requestMatchers("/api/personas/mis-unidades/**").permitAll()
                .requestMatchers("/api/personas/mis-unidades/**").permitAll()
                .requestMatchers("/api/personas/**").hasAuthority("ADMIN")

                // Rutas protegidas - Imágenes
                .requestMatchers("/api/imagenes/ver/**").hasAnyAuthority("ADMIN", "USUARIO")
                .requestMatchers("/api/imagenes/agregar").hasAuthority("USUARIO")
                .requestMatchers("/api/imagenes/{id}").hasAnyAuthority("ADMIN", "USUARIO")
                .requestMatchers("/api/imagenes/reclamo/{idReclamo}/imagenes").hasAnyAuthority("ADMIN")
                .requestMatchers("/api/imagenes/verimagen/{id}").hasAnyAuthority("ADMIN")
                .requestMatchers("/api/imagenes/actualizar/{id}").hasAnyAuthority("ADMIN", "USUARIO")
                

                .requestMatchers("/api/imagenes/**").hasAuthority("ADMIN")
                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
