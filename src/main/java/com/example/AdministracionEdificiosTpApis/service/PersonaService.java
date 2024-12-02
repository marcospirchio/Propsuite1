package com.example.AdministracionEdificiosTpApis.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.AdministracionEdificiosTpApis.data.PersonaDAO;
import com.example.AdministracionEdificiosTpApis.data.PersonaRepository;
import com.example.AdministracionEdificiosTpApis.data.UnidadDAO;
import com.example.AdministracionEdificiosTpApis.data.UnidadRepository;
import com.example.AdministracionEdificiosTpApis.data.UsuarioDAO;
import com.example.AdministracionEdificiosTpApis.data.UsuarioRepository;
import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.model.Usuario;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;

@Service
public class PersonaService {

    @Autowired
    private PersonaDAO personaDAO;
    
    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UnidadRepository unidadRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private UnidadDAO unidadDAO;
    
    @Autowired
    private UsuarioDAO usuarioDAO;

    public List<Persona> obtenerTodasLasPersonas() {
        return personaDAO.getAllPersonas();
    }

    public Persona obtenerPersonaPorId(String documento) throws PersonaException {
        return personaDAO.getPersonaById(documento)
                .orElseThrow(() -> new PersonaException("Persona con documento " + documento + " no fue encontrada"));
    }

    public void agregarPersona(Persona persona) throws PersonaException {
        if (personaDAO.existePorId(persona.getDocumento())) {
            throw new PersonaException("La persona ya existe en el sistema.");
        }
        try {
            personaDAO.agregarPersona(persona);
            System.out.println("La persona fue cargada correctamente.");
        } catch (Exception e) {
            throw new PersonaException("Ocurrió un error al guardar la persona: " + e.getMessage());
        }
    }

    public void actualizarPersona(Persona persona) throws PersonaException {
        if (!personaDAO.existePorId(persona.getDocumento())) {
            throw new PersonaException("Persona no encontrada.");
        }
        try {
            personaDAO.actualizarPersona(persona);
            System.out.println("La persona fue actualizada correctamente.");
        } catch (Exception e) {
            throw new PersonaException("Ocurrió un error al actualizar la persona: " + e.getMessage());
        }
    }

    public void eliminarPersona(String documento) throws PersonaException {
        if (!personaDAO.existePorId(documento)) {
            throw new PersonaException("Persona no encontrada.");
        }
        try {
            personaDAO.eliminarPersona(documento);
            System.out.println("La Persona fue eliminada");
        } catch (Exception e) {
            throw new PersonaException("Ocurrió un error al eliminar la persona: " + e.getMessage());
        }
    }
    
    public List<UnidadView> misUnidades(String dni) {
        Persona persona = personaRepository.findById(dni).orElse(null);
        if (persona == null) return List.of(); // Retorna una lista vacía si la persona no existe

        // Unidades donde la persona es dueño
        List<Unidad> unidadesDueno = unidadRepository.findByDuenios(persona);
        // Unidades donde la persona es inquilino
        List<Unidad> unidadesInquilino = unidadRepository.findByInquilinos(persona);

        // Combinar ambas listas
        unidadesDueno.addAll(unidadesInquilino);

        // Convertir las unidades a vistas antes de retornar
        return unidadesDueno.stream()
                .distinct() // Eliminar duplicados en caso de que la persona sea dueño e inquilino de la misma unidad
                .map(Unidad::toView)
                .collect(Collectors.toList());
    }
    
    public List<UnidadView> obtenerMisUnidadesLogueadas(String nombreUsuario) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Persona persona = usuario.getPersona();
        List<Unidad> unidadesDueno = unidadRepository.findByDuenios(persona);
        List<Unidad> unidadesInquilino = unidadRepository.findByInquilinos(persona);

        unidadesDueno.addAll(unidadesInquilino);

        return unidadesDueno.stream()
            .distinct()
            .map(Unidad::toView)
            .collect(Collectors.toList());
    }

    public Map<String, List<UnidadView>> obtenerUnidadesPorRolLogueado(String username) throws PersonaException {
        Persona persona = personaDAO.getPersonaPorUsername(username)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado: " + username));

        List<UnidadView> duenio = unidadDAO.getUnidadesPorDuenio(persona).stream()
                .map(Unidad::toView)
                .collect(Collectors.toList());

        List<UnidadView> inquilino = unidadDAO.getUnidadesPorInquilino(persona).stream()
                .map(Unidad::toView)
                .collect(Collectors.toList());

        Map<String, List<UnidadView>> resultado = new HashMap<>();
        resultado.put("duenio", duenio);
        resultado.put("inquilino", inquilino);

        return resultado;
    }

    public List<UnidadView> obtenerUnidadesDondeSoyDuenio(String username) throws PersonaException {
        // Buscar al usuario en la base de datos
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(username)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        // Obtener las unidades donde el usuario es dueño
        List<Unidad> unidades = unidadDAO.getUnidadesPorDuenio(usuario.getPersona());

        // Convertir a UnidadView
        return unidades.stream()
                .map(unidad -> new UnidadView(
                        unidad.getId(),
                        unidad.getPiso(),
                        unidad.getNumero(),
                        unidad.getEstaHabitado(),
                        unidad.getEdificio().toView()
                ))
                .collect(Collectors.toList());
    }

    public List<UnidadView> obtenerUnidadesDondeSoyInquilino(String username) throws PersonaException {
        // Buscar al usuario en la base de datos
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(username)
                .orElseThrow(() -> new PersonaException("Usuario no encontrado en la base de datos."));

        // Obtener las unidades donde el usuario es inquilino
        List<Unidad> unidades = unidadDAO.getUnidadesPorInquilino(usuario.getPersona());

        // Convertir a UnidadView
        return unidades.stream()
                .map(unidad -> new UnidadView(
                        unidad.getId(),
                        unidad.getPiso(),
                        unidad.getNumero(),
                        unidad.getEstaHabitado(),
                        unidad.getEdificio().toView()
                ))
                .collect(Collectors.toList());
    }

    
    public void mostrarPersona(String documento) throws PersonaException {
        Persona persona = obtenerPersonaPorId(documento);
        System.out.println(persona);
    }
    
    
}