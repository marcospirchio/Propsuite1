package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;

import com.example.AdministracionEdificiosTpApis.exceptions.PersonaException;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Unidad;

import jakarta.persistence.NoResultException;

@Repository
public class UnidadDAO {
	
	//-------------REPOSITORIO-------------
	
	@Autowired
    private UnidadRepository unidadRepository;
	
	@Autowired
    private PersonaDAO personaDAO;
	
	@PersistenceContext
	private EntityManager entityManager;

	//-------------CRUD-------------
	
	public void agregarUnidad(Unidad unidad) {
        unidadRepository.save(unidad);
    }

    public void actualizarUnidad(Unidad unidad) {
        unidadRepository.save(unidad);
    }

    public void eliminarUnidad(int idUnidad) {
        unidadRepository.deleteById(idUnidad);
    }
	
	//-------------METODOS-------------
	
    public List<Unidad> getAllUnidades() {
        return unidadRepository.findAll();
    }

    public Optional<Unidad> getUnidadById(int id) {
        return unidadRepository.findById(id);
    }
    
    public List<Unidad> getUnidadesByDuenio(Persona duenio) {
        return unidadRepository.findByDueniosContaining(duenio);
    }

    public List<Unidad> getUnidadesByInquilino(Persona inquilino) {
        return unidadRepository.findByInquilinosContaining(inquilino);
    }
    
    public List<Unidad> getUnidadesPorDuenio(Persona duenio) {
        return unidadRepository.findByDueniosContains(duenio);
    }

    public List<Unidad> getUnidadesPorInquilino(Persona inquilino) {
        return unidadRepository.findByInquilinosContains(inquilino);
    }
    
    public List<Unidad> getUnidadesDondeEsDueno(String documentoDuenio) throws PersonaException {
        Persona duenio = personaDAO.getPersonaById(documentoDuenio)
                .orElseThrow(() -> new PersonaException("Dueño no encontrado."));
        return unidadRepository.findByDueniosContaining(duenio);
    }

    public List<Unidad> getUnidadesDondeEsInquilino(String documentoInquilino) throws PersonaException {
        Persona inquilino = personaDAO.getPersonaById(documentoInquilino)
                .orElseThrow(() -> new PersonaException("Inquilino no encontrado."));
        return unidadRepository.findByInquilinosContaining(inquilino);
    }
    
    public Optional<Unidad> getUnidadByCodigoPisoNumero(int codigo, String piso, String numero) {
        System.out.println("Buscando unidad con código=" + codigo + ", piso='" + piso + "', número='" + numero + "'");
        piso = piso.trim().toLowerCase();
        numero = numero.trim().toLowerCase();

        Optional<Unidad> unidad = unidadRepository.findByEdificioCodigoAndPisoAndNumero(codigo, piso, numero);
        if (unidad.isEmpty()) {
            System.out.println("No se encontró ninguna unidad que coincida con los parámetros.");
        } else {
            System.out.println("Unidad encontrada: " + unidad.get());
        }
        return unidad;
    }

    



} 
