package com.example.AdministracionEdificiosTpApis.views;

public class ImagenView {
    
    private int numero;
    private String tipo;
    private String contenidoBase64;

    // Constructor vacío
    public ImagenView() {}

    // Constructor con todos los campos
    public ImagenView(int numero, String tipo, String contenidoBase64) {
        this.numero = numero;
        this.tipo = tipo;
        this.contenidoBase64 = contenidoBase64;
    }

    // Getters y Setters
    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getContenidoBase64() {
        return contenidoBase64;
    }

    public void setContenidoBase64(String contenidoBase64) {
        this.contenidoBase64 = contenidoBase64;
    }

    @Override
    public String toString() {
        return "ImagenView{" +
                "numero=" + numero +
                ", tipo='" + tipo + '\'' +
                ", contenidoBase64='" + (contenidoBase64 != null ? "[Base64 Content Truncated]" : null) + '\'' +
                '}';
    }
}
