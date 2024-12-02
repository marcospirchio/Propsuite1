package com.example.AdministracionEdificiosTpApis.data;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import java.util.Set;
//import org.hibernate.mapping.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.AdministracionEdificiosTpApis.model.Edificio;
import com.example.AdministracionEdificiosTpApis.model.Persona;

@Repository
public class EdificioDAO {
	
	//-------------REPOSITORIO-------------
	
	@Autowired
	private EdificioRepository edificioRepository;

	//-------------CRUD-------------
	
	public void agregarEdificio(Edificio edificio) {
        edificioRepository.save(edificio);
    }

    public void actualizarEdificio(Edificio edificio) {
        edificioRepository.save(edificio);
    }

    public void eliminarEdificio(int codigoEdificio) {
        edificioRepository.deleteById(codigoEdificio);
    }
	
	//-------------METODOS-------------

    public List<Edificio> getAllEdificios() {
        return edificioRepository.findAll();
    }

    public Optional<Edificio> getEdificioById(int id) {
        return edificioRepository.findById(id);
    }
    
    public List<Edificio> findEdificiosByUsuario(String documentoUsuario) {
        return getAllEdificios().stream()
            .filter(edificio -> {
                Set<Persona> personas = edificio.habilitados(); 
                return personas.stream().anyMatch(persona -> persona.getDocumento().equals(documentoUsuario));
            })
            .collect(Collectors.toList());
    }

}
