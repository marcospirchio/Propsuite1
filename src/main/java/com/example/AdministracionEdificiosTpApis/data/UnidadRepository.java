package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Unidad;

public interface UnidadRepository extends JpaRepository<Unidad, Integer> {
	
    List<Unidad> findByDuenios(Persona duenio); //para obtenerReclamosPorDNI (personaDAO)
    List<Unidad> findByInquilinos(Persona inquilino); //para obtenerReclamosPorDNI (personaDAO)
    List<Unidad> findByEdificioCodigoAndDueniosDocumento(int codigoEdificio, String documento);
    List<Unidad> findByEdificioCodigoAndInquilinosDocumento(int codigoEdificio, String documento);
    List<Unidad> findByEdificioCodigo(int i);
    List<Unidad> findByDueniosContaining(Persona duenio);
    List<Unidad> findByInquilinosContaining(Persona inquilino);
    
    List<Unidad> findByDueniosContains(Persona duenio);
    List<Unidad> findByInquilinosContains(Persona inquilino);
    @Query("SELECT u FROM Unidad u WHERE u.edificio.codigo = :codigo AND TRIM(LOWER(u.piso)) = TRIM(LOWER(:piso)) AND TRIM(LOWER(u.numero)) = TRIM(LOWER(:numero))")
    Optional<Unidad> findByEdificioCodigoAndPisoAndNumero(@Param("codigo") int codigo, 
                                                          @Param("piso") String piso, 
                                                          @Param("numero") String numero);
    
    
    @Query("SELECT u FROM Unidad u WHERE u.edificio.codigo = :codigo AND u.piso = :piso AND u.numero = :numero")
    Optional<Unidad> findUnidadByCodigoPisoNumero(@Param("codigo") int codigo, @Param("piso") String piso, @Param("numero") String numero);

}

