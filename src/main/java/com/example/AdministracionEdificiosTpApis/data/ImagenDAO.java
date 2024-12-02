package com.example.AdministracionEdificiosTpApis.data;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.AdministracionEdificiosTpApis.model.Imagen;

@Repository
public class ImagenDAO {
	
	//-------------REPOSITORIO-------------
	
	@Autowired
    private ImagenRepository imagenRepository;
	
	//-------------CRUD-------------
	
	public void agregarImagen(Imagen imagen) {
        imagenRepository.save(imagen);
    }

    public void actualizarImagen(Imagen imagen) {
        imagenRepository.save(imagen);
    }

    public void eliminarImagen(int idImagen) {
        imagenRepository.deleteById(idImagen);
    }
	
	//-------------METODOS-------------
	
    public List<Imagen> getAllImagenes() {
        return imagenRepository.findAll();
    }



    public Optional<Imagen> getImagenById(int idImagen) {
        return imagenRepository.findById(idImagen);
    }
    public List<Imagen> obtenerImagenesPorReclamo(int idReclamo) {
        return imagenRepository.findByReclamoNumero(idReclamo);
    }
    
    public List<Imagen> getImagenesByReclamoId(int idReclamo) {
        return imagenRepository.findImagenesByReclamoId(idReclamo);
    }
    
}
