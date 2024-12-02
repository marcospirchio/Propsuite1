package com.example.AdministracionEdificiosTpApis.views;

import java.util.Date;
import java.util.List;

public class ReclamoView {

    private int numero;
    private PersonaView usuario;
    private EdificioView edificio;
    private String ubicacion;
    private String descripcion;
    private UnidadView unidad;
    private String estado; // Cambiado a String para mostrar el estado en formato "Capitalize"
    private List<ImagenView> imagenes;
    private String detalleEstado; // 
    private Date fecha;

    public ReclamoView(int numero, PersonaView usuario, EdificioView edificio, String ubicacion, String descripcion, UnidadView unidad, String estado, List<ImagenView> imagenes, String detalleEstado, Date fecha) {
        this.numero = numero;
        this.usuario = usuario;
        this.edificio = edificio;
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.unidad = unidad;
        this.estado = estado;
        this.imagenes = imagenes;
        this.detalleEstado = detalleEstado;
        this.fecha = fecha;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public PersonaView getUsuario() {
        return usuario;
    }

    public void setUsuario(PersonaView usuario) {
        this.usuario = usuario;
    }

    public EdificioView getEdificio() {
        return edificio;
    }

    public void setEdificio(EdificioView edificio) {
        this.edificio = edificio;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public UnidadView getUnidad() {
        return unidad;
    }

    public void setUnidad(UnidadView unidad) {
        this.unidad = unidad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<ImagenView> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<ImagenView> imagenes) {
        this.imagenes = imagenes;
    }
    public String getDetalleEstado() {
        return detalleEstado;
    }

    public void setDetalleEstado(String detalleEstado) {
        this.detalleEstado = detalleEstado;
    }
    
    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }
} 
