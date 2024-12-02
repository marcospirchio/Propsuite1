package com.example.AdministracionEdificiosTpApis.data;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AdministracionEdificiosTpApis.model.Edificio;

public interface EdificioRepository extends JpaRepository<Edificio, Integer> {

}

