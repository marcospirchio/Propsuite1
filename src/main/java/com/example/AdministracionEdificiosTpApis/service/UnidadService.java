package com.example.AdministracionEdificiosTpApis.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.AdministracionEdificiosTpApis.data.EdificioDAO;
import com.example.AdministracionEdificiosTpApis.data.PersonaDAO;
import com.example.AdministracionEdificiosTpApis.data.UnidadDAO;
import com.example.AdministracionEdificiosTpApis.data.UnidadRepository;
import com.example.AdministracionEdificiosTpApis.exceptions.EdificioException;
import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.exceptions.UnidadException;
import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.views.PersonaView;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;

@Service
public class UnidadService {

    @Autowired
    private UnidadDAO unidadDAO;
    @Autowired
    private UnidadRepository unidadRepository;

    @Autowired
    private EdificioDAO edificioDAO;

    @Autowired
    private PersonaDAO personaDAO;

    public List<UnidadView> obtenerTodasLasUnidades() {
        return unidadDAO.getAllUnidades().stream()
                .map(Unidad::toView)
                .collect(Collectors.toList());
    }

    public UnidadView obtenerUnidadPorId(int id) throws UnidadException {
        return unidadDAO.getUnidadById(id)
                .map(Unidad::toView)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada."));
    }
    
    public Unidad obtenerUnidadPorPisoNumero(int codigo, String piso, String numero) throws UnidadException {
        return unidadRepository.findUnidadByCodigoPisoNumero(codigo, piso, numero)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada."));
    }


    public void agregarUnidad(Unidad unidad, int idEdificio) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(idEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));

        // Verificar si ya existe una unidad con el mismo piso y número en el edificio
        boolean existe = edificio.getUnidades().stream()
                .anyMatch(u -> u.getPiso().equals(unidad.getPiso()) && u.getNumero().equals(unidad.getNumero()));

        if (existe) {
            throw new EdificioException("Ya existe una unidad con este piso y número en el edificio.");
        }

        unidad.setEdificio(edificio); // Relacionar la unidad con el edificio
        unidadDAO.agregarUnidad(unidad); // Persistir la unidad
        edificio.agregarUnidad(unidad); // Actualizar la relación bidireccional
        System.out.println("Unidad agregada al edificio " + idEdificio);
    }


    public void actualizarUnidad(Unidad unidad) throws UnidadException {
        // Verificar si la unidad existe
        Unidad unidadExistente = unidadDAO.getUnidadById(unidad.getId())
                .orElseThrow(() -> new UnidadException("Unidad no encontrada."));

        // Obtener el edificio asociado a la unidad existente
        Edificio edificio = unidadExistente.getEdificio();
        if (edificio == null) {
            throw new UnidadException("La unidad no tiene un edificio asociado.");
        }

        // Verificar si ya existe otra unidad con el mismo piso y número en el mismo edificio
        boolean existeDuplicado = edificio.getUnidades().stream()
                .anyMatch(u -> u.getPiso().equals(unidad.getPiso()) &&
                               u.getNumero().equals(unidad.getNumero()) &&
                               u.getId() != unidad.getId()); // Comparar usando '!=' para primitivos

        if (existeDuplicado) {
            throw new UnidadException("Ya existe otra unidad con este piso y número en el edificio.");
        }

        // Actualizar los campos de la unidad existente
        unidadExistente.setPiso(unidad.getPiso());
        unidadExistente.setNumero(unidad.getNumero());
        unidadExistente.setHabitado(unidad.getEstaHabitado());

        // Persistir los cambios
        unidadDAO.actualizarUnidad(unidadExistente);
        System.out.println("La unidad fue actualizada correctamente.");
    }



    public void eliminarUnidad(int idUnidad) throws UnidadException {
        obtenerUnidadPorId(idUnidad); // Verifica existencia
        unidadDAO.eliminarUnidad(idUnidad);
        System.out.println("La unidad fue eliminada correctamente.");
    }

    public List<PersonaView> obtenerDueniosPorUnidad(int codigo, String piso, String numero) throws UnidadException {
        System.out.println("Obteniendo dueños para unidad: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'");
        String pisoNormalizado = piso.trim().toLowerCase(); // Normalizar el formato
        String numeroNormalizado = numero.trim().toLowerCase(); // Normalizar el formato

        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, pisoNormalizado, numeroNormalizado)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'"));
        System.out.println("Dueños encontrados para la unidad: " + unidad.getDuenios());
        return unidad.getDuenios().stream()
                .map(Persona::toView)
                .collect(Collectors.toList());
    }



    public List<PersonaView> obtenerInquilinosPorUnidad(int codigo, String piso, String numero) throws UnidadException {
        System.out.println("Obteniendo inquilinos para unidad: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'");
        String pisoNormalizado = piso.trim().toLowerCase(); // Normalizar el formato
        String numeroNormalizado = numero.trim().toLowerCase(); // Normalizar el formato

        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, pisoNormalizado, numeroNormalizado)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'"));
        System.out.println("Inquilinos encontrados para la unidad: " + unidad.getInquilinos());
        return unidad.getInquilinos().stream()
                .map(Persona::toView)
                .collect(Collectors.toList());
    }



    public void transferirUnidad(int codigo, String piso, String numero, String idPersona) throws UnidadException, PersonaException {
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso, numero)
                .orElseThrow(() -> new UnidadException("Unidad no encontrada."));
        Persona nuevoDuenio = personaDAO.getPersonaById(idPersona)
                .orElseThrow(() -> new PersonaException("Persona no encontrada."));
        
        // Transfiere la unidad al nuevo dueño
        unidad.transferir(nuevoDuenio);
        
        // Limpia la lista de inquilinos
        unidad.getInquilinos().clear();
        
        // Marca la unidad como no habitada
        unidad.setHabitado(false);

        // Actualiza la unidad en la base de datos
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("Unidad transferida al dueño " + nuevoDuenio.getDocumento() + " y todos los inquilinos han sido eliminados.");
    }


    public void agregarDuenioUnidad(int codigo, String piso, String numero, String idPersona) throws UnidadException, PersonaException {
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso, numero)
        		.orElseThrow(() -> new UnidadException("Unidad no encontrado."));
        Persona duenio = personaDAO.getPersonaById(idPersona)
                .orElseThrow(() -> new PersonaException("Persona no encontrada"));
        unidad.agregarDuenio(duenio);
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("Dueño agregado a la unidad " + unidad.getId());
    }

    public void alquilarUnidad(int codigo, String piso, String numero, String idInquilino) throws UnidadException, PersonaException {
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso, numero)
        		.orElseThrow(() -> new UnidadException("Unidad no encontrado."));
        Persona inquilino = personaDAO.getPersonaById(idInquilino)
                .orElseThrow(() -> new PersonaException("Persona no encontrada"));
        unidad.alquilar(inquilino);
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("Unidad " + unidad.getId() + " alquilada por la persona " + inquilino.getDocumento());
    }

    public void agregarInquilinoUnidad(int codigo, String piso, String numero, String idPersona) throws UnidadException, PersonaException {
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso, numero)
        		.orElseThrow(() -> new UnidadException("Unidad no encontrado."));
        Persona inquilino = personaDAO.getPersonaById(idPersona)
                .orElseThrow(() -> new PersonaException("Persona no encontrada"));
        unidad.agregarInquilino(inquilino);
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("Inquilino agregado a la unidad " + unidad.getId());
    }

    public void liberarUnidad(int codigo, String piso, String numero) throws UnidadException {
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso, numero)
        		.orElseThrow(() -> new UnidadException("Unidad no encontrado."));
        unidad.liberar();
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("La unidad " + unidad.getId() + " ha sido liberada.");
    }
    
    public void habitarUnidad(int codigo, String piso, String numero, String documento) throws UnidadException, PersonaException {
        Unidad unidad = unidadDAO.getUnidadByCodigoPisoNumero(codigo, piso.trim().toLowerCase(), numero.trim().toLowerCase())
                .orElseThrow(() -> new UnidadException("Unidad no encontrada: código=" + codigo + ", piso='" + piso + "', número='" + numero + "'"));

        Persona persona = personaDAO.getPersonaById(documento)
                .orElseThrow(() -> new PersonaException("Persona no encontrada con documento: " + documento));

        if (unidad.getEstaHabitado()) {
            throw new UnidadException("La unidad ya está habitada.");
        }

        unidad.setHabitado(true); // Marcar la unidad como habitada
        unidad.agregarInquilino(persona); // Asociar la persona como habitante (agregarla a los inquilinos)

        unidadDAO.actualizarUnidad(unidad);
        System.out.println("La unidad " + unidad.getId() + " ha sido habitada por " + persona.getNombre());
    }


    
    public List<UnidadView> obtenerUnidadesAlquiladasPorEdificio(int codigoEdificio) throws EdificioException {
        // Obtener el edificio por su código
        Edificio edificio = edificioDAO.getEdificioById(codigoEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado con código: " + codigoEdificio));
        
        // Filtrar unidades alquiladas
        List<UnidadView> unidadesAlquiladas = edificio.getUnidades().stream()
                .filter(unidad -> unidad.getEstaHabitado() && !tienePropietariosEnInquilinos(unidad))
                .map(Unidad::toView)
                .collect(Collectors.toList());
        
        return unidadesAlquiladas;
    }

    

    public void eliminarInquilinoDeUnidad(int codigo, String piso, String numero, String dniInquilino) throws UnidadException, PersonaException {
        Unidad unidad = obtenerUnidadPorPisoNumero(codigo, piso, numero);
        Persona inquilino = personaDAO.getPersonaById(dniInquilino)
                .orElseThrow(() -> new PersonaException("Persona no encontrada con DNI: " + dniInquilino));
        if (!unidad.getInquilinos().removeIf(p -> p.getDocumento().equals(dniInquilino))) {
            throw new PersonaException("Inquilino no encontrado en la unidad.");
        }
        if (unidad.getInquilinos().isEmpty()) {
            unidad.setHabitado(false);
        }
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("Inquilino eliminado correctamente de la unidad.");
    }

    public void eliminarDuenioDeUnidad(int codigo, String piso, String numero, String dniDuenio) throws UnidadException, PersonaException {
        Unidad unidad = obtenerUnidadPorPisoNumero(codigo, piso, numero);
        Persona duenio = personaDAO.getPersonaById(dniDuenio)
                .orElseThrow(() -> new PersonaException("Persona no encontrada con DNI: " + dniDuenio));
        if (!unidad.getDuenios().removeIf(p -> p.getDocumento().equals(dniDuenio))) {
            throw new PersonaException("Dueño no encontrado en la unidad.");
        }
        unidadDAO.actualizarUnidad(unidad);
        System.out.println("Dueño eliminado correctamente de la unidad.");
    }

    
    
    // Método auxiliar para verificar si algún inquilino es dueño tambien
    private boolean tienePropietariosEnInquilinos(Unidad unidad) {
        for (Persona inquilino : unidad.getInquilinos()) {
            if (unidad.getDuenios().contains(inquilino)) {
                return true; // Hay coincidencia, no es alquilada
            }
        }
        return false; // Ningún inquilino es dueño, está alquilada
    }

}