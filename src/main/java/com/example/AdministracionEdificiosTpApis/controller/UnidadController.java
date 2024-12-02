package com.example.AdministracionEdificiosTpApis.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.exceptions.EdificioException;
import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.exceptions.UnidadException;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.service.UnidadService;
import com.example.AdministracionEdificiosTpApis.views.PersonaView;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;

@RestController
@RequestMapping("/api/unidades")
public class UnidadController {

    private final UnidadService unidadService;

    @Autowired
    public UnidadController(UnidadService unidadService) {
        this.unidadService = unidadService;
    }

    // Obtener todas las unidades
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UnidadView>> obtenerTodasLasUnidades() {
        List<UnidadView> unidades = unidadService.obtenerTodasLasUnidades();
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }

    // Obtener unidad por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UnidadView> obtenerUnidadPorId(@PathVariable int id) throws UnidadException {
        UnidadView unidad = unidadService.obtenerUnidadPorId(id);
        return new ResponseEntity<>(unidad, HttpStatus.OK);
    }

    //FUNCIIONA
    // Obtener unidad por código, piso y número
    @GetMapping("/unidad")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UnidadView> obtenerUnidadPorPisoNumero(
            @RequestParam int codigo,
            @RequestParam String piso,
            @RequestParam String numero) throws UnidadException {
        Unidad unidad = unidadService.obtenerUnidadPorPisoNumero(codigo, piso, numero);
        return new ResponseEntity<>(unidad.toView(), HttpStatus.OK);
    }


    // Agregar una unidad a un edificio
    @PostMapping("/{idEdificio}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> agregarUnidad(
            @RequestBody Unidad unidad,
            @PathVariable int idEdificio) throws EdificioException {
        unidadService.agregarUnidad(unidad, idEdificio);
        return new ResponseEntity<>("Unidad agregada con éxito.", HttpStatus.CREATED);
    }

    // Actualizar una unidad
    @PutMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> actualizarUnidad(@RequestBody Unidad unidad) throws UnidadException {
        unidadService.actualizarUnidad(unidad);
        return new ResponseEntity<>("Unidad actualizada con éxito.", HttpStatus.OK);
    }

    // Eliminar una unidad
    @DeleteMapping("/{idUnidad}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarUnidad(@PathVariable int idUnidad) throws UnidadException {
        unidadService.eliminarUnidad(idUnidad);
        return new ResponseEntity<>("Unidad eliminada con éxito.", HttpStatus.OK);
    }
    
    
    // FUNCIONA
    // Obtener dueños por unidad
    @GetMapping("/{codigo}/duenios")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PersonaView>> obtenerDueniosPorUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero) throws UnidadException {
        System.out.println("Parámetros recibidos: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'");
        piso = piso.trim().toLowerCase(); // Normalizamos los datos entrantes
        numero = numero.trim().toLowerCase(); // Normalizamos los datos entrantes

        List<PersonaView> duenios = unidadService.obtenerDueniosPorUnidad(codigo, piso, numero);
        System.out.println("Dueños encontrados: " + duenios.size());
        return new ResponseEntity<>(duenios, HttpStatus.OK);
    }
    
    // FUNCIONA
    @GetMapping("/{codigo}/inquilinos")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PersonaView>> obtenerInquilinosPorUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero) throws UnidadException {
        System.out.println("Parámetros recibidos: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'");
        piso = piso.trim().toLowerCase(); // Normalizamos los datos entrantes
        numero = numero.trim().toLowerCase(); // Normalizamos los datos entrantes

        List<PersonaView> inquilinos = unidadService.obtenerInquilinosPorUnidad(codigo, piso, numero);
        System.out.println("Inquilinos encontrados: " + inquilinos.size());
        return new ResponseEntity<>(inquilinos, HttpStatus.OK);
    }

    @GetMapping("/alquiladas/{codigoEdificio}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UnidadView>> obtenerUnidadesAlquiladasPorEdificio(@PathVariable int codigoEdificio) {
        try {
            List<UnidadView> unidadesAlquiladas = unidadService.obtenerUnidadesAlquiladasPorEdificio(codigoEdificio);
            return new ResponseEntity<>(unidadesAlquiladas, HttpStatus.OK);
        } catch (EdificioException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    // Transferir unidad
    @PostMapping("/{codigo}/transferir")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> transferirUnidad(
            @PathVariable int codigo,
            @RequestBody Map<String, String> requestBody) throws UnidadException, PersonaException {
        String piso = requestBody.get("piso");
        String numero = requestBody.get("numero");
        String documento = requestBody.get("documento");
        unidadService.transferirUnidad(codigo, piso, numero, documento);
        return new ResponseEntity<>("Unidad transferida con éxito y todos los inquilinos han sido eliminados.", HttpStatus.OK);
    }


    // Agregar dueño a una unidad
    @PostMapping("/{codigo}/agregarDuenio")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> agregarDuenioUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero,
            @RequestParam String documento) throws UnidadException, PersonaException {
        unidadService.agregarDuenioUnidad(codigo, piso, numero, documento);
        return new ResponseEntity<>("Dueño agregado con éxito.", HttpStatus.OK);
    }

    
    // FUNCIONA  AGREGA UN INQUILINO
    @PostMapping("/{codigo}/alquilar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> alquilarUnidad(
            @PathVariable int codigo,
            @RequestBody Map<String, String> requestBody) throws UnidadException, PersonaException {
        String piso = requestBody.get("piso");
        String numero = requestBody.get("numero");
        String documento = requestBody.get("documento");
        unidadService.alquilarUnidad(codigo, piso, numero, documento);
        return new ResponseEntity<>("Unidad alquilada con éxito.", HttpStatus.OK);
    }

    // Funciona
    // Agregar inquilino a una unidad
    @PostMapping("/{codigo}/agregarInquilino")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> agregarInquilinoUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero,
            @RequestParam String documento) throws UnidadException, PersonaException {
        unidadService.agregarInquilinoUnidad(codigo, piso, numero, documento);
        return new ResponseEntity<>("Inquilino agregado con éxito.", HttpStatus.OK);
    }

    // Liberar unidad
    @PostMapping("/{codigo}/liberar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> liberarUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero) throws UnidadException {
        unidadService.liberarUnidad(codigo, piso, numero);
        return new ResponseEntity<>("Unidad liberada con éxito.", HttpStatus.OK);
    }

    // funciona
    @PostMapping("/{codigo}/habitar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> habitarUnidad(
            @PathVariable int codigo,
            @RequestBody Map<String, String> requestBody) throws UnidadException, PersonaException {
        String piso = requestBody.get("piso");
        String numero = requestBody.get("numero");
        String documento = requestBody.get("documento");

        unidadService.habitarUnidad(codigo, piso, numero, documento);
        return new ResponseEntity<>("Unidad habitada con éxito por la persona con documento " + documento, HttpStatus.OK);
    }

    @DeleteMapping("/{codigo}/eliminarInquilino")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarInquilinoDeUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero,
            @RequestParam String dni) throws UnidadException, PersonaException {
        unidadService.eliminarInquilinoDeUnidad(codigo, piso, numero, dni);
        return new ResponseEntity<>("Inquilino eliminado con éxito.", HttpStatus.OK);
    }

    @DeleteMapping("/{codigo}/eliminarDuenio")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarDuenioDeUnidad(
            @PathVariable int codigo,
            @RequestParam String piso,
            @RequestParam String numero,
            @RequestParam String dni) throws UnidadException, PersonaException {
        unidadService.eliminarDuenioDeUnidad(codigo, piso, numero, dni);
        return new ResponseEntity<>("Dueño eliminado con éxito.", HttpStatus.OK);
    }

}
