package com.example.AdministracionEdificiosTpApis.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.exceptions.UsuarioException;
import com.example.AdministracionEdificiosTpApis.model.Usuario;
import com.example.AdministracionEdificiosTpApis.service.UsuarioService;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/restablecerContrasena")
    public ResponseEntity<Map<String, String>> restablecerContrasena(@RequestBody Map<String, String> requestBody) {
        try {
            String nombreUsuario = requestBody.get("nombreUsuario");
            String dni = requestBody.get("dni");
            String nuevaContrasena = requestBody.get("nuevaContrasena");

            // Validar los campos de entrada
            if (nombreUsuario == null || dni == null || nuevaContrasena == null) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("error", "Faltan campos en la solicitud."));
            }

            // Lógica del servicio para restablecer la contraseña
            usuarioService.restablecerContrasena(nombreUsuario, dni, nuevaContrasena);

            // Respuesta exitosa en formato JSON
            return ResponseEntity.ok(Collections.singletonMap("message", "Contraseña restablecida correctamente."));
        } catch (Exception e) {
            // Respuesta de error en formato JSON
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Error restableciendo contraseña: " + e.getMessage()));
        }
    }

    
    
    @PutMapping("/actualizar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> actualizarUsuario(@RequestBody Map<String, Object> datos) {
        try {
            String documento = (String) datos.get("documento");
            String nombreUsuario = (String) datos.get("nombreUsuario");
            String contrasena = (String) datos.get("contrasena");

            if (documento == null || nombreUsuario == null || contrasena == null) {
                return ResponseEntity.badRequest().body("Faltan datos necesarios para la actualización.");
            }

            usuarioService.actualizarUsuario(documento, nombreUsuario, contrasena);
            return ResponseEntity.ok("Usuario actualizado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok("Usuario eliminado correctamente.");
        } catch (UsuarioException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el usuario.");
        }
    }
    
    @PutMapping("/actualizar-nombre-usuario")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public ResponseEntity<String> actualizarNombreUsuario(@RequestBody Map<String, String> request) {
        try {
            // Obtener el nombre de usuario actual desde el contexto de seguridad
            String nombreUsuarioActual = SecurityContextHolder.getContext().getAuthentication().getName();

            // Obtener el nuevo nombre de usuario desde el JSON
            String nuevoNombreUsuario = request.get("nuevoNombreUsuario");

            // Llamar al servicio para actualizar el nombre de usuario
            usuarioService.actualizarNombreUsuario(nombreUsuarioActual, nuevoNombreUsuario);

            return new ResponseEntity<>("Nombre de usuario actualizado con éxito.", HttpStatus.OK);
        } catch (UsuarioException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    
}

	

//package com.example.AdministracionEdificiosTpApis.controller;
//
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.AdministracionEdificiosTpApis.exceptions.UsuarioException;
//import com.example.AdministracionEdificiosTpApis.service.UsuarioService;
//
//@RestController
//@RequestMapping("/api/usuarios")
//public class UsuarioController {
//
//    @Autowired
//    private UsuarioService usuarioService;
//
//    @PostMapping("/restablecer")
//    public ResponseEntity<String> restablecerContrasena(@RequestBody Map<String, String> datos) {
//        String nombreUsuario = datos.get("nombreUsuario");
//        String dni = datos.get("dni");
//        String nuevaContrasena = datos.get("nuevaContrasena");
//
//        if (nombreUsuario == null || dni == null || nuevaContrasena == null || nuevaContrasena.isEmpty()) {
//            return new ResponseEntity<>("Datos incompletos para restablecer contraseña.", HttpStatus.BAD_REQUEST);
//        }
//        try {
//            usuarioService.restablecerContrasena(nombreUsuario, dni, nuevaContrasena);
//            return new ResponseEntity<>("Contraseña restablecida correctamente.", HttpStatus.OK);
//        } catch (UsuarioException e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }
//
//}
//
