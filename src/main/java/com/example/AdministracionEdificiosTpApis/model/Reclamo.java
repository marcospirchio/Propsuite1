package com.example.AdministracionEdificiosTpApis.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.example.AdministracionEdificiosTpApis.views.Estado;
import com.example.AdministracionEdificiosTpApis.views.ImagenView;
import com.example.AdministracionEdificiosTpApis.views.ReclamoView;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "reclamos")
public class Reclamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idreclamo")
    private Integer numero;
    private String ubicacion;
    private String descripcion;
    
    @Column(name = "detalle_estado")
    private String detalleEstado;

    @ManyToOne
    @JoinColumn(name = "documento")
    private Persona usuario;

    @ManyToOne
    @JoinColumn(name = "codigo")
    private Edificio edificio;

    @ManyToOne
    @JoinColumn(name = "identificador", nullable = true)
    private Unidad unidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    @OneToMany(mappedBy = "reclamo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Imagen> imagenes;

    @ManyToOne
    @JoinColumn(name = "idtiporeclamo")
    private TipoReclamo tipoReclamo;

    @Temporal(TemporalType.TIMESTAMP) // Asegúrate de importar TemporalType
    @Column(name = "fecha", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date fecha = new Date(); ;

    
    public Reclamo() {}

    public Reclamo(String ubicacion, String descripcion, String detalleEstado) {
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.estado = Estado.nuevo;
        this.detalleEstado = detalleEstado;
        this.imagenes = new ArrayList<>();
    }

    public Reclamo(Integer numero, String ubicacion, String descripcion, String detalleEstado) {
        this.numero = numero;
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.estado = Estado.nuevo;
        this.detalleEstado = detalleEstado;
        this.imagenes = new ArrayList<>();
    }

    public Reclamo(Persona usuario, Edificio edificio, String ubicacion, String descripcion, Unidad unidad, TipoReclamo tipoReclamo, String detalleEstado) {
        this.usuario = usuario;
        this.edificio = edificio;
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.unidad = unidad;
        this.estado = Estado.nuevo;
        this.tipoReclamo = tipoReclamo;
        this.detalleEstado = detalleEstado;
        this.imagenes = new ArrayList<>();
    }

    public Reclamo(Integer numero, Persona usuario, Edificio edificio, String ubicacion, String descripcion, Unidad unidad, TipoReclamo tipoReclamo, String detalleEstado) {
        this.numero = numero;
        this.usuario = usuario;
        this.edificio = edificio;
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.unidad = unidad;
        this.estado = Estado.nuevo;
        this.tipoReclamo = tipoReclamo;
        this.detalleEstado = detalleEstado;
        this.imagenes = new ArrayList<>();
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
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

    public String getDetalleEstado() {
        return detalleEstado;
    }

    public void setDetalleEstado(String detalleEstado) {
        this.detalleEstado = detalleEstado;
    }

    public Persona getUsuario() {
        return usuario;
    }

    public void setUsuario(Persona usuario) {
        this.usuario = usuario;
    }

    public Edificio getEdificio() {
        return edificio;
    }

    public void setEdificio(Edificio edificio) {
        this.edificio = edificio;
    }

    public Unidad getUnidad() {
        return unidad;
    }

    public void setUnidad(Unidad unidad) {
        this.unidad = unidad;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }
    
    public void cambiarEstado(Estado estado) {
        setEstado(estado); 
    }

    public List<Imagen> getImagenes() {
        return imagenes != null ? imagenes : new ArrayList<>();
    }

    public void setImagenes(List<Imagen> imagenes) {
        this.imagenes = imagenes;
    }

    public TipoReclamo getTipoReclamo() {
        return tipoReclamo;
    }

    public void setTipoReclamo(TipoReclamo tipoReclamo) {
        this.tipoReclamo = tipoReclamo;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }
    
    public ReclamoView toView() {
        // Convertir la lista de imágenes a una lista de ImagenView
        List<ImagenView> imagenesView = getImagenes().stream()
                .map(Imagen::toView)
                .collect(Collectors.toList());

        // Formatear el estado para capitalizar la primera letra y poner el resto en minúsculas
        String estadoFormateado = estado.name().charAt(0) + estado.name().substring(1).toLowerCase();


        return new ReclamoView(
            numero,
            usuario != null ? usuario.toView() : null, // Asegurarse de que usuario no es null
            edificio != null ? edificio.toView() : null, // Asegurarse de que edificio no es null
            ubicacion,
            descripcion,
            unidad != null ? unidad.toView() : null, // Asegurarse de que unidad no es null
            estadoFormateado,
            imagenesView,
            detalleEstado, // Añadir el detalleEstado al constructor de ReclamoView
            fecha
        		);
    }


    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Reclamo other = (Reclamo) obj;
        return Objects.equals(numero, other.numero);
    }

    @Override
    public String toString() {
        return "Reclamo [numero=" + numero + ", fecha=" + fecha + ", usuario=" + usuario + ", edificio=" + edificio + ", ubicacion=" + ubicacion + ", descripcion=" + descripcion + ", unidad=" + unidad + ", estado=" + estado + ", tipoReclamo=" + tipoReclamo + ", detalleEstado=" + detalleEstado + "]";
    }
}
