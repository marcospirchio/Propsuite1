package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.AdministracionEdificiosTpApis.model.TipoReclamo;

@Repository
public class TipoReclamoDAO {
	
	//-------------REPOSITORIO-------------
	
    @Autowired
    private TipoReclamoRepository tipoReclamoRepository;
	
  
    
	//-------------CRUD-------------
	
   

    public void actualizarTipoReclamo(TipoReclamo tipoReclamo) {
        tipoReclamoRepository.save(tipoReclamo);
    }

    public void eliminarTipoReclamo(int idTipoReclamo) {
        tipoReclamoRepository.deleteById(idTipoReclamo);
    }
    
	//-------------METODOS-------------

    public List<TipoReclamo> getAllTiposReclamos() {
        return tipoReclamoRepository.findAll();
    }

    public Optional<TipoReclamo> getTipoReclamoById(int id) {
        return tipoReclamoRepository.findById(id);
    }
}
