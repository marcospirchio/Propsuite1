package com.example.AdministracionEdificiosTpApis.model;

import java.util.Objects;

import com.example.AdministracionEdificiosTpApis.views.ImagenView;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "imagenes")
public class Imagen {

    //-------------ATRIBUTOS-------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer numero;

    private String tipo;

    @ManyToOne
    @JoinColumn(name = "idreclamo")
    @JsonIgnore
    private Reclamo reclamo;


    @Column(name = "contenido", columnDefinition = "TEXT")
    private String contenido;

    //-------------CONSTRUCTORES-------------
    public Imagen() {} // Constructor vacío

    public Imagen(String tipo, Reclamo reclamo, String contenido) {
        this.tipo = tipo;
        this.reclamo = reclamo;
        this.contenido = contenido;
    }

    public Imagen(Integer numero, String tipo, Reclamo reclamo, String contenido) {
        this.numero = numero;
        this.tipo = tipo;
        this.reclamo = reclamo;
        this.contenido = contenido;
    }

    //-------------GETTERS Y SETTERS-------------
    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Reclamo getReclamo() {
        return reclamo;
    }

    public void setReclamo(Reclamo reclamo) {
        this.reclamo = reclamo;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    //-------------MÉTODOS-------------
    public ImagenView toView() {
        return new ImagenView(getNumero(), tipo, contenido);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Imagen other = (Imagen) obj;
        return Objects.equals(numero, other.numero);
    }

    @Override
    public String toString() {
        return "Numero " + numero + " : Tipo " + tipo + " : Contenido [truncado] : Id reclamo " + (reclamo != null ? reclamo.getNumero() : "null");
    }
}



//package com.example.AdministracionEdificiosTpApis.model;
//
//import java.util.Objects;
//
//import com.example.AdministracionEdificiosTpApis.views.ImagenView;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.Table;
//
//@Entity
//@Table(name = "imagenes")
//public class Imagen {
//	
//	//-------------ATRIBUTOS-------------
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	private Integer numero;
//	@Column(name = "path")
//	private String direccion;
//	private String tipo;
//	@ManyToOne
//	@JoinColumn(name = "idreclamo")
//	private Reclamo reclamo;
//	
//	//-------------CONSTRUCTORES-------------
//	public Imagen() {}	// constructor vacio
//	
//	public Imagen(String direccion, String tipo, Reclamo reclamo) { 	// constructor para generar id con identity
//		this.direccion = direccion;
//		this.tipo = tipo;
//		this.reclamo = reclamo;
//	}
//	
//	public Imagen(Integer numero, String direccion, String tipo, Reclamo reclamo) { 	// constructor para asignar id manualmente
//		this.numero = numero;
//		this.direccion = direccion;
//		this.tipo = tipo;
//		this.reclamo = reclamo;
//	}
//
//	//-------------GETTERS Y SETTERS-------------
//	public int getNumero() {
//		return numero;
//	}
//
//	public void setNumero(int numero) {
//		this.numero = numero;
//	}
//	
//	public void setReclamo(Reclamo reclamo) {
//		this.reclamo = reclamo;
//	}
//
//	public String getDireccion() {
//		return direccion;
//	}
//
//	public void setDireccion(String direccion) {
//		this.direccion = direccion;
//	}
//
//	public String getTipo() {
//		return tipo;
//	}
//
//	public void setTipo(String tipo) {
//		this.tipo = tipo;
//	}
//	
//	public Reclamo getReclamo() {
//		return reclamo;
//	}
//	
//	//-------------METODOS-------------
//
//	public ImagenView toView() {
//		return new ImagenView(getNumero(), direccion, tipo);
//	}
//	
//	//-------------METODOS AGREGADOS-------------
//	@Override
//	public boolean equals(Object obj) {
//		if (this == obj)
//			return true;
//		if (obj == null)
//			return false;
//		if (getClass() != obj.getClass())
//			return false;
//		Imagen other = (Imagen) obj;
//		return Objects.equals(numero, other.numero);
//	}
//
//	@Override
//	public String toString() {
//		return "Numero " + numero + " : Direccion " + direccion + " : Tipo " + tipo + " : Id reclamo" + reclamo.getNumero();
//	}
//}
