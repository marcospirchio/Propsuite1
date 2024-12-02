package com.example.AdministracionEdificiosTpApis.model;

import java.util.Objects;

import com.example.AdministracionEdificiosTpApis.views.PersonaView;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "personas")
public class Persona {
	
	
	@Id
	private String documento;
	private String nombre;
	

	public Persona() {}	// constructor vacio
	
	public Persona(String documento, String nombre) {	
		this.documento = documento;
		this.nombre = nombre;
	}
	

	public String getDocumento() {
		return documento;
	}

	public String getNombre() {
		return nombre;
	}


	
	public PersonaView toView() {
		return new PersonaView(documento, nombre);
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Persona other = (Persona) obj;
		return Objects.equals(documento, other.documento);
	}

	@Override
	public String toString() {
		return "Documento " + documento + " : Nombre " + nombre;
	}
}
