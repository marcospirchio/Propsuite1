package com.example.AdministracionEdificiosTpApis.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.AdministracionEdificiosTpApis.data.EdificioDAO;
import com.example.AdministracionEdificiosTpApis.data.ImagenDAO;
import com.example.AdministracionEdificiosTpApis.data.PersonaDAO;
import com.example.AdministracionEdificiosTpApis.data.ReclamoDAO;
import com.example.AdministracionEdificiosTpApis.data.ReclamoRepository;
import com.example.AdministracionEdificiosTpApis.data.TipoReclamoDAO;
import com.example.AdministracionEdificiosTpApis.data.UnidadDAO;
import com.example.AdministracionEdificiosTpApis.data.UsuarioRepository;
import com.example.AdministracionEdificiosTpApis.exceptions.EdificioException;
import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.exceptions.ReclamoException;
import com.example.AdministracionEdificiosTpApis.exceptions.UnidadException;
import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.model.Imagen;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Reclamo;
import com.example.AdministracionEdificiosTpApis.model.TipoReclamo;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.views.Estado;
import com.example.AdministracionEdificiosTpApis.views.ReclamoView;


@Service
public class ReclamoService {

    @Autowired
    private ReclamoDAO reclamoDAO;

    @Autowired
    private PersonaDAO personaDAO;

    @Autowired
    private EdificioDAO edificioDAO;
    
    @Autowired
    private ReclamoRepository reclamoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private UnidadDAO unidadDAO;

    @Autowired
    private TipoReclamoDAO tipoReclamoDAO;
    
    @Autowired
    private ImagenDAO imagenDAO; 

    // Método que retorna una lista de ReclamoView para visualización
    public List<ReclamoView> obtenerTodosLosReclamos() {
        return reclamoDAO.getAllReclamos().stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }

    // Método que obtiene un ReclamoView para visualización
    public ReclamoView obtenerReclamoPorId(int idReclamo) throws ReclamoException {
        return reclamoDAO.getReclamoById(idReclamo)
                .map(Reclamo::toView)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado"));
    }
    
    // Método para obtener reclamos por edificio
    public List<ReclamoView> obtenerReclamosPorEdificio(int codigoEdificio) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(codigoEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado"));
        return reclamoDAO.getReclamosByEdificio(edificio).stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }

    // Método para obtener reclamos por unidad
    public List<ReclamoView> obtenerReclamosPorUnidad(int codigo, String piso, String numero) throws UnidadException {
        Unidad unidad= unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso, numero)
                .orElseThrow(() -> new UnidadException("Unidad no encontrado"));
        return reclamoDAO.getReclamosByUnidad(unidad).stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }

    
 // Método para obtener reclamos por ID de unidad
    public List<ReclamoView> obtenerReclamosPorIdUnidad(int idUnidad) throws UnidadException {
        Unidad unidad = unidadDAO.getUnidadById(idUnidad)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada"));
        return reclamoDAO.getReclamosByUnidad(unidad).stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }

//     Método para obtener reclamos por persona
    public List<ReclamoView> obtenerReclamosPorPersona(String documentoPersona) throws PersonaException {
        Persona persona = personaDAO.getPersonaById(documentoPersona)
                .orElseThrow(() -> new PersonaException("Persona no encontrada"));
        return reclamoDAO.getReclamosByPersona(persona).stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }
    public List<ReclamoView> obtenerReclamosPorUsuario(String documentoPersona) throws PersonaException {
        // Obtener la entidad Persona por el documento
        Persona persona = personaDAO.getPersonaById(documentoPersona)
                .orElseThrow(() -> new PersonaException("Persona no encontrada"));

        // Usar el método findByUsuario del repositorio
        List<Reclamo> reclamos = reclamoDAO.getReclamosByUsuario(persona);

        // Mapear a ReclamoView y retornar
        return reclamos.stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }

    
 // Método para obtener reclamos filtrados por tipo de reclamo
    public List<ReclamoView> obtenerReclamosPorTipo(int idTipoReclamo) {
        return reclamoDAO.getReclamosByTipo(idTipoReclamo).stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }

 // Método para obtener reclamos filtrados por estado
    public List<ReclamoView> obtenerReclamosPorEstado(Estado estado) {
        return reclamoDAO.getReclamosByEstado(estado).stream()
                .map(Reclamo::toView)
                .collect(Collectors.toList());
    }
    
    
    public List<ReclamoView> filtrarReclamosPorFecha(String documentoUsuario, boolean masRecientes) {
        List<Reclamo> reclamos = reclamoRepository.findByUsuarioDocumento(documentoUsuario);

        // Filtrar por más recientes o más antiguos
        return reclamos.stream()
                .sorted((r1, r2) -> masRecientes
                        ? r2.getFecha().compareTo(r1.getFecha()) // Más recientes primero
                        : r1.getFecha().compareTo(r2.getFecha())) // Más antiguos primero
                .map(Reclamo::toView) // Convertir a ReclamoView
                .collect(Collectors.toList());
    }
    
    
    // Método de agregar reclamo adaptado para recibir parámetros individuales, no ReclamoView

    public int agregarReclamoConUnidad(int codigoEdificio, String pisoUnidad, String numeroUnidad, 
    	    String documentoPersona, String ubicacion, String descripcion, 
    	    int idTipoReclamo) throws PersonaException, EdificioException, UnidadException, ReclamoException {

    	    Persona persona = personaDAO.getPersonaById(documentoPersona)
    	        .orElseThrow(() -> new PersonaException("Persona no encontrada"));

    	    Edificio edificio = edificioDAO.getEdificioById(codigoEdificio)
    	        .orElseThrow(() -> new EdificioException("Edificio no encontrado"));

    	    Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigoEdificio, pisoUnidad, numeroUnidad)
    	        .orElseThrow(() -> new UnidadException("Unidad no encontrada"));

    	    TipoReclamo tipoReclamo = tipoReclamoDAO.getTipoReclamoById(idTipoReclamo)
    	        .orElseThrow(() -> new ReclamoException("Tipo de reclamo no encontrado"));

    	    // Set 'detalleEstado' as null by default upon creation
    	    Reclamo reclamo = new Reclamo(persona, edificio, ubicacion, descripcion, unidad, tipoReclamo, null);
    	    reclamoDAO.agregarReclamo(reclamo);

    	    return reclamo.getNumero();
    	}


    public int agregarReclamoSinUnidad(int codigoEdificio, String documentoPersona, String ubicacion, 
    	    String descripcion, int idTipoReclamo) throws PersonaException, EdificioException, ReclamoException {

    	    Persona persona = personaDAO.getPersonaById(documentoPersona)
    	        .orElseThrow(() -> new PersonaException("Persona no encontrada"));

    	    Edificio edificio = edificioDAO.getEdificioById(codigoEdificio)
    	        .orElseThrow(() -> new EdificioException("Edificio no encontrado"));

    	    TipoReclamo tipoReclamo = tipoReclamoDAO.getTipoReclamoById(idTipoReclamo)
    	        .orElseThrow(() -> new ReclamoException("Tipo de reclamo no encontrado"));

    	    Reclamo reclamo = new Reclamo(persona, edificio, ubicacion, descripcion, null, tipoReclamo, null);
    	    reclamoDAO.agregarReclamo(reclamo);

    	    return reclamo.getNumero();
    	}

    

    // Método de actualización que usa parámetros individuales, no ReclamoView
    public void actualizarReclamo(int idReclamo, String ubicacion, String descripcion) throws ReclamoException {
        Reclamo reclamoExistente = reclamoDAO.getReclamoById(idReclamo)
        		.orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));
        reclamoExistente.setDescripcion(descripcion);
        reclamoExistente.setUbicacion(ubicacion);
        reclamoDAO.actualizarReclamo(reclamoExistente);
        System.out.println("Reclamo actualizado correctamente.");
    }

    public void eliminarReclamo(int idReclamo) throws ReclamoException {
        Reclamo reclamo = reclamoDAO.getReclamoById(idReclamo)
        		.orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));
        reclamoDAO.eliminarReclamo(reclamo.getNumero());
        System.out.println("Reclamo eliminado correctamente.");
    }

    public void cambiarEstado(int idReclamo, Estado nuevoEstado, String detalleEstado) throws ReclamoException {
        // Obtener el reclamo desde la base de datos
        Reclamo reclamo = reclamoDAO.getReclamoById(idReclamo)
                .orElseThrow(() -> new ReclamoException("Reclamo no encontrado."));

        // Validar si el estado actual es "terminado"
        if (reclamo.getEstado() == Estado.terminado) {
            throw new ReclamoException("No se puede cambiar el estado de un reclamo que ya está terminado.");
        }

        // Actualizar estado y detalle del estado
        reclamo.cambiarEstado(nuevoEstado);
        reclamo.setDetalleEstado(detalleEstado);

        // Guardar los cambios
        reclamoDAO.actualizarReclamo(reclamo);
    }


    
    public Optional<Reclamo> obtenerReclamoEntityPorId(int idReclamo) {
        return reclamoDAO.getReclamoById(idReclamo);
    }

    public List<ReclamoView> obtenerReclamosAreasComunesPorUsuario(String documento) throws ReclamoException {
        List<Edificio> edificios = edificioDAO.findEdificiosByUsuario(documento);
        List<Reclamo> reclamos = new ArrayList<>();
        for (Edificio edificio : edificios) {
            // Asumiendo que reclamoDAO tiene un método para buscar reclamos sin unidad por edificio
            reclamos.addAll(reclamoDAO.getReclamosSinUnidadByEdificio(edificio.getCodigo()));
        }
        return reclamos.stream().map(Reclamo::toView).collect(Collectors.toList());
    }
    
    public List<ReclamoView> obtenerReclamosAreasComunes() {
        return reclamoDAO.getReclamosAreasComunes().stream()
               .map(Reclamo::toView)
               .collect(Collectors.toList());
    }

    public boolean usuarioPuedeAccederAlReclamo(Reclamo reclamo, String documentoUsuario) throws UnidadException {
        Unidad unidad = reclamo.getUnidad();

        if (unidad == null) {
            // Si el reclamo no tiene unidad asociada, no es accesible
            throw new UnidadException("El reclamo no tiene una unidad asociada.");
        }

        // Validar si el usuario es uno de los inquilinos de la unidad
        if (unidad.getInquilinos().stream().anyMatch(inquilino -> inquilino.getDocumento().equals(documentoUsuario))) {
            return true;
        }

        // Validar si el usuario es uno de los dueños y no hay inquilinos
        if (unidad.getDuenios().stream().anyMatch(duenio -> duenio.getDocumento().equals(documentoUsuario))) {
            return unidad.getInquilinos().isEmpty(); // Solo puede acceder si no hay inquilinos
        }

        return false; // Usuario no tiene acceso
    }


}