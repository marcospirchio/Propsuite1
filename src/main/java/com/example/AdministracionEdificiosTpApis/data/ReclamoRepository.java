package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AdministracionEdificiosTpApis.views.Estado;
import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Reclamo;
import com.example.AdministracionEdificiosTpApis.model.Unidad;

public interface ReclamoRepository extends JpaRepository<Reclamo, Integer> {
    List<Reclamo> findByEdificio(Edificio edificio);

    List<Reclamo> findByUnidad(Unidad unidad);

    List<Reclamo> findByUsuario(Persona persona);
    
    List<Reclamo> findByEstado(Estado estado); // para filtrarReclamos (reclamoDAO)
    
    List<Reclamo> findByTipoReclamoId(int idTipoReclamo);
    
    List<Reclamo> findByUnidadIsNull();
    
    List<Reclamo> findByUsuarioDocumento(String documento);
    
}
