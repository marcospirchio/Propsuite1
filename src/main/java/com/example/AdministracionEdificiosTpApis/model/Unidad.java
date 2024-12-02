package com.example.AdministracionEdificiosTpApis.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.example.AdministracionEdificiosTpApis.views.EdificioView;
import com.example.AdministracionEdificiosTpApis.views.UnidadView;
import com.example.AdministracionEdificiosTpApis.exceptions.UnidadException;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "unidades")
public class Unidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "identificador")
    private Integer id;
    private String piso;
    private String numero;
    private boolean habitado;

    @ManyToOne
    @JoinColumn(name = "codigoedificio")
    @JsonBackReference
    private Edificio edificio;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "duenios", joinColumns = @JoinColumn(name = "identificador"), inverseJoinColumns = @JoinColumn(name = "documento"))
    private List<Persona> duenios;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "inquilinos", joinColumns = @JoinColumn(name = "identificador"), inverseJoinColumns = @JoinColumn(name = "documento"))
    private List<Persona> inquilinos;

	
	//-------------CONSTRUCTORES-------------
	public Unidad() {}	// constructor vacio
	
	public Unidad(String piso, String numero) { 	// constructor para generar id con identity
		this.piso = piso;
		this.numero = numero;
		this.habitado = false;
		this.duenios = new ArrayList<Persona>();
		this.inquilinos = new ArrayList<Persona>();
	}
	
	public Unidad(Integer id, String piso, String numero) {	// constructor para asignar id manualmente
		this.id = id;
		this.piso = piso;
		this.numero = numero;
		this.habitado = false;
	}
	
	//-------------SETTERS-------------
	
	public void setHabitado(boolean habitado) {
		this.habitado = habitado;
	}

	public void setPiso(String piso) {
		this.piso = piso;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}
	
	public void setEdificio(Edificio edificio) {
		this.edificio = edificio;
	}
	
	public void setDuenios(List<Persona> duenios) {
		this.duenios = duenios;
	}

	public void setInquilinos(List<Persona> inquilinos) {
		this.inquilinos = inquilinos;
	}

	//-------------GETTERS-------------
	public int getId() {
		return id;
	}

	public String getPiso() {
		return piso;
	}

	public String getNumero() {
		return numero;
	}
	
	public boolean getEstaHabitado() {
		return habitado;
	}
	
	public Edificio getEdificio() {
		return edificio;
	}

	public List<Persona> getDuenios() {
		return duenios;
	}

	public List<Persona> getInquilinos() {
		return inquilinos;
	}
	
	//-------------METODOS-------------
    public void transferir(Persona nuevoDuenio) {
        this.duenios.clear();
        this.duenios.add(nuevoDuenio);
        this.inquilinos.clear();
        this.habitado = false;
    }
	
	public void agregarDuenio(Persona duenio) {		// agregar un duenio a una unidad
		duenios.add(duenio);
	}
	
	public void alquilar(Persona inquilino) throws UnidadException {	// alquilar una unidad
		if(!this.habitado) {
			this.habitado = true;
			inquilinos = new ArrayList<Persona>();
			inquilinos.add(inquilino);
		}
		else
			throw new UnidadException("La unidad esta ocupada");
	}
	
	public void agregarInquilino(Persona inquilino) {	// agregar inquilinos a una unidad alquilada
		inquilinos.add(inquilino);
	}
	
	public void liberar() {		// liberar una unidad alquilada
		this.inquilinos = new ArrayList<Persona>();
		this.habitado = false;
	}
	
	public void habitar() throws UnidadException {	// habitar una unidad
		if(this.habitado)
			throw new UnidadException("La unidad ya esta habitada");
		else
			this.habitado = true;
	}
	
	public UnidadView toView() {
		EdificioView auxEdificio = edificio.toView();
		return new UnidadView(id, piso, numero, habitado, auxEdificio);
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
		Unidad other = (Unidad) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public String toString() {
		return "Id " + id + " : Piso " + piso + " : Numero " + numero + " : Habitado - " + habitado + " : Dueños " + duenios.size() 
		+ " : Inquilinos " + inquilinos.size() + " : Id edificio " + edificio.getCodigo();
	}
}
