package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Usuario;

@Repository
public class PersonaDAO {
	
	//-------------REPOSITORIO-------------
	
	@Autowired
    private PersonaRepository personaRepository;
	
	@Autowired
    private UsuarioRepository usuarioRepository;
	//-------------CRUD-------------
	
	 public void agregarPersona(Persona persona) {
	    personaRepository.save(persona);
    }

    public void actualizarPersona(Persona persona) {
        personaRepository.save(persona);
    }

    public void eliminarPersona(String documento) {
        personaRepository.deleteById(documento);
    }
	
	//-------------METODOS-------------
	
    public List<Persona> getAllPersonas() {
        return personaRepository.findAll();
    }

    public Optional<Persona> getPersonaById(String documento) {
        return personaRepository.findById(documento);
    }
    
    public boolean existePorId(String documento) {
        return personaRepository.existsById(documento);
    }
    
    public Optional<Persona> getPersonaPorUsername(String username) {
        return usuarioRepository.findByNombreUsuario(username)
                .map(usuario -> usuario.getPersona());
    }
    
}

