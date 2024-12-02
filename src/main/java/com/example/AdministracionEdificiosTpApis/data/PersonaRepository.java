package com.example.AdministracionEdificiosTpApis.data;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AdministracionEdificiosTpApis.model.Persona;

public interface PersonaRepository extends JpaRepository<Persona, String> {

}

