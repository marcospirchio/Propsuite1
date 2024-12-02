package com.example.AdministracionEdificiosTpApis.service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.AdministracionEdificiosTpApis.data.ImagenDAO;
import com.example.AdministracionEdificiosTpApis.data.ReclamoDAO;
import com.example.AdministracionEdificiosTpApis.exceptions.ImagenException;
import com.example.AdministracionEdificiosTpApis.model.Imagen;
import com.example.AdministracionEdificiosTpApis.model.Reclamo;

@Service
public class ImagenService {

    @Autowired
    private ImagenDAO imagenDAO;

    @Autowired
    private ReclamoDAO reclamoDAO;

    public List<Imagen> obtenerTodasLasImagenes() {
        return imagenDAO.getAllImagenes();
    }

    public Imagen obtenerImagenPorId(int idImagen) throws ImagenException {
        return imagenDAO.getImagenById(idImagen)
                .orElseThrow(() -> new ImagenException("Imagen no encontrada"));
    }


    public Optional<Imagen> obtenerImagenPorIdOptional(int idImagen) {
        return imagenDAO.getImagenById(idImagen);
    }

    
    public void agregarImagen(String tipo, String contenidoBase64, int idReclamo) throws Exception {
        Reclamo reclamo = reclamoDAO.getReclamoById(idReclamo)
                .orElseThrow(() -> new Exception("Reclamo no encontrado."));

        Imagen nuevaImagen = new Imagen();
        nuevaImagen.setTipo(tipo);
        nuevaImagen.setContenido(contenidoBase64);
        nuevaImagen.setReclamo(reclamo);

        imagenDAO.agregarImagen(nuevaImagen);
        System.out.println("Imagen cargada y asociada al reclamo.");
    }

    public List<Imagen> obtenerImagenesPorReclamo(int idReclamo) {
        return imagenDAO.obtenerImagenesPorReclamo(idReclamo);
    }

    public void actualizarImagen(Imagen imagen) throws ImagenException {
        Imagen imagenExistente = obtenerImagenPorId(imagen.getNumero());
        imagen.setReclamo(imagenExistente.getReclamo());
        imagenDAO.actualizarImagen(imagen);
        System.out.println("Imagen actualizada correctamente.");
    }

    public void eliminarImagen(int idImagen) throws ImagenException {
        Imagen imagen = obtenerImagenPorId(idImagen);
        imagenDAO.eliminarImagen(imagen.getNumero());
        System.out.println("Imagen eliminada correctamente.");
    }
}
