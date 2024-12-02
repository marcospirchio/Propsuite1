package com.example.AdministracionEdificiosTpApis.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.service.PersonaService;
import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    // Solo ADMIN puede obtener todas las personas
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Persona>> obtenerTodasLasPersonas() {
        List<Persona> personas = personaService.obtenerTodasLasPersonas();
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }

    // Solo ADMIN puede obtener una persona por ID
    @GetMapping("/{documento}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Persona> obtenerPersonaPorId(@PathVariable String documento) throws PersonaException {
        Persona persona = personaService.obtenerPersonaPorId(documento);
        return new ResponseEntity<>(persona, HttpStatus.OK);
    }

    // USUARIO puede obtener sus propias unidades
    @GetMapping("/{documento}/unidades")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UnidadView>> obtenerUnidadesPorId(@PathVariable String documento) {
        List<UnidadView> unidades = personaService.misUnidades(documento);
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }


    @GetMapping("/mis-unidades/duenio")
    @PreAuthorize("hasAuthority('USUARIO')")
    public ResponseEntity<List<UnidadView>> obtenerMisUnidadesDondeSoyDuenio() throws PersonaException {
        // Obtener los detalles del usuario actual desde el token JWT
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        // Extraer el username del usuario autenticado
        String username = userDetails.getUsername();

        // Obtener las unidades donde el usuario es dueño
        List<UnidadView> unidades = personaService.obtenerUnidadesDondeSoyDuenio(username);

        // Retornar las unidades
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }

    
    @GetMapping("/mis-unidades/inquilino")
    @PreAuthorize("hasAuthority('USUARIO')")
    public ResponseEntity<List<UnidadView>> obtenerMisUnidadesDondeSoyInquilino() throws PersonaException {
        // Obtener los detalles del usuario actual desde el token JWT
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        // Extraer el username del usuario autenticado
        String username = userDetails.getUsername();

        // Obtener las unidades donde el usuario es inquilino
        List<UnidadView> unidades = personaService.obtenerUnidadesDondeSoyInquilino(username);

        // Retornar las unidades
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }


    // Solo ADMIN puede agregar una persona
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> agregarPersona(@RequestBody Persona persona) throws PersonaException {
        personaService.agregarPersona(persona);
        return new ResponseEntity<>("Persona agregada correctamente.", HttpStatus.CREATED);
    }

    // Solo ADMIN puede actualizar una persona
    @PutMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> actualizarPersona(@RequestBody Persona persona) throws PersonaException {
        personaService.actualizarPersona(persona);
        return new ResponseEntity<>("Persona actualizada correctamente.", HttpStatus.OK);
    }

 // Solo ADMIN puede eliminar una persona
    @DeleteMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarPersona(@RequestBody Map<String, String> requestBody) throws PersonaException {
        String documento = requestBody.get("documento"); // Extraer el documento del JSON
        if (documento == null || documento.isBlank()) {
            return ResponseEntity.badRequest().body("El documento es obligatorio para eliminar una persona.");
        }

        personaService.eliminarPersona(documento);
        return new ResponseEntity<>("Persona eliminada correctamente.", HttpStatus.OK);
    }

}
