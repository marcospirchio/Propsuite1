package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.AdministracionEdificiosTpApis.model.Usuario;

@Repository
public class UsuarioDAO {

    //-------------REPOSITORIO-------------
    @Autowired
    private UsuarioRepository usuarioRepository;

    //-------------CRUD-------------
    public void agregarUsuario(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

    public void actualizarUsuario(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(int id) {
        usuarioRepository.deleteById(id);
    }

    //-------------MÉTODOS-------------
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUsuarioPorId(int id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> getUsuarioPorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }
    public Optional<Usuario> getUsuarioPorPersonaDocumento(String documento) {
        return usuarioRepository.findByPersonaDocumento(documento);
    }

   
    
}
