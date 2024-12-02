package com.example.AdministracionEdificiosTpApis.data;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Reclamo;
import com.example.AdministracionEdificiosTpApis.model.Unidad;
import com.example.AdministracionEdificiosTpApis.views.Estado;

@Repository
public class ReclamoDAO {
	
	//-------------REPOSITORIO-------------
	
	@Autowired
    private ReclamoRepository reclamoRepository;
	
	//-------------CRUD-------------
	
	public void agregarReclamo(Reclamo reclamo) {
        reclamoRepository.save(reclamo);
    }

    public void actualizarReclamo(Reclamo reclamo) {
        reclamoRepository.save(reclamo);
    }

    public void eliminarReclamo(int idReclamo) {
        reclamoRepository.deleteById(idReclamo);
    }
	
	//-------------METODOS-------------
	
    public List<Reclamo> getAllReclamos() {
        return reclamoRepository.findAll();
    }

    public Optional<Reclamo> getReclamoById(int idReclamo) {
        return reclamoRepository.findById(idReclamo);
    }
    
    // Método para obtener reclamos por edificio
    public List<Reclamo> getReclamosByEdificio(Edificio edificio) {
        return reclamoRepository.findByEdificio(edificio);
    }

    // Método para obtener reclamos por unidad específica
    public List<Reclamo> getReclamosByUnidad(Unidad unidad) {
        return reclamoRepository.findByUnidad(unidad);
    }

    public List<Reclamo> getReclamosByUsuario(Persona persona) {
        return reclamoRepository.findByUsuario(persona);
    }

    // Método para obtener reclamos por persona
    public List<Reclamo> getReclamosByPersona(Persona persona) {
        return reclamoRepository.findByUsuario(persona);
    }
    
    public List<Reclamo> getReclamosByTipo(int idTipoReclamo) {
        return reclamoRepository.findByTipoReclamoId(idTipoReclamo);
    }
    
    public List<Reclamo> getReclamosByEstado(Estado estado) {
        return reclamoRepository.findByEstado(estado);
    }
    
    public List<Reclamo> getReclamosSinUnidadByEdificio(int codigoEdificio) {
        // Implementación para buscar reclamos sin unidad que pertenecen a un edificio específico
        return reclamoRepository.findAll().stream()
            .filter(reclamo -> reclamo.getEdificio().getCodigo() == codigoEdificio && reclamo.getUnidad() == null)
            .collect(Collectors.toList());
    }
    
    public List<Reclamo> getReclamosMasRecientesDeUsuario(Persona usuario) {
        return reclamoRepository.findByUsuario(usuario).stream()
                .sorted(Comparator.comparing(Reclamo::getFecha).reversed())
                .collect(Collectors.toList());
    }

    // Método para obtener reclamos más antiguos del usuario actual
    public List<Reclamo> getReclamosMasAntiguosDeUsuario(Persona usuario) {
        return reclamoRepository.findByUsuario(usuario).stream()
                .sorted(Comparator.comparing(Reclamo::getFecha))
                .collect(Collectors.toList());
    }
    
    
    public void cambiarEstado(Reclamo reclamo, Estado estado, String detalleEstado) {
        reclamo.setEstado(estado);
        reclamo.setDetalleEstado(detalleEstado);
        reclamoRepository.save(reclamo);
    }
    
    public List<Reclamo> getReclamosAreasComunes() {
        return reclamoRepository.findByUnidadIsNull();
    }

}


