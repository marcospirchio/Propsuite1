package com.example.AdministracionEdificiosTpApis.data;

import com.example.AdministracionEdificiosTpApis.model.Rol;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    Optional<Rol> findByNombre(String nombre); // Define la consulta derivada
    Optional<Rol> findById(Long id);
}
