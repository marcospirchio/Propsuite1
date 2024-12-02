package com.example.AdministracionEdificiosTpApis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.data.PersonaRepository;
import com.example.AdministracionEdificiosTpApis.exceptions.UsuarioException;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Usuario;
import com.example.AdministracionEdificiosTpApis.security.JwtTokenUtil;
import com.example.AdministracionEdificiosTpApis.service.UsuarioService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private PersonaRepository personaRepository;
    
    @PostMapping("/registrar")
    public ResponseEntity<String> registrarUsuario(@RequestBody Usuario usuario) {
        usuarioService.agregarUsuario(usuario);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }
    
    @PostMapping("/registrarAdmin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> agregarAdmin(@RequestBody Usuario usuario) {
        try {
            usuarioService.agregarAdmin(usuario);
            return ResponseEntity.ok("Administrador registrado con éxito");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) throws UsuarioException {
        Usuario user = usuarioService.obtenerUsuarioPorNombreUsuario(usuario.getNombreUsuario());
        System.out.println("Usuario recuperado: " + user);

        if (user != null && passwordEncoder.matches(usuario.getContrasena(), user.getContrasena())) {
            System.out.println("Contraseña validada correctamente.");
            UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getNombreUsuario());
            final String token = jwtTokenUtil.generateToken(userDetails);

            // Extraer el rol del usuario
            String role = user.getRol().getNombre();

            // Crear la respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login exitoso");
            response.put("token", token);
            response.put("role", role); // Incluir el rol en la respuesta

            return ResponseEntity.ok(response);
        }

        System.out.println("Falló la validación de credenciales.");
        return ResponseEntity.badRequest().body("Credenciales inválidas");
    }


//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Usuario usuario) throws UsuarioException {
//        Usuario user = usuarioService.obtenerUsuarioPorNombreUsuario(usuario.getNombreUsuario());
//        if (user != null && passwordEncoder.matches(usuario.getContrasena(), user.getContrasena())) {
//            UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getNombreUsuario());
//            final String token = jwtTokenUtil.generateToken(userDetails);
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Login exitoso");
//            response.put("token", token);
//            return ResponseEntity.ok(response);
//        }
//        return ResponseEntity.badRequest().body("Credenciales inválidas");
//    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        SecurityContextHolder.clearContext(); // Cierra la sesión actual.
        return ResponseEntity.ok("Sesión cerrada exitosamente");
    }
}



//package com.example.AdministracionEdificiosTpApis.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.AdministracionEdificiosTpApis.exceptions.UsuarioException;
//import com.example.AdministracionEdificiosTpApis.model.Usuario;
//import com.example.AdministracionEdificiosTpApis.service.UsuarioService;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private UsuarioService usuarioService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @PostMapping("/registrar")
//    public ResponseEntity<String> registrarUsuario(@RequestBody Usuario usuario) {
//        usuarioService.agregarUsuario(usuario);
//        return ResponseEntity.ok("Usuario registrado con éxito");
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody Usuario usuario) throws UsuarioException {
//        Usuario user = usuarioService.obtenerUsuarioPorNombreUsuario(usuario.getNombreUsuario());
//        if (passwordEncoder.matches(usuario.getContrasena(), user.getContrasena())) {
//            return ResponseEntity.ok("Login exitoso");
//        }
//        return ResponseEntity.badRequest().body("Credenciales inválidas");
//    }
//    
//    @PostMapping("/logout")
//    public ResponseEntity<String> logout() {
//        SecurityContextHolder.clearContext(); // Cierra la sesión actual.
//        return ResponseEntity.ok("Sesión cerrada exitosamente");
//    }
//}



