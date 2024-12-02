package com.example.AdministracionEdificiosTpApis.data;

import com.example.AdministracionEdificiosTpApis.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByNombreUsuario(String nombreUsuario); // Busca por nombre de usuario
    Optional<Usuario> findByPersonaDocumento(String documento); // Busca usuario por documento de la persona
    
}