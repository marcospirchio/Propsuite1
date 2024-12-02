package com.example.AdministracionEdificiosTpApis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.service.TipoReclamoService;
import com.example.AdministracionEdificiosTpApis.exceptions.TipoReclamoException;
import com.example.AdministracionEdificiosTpApis.model.TipoReclamo;

import java.util.List;

@RestController
@RequestMapping("/api/tiposReclamo")
public class TipoReclamoController {

    private final TipoReclamoService tipoReclamoService;

    @Autowired
    public TipoReclamoController(TipoReclamoService tipoReclamoService) {
        this.tipoReclamoService = tipoReclamoService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TipoReclamo>> obtenerTodosLosTiposReclamo() {
        List<TipoReclamo> tipos = tipoReclamoService.obtenerTodosLosTiposReclamos();
        return new ResponseEntity<>(tipos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TipoReclamo> obtenerTipoReclamoPorId(@PathVariable int id) throws TipoReclamoException {
        TipoReclamo tipo = tipoReclamoService.obtenerTipoReclamoPorId(id);
        return new ResponseEntity<>(tipo, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TipoReclamo> agregarTipoReclamo(@RequestBody TipoReclamo tipoReclamo) throws TipoReclamoException {
        TipoReclamo creado = tipoReclamoService.agregarTipoReclamo(tipoReclamo);
        return new ResponseEntity<>(creado, HttpStatus.CREATED); // Devuelve el objeto con el ID generado
    }


    @PutMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> actualizarTipoReclamo(@RequestBody TipoReclamo tipoReclamo) throws TipoReclamoException {
        tipoReclamoService.actualizarTipoReclamo(tipoReclamo);
        return new ResponseEntity<>("Tipo de reclamo actualizado correctamente.", HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarTipoReclamo(@PathVariable int id) throws TipoReclamoException {
        tipoReclamoService.eliminarTipoReclamo(id);
        return new ResponseEntity<>("Tipo de reclamo eliminado correctamente.", HttpStatus.OK);
    }
}
