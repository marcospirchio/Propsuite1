package com.example.AdministracionEdificiosTpApis.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.exceptions.EdificioException;
import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.service.EdificioService;
import com.example.AdministracionEdificiosTpApis.views.EdificioView;
import com.example.AdministracionEdificiosTpApis.views.PersonaView;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;

@RestController
@RequestMapping("/api/edificios")
public class EdificioController {

    private final EdificioService edificioService;

    @Autowired
    public EdificioController(EdificioService edificioService) {
        this.edificioService = edificioService;
    }

    // Obtener todos los edificios
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EdificioView>> getEdificios() {
        List<EdificioView> edificios = edificioService.obtenerTodosLosEdificios();
        return new ResponseEntity<>(edificios, HttpStatus.OK);
    }

    // Obtener un edificio por ID
    @GetMapping("/{codigo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EdificioView> getEdificioPorId(@PathVariable int codigo) throws EdificioException {
        EdificioView edificio = edificioService.obtenerEdificioPorId(codigo);
        return new ResponseEntity<>(edificio, HttpStatus.OK);
    }

    // Obtener todas las unidades de un edificio
    @GetMapping("/{codigo}/unidades")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UnidadView>> getUnidadesPorEdificio(@PathVariable int codigo) throws EdificioException {
        List<UnidadView> unidades = edificioService.obtenerTodasLasUnidadesPorEdificio(codigo);
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }

    // Obtener personas habilitadas en un edificio (duebio + inquilino)
    @GetMapping("/{codigo}/habilitados")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PersonaView>> habilitadosPorEdificio(@PathVariable int codigo) throws EdificioException {
        List<PersonaView> habilitados = edificioService.obtenerHabilitadosPorEdificio(codigo);
        return new ResponseEntity<>(habilitados, HttpStatus.OK);
    }

    // Obtener dueños de un edificio
    @GetMapping("/{codigo}/duenios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PersonaView>> dueniosPorEdificio(@PathVariable int codigo) throws EdificioException {
        List<PersonaView> duenios = edificioService.obtenerDueniosPorEdificio(codigo);
        return new ResponseEntity<>(duenios, HttpStatus.OK);
    }

    // Obtener habitantes de un edificio (Habitantes y Duenios)
    @GetMapping("/{codigo}/habitantes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PersonaView>> habitantesPorEdificio(@PathVariable int codigo) throws EdificioException {
        List<PersonaView> habitantes = edificioService.obtenerHabitantesPorEdificio(codigo);
        return new ResponseEntity<>(habitantes, HttpStatus.OK);
    }

    // Obtener inquilinos de un edificio
    @GetMapping("/{codigo}/inquilinos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PersonaView>> inquilinosPorEdificio(@PathVariable int codigo) throws EdificioException {
        List<PersonaView> inquilinos = edificioService.obtenerInquilinosPorEdificio(codigo);
        return new ResponseEntity<>(inquilinos, HttpStatus.OK);
    }
    
    // Agregar un nuevo edificio
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> agregarEdificio(@RequestBody Edificio edificio) throws EdificioException {
        edificioService.agregarEdificio(edificio);
        return new ResponseEntity<>("Edificio agregado correctamente.", HttpStatus.CREATED);
    }

    // Actualizar un edificio existente
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> actualizarEdificio(@RequestBody Edificio edificio) throws EdificioException {
        edificioService.actualizarEdificio(edificio);
        return new ResponseEntity<>("Edificio actualizado correctamente.", HttpStatus.OK);
    }

 // Eliminar un edificio por medio de JSON
    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarEdificio(@RequestBody Map<String, Integer> payload) throws EdificioException {
        int codigo = payload.get("codigo");
        edificioService.eliminarEdificio(codigo);
        return new ResponseEntity<>("Edificio eliminado correctamente.", HttpStatus.OK);
    }



}
