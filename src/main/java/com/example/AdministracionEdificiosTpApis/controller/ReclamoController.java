package com.example.AdministracionEdificiosTpApis.controller;

//import org.apache.tomcat.util.net.openssl.ciphers.Authentication; SI ALGO FALLA REVISAR ESTE IMPORT Y ELIMINAR EL DE SPRING AUTHETICATION DE ABAJO
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.AdministracionEdificiosTpApis.service.ReclamoService;
import com.example.AdministracionEdificiosTpApis.data.ImagenDAO;
import com.example.AdministracionEdificiosTpApis.data.UnidadDAO;
import com.example.AdministracionEdificiosTpApis.data.UsuarioDAO;
import com.example.AdministracionEdificiosTpApis.exceptions.*;
import com.example.AdministracionEdificiosTpApis.model.Usuario;
import com.example.AdministracionEdificiosTpApis.model.Imagen;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Reclamo;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.views.Estado;
import com.example.AdministracionEdificiosTpApis.views.ReclamoView;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/api/reclamos")
public class ReclamoController {

    private final ReclamoService reclamoService;
    private final UsuarioDAO usuarioDAO;
    
    @Autowired
    private UnidadDAO unidadDAO;
    
    @Autowired
    private ImagenDAO imagenDAO;
    
    @Autowired
    public ReclamoController(ReclamoService reclamoService, UsuarioDAO usuarioDAO) {
        this.reclamoService = reclamoService;
        this.usuarioDAO = usuarioDAO;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ReclamoView>> obtenerTodosLosReclamos() {
        List<ReclamoView> reclamos = reclamoService.obtenerTodosLosReclamos();
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USUARIO')")
    public ResponseEntity<Map<String, Object>> obtenerReclamoPorId(@PathVariable int id) throws ReclamoException, PersonaException {
        // Obtener los detalles del usuario autenticado desde el contexto de seguridad
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        // Buscar el usuario autenticado en la base de datos
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documentoUsuario = usuario.getPersona().getDocumento();

        // Obtener el reclamo desde el servicio
        Reclamo reclamo = reclamoService.obtenerReclamoEntityPorId(id)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));

        // Validar que el usuario autenticado sea el propietario del reclamo o tenga acceso (ADMIN)
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ADMIN"));
        
        if (!isAdmin && (reclamo.getUsuario() == null || !reclamo.getUsuario().getDocumento().equals(documentoUsuario))) {
            throw new ReclamoException("No tiene permisos para acceder a este reclamo.");
        }

        // Obtener las imágenes asociadas al reclamo
        List<Imagen> imagenes = imagenDAO.getImagenesByReclamoId(id);  // Este método asume que tienes una clase ImagenDAO

        // Convertir el reclamo a su vista
        ReclamoView reclamoView = reclamo.toView();

        // Crear la respuesta con las imágenes
        Map<String, Object> response = new HashMap<>();
        response.put("reclamo", reclamoView);

        // Si hay imágenes asociadas, las agregamos al mapa de respuesta
        if (!imagenes.isEmpty()) {
            List<Map<String, String>> imagenesData = new ArrayList<>();
            for (Imagen imagen : imagenes) {
                Map<String, String> imagenMap = new HashMap<>();
                imagenMap.put("tipo", imagen.getTipo());
                imagenMap.put("contenido", "data:" + imagen.getTipo() + ";base64," + imagen.getContenido());
                imagenesData.add(imagenMap);
            }
            response.put("imagenes", imagenesData);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    @GetMapping("/edificio/{codigoEdificio}")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerReclamosPorEdificio(@PathVariable int codigoEdificio) throws PersonaException, EdificioException {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documento = usuario.getPersona().getDocumento();

        // Obtener reclamos por edificio y filtrar los del usuario logueado
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorEdificio(codigoEdificio).stream()
                .filter(reclamo -> reclamo.getUsuario() != null 
                        && reclamo.getUsuario().getDocumento().equals(documento))
                .collect(Collectors.toList());

        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }


    @GetMapping("/unidad/{codigoEdificio}/{piso}/{numero}")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerReclamosPorUnidad(
            @PathVariable int codigoEdificio,
            @PathVariable String piso,
            @PathVariable String numero) throws UnidadException, PersonaException {

        // Obtener detalles del usuario autenticado
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        // Buscar usuario autenticado en la base de datos
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documentoPersona = usuario.getPersona().getDocumento();

        // Verificar si la unidad corresponde al usuario logueado como dueño o inquilino
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigoEdificio, piso, numero)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada."));

        boolean esInquilino = unidad.getInquilinos().stream()
                .anyMatch(inquilino -> inquilino.getDocumento().equals(documentoPersona));

        boolean esDuenioSinInquilinos = unidad.getDuenios().stream()
                .anyMatch(duenio -> duenio.getDocumento().equals(documentoPersona)) && unidad.getInquilinos().isEmpty();

        if (!esInquilino && !esDuenioSinInquilinos) {
            return new ResponseEntity<>(List.of(), HttpStatus.OK); // Retorna lista vacía si no tiene permisos
        }

        // Obtener y devolver los reclamos de la unidad si el usuario tiene acceso
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorUnidad(codigoEdificio, piso, numero);
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }


    
    @GetMapping("/unidad/{idUnidad}")
    @PreAuthorize("hasAuthority('ADMIN', 'USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerReclamosPorIdUnidad(@PathVariable int idUnidad) throws UnidadException {
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorIdUnidad(idUnidad);
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }

    @GetMapping("/persona/{documentoPersona}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ReclamoView>> obtenerReclamosPorPersona(@PathVariable String documentoPersona) throws PersonaException {
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorPersona(documentoPersona);
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }
    
    
    @GetMapping("/tipo/{idTipoReclamo}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerReclamosPorTipo(@PathVariable int idTipoReclamo) throws PersonaException {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documento = usuario.getPersona().getDocumento();

        // Obtener reclamos por tipo y filtrar los del usuario logueado
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorTipo(idTipoReclamo).stream()
                .filter(reclamo -> reclamo.getUsuario() != null 
                        && reclamo.getUsuario().getDocumento().equals(documento))
                .collect(Collectors.toList());

        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }
    
    // ARREGLAR
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerReclamosPorEstado(@PathVariable Estado estado) throws PersonaException {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documento = usuario.getPersona().getDocumento();

        // Obtener reclamos por estado y filtrar los del usuario logueado
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorEstado(estado).stream()
                .filter(reclamo -> reclamo.getUsuario() != null 
                        && reclamo.getUsuario().getDocumento().equals(documento))
                .collect(Collectors.toList());

        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }
    
    @GetMapping("/mis-reclamos")
    @PreAuthorize("hasAnyAuthority('USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerMisReclamos() throws PersonaException {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documento = usuario.getPersona().getDocumento();

        List<ReclamoView> reclamos = reclamoService.obtenerReclamosPorPersona(documento);
        
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }


    @GetMapping("/mis-reclamos/filtrar")
    @PreAuthorize("hasAnyAuthority('USUARIO')")
    public ResponseEntity<List<ReclamoView>> filtrarMisReclamosPorFecha(@RequestParam boolean masRecientes) throws PersonaException {
        // Obtener el usuario autenticado
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        String documento = usuario.getPersona().getDocumento();

        // Filtrar los reclamos del usuario por fecha
        List<ReclamoView> reclamosFiltrados = reclamoService.filtrarReclamosPorFecha(documento, masRecientes);

        return new ResponseEntity<>(reclamosFiltrados, HttpStatus.OK);
    }
    
    
    @GetMapping("/areas-comunes")
    @PreAuthorize("hasAuthority('USUARIO')")
    public ResponseEntity<List<ReclamoView>> obtenerMisReclamosEnAreasComunes() throws ReclamoException, PersonaException {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String nombreUsuario = userDetails.getUsername();

        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        List<ReclamoView> reclamos = reclamoService.obtenerReclamosAreasComunesPorUsuario(usuario.getPersona().getDocumento());
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }
    
    
    @GetMapping("/areas-comunes/todos")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ReclamoView>> obtenerTodosLosReclamosDeAreasComunes() {
        List<ReclamoView> reclamos = reclamoService.obtenerReclamosAreasComunes();
        return new ResponseEntity<>(reclamos, HttpStatus.OK);
    }
    
    @PostMapping("/conUnidad")
    @PreAuthorize("hasAuthority('USUARIO')")
    public ResponseEntity<Map<String, Object>> agregarReclamoConUnidad(@RequestBody Map<String, Object> request) throws ReclamoException, PersonaException, UnidadException, EdificioException {
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Obtener el nombre de usuario desde los detalles del usuario autenticado
        String nombreUsuario = userDetails.getUsername();

        // Buscar el usuario en la base de datos para obtener su documento
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        // Extraer el documento de la persona asociada al usuario
        String documentoPersona = usuario.getPersona().getDocumento();

        int codigoEdificio = (int) request.get("codigoEdificio");
        String piso = (String) request.get("piso");
        String numeroUnidad = (String) request.get("numeroUnidad");
        String ubicacion = (String) request.get("ubicacion");
        String descripcion = (String) request.get("descripcion");
        int tipoReclamo = (int) request.get("tipoReclamo");

        // Verificar que el usuario es dueño o inquilino de la unidad y tiene permiso para hacer un reclamo
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigoEdificio, piso, numeroUnidad)
            .orElseThrow(() -> new UnidadException("Unidad no encontrada."));

        boolean isOwner = unidad.getDuenios().stream().anyMatch(persona -> persona.getDocumento().equals(documentoPersona));
        boolean isTenant = unidad.getInquilinos().stream().anyMatch(persona -> persona.getDocumento().equals(documentoPersona));
        boolean isUnoccupied = unidad.getInquilinos().isEmpty();

        if (!(isOwner && (isUnoccupied || !isTenant)) && !isTenant) {
            throw new PersonaException("No autorizado para hacer reclamos en esta unidad.");
        }

        int idReclamo = reclamoService.agregarReclamoConUnidad(codigoEdificio, piso, numeroUnidad, documentoPersona, ubicacion, descripcion, tipoReclamo);

        Map<String, Object> response = Map.of(
                "mensaje", "Reclamo creado exitosamente",
                "idReclamo", idReclamo
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



    @PostMapping("/sinUnidad")
    @PreAuthorize("hasAuthority('USUARIO')")
    public ResponseEntity<Integer> agregarReclamoSinUnidad(@RequestBody Map<String, Object> request)
            throws ReclamoException, PersonaException, EdificioException, UnidadException {

        // Obtener los detalles del usuario autenticado desde el SecurityContextHolder
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        // Obtener el nombre de usuario desde los detalles del usuario autenticado
        String nombreUsuario = userDetails.getUsername();

        // Buscar el usuario en la base de datos para obtener su documento
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        // Extraer el documento de la persona asociada al usuario
        String documentoPersona = usuario.getPersona().getDocumento();

        int codigoEdificio = (int) request.get("codigoEdificio");
        String ubicacion = (String) request.get("ubicacion");
        String descripcion = (String) request.get("descripcion");
        int tipoReclamo = (int) request.get("tipoReclamo");

        int idReclamo = reclamoService.agregarReclamoSinUnidad(
                codigoEdificio, documentoPersona, ubicacion, descripcion, tipoReclamo
        );

        return new ResponseEntity<>(idReclamo, HttpStatus.CREATED);
    }


    @PutMapping("actualizar")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public ResponseEntity<String> actualizarReclamo(@RequestBody Map<String, Object> request)
            throws ReclamoException, UnidadException {

        // Obtener detalles del usuario autenticado
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String nombreUsuario = userDetails.getUsername();

        // Buscar usuario autenticado en la base de datos
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new ReclamoException("Usuario no encontrado en la base de datos."));

        // Obtener documento del usuario autenticado
        String documentoPersona = usuario.getPersona().getDocumento();

        // Extraer datos del request
        int idReclamo = (int) request.get("idReclamo");
        String ubicacion = (String) request.get("ubicacion");
        String descripcion = (String) request.get("descripcion");

        // Validar que el reclamo existe
        Reclamo reclamo = reclamoService.obtenerReclamoEntityPorId(idReclamo)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));

        // Validar si el reclamo pertenece al usuario autenticado
        boolean esCreadorDelReclamo = reclamo.getUsuario() != null &&
                reclamo.getUsuario().getDocumento().equals(documentoPersona);

        if (!esCreadorDelReclamo) {
            throw new ReclamoException("El usuario no tiene permisos para acceder o actualizar este reclamo.");
        }

        // Actualizar reclamo
        reclamoService.actualizarReclamo(idReclamo, ubicacion, descripcion);

        return new ResponseEntity<>("Reclamo actualizado correctamente.", HttpStatus.OK);
    }

    
    
    @PutMapping("/estado")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> cambiarEstadoReclamo(@RequestBody Map<String, Object> request) throws ReclamoException {
        // Obtener detalles del usuario autenticado
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String rolUsuario = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        // Validar rol del usuario
        if (!"ADMIN".equals(rolUsuario)) {
            return new ResponseEntity<>("No autorizado para cambiar el estado de un reclamo.", HttpStatus.FORBIDDEN);
        }

        // Extraer valores del JSON
        int idReclamo = (int) request.get("idReclamo");
        String estadoStr = (String) request.get("estado");
        String detalleEstado = (String) request.get("detalleEstado");

        // Convertir estado recibido en formato seguro
        Estado nuevoEstado = convertirEstado(estadoStr);

        // Llamar al servicio para actualizar el estado
        reclamoService.cambiarEstado(idReclamo, nuevoEstado, detalleEstado);

        return new ResponseEntity<>("Estado del reclamo actualizado correctamente.", HttpStatus.OK);
    }

    private Estado convertirEstado(String estadoStr) throws ReclamoException {
        try {
            // Normalizar la cadena para que coincida con los valores del enum
            String normalizedState = estadoStr.trim().toLowerCase(); // Normalizamos a minúsculas
            for (Estado estado : Estado.values()) {
                if (estado.name().equalsIgnoreCase(normalizedState)) {
                    return estado;
                }
            }
            throw new IllegalArgumentException(); // Lanzar si no encuentra coincidencia
        } catch (IllegalArgumentException e) {
            throw new ReclamoException("Estado inválido: " + estadoStr);
        }
    }




    @DeleteMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarReclamo(@RequestBody Map<String, Object> request) throws ReclamoException {
        int idReclamo = (int) request.get("idReclamo");

        reclamoService.eliminarReclamo(idReclamo);
        return new ResponseEntity<>("Reclamo eliminado correctamente.", HttpStatus.OK);
    }




 
}

