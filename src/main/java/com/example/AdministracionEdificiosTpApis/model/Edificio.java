package com.example.AdministracionEdificiosTpApis.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import com.example.AdministracionEdificiosTpApis.views.EdificioView;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "edificios")
public class Edificio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codigo;
    private String nombre;
    private String direccion;

    @OneToMany(mappedBy = "edificio", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Unidad> unidades;
	//-------------CONSTRUCTORES-------------
	public Edificio() {} // constructor vacio
	
	public Edificio(String nombre, String direccion) {	// constructor para generar id con identity
		this.nombre = nombre;
		this.direccion = direccion;
		this.unidades = new ArrayList<Unidad>();
	}
	
	public Edificio(Integer codigo, String nombre, String direccion) {	// constructor para asignar id manualmente
		this.codigo = codigo;
		this.nombre = nombre;
		this.direccion = direccion;
		this.unidades = new ArrayList<Unidad>();
	}
	
	//-------------SETTERS-------------
	
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	
	public void setUnidades(List<Unidad> unidades) {
		this.unidades = unidades;
	}
	
	//-------------GETTERS-------------
	public int getCodigo() {
		return codigo;
	}

	public String getNombre() {
		return nombre;
	}

	public String getDireccion() {
		return direccion;
	}
	
	public List<Unidad> getUnidades() {
		return unidades;
	}
	
	//-------------GETTERS PERSONAS DEL EDIFICIO-------------
	public Set<Persona> habilitados(){
		Set<Persona> habilitados = new HashSet<Persona>();
		for(Unidad unidad : unidades) {
			List<Persona> duenios = unidad.getDuenios();
			for(Persona p : duenios)
				habilitados.add(p);
			List<Persona> inquilinos = unidad.getInquilinos();
			for(Persona p : inquilinos)
				habilitados.add(p);
		}
		return habilitados;
	}
	
	public Set<Persona> duenios() {
		Set<Persona> resultado = new HashSet<Persona>();
		for(Unidad unidad : unidades) {
			List<Persona> duenios = unidad.getDuenios();
			for(Persona p : duenios)
				resultado.add(p);
		}
		return resultado;
	}
	
	public Set<Persona> habitantes() {
		Set<Persona> resultado = new HashSet<Persona>();
		for(Unidad unidad : unidades) {
			if(unidad.getEstaHabitado()) {
				List<Persona> inquilinos = unidad.getInquilinos();
				if(inquilinos.size() > 0) 
					for(Persona p : inquilinos)
						resultado.add(p);
				else {
					List<Persona> duenios = unidad.getDuenios();
					for(Persona p : duenios)
						resultado.add(p);
				}
			}
		}
		return resultado;
	}
	
	//-------------METODOS-------------
	public void agregarUnidad(Unidad unidad) {
		unidades.add(unidad);
	}
	
	public EdificioView toView() {
		return new EdificioView(codigo, nombre, direccion);
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
		Edificio other = (Edificio) obj;
		return Objects.equals(codigo, other.codigo);
	}

	@Override
	public String toString() {
		return "Codigo " + codigo + " : Nombre " + nombre + " : Direccion " + direccion + " : Cantidad de unidades " + unidades.size();
	}

}
