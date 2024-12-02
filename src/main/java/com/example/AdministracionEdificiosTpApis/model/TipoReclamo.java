package com.example.AdministracionEdificiosTpApis.model;

import java.util.Objects;

import jakarta.persistence.*;

@Entity
@Table(name = "tiposreclamo")
public class TipoReclamo {
	
	//-------------ATRIBUTOS-------------
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idtiporeclamo")
	private Integer id;
	private String descripcion;
	
	//-------------CONTRUCTORES-------------
	public TipoReclamo() {}	// constructor vacio
	
	public TipoReclamo(String descripcion) {
		this.descripcion = descripcion;
	}

	public TipoReclamo(Integer id, String descripcion) {
		this.id = id;
		this.descripcion = descripcion;
	}
	
	//-------------GETTERS-------------
	public Integer getId() {
		return id;
	}

	public String getDescripcion() {
		return descripcion;
	}
	
	//-------------METODOS AGREGADOS-------------
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TipoReclamo other = (TipoReclamo) obj;
		return Objects.equals(descripcion, other.descripcion) && Objects.equals(id, other.id);
	}

	@Override
	public String toString() {
		return "Id " + id + " : Descripcion " + descripcion;
	}
	
	
}

