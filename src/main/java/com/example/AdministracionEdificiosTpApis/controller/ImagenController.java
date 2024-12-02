package com.example.AdministracionEdificiosTpApis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.example.AdministracionEdificiosTpApis.service.ImagenService;
import com.example.AdministracionEdificiosTpApis.service.ReclamoService;
import com.example.AdministracionEdificiosTpApis.data.ImagenDAO;
import com.example.AdministracionEdificiosTpApis.data.UsuarioDAO;
import com.example.AdministracionEdificiosTpApis.exceptions.ImagenException;
import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.exceptions.ReclamoException;
import com.example.AdministracionEdificiosTpApis.model.Imagen;
import com.example.AdministracionEdificiosTpApis.model.Reclamo;
import com.example.AdministracionEdificiosTpApis.model.Usuario;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {

    @Autowired
    private ImagenService imagenService;

    @Autowired
    private ImagenDAO imagenDAO;
    
    @Autowired
    private UsuarioDAO usuarioDAO;
    
    @Autowired
    private ReclamoService reclamoService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Imagen>> obtenerTodasLasImagenes() {
        List<Imagen> imagenes = imagenService.obtenerTodasLasImagenes();
        return new ResponseEntity<>(imagenes, HttpStatus.OK);
    }

    @PostMapping("/agregar")
    @PreAuthorize("hasAuthority('USUARIO','ADMIN')")
    public ResponseEntity<String> agregarImagen(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("idReclamo") int idReclamo) throws Exception {

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

        // Verificar que el reclamo pertenece al usuario logueado
        Reclamo reclamo = reclamoService.obtenerReclamoEntityPorId(idReclamo)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));

        if (!reclamo.getUsuario().getDocumento().equals(documentoPersona)) {
            throw new ReclamoException("No tiene permiso para agregar imágenes a este reclamo.");
        }

        // Convertir el archivo a Base64
        String contenidoBase64 = Base64.getEncoder().encodeToString(archivo.getBytes());

        // Agregar la imagen
        imagenService.agregarImagen(archivo.getContentType(), contenidoBase64, idReclamo);

        return new ResponseEntity<>("Imagen cargada y asociada correctamente.", HttpStatus.CREATED);
    }

    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAuthority('USUARIO','ADMIN')")
    public ResponseEntity<String> actualizarImagen(
            @PathVariable int id,
            @RequestParam("archivo") MultipartFile archivo) throws Exception {

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

        // Obtener la imagen existente
        Imagen imagenExistente = imagenService.obtenerImagenPorId(id);

        // Verificar que la imagen pertenece a un reclamo del usuario logueado
        if (!imagenExistente.getReclamo().getUsuario().getDocumento().equals(documentoPersona)) {
            throw new ReclamoException("No tiene permiso para actualizar esta imagen.");
        }

        // Convertir el archivo a Base64
        String contenidoBase64 = Base64.getEncoder().encodeToString(archivo.getBytes());

        // Actualizar los datos de la imagen
        imagenExistente.setContenido(contenidoBase64);
        imagenExistente.setTipo(archivo.getContentType());

        // Guardar los cambios
        imagenService.actualizarImagen(imagenExistente);

        return new ResponseEntity<>("Imagen actualizada correctamente.", HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USUARIO','ADMIN')")
    public ResponseEntity<String> eliminarImagen(@PathVariable int id) throws ImagenException, ReclamoException, PersonaException {
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

        // Obtener la imagen
        Imagen imagen = imagenDAO.getImagenById(id)
                .orElseThrow(() -> new ImagenException("Imagen no encontrada."));

        // Verificar que la imagen pertenece a un reclamo del usuario logueado
        if (!imagen.getReclamo().getUsuario().getDocumento().equals(documentoPersona)) {
            throw new ReclamoException("No tiene permiso para eliminar esta imagen.");
        }

        // Eliminar la imagen
        imagenService.eliminarImagen(id);

        return new ResponseEntity<>("Imagen eliminada correctamente.", HttpStatus.OK);
    }

    @GetMapping("/ver/{id}")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public ResponseEntity<byte[]> verImagen(@PathVariable int id) throws ImagenException, ReclamoException, PersonaException {
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

        // Obtener la imagen
        Imagen imagen = imagenDAO.getImagenById(id)
                .orElseThrow(() -> new ImagenException("Imagen no encontrada."));

        // Verificar que la imagen pertenece a un reclamo del usuario logueado
        if (!imagen.getReclamo().getUsuario().getDocumento().equals(documentoPersona)) {
            throw new ReclamoException("No tiene permiso para acceder a esta imagen.");
        }

        // Preparar la respuesta
        byte[] contenidoImagen = Base64.getDecoder().decode(imagen.getContenido());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf(imagen.getTipo()));
        headers.setContentLength(contenidoImagen.length);

        return new ResponseEntity<>(contenidoImagen, headers, HttpStatus.OK);
    }


    @GetMapping("/ver/reclamo/{idReclamo}")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public ResponseEntity<List<Map<String, String>>> verImagenesPorReclamo(@PathVariable int idReclamo) throws ImagenException, ReclamoException, PersonaException {
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

        // Verificar que el reclamo pertenece al usuario logueado
        Reclamo reclamo = reclamoService.obtenerReclamoEntityPorId(idReclamo)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));
        
        if (!reclamo.getUsuario().getDocumento().equals(documentoPersona)) {
            throw new ReclamoException("No tiene permiso para acceder a las imágenes de este reclamo.");
        }

        // Obtener las imágenes del reclamo
        List<Imagen> imagenes = imagenDAO.getImagenesByReclamoId(idReclamo);

        if (imagenes.isEmpty()) {
            throw new ImagenException("No se encontraron imágenes para el reclamo con ID: " + idReclamo);
        }

        // Preparar la respuesta
        List<Map<String, String>> respuesta = new ArrayList<>();
        for (Imagen imagen : imagenes) {
            Map<String, String> imagenData = new HashMap<>();
            imagenData.put("tipo", imagen.getTipo());
            imagenData.put("contenido", "data:" + imagen.getTipo() + ";base64," + imagen.getContenido());
            respuesta.add(imagenData);
        }

        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    
    //ONLY ADMIN
 // Obtener una imagen específica por ID
    @GetMapping("/verimagen/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<byte[]> verFoto(@PathVariable int id) throws ImagenException {
        Imagen imagen = imagenDAO.getImagenById(id)
                .orElseThrow(() -> new ImagenException("Imagen no encontrada."));

        byte[] contenidoImagen = Base64.getDecoder().decode(imagen.getContenido());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf(imagen.getTipo()));
        headers.setContentLength(contenidoImagen.length);

        return new ResponseEntity<>(contenidoImagen, headers, HttpStatus.OK);
    }

    // Ver imágenes asociadas a un reclamo
    @GetMapping("/reclamo/{idReclamo}/imagenes")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Map<String, String>>> verImagenesDelReclamo(@PathVariable int idReclamo) throws ImagenException, ReclamoException {
        Reclamo reclamo = reclamoService.obtenerReclamoEntityPorId(idReclamo)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));

        List<Imagen> imagenes = imagenDAO.getImagenesByReclamoId(idReclamo);

        if (imagenes.isEmpty()) {
            throw new ImagenException("No se encontraron imágenes para el reclamo con ID: " + idReclamo);
        }

        List<Map<String, String>> respuesta = new ArrayList<>();
        for (Imagen imagen : imagenes) {
            Map<String, String> imagenData = new HashMap<>();
            imagenData.put("tipo", imagen.getTipo());
            imagenData.put("contenido", "data:" + imagen.getTipo() + ";base64," + imagen.getContenido());
            respuesta.add(imagenData);
        }

        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

}
