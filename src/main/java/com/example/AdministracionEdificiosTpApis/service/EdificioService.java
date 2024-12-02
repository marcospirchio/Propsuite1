package com.example.AdministracionEdificiosTpApis.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.AdministracionEdificiosTpApis.data.EdificioDAO;
import com.example.AdministracionEdificiosTpApis.exceptions.EdificioException;
import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.views.EdificioView;
import com.example.AdministracionEdificiosTpApis.views.PersonaView;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;

@Service
public class EdificioService {

    @Autowired
    private EdificioDAO edificioDAO;

    // Método que devuelve una lista de vistas de todos los edificios
    public List<EdificioView> obtenerTodosLosEdificios() {
        return edificioDAO.getAllEdificios().stream()
                .map(Edificio::toView)
                .collect(Collectors.toList());
    }

    // Método que obtiene un edificio por ID y lo devuelve como vista
    public EdificioView obtenerEdificioPorId(int id) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(id)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        return edificio.toView();
    }

    public void agregarEdificio(Edificio edificio) throws EdificioException {
        try {
            edificioDAO.agregarEdificio(edificio);
            System.out.println("El edificio fue cargado correctamente.");
        } catch (Exception e) {
            throw new EdificioException("Ocurrió un error al agregar el edificio: " + e.getMessage());
        }
    }

    public void actualizarEdificio(Edificio edificio) throws EdificioException {
        Edificio edificioExistente = edificioDAO.getEdificioById(edificio.getCodigo())
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        edificio.setUnidades(edificioExistente.getUnidades()); // Mantiene las unidades existentes
        try {
            edificioDAO.actualizarEdificio(edificio);
            System.out.println("El edificio fue actualizado correctamente.");
        } catch (Exception e) {
            throw new EdificioException("Ocurrió un error al actualizar el edificio: " + e.getMessage());
        }
    }

    public void eliminarEdificio(int codigoEdificio) throws EdificioException {
        edificioDAO.getEdificioById(codigoEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado.")); // Verifica existencia
        try {
            edificioDAO.eliminarEdificio(codigoEdificio);
            System.out.println("El edificio fue eliminado correctamente.");
        } catch (Exception e) {
            throw new EdificioException("Ocurrió un error al eliminar el edificio: " + e.getMessage());
        }
    }

    public List<PersonaView> obtenerHabilitadosPorEdificio(int idEdificio) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(idEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        Set<Persona> habilitados = edificio.habilitados();
        if (habilitados.isEmpty()) {
            throw new EdificioException("No se encontraron habilitados en el edificio.");
        }
        return habilitados.stream().map(Persona::toView).collect(Collectors.toList());
    }

    public List<PersonaView> obtenerDueniosPorEdificio(int idEdificio) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(idEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        Set<Persona> duenios = edificio.duenios();
        if (duenios.isEmpty()) {
            throw new EdificioException("No se encontraron dueños en el edificio.");
        }
        return duenios.stream().map(Persona::toView).collect(Collectors.toList());
    }

    public List<PersonaView> obtenerHabitantesPorEdificio(int idEdificio) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(idEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        Set<Persona> habitantes = edificio.habitantes();
        if (habitantes.isEmpty()) {
            throw new EdificioException("No se encontraron habitantes en el edificio.");
        }
        return habitantes.stream().map(Persona::toView).collect(Collectors.toList());
    }

    public List<UnidadView> obtenerTodasLasUnidadesPorEdificio(int idEdificio) throws EdificioException {
        Edificio edificio = edificioDAO.getEdificioById(idEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        List<Unidad> unidades = edificio.getUnidades();
        if (unidades.isEmpty()) {
            throw new EdificioException("No se encontraron unidades en el edificio.");
        }
        return unidades.stream().map(Unidad::toView).collect(Collectors.toList());
    }
    
    public List<PersonaView> obtenerInquilinosPorEdificio(int idEdificio) throws EdificioException {
        // Obtener el edificio por su ID
        Edificio edificio = edificioDAO.getEdificioById(idEdificio)
                .orElseThrow(() -> new EdificioException("Edificio no encontrado."));
        
        // Obtener las unidades asociadas al edificio
        List<Unidad> unidades = edificio.getUnidades();
        if (unidades.isEmpty()) {
            throw new EdificioException("No se encontraron unidades asociadas a este edificio.");
        }

        // Extraer los inquilinos de cada unidad y eliminar duplicados
        Set<Persona> inquilinos = new HashSet<>();
        for (Unidad unidad : unidades) {
            inquilinos.addAll(unidad.getInquilinos());
        }

        // Convertir a vistas de Persona y devolver el resultado
        return inquilinos.stream().map(Persona::toView).collect(Collectors.toList());
    }

}