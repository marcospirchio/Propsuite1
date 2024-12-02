package com.example.AdministracionEdificiosTpApis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import com.example.AdministracionEdificiosTpApis.data.*;
import com.example.AdministracionEdificiosTpApis.exceptions.EdificioException;
import com.example.AdministracionEdificiosTpApis.model.*;
import com.example.AdministracionEdificiosTpApis.views.Estado;

import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

@SpringBootApplication

public class AdministracionEdificiosTpApisApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(AdministracionEdificiosTpApisApplication.class, args);
    }
    @Autowired
    UnidadRepository unidadRepository;
    @Autowired
    EdificioRepository edificioRepository;
    @Autowired
    PersonaRepository personaRepository;
    @Autowired
    ReclamoRepository reclamoRepository;
    @Autowired
    TipoReclamoRepository tipoReclamoRepository;
    @Autowired
    ImagenRepository imagenRepository;
    
    @Autowired
    UnidadDAO unidadDAO;
    @Autowired
    EdificioDAO edificioDAO;
    @Autowired
    PersonaDAO personaDAO;
    @Autowired
    ReclamoDAO reclamoDAO;
    @Autowired
    TipoReclamoDAO tipoReclamoDAO;
    @Autowired
    ImagenDAO imagenDAO;
  
    
    
    
    @Override
    public void run(String... args) throws EdificioException {

    }
    
}


