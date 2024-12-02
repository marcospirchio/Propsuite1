package com.example.AdministracionEdificiosTpApis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.AdministracionEdificiosTpApis.data.RolRepository;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public boolean validarRol(String nombreRol) {
        return rolRepository.findByNombre(nombreRol).isPresent();
    }
}
