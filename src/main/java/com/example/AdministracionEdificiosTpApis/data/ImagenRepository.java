package com.example.AdministracionEdificiosTpApis.data;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.AdministracionEdificiosTpApis.model.Imagen;

public interface ImagenRepository extends JpaRepository<Imagen, Integer> {
    List<Imagen> findByReclamoNumero(int idReclamo);
    @Query("SELECT i FROM Imagen i WHERE i.reclamo.numero = :idReclamo")
    List<Imagen> findImagenesByReclamoId(@Param("idReclamo") int idReclamo);
}