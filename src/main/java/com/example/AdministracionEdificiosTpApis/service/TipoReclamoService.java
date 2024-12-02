package com.example.AdministracionEdificiosTpApis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.AdministracionEdificiosTpApis.data.TipoReclamoDAO;
import com.example.AdministracionEdificiosTpApis.data.TipoReclamoRepository;
import com.example.AdministracionEdificiosTpApis.exceptions.TipoReclamoException;
import com.example.AdministracionEdificiosTpApis.model.TipoReclamo;

@Service
public class TipoReclamoService {

    @Autowired
    private TipoReclamoDAO tipoReclamoDAO;
    
    @Autowired
    private TipoReclamoRepository tipoReclamoRepository;

    public List<TipoReclamo> obtenerTodosLosTiposReclamos() {
        return tipoReclamoDAO.getAllTiposReclamos();
    }

    public TipoReclamo obtenerTipoReclamoPorId(int id) throws TipoReclamoException {
        return tipoReclamoDAO.getTipoReclamoById(id)
                .orElseThrow(() -> new TipoReclamoException("Tipo de reclamo no encontrado."));
    }

    @Transactional
    public TipoReclamo agregarTipoReclamo(TipoReclamo tipoReclamo) throws TipoReclamoException {
        try {
            return tipoReclamoRepository.saveAndFlush(tipoReclamo);
        } catch (Exception e) {
            throw new TipoReclamoException("Ocurrió un error al agregar el tipo de reclamo: " + e.getMessage());
        }
    }


    public void actualizarTipoReclamo(TipoReclamo tipoReclamo) throws TipoReclamoException {
        if (!tipoReclamoDAO.getTipoReclamoById(tipoReclamo.getId()).isPresent()) {
            throw new TipoReclamoException("Tipo de reclamo no encontrado.");
        }
        try {
            tipoReclamoDAO.actualizarTipoReclamo(tipoReclamo);
            System.out.println("El tipo de reclamo fue actualizado correctamente.");
        } catch (Exception e) {
            throw new TipoReclamoException("Ocurrió un error al actualizar el tipo de reclamo: " + e.getMessage());
        }
    }

    public void eliminarTipoReclamo(int idTipoReclamo) throws TipoReclamoException {
        if (!tipoReclamoDAO.getTipoReclamoById(idTipoReclamo).isPresent()) {
            throw new TipoReclamoException("Tipo de reclamo no encontrado.");
        }
        try {
            tipoReclamoDAO.eliminarTipoReclamo(idTipoReclamo);
            System.out.println("El tipo de reclamo fue eliminado correctamente.");
        } catch (Exception e) {
            throw new TipoReclamoException("Ocurrió un error al eliminar el tipo de reclamo: " + e.getMessage());
        }
    }

    public void mostrarTipoReclamo(int idTipoReclamo) throws TipoReclamoException {
        TipoReclamo tipoReclamo = obtenerTipoReclamoPorId(idTipoReclamo);
        System.out.println(tipoReclamo);
    }
}
