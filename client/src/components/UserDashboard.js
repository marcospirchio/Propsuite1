import React, { useState } from "react";

import "./UserDashboard.css";

function UsuarioDashboard() {
  const [showModal, setShowModal] = useState(null);
  const [modalContent, setModalContent] = useState("");
  const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [dni, setDni] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [idReclamo, setIdReclamo] = useState("");
  const [codigoEdificio, setCodigoEdificio] = useState("");
  const [piso, setPiso] = useState("");
  const [numero, setNumero] = useState("");
  const [idUnidad, setIdUnidad] = useState("");
  const [idTipoReclamo, setIdTipoReclamo] = useState("");
  const [estado, setEstado] = useState("");
  const [numeroUnidad, setNumeroUnidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoReclamo, setTipoReclamo] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tipo, setTipo] = useState(""); 
  const [idImagen, setIdImagen] = useState(""); 
  

  const jwtToken = localStorage.getItem("jwtToken");

  const handleApiCall = async (url, options) => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error desconocido');
      }
      return data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert(`Error: ${error.message}`);
      return null;
    }
  };
/*METODOS USUARIOS*/
const actualizarNombreUsuario = async () => {
  try {
    console.log("Iniciando solicitud para actualizar nombre de usuario...");
    const response = await fetch("http://localhost:8080/api/usuario/actualizar-nombre-usuario", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ nuevoNombreUsuario }),
    });

    console.log("Respuesta del servidor:", response);

    if (response.ok) {
      alert("Nombre de usuario actualizado con éxito. Por favor, vuelve a iniciar sesión.");
      cerrarSesion();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message || "Error desconocido"}`);
    }
  } catch (e) {
    console.error("Error al conectar con el servidor:", e);
    alert("Error al conectar con el servidor");
  }
};



const restablecerContrasena = async () => {
  const url = "http://localhost:8080/api/usuario/restablecerContrasena";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombreUsuario, // Define este estado en tu componente
      dni,           // Define este estado en tu componente
      nuevaContrasena, // Define este estado en tu componente
    }),
  };

  try {
    const response = await fetch(url, options);

    // Manejar errores HTTP
    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Error en la solicitud.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Error desconocido.");
      }
    }

    // Manejar respuesta exitosa
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      alert(data.message || "Operación exitosa.");
    } else {
      const message = await response.text();
      alert(message || "Operación exitosa.");
    }
  } catch (error) {
    console.error("Error restableciendo contraseña:", error.message);
    alert(`Error: ${error.message}`);
  }
};

  

  const cerrarSesion = () => {
    localStorage.removeItem("jwtToken");
    alert("Sesión cerrada. Redirigiendo a la página de inicio.");
    window.location.href = "http://localhost:3000/";
  };

  /*METODOS RECLAMOS*/
  const mostrarReclamo = async (url) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    try {
      const result = await handleApiCall(url, options);
      if (result) {
        const formattedResult = Array.isArray(result)
          ? result
              .map((reclamo, index) => {
                const unidadInfo = reclamo.unidad
                  ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}`
                  : "N/A";
                return `
                  <div class="reclamo-item">
                    <strong>ID Reclamo:</strong> ${reclamo.numero} <br>
                    <strong>Documento de Reclamante:</strong> ${
                      reclamo.usuario ? reclamo.usuario.documento : "No disponible"
                    } <br>
                    <strong>Código de Edificio:</strong> ${
                      reclamo.edificio ? reclamo.edificio.codigo : "N/A"
                    } <br>
                    <strong>Ubicación:</strong> ${reclamo.ubicacion} <br>
                    <strong>Identificador de Unidad:</strong> ${unidadInfo} <br>
                    <strong>Descripción:</strong> ${reclamo.descripcion} <br>
                    <strong>Estado:</strong> ${reclamo.estado} <br>
                    <strong>Detalle Estado:</strong> ${reclamo.detalleEstado} <br>
                    <strong>Fecha:</strong> ${reclamo.fecha} <br>
                  </div>
                  <hr>
                `;
              })
              .join("\n")
          : "No se encontraron reclamos.";
  
        setModalContent(formattedResult);
        setShowModal("verMisReclamos");
      }
    } catch (error) {
      console.error("Error al obtener el reclamo:", error);
      alert("Hubo un error al obtener el reclamo. Verifica el ID e intenta nuevamente.");
    }
  };

  const obtenerReclamoPorId = async () => {
    if (!idReclamo) {
      alert("Por favor, ingrese un ID de reclamo válido.");
      return;
    }
  
    const urlReclamo = `http://localhost:8080/api/reclamos/${idReclamo}`;
    const optionsReclamo = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    try {
      const reclamo = await handleApiCall(urlReclamo, optionsReclamo);
      if (reclamo) {
        // Formatear la respuesta del reclamo
        const formatted = `
          <div class="reclamo-item">
            <strong>ID Reclamo:</strong> ${reclamo.reclamo?.numero || "No disponible"} <br>
            <strong>Documento de Reclamante:</strong> ${
              reclamo.reclamo?.usuario?.documento || "No disponible"
            } <br>
            <strong>Código de Edificio:</strong> ${reclamo.reclamo?.edificio?.codigo || "N/A"} <br>
            <strong>Ubicación:</strong> ${reclamo.reclamo?.ubicacion || "No disponible"} <br>
            <strong>Identificador de Unidad:</strong> ${
              reclamo.reclamo?.unidad
                ? `Piso: ${reclamo.reclamo.unidad.piso}, Número: ${reclamo.reclamo.unidad.numero}`
                : "N/A"
            } <br>
            <strong>Descripción:</strong> ${reclamo.reclamo?.descripcion || "No disponible"} <br>
            <strong>Estado:</strong> ${reclamo.reclamo?.estado || "No disponible"} <br>
            <strong>Detalle Estado:</strong> ${reclamo.reclamo?.detalleEstado || "N/A"} <br>
            <strong>Fecha:</strong> ${reclamo.reclamo?.fecha || "No disponible"} <br>
          </div>
          <hr>
        `;
  
        // Obtener las imágenes asociadas al reclamo
        const urlImagenes = `http://localhost:8080/api/imagenes/ver/reclamo/${idReclamo}`;
        const optionsImagenes = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        };
  
        const imagenes = await handleApiCall(urlImagenes, optionsImagenes);
        const imagenesContent =
          imagenes && imagenes.length > 0
            ? imagenes
                .map(
                  (imagen, index) =>
                    `<img src="${imagen.contenido}" alt="Imagen del reclamo ${index + 1}" style="max-width: 100%; max-height: 200px; margin: 10px;" />`
                )
                .join("")
            : "No hay imágenes asociadas a este reclamo.";
  
        // Añadir las imágenes al contenido
        const finalContent = `${formatted}<strong>Imágenes:</strong><br>${imagenesContent}`;
  
        // Establecer el contenido del modal y mostrarlo
        setModalContent(finalContent);
        setShowModal("verMisReclamos");
      }
    } catch (error) {
      console.error("Error al obtener el reclamo:", error);
      alert("Hubo un error al obtener el reclamo. Verifica el ID e intenta nuevamente.");
    }
  };
  

  
  
  const obtenerReclamosPorEdificio = async () => {
    const url = `http://localhost:8080/api/reclamos/edificio/${codigoEdificio}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const result = await handleApiCall(url, options);
    if (result) {
      const formatted = result.map(reclamo => formatReclamo(reclamo)).join("\n");
      setModalContent(formatted);
      setShowModal("verMisReclamos");
    }
  };
  
  const obtenerReclamosPorUnidad = async () => {
    const url = `http://localhost:8080/api/reclamos/unidad/${codigoEdificio}/${piso}/${numero}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const result = await handleApiCall(url, options);
    if (result) {
      const formatted = result.map(reclamo => formatReclamo(reclamo)).join("\n");
      setModalContent(formatted);
      setShowModal("verMisReclamos");
    }
  };

  const obtenerReclamosPorIdUnidad = async () => {
    const url = `http://localhost:8080/api/reclamos/unidad/${idUnidad}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const result = await handleApiCall(url, options);
    if (result) {
      const formatted = result.map((reclamo, index) => {
        const unidadInfo = reclamo.unidad
          ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}, ID: ${reclamo.unidad.id}`
          : "N/A";
  
        return `Reclamo ${index + 1}:
        - ID Reclamo: ${reclamo.numero}
        - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
        - Ubicación: ${reclamo.ubicacion}
        - Identificador de Unidad: ${unidadInfo}
        - Descripción: ${reclamo.descripcion}
        - Estado: ${reclamo.estado}
        - Fecha: ${reclamo.fecha}`;
      }).join("\n");
      setModalContent(formatted);
      setShowModal("verReclamosPorIdUnidad");
    }
  };
  
  const obtenerReclamosPorTipo = async () => {
    const url = `http://localhost:8080/api/reclamos/tipo/${idTipoReclamo}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const result = await handleApiCall(url, options);
    if (result) {
      const formatted = result.map((reclamo, index) => {
        const unidadInfo = reclamo.unidad
          ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}, ID: ${reclamo.unidad.id}`
          : "N/A";
  
        return `Reclamo ${index + 1}:
        - ID Reclamo: ${reclamo.numero}
        - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
        - Tipo de Reclamo: ${idTipoReclamo}
        - Ubicación: ${reclamo.ubicacion}
        - Identificador de Unidad: ${unidadInfo}
        - Descripción: ${reclamo.descripcion}
        - Estado: ${reclamo.estado}
        - Fecha: ${reclamo.fecha}`;
      }).join("\n");
      setModalContent(formatted);
      setShowModal("verReclamosPorTipo");
    }
  };
  
  const obtenerReclamosPorEstado = async () => {
    const url = `http://localhost:8080/api/reclamos/estado/${estado}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const result = await handleApiCall(url, options);
    if (result) {
      const formatted = result.map((reclamo, index) => {
        const unidadInfo = reclamo.unidad
          ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}, ID: ${reclamo.unidad.id}`
          : "N/A";
  
        return `Reclamo ${index + 1}:
        - ID Reclamo: ${reclamo.numero}
        - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
        - Estado: ${estado}
        - Ubicación: ${reclamo.ubicacion}
        - Identificador de Unidad: ${unidadInfo}
        - Descripción: ${reclamo.descripcion}
        - Fecha: ${reclamo.fecha}`;
      }).join("\n");
      setModalContent(formatted);
      setShowModal("verReclamosPorEstado");
    }
  };
  
  const obtenerReclamosEnAreasComunes = async () => {
    const url = "http://localhost:8080/api/reclamos/areas-comunes";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    const result = await handleApiCall(url, options);
    if (result) {
      const formatted = result.map((reclamo, index) => `
        Reclamo ${index + 1}:
        - ID Reclamo: ${reclamo.numero}
        - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
        - Ubicación: ${reclamo.ubicacion}
        - Identificador de Unidad: ${
          reclamo.unidad ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}` : "N/A"
        }
        - Descripción: ${reclamo.descripcion}
        - Estado: ${reclamo.estado}
        - Fecha: ${reclamo.fecha}`).join("\n");
      setModalContent(formatted);
      setShowModal("verReclamosEnAreasComunes");
    }
  };

  
  const filtrarReclamosPorFecha = async (masRecientes) => {
    const url = `http://localhost:8080/api/reclamos/mis-reclamos/filtrar?masRecientes=${masRecientes}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`, // Asegúrate de que jwtToken sea válido
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text(); // Captura posibles errores del servidor
        console.error("Error del servidor:", errorText);
        throw new Error(`HTTP ${response.status}`);
      }
  
      const result = await response.json();
      const formatted = result.map((reclamo, index) => `
        Reclamo ${index + 1}:
        - ID Reclamo: ${reclamo.numero}
        - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
        - Ubicación: ${reclamo.ubicacion}
        - Descripción: ${reclamo.descripcion}
        - Estado: ${reclamo.estado}
        - Fecha: ${reclamo.fecha}`).join("\n");
  
      setModalContent(formatted);
      setShowModal("verMisReclamos");
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
      alert("No se pudo cargar los reclamos. Por favor, verifica tus credenciales o intenta nuevamente.");
    }
  };
  
  

  const formatReclamo = (reclamo) => {
    const identificadorUnidad = reclamo.unidad ? `ID: ${reclamo.unidad.id}, Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}` : 'N/A';
    return `Reclamo:
    - ID Reclamo: ${reclamo.numero}
    - Documento de Reclamante: ${reclamo.usuario ? reclamo.usuario.documento : 'No disponible'}
    - Código de Edificio: ${reclamo.edificio ? reclamo.edificio.codigo : undefined}
    - Ubicación: ${reclamo.ubicacion}
    - Identificador de Unidad: ${identificadorUnidad}
    - Descripción: ${reclamo.descripcion}
    - Estado: ${reclamo.estado}
    - Detalle Estado: ${reclamo.detalleEstado}
    - Fecha: ${reclamo.fecha}\n`;
  };

  const obtenerMisReclamos = () => {
    const url = "http://localhost:8080/api/reclamos/mis-reclamos";
    mostrarReclamo(url);
  };

  const agregarReclamoConUnidad = async () => {
    try {
      const payload = {
        codigoEdificio: parseInt(codigoEdificio, 10), // Convertir a entero
        piso, // Se envía como string
        numeroUnidad, // Se envía como string
        ubicacion, // Se envía como string
        descripcion, // Se envía como string
        tipoReclamo: parseInt(tipoReclamo, 10), // Convertir a entero
      };
  
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Asegúrate de que jwtToken esté configurado
        },
        body: JSON.stringify(payload),
      };
  
      const url = "http://localhost:8080/api/reclamos/conUnidad";
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar el reclamo.");
      }
  
      const result = await response.json();
      alert(`Reclamo creado exitosamente con ID: ${result.idReclamo}`);
    } catch (error) {
      console.error("Error al agregar el reclamo:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  const actualizarReclamo = async () => {
    try {
      const payload = {
        idReclamo: parseInt(idReclamo, 10), // Convertir a entero
        ubicacion, // Se envía como string
        descripcion, // Se envía como string
      };
  
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Asegúrate de que jwtToken esté configurado
        },
        body: JSON.stringify(payload),
      };
  
      const url = "http://localhost:8080/api/reclamos/actualizar";
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el reclamo.");
      }
  
      const result = await response.text();
      alert(result);
      setShowModal(null); // Cerrar modal tras éxito
    } catch (error) {
      console.error("Error al actualizar el reclamo:", error);
      alert(`Error: ${error.message}`);
    }
  };
  

  const agregarReclamoSinUnidad = async () => {
    try {
      const payload = {
        codigoEdificio: parseInt(codigoEdificio, 10), // Convertir a entero
        ubicacion, // Se envía como string
        descripcion, // Se envía como string
        tipoReclamo: parseInt(tipoReclamo, 10), // Convertir a entero
      };
  
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Asegúrate de que jwtToken esté configurado
        },
        body: JSON.stringify(payload),
      };
  
      const url = "http://localhost:8080/api/reclamos/sinUnidad";
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar el reclamo.");
      }
  
      const idReclamo = await response.json();
      alert(`Reclamo creado exitosamente con ID: ${idReclamo}`);
    } catch (error) {
      console.error("Error al agregar el reclamo:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  const agregarImagen = async () => {
    if (!archivo || !idReclamo || !tipo) {
      alert("Debe seleccionar un archivo, ingresar un ID de reclamo y especificar el tipo.");
      return;
    }
  
    // Crear el FormData
    const formData = new FormData();
    formData.append("archivo", archivo); // Archivo seleccionado
    formData.append("idReclamo", idReclamo); // ID del reclamo asociado
    formData.append("tipo", tipo); // Tipo de archivo
  
    try {
      const response = await fetch("http://localhost:8080/api/imagenes/agregar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`, // JWT Token para autenticación
        },
        body: formData, // FormData con archivo, ID y tipo
      });
  
      // Manejar la respuesta del servidor
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error al subir la imagen: ${errorText}`);
        return;
      }
  
      const result = await response.text();
      alert(`Éxito: ${result}`);
    } catch (error) {
      alert("Ocurrió un error al subir la imagen. Intente nuevamente.");
    }
  };
  
  const actualizarImagen = async () => {
    if (!archivo || !idImagen || !tipo) {
      alert("Por favor, complete todos los campos: archivo, ID de la imagen y tipo.");
      return;
    }
  
    const formData = new FormData();
    formData.append("archivo", archivo); // Archivo seleccionado
    formData.append("tipo", tipo); // Tipo del archivo
    formData.append("id", idImagen); // ID de la imagen a actualizar
  
    const url = `http://localhost:8080/api/imagenes/actualizar/${idImagen}`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Agregar token de autorización
      },
      body: formData, // Form data con archivo, tipo e ID
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      alert("Imagen actualizada correctamente.");
      setShowModal(null); // Cerrar modal después de la actualización
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      alert("Hubo un error al actualizar la imagen.");
    }
  };
  
  const eliminarImagen = async () => {
    if (!idImagen) {
      alert("Por favor, ingresa un ID válido de la imagen.");
      return;
    }
  
    const url = `http://localhost:8080/api/imagenes/${idImagen}`;
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.text();
        alert(result);
        setIdImagen(""); // Limpia el input después de eliminar
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar la imagen:", errorText);
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al intentar eliminar la imagen.");
    }
  };
  
  const verImagen = async () => {
    if (!idImagen) {
      alert("Por favor, ingresa un ID válido de la imagen.");
      return;
    }
  
    const url = `http://localhost:8080/api/imagenes/ver/${idImagen}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const blob = await response.blob(); // Recibe la imagen como blob
        const urlBlob = URL.createObjectURL(blob); // Crea un URL para la imagen
        setModalContent(urlBlob); // Guarda el URL en el estado para mostrar la imagen
      } else {
        const errorText = await response.text();
        console.error("Error al ver la imagen:", errorText);
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al intentar ver la imagen.");
    }
  };
  
  const verImagenesPorReclamo = async (idReclamo) => {
    if (!idReclamo) {
      alert("Por favor, ingresa un ID válido para el reclamo.");
      return;
    }
  
    const url = `http://localhost:8080/api/imagenes/ver/reclamo/${idReclamo}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setModalContent(data); // Guarda las imágenes para mostrarlas en el modal
      } else {
        const errorText = await response.text();
        console.error("Error al obtener imágenes:", errorText);
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al intentar obtener las imágenes.");
    }
  };
  /*METODOS UNIDADES*/
  
  // Función para obtener las unidades donde el usuario es dueño
  const obtenerUnidadesDondeSoyDuenio = async () => {
    const url = 'http://localhost:8080/api/mis-unidades/duenio';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  
    const result = await handleApiCall(url, options);
    if (result) {
      const formattedResult = result.length > 0 ? result.map((unidad, index) => {
        return `Unidad ${index + 1}:
          - ID: ${unidad.id}
          - Código Edificio: ${unidad.edificio.codigo}
          - Piso: ${unidad.piso}
          - Número: ${unidad.numero}
          - Estado: ${unidad.estado}
          - Descripción: ${unidad.descripcion}`;
      }).join("\n") : "No tienes unidades donde eres dueño.";
  
      setModalContent(formattedResult);
      setShowModal("verMisUnidadesDuenio");
    }
  };
  
  
// Función para obtener las unidades donde el usuario es inquilino
const obtenerUnidadesDondeSoyInquilino = async () => {
  const url = 'http://localhost:8080/api/mis-unidades/inquilino';
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`, // Asegúrate de pasar el JWT Token aquí
    },
  };
  
  const result = await handleApiCall(url, options);
  if (result) {
    setModalContent(result); // Procesa la respuesta aquí
    setShowModal("verMisUnidadesInquilino");
  }
};



const cerrarModal = () => {
  setShowModal(null); // Esto asegura que el modal se cierre completamente
  setModalContent(''); // Limpiar el contenido del modal
};

  
  
  

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">PROPSUITE</h1>
        <nav className="header-buttons">
          <div className="dropdown">
            <button className="nav-button">Usuario</button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => setShowModal("actualizarNombreUsuario")}>Actualizar nombre de usuario</button></li>
              <li><button className="dropdown-item" onClick={() => setShowModal("restablecerContrasena")}>Restablecer contraseña</button></li>
              <li><button className="dropdown-item" onClick={cerrarSesion}>Cerrar sesión</button></li>
            </ul>
          </div>
        </nav>
      </header>
      <div className="welcome-section">
        <h2 className="welcome-title">PROPSUITE</h2>
        <p className="welcome-subtitle">Bienvenidos a nuestro sistema, diseñado para hacer tu gestión fácil y dinámica.</p>
      </div>
      <div className="section-container">
  <h2 className="section-title">Reclamos</h2>

  <button className="section-button" onClick={() => {
  setIdReclamo(""); // Limpiar el valor previo del ID
  setModalContent(""); // Limpiar el contenido del modal
  setShowModal("obtenerReclamoPorId"); // Mostrar el modal para ingresar el ID
}}>Ver Reclamo por ID</button>


{showModal === "obtenerReclamoPorId" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Reclamo por ID</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="ID del Reclamo"
        value={idReclamo}
        onChange={(e) => setIdReclamo(e.target.value)}  // Actualiza el valor del ID
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={async () => {
            // Validar si el ID del reclamo es válido
            if (!idReclamo) {
              alert("Por favor, ingrese un ID de reclamo válido.");
              return;
            }
            const url = `http://localhost:8080/api/reclamos/${idReclamo}`;
            const options = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,  // Usar el JWT almacenado
              },
            };

            try {
              const result = await handleApiCall(url, options);  // Realiza la llamada a la API

              if (result) {
                // Formatear la respuesta para mostrarla de manera estética
                const formatted = `
                  <div class="reclamo-item">
                    <strong>ID Reclamo:</strong> ${result.numero} <br>
                    <strong>Documento de Reclamante:</strong> ${result.usuario?.documento || "No disponible"} <br>
                    <strong>Código de Edificio:</strong> ${result.edificio?.codigo || "N/A"} <br>
                    <strong>Ubicación:</strong> ${result.ubicacion} <br>
                    <strong>Identificador de Unidad:</strong> ${
                      result.unidad ? `Piso: ${result.unidad.piso}, Número: ${result.unidad.numero}` : "N/A"
                    } <br>
                    <strong>Descripción:</strong> ${result.descripcion} <br>
                    <strong>Estado:</strong> ${result.estado} <br>
                    <strong>Detalle Estado:</strong> ${result.detalleEstado || "N/A"} <br>
                    <strong>Fecha:</strong> ${result.fecha} <br>
                  </div>
                  <hr>
                `;
                
                // Obtener las imágenes asociadas al reclamo
                const urlImagenes = `http://localhost:8080/api/imagenes/ver/reclamo/${idReclamo}`;
                const optionsImagenes = {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                  },
                };

                const imagenes = await handleApiCall(urlImagenes, optionsImagenes);
                const imagenesContent = imagenes && imagenes.length > 0
                  ? imagenes.map((imagen, index) => `<img src="${imagen.contenido}" alt="Imagen del reclamo ${index + 1}" />`)
                  : "No hay imágenes asociadas a este reclamo.";

                // Añadir las imágenes al contenido
                const finalContent = `${formatted}<strong>Imágenes:</strong><br>${imagenesContent}`;

                // Establecer el contenido del modal y mostrarlo
                setModalContent(finalContent);
                setShowModal("verMisReclamos");
              }
            } catch (error) {
              console.error("Error al obtener el reclamo:", error);
              alert("Hubo un error al obtener el reclamo. Verifica el ID e intenta nuevamente.");
            }
          }}
        >
          Buscar
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


  <button className="section-button" onClick={() => {
    setCodigoEdificio('');
    setModalContent(''); // Limpia el contenido previo del modal
    setShowModal("obtenerReclamosPorEdificio");
  }}>Ver Reclamos por Edificio</button>

  <button className="section-button" onClick={() => {
    setCodigoEdificio('');
    setPiso('');
    setNumero('');
    setModalContent(''); // Limpia el contenido previo del modal
    setShowModal("obtenerReclamosPorUnidad");
  }}>Ver Reclamos por Unidad</button>

  <button className="section-button" onClick={() => {
    setModalContent(''); // Limpia el contenido previo del modal
    obtenerMisReclamos();
  }}>Mis Reclamos</button>

  <button className="section-button" onClick={() => {
    setIdUnidad('');
    setModalContent(''); // Limpia el contenido previo del modal
    setShowModal("verReclamosPorIdUnidad");
  }}>Reclamos por ID Unidad</button>

  <button className="section-button" onClick={() => {
    setIdTipoReclamo('');
    setModalContent(''); // Limpia el contenido previo del modal
    setShowModal("verReclamosPorTipo");
  }}>Reclamos por Tipo</button>

  <button className="section-button" onClick={() => {
    setEstado('');
    setModalContent(''); // Limpia el contenido previo del modal
    setShowModal("verReclamosPorEstado");
  }}>Reclamos por Estado</button>

<button className="section-button" onClick={() => {
      setModalContent(''); // Limpia el contenido previo
      setShowModal("verReclamosEnAreasComunes");
    }}>Reclamos en Áreas Comunes</button>

<button className="section-button" onClick={() => {
    setModalContent(""); // Limpia el contenido previo
    setShowModal("filtrarReclamosPorFecha");
  }}>Filtrar Reclamos por Fecha</button>

<button className="section-button" onClick={() => {
  setCodigoEdificio('');
  setPiso('');
  setNumeroUnidad('');
  setUbicacion('');
  setDescripcion('');
  setTipoReclamo('');
  setModalContent('');
  setShowModal("agregarReclamoConUnidad");
}}>Agregar Reclamo con Unidad</button>

<button className="section-button" onClick={() => {
  setCodigoEdificio('');
  setUbicacion('');
  setDescripcion('');
  setTipoReclamo('');
  setModalContent('');
  setShowModal("agregarReclamoSinUnidad");
}}>Agregar Reclamo sin Unidad</button>

<button className="section-button" onClick={() => {
    setIdReclamo(""); // Limpia el campo previo
    setUbicacion(""); // Limpia el campo previo
    setDescripcion(""); // Limpia el campo previo
    setModalContent(""); // Limpia cualquier contenido previo
    setShowModal("actualizarReclamo");
  }}>Actualizar Reclamo</button>

<button className="section-button" onClick={() => {
    setArchivo(null);
    setIdReclamo("");
    setTipo(""); // Inicializa el tipo
    setShowModal("agregarImagen");
    }}> Agregar Imagen</button> 

<button className="section-button" onClick={() => {
    setArchivo(null);
    setIdImagen("");
    setTipo("");
    setShowModal("actualizarImagen");
  }}> Actualizar Imagen</button>

<button className="section-button" onClick={() => {
    setIdImagen(""); // Limpia el estado anterior
    setShowModal("eliminarImagen");
  }}> Eliminar Imagen</button>

<button className="section-button" onClick={() => {
    setIdImagen(""); // Limpia el estado anterior
    setModalContent(""); // Limpia el contenido previo
    setShowModal("verImagen"); // Muestra el modal
  }}> Ver Imagen por ID</button>

<button className="section-button"  onClick={() => {
    setIdReclamo(""); // Limpia el estado del ID
    setModalContent([]); // Limpia el contenido previo
    setShowModal("verImagenesPorReclamo"); // Abre el modal
  }}> Ver Imágenes de un Reclamo</button>


</div>
      <div className="section-container">
        <h2 className="section-title">Unidades</h2>
        <button className="section-button" onClick={() => {
  setModalContent(''); // Limpia el contenido previo del modal
  setShowModal("verMisUnidadesDuenio");
  obtenerUnidadesDondeSoyDuenio(); // Llama la función para obtener las unidades donde eres dueño
}}>
  Ver Mis Unidades como Dueño
</button>


<button className="section-button" onClick={() => {
  setModalContent(''); // Limpia el contenido previo del modal
  setShowModal("verMisUnidadesInquilino");
  obtenerUnidadesDondeSoyInquilino(); // Llama la función para obtener las unidades donde eres inquilino
}}>
  Ver Mis Unidades como Inquilino
</button>



      </div>
        
      {/* Modales para usuario */}
      {showModal === "actualizarNombreUsuario" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Nombre de Usuario</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Nuevo nombre de usuario"
        value={nuevoNombreUsuario}
        onChange={(e) => setNuevoNombreUsuario(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={actualizarNombreUsuario}>
          Guardar
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


  
{showModal === "restablecerContrasena" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Restablecer Contraseña</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Nombre de usuario"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento: Ejemplo: 'DNI45286575'"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
      />
      <input
        className="modal-input"
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={restablecerContrasena}>
          Restablecer
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "obtenerReclamoPorId" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Reclamo por ID</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="ID del Reclamo"
        value={idReclamo}
        onChange={(e) => setIdReclamo(e.target.value)} // Actualiza el valor del ID
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={obtenerReclamoPorId} // Llamar a la función obtenerReclamoPorId
        >
          Buscar
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
      

      {showModal === "verMisReclamos" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles del Reclamo</h2>
      <div
        className="modal-body"
        dangerouslySetInnerHTML={{ __html: modalContent }} // Aquí renderizamos el contenido como HTML
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

    
      {/* Modal para ver Reclamos por Edificio */}
      {showModal === "obtenerReclamosPorEdificio" && (
        <div className="modal">
          <div className="modal-content custom-modal">
            <h2 className="modal-title">Ver Reclamos por Edificio</h2>
            <input
              className="modal-input"
              type="text"
              placeholder="Código del Edificio"
              value={codigoEdificio}
              onChange={(e) => setCodigoEdificio(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="section-button" onClick={async () => {
                const url = `http://localhost:8080/api/reclamos/edificio/${codigoEdificio}`;
                const options = {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                  },
                };
                const result = await handleApiCall(url, options);
                if (result) {
                  const formatted = result.map((reclamo, index) => `
                    Reclamo ${index + 1}:
                    - ID Reclamo: ${reclamo.numero}
                    - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
                    - Ubicación: ${reclamo.ubicacion}
                    - Descripción: ${reclamo.descripcion}
                    - Estado: ${reclamo.estado}
                    - Fecha: ${reclamo.fecha}`).join("\n");
                  setModalContent(formatted);
                  setShowModal("verMisReclamos");
                }
              }}>Buscar</button>
              <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {showModal === "agregarReclamoConUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Reclamo con Unidad</h2>
      <input
        className="modal-input"
        type="number"
        placeholder="Código del Edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={piso}
        onChange={(e) => setPiso(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número de Unidad"
        value={numeroUnidad}
        onChange={(e) => setNumeroUnidad(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <input
        className="modal-input"
        type="number"
        placeholder="Tipo de Reclamo"
        value={tipoReclamo}
        onChange={(e) => setTipoReclamo(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={agregarReclamoConUnidad}>Agregar</button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

{showModal === "agregarReclamoSinUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Reclamo sin Unidad</h2>
      <input
        className="modal-input"
        type="number"
        placeholder="Código del Edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <input
        className="modal-input"
        type="number"
        placeholder="Tipo de Reclamo"
        value={tipoReclamo}
        onChange={(e) => setTipoReclamo(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={agregarReclamoSinUnidad}>Agregar</button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

      {/* Modal para ver Reclamos por Unidad */}
      {showModal === "obtenerReclamosPorUnidad" && (
        <div className="modal">
          <div className="modal-content custom-modal">
            <h2 className="modal-title">Ver Reclamos por Unidad</h2>
            <input
              className="modal-input"
              type="text"
              placeholder="Código del Edificio"
              value={codigoEdificio}
              onChange={(e) => setCodigoEdificio(e.target.value)}
            />
            <input
              className="modal-input"
              type="text"
              placeholder="Piso"
              value={piso}
              onChange={(e) => setPiso(e.target.value)}
            />
            <input
              className="modal-input"
              type="text"
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="section-button" onClick={async () => {
                const url = `http://localhost:8080/api/reclamos/unidad/${codigoEdificio}/${piso}/${numero}`;
                const options = {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                  },
                };
                const result = await handleApiCall(url, options);
                if (result) {
                  const formatted = result.map((reclamo, index) => `
                    Reclamo ${index + 1}:
                    - ID Reclamo: ${reclamo.numero}
                    - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
                    - Ubicación: ${reclamo.ubicacion}
                    - Descripción: ${reclamo.descripcion}
                    - Estado: ${reclamo.estado}
                    - Fecha: ${reclamo.fecha}`).join("\n");
                  setModalContent(formatted);
                  setShowModal("verMisReclamos");
                }
              }}>Buscar</button>
              <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para ver Reclamos por ID Unidad */}
{showModal === "verReclamosPorIdUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Reclamos por ID Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Ingrese el ID de la Unidad"
        value={idUnidad}
        onChange={(e) => setIdUnidad(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={async () => {
          const url = `http://localhost:8080/api/reclamos/unidad/${idUnidad}`;
          const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          };
          const result = await handleApiCall(url, options);
          if (result) {
            const formatted = result.map((reclamo, index) => `
              Reclamo ${index + 1}:
              - ID Reclamo: ${reclamo.numero}
              - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
              - Ubicación: ${reclamo.ubicacion}
              - Identificador de Unidad: ${reclamo.unidad ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}` : "N/A"}
              - Descripción: ${reclamo.descripcion}
              - Estado: ${reclamo.estado}
              - Fecha: ${reclamo.fecha}`).join("\n");
            setModalContent(formatted);
            setShowModal("verMisReclamos");
          }
        }}>Buscar</button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

{/* Modal para ver Reclamos por Tipo */}
{showModal === "verReclamosPorTipo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Reclamos por Tipo</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Ingrese el ID del Tipo de Reclamo"
        value={idTipoReclamo}
        onChange={(e) => setIdTipoReclamo(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={async () => {
          const url = `http://localhost:8080/api/reclamos/tipo/${idTipoReclamo}`;
          const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          };
          const result = await handleApiCall(url, options);
          if (result) {
            const formatted = result.map((reclamo, index) => `
              Reclamo ${index + 1}:
              - ID Reclamo: ${reclamo.numero}
              - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
              - Tipo de Reclamo: ${idTipoReclamo}
              - Ubicación: ${reclamo.ubicacion}
              - Descripción: ${reclamo.descripcion}
              - Estado: ${reclamo.estado}
              - Fecha: ${reclamo.fecha}`).join("\n");
            setModalContent(formatted);
            setShowModal("verMisReclamos");
          }
        }}>Buscar</button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

{/* Modal para ver Reclamos por Estado */}
{showModal === "verReclamosPorEstado" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Reclamos por Estado</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Ingrese el Estado del Reclamo"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={async () => {
          const url = `http://localhost:8080/api/reclamos/estado/${estado}`;
          const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          };
          const result = await handleApiCall(url, options);
          if (result) {
            const formatted = result.map((reclamo, index) => `
              Reclamo ${index + 1}:
              - ID Reclamo: ${reclamo.numero}
              - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
              - Estado: ${estado}
              - Ubicación: ${reclamo.ubicacion}
              - Identificador de Unidad: ${reclamo.unidad ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}` : "N/A"}
              - Descripción: ${reclamo.descripcion}
              - Fecha: ${reclamo.fecha}`).join("\n");
            setModalContent(formatted);
            setShowModal("verMisReclamos");
          }
        }}>Buscar</button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}
{showModal === "verReclamosEnAreasComunes" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Reclamos en Áreas Comunes</h2>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={async () => {
            const url = "http://localhost:8080/api/reclamos/areas-comunes";
            const options = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
            };
            const result = await handleApiCall(url, options);
            if (result) {
              const formatted = result.map((reclamo, index) => `
                Reclamo ${index + 1}:
                - ID Reclamo: ${reclamo.numero}
                - Documento de Reclamante: ${reclamo.usuario?.documento || "No disponible"}
                - Ubicación: ${reclamo.ubicacion}
                - Identificador de Unidad: ${reclamo.unidad ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}` : "N/A"}
                - Descripción: ${reclamo.descripcion}
                - Estado: ${reclamo.estado}
                - Fecha: ${reclamo.fecha}`).join("\n");
              setModalContent(formatted);
              setShowModal("verMisReclamos");
            }
          }}
        >
          Buscar
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

{showModal === "filtrarReclamosPorFecha" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Filtrar Reclamos por Fecha</h2>
      <p>Seleccione cómo desea ordenar los reclamos:</p>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => filtrarReclamosPorFecha(true)}>
          Más Recientes Primero
        </button>
        <button className="section-button" onClick={() => filtrarReclamosPorFecha(false)}>
          Más Antiguos Primero
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}



{showModal === "actualizarReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Reclamo</h2>
      <input
        className="modal-input"
        type="number"
        placeholder="ID del Reclamo"
        value={idReclamo}
        onChange={(e) => setIdReclamo(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Nueva Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Descripción Actualizada"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={actualizarReclamo}>
          Actualizar
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "agregarImagen" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Imagen</h2>
      <label className="modal-label">Seleccione una imagen:</label>
      <input
        type="file"
        accept="image/*" // Solo permitir imágenes
        onChange={(e) => setArchivo(e.target.files[0])} // Guardar archivo seleccionado
      />
      <label className="modal-label">ID del Reclamo:</label>
      <input
        type="number"
        placeholder="Ingrese el ID del reclamo"
        value={idReclamo}
        onChange={(e) => setIdReclamo(e.target.value)} // Guardar ID del reclamo
      />
      <label className="modal-label">Tipo de Imagen (jpg, png, etc.):</label>
      <input
        type="text"
        placeholder="Ingrese el tipo de imagen"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)} // Guardar tipo de archivo
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={agregarImagen}>
          Subir Imagen
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "actualizarImagen" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Imagen</h2>
      <label className="modal-label">ID de la Imagen:</label>
      <input
        type="number"
        placeholder="Ingrese el ID de la imagen"
        value={idImagen}
        onChange={(e) => setIdImagen(e.target.value)}
      />
      <label className="modal-label">Seleccione un nuevo archivo:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setArchivo(e.target.files[0])}
      />
      <label className="modal-label">Tipo de Archivo:</label>
      <input
        type="text"
        placeholder="Ejemplo: jpg, jpeg, png"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={actualizarImagen}>
          Actualizar Imagen
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "eliminarImagen" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Imagen</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="ID de la Imagen"
        value={idImagen}
        onChange={(e) => setIdImagen(e.target.value)}
      />
      <div className="modal-buttons">
        <button className="section-button" onClick={eliminarImagen}>
          Eliminar
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "verImagen" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Imagen</h2>
      {!modalContent ? (
        <>
          <input
            className="modal-input"
            type="text"
            placeholder="ID de la Imagen"
            value={idImagen}
            onChange={(e) => setIdImagen(e.target.value)}
          />
          <div className="modal-buttons">
            <button className="section-button" onClick={verImagen}>
              Ver Imagen
            </button>
            <button className="section-button" onClick={() => setShowModal(null)}>
              Cerrar
            </button>
          </div>
        </>
      ) : (
        <>
          <img
            src={modalContent}
            alt="Vista previa"
            className="image-preview"
            style={{ maxWidth: "100%", maxHeight: "400px" }}
          />
          <div className="modal-buttons">
            <button className="section-button" onClick={() => setModalContent("")}>
              Ver Otra Imagen
            </button>
            <button className="section-button" onClick={() => setShowModal(null)}>
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

{showModal === "verImagenesPorReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Imágenes del Reclamo</h2>
      {!modalContent || modalContent.length === 0 ? (
        <>
          <input
            className="modal-input"
            type="text"
            placeholder="ID del Reclamo"
            value={idReclamo}
            onChange={(e) => setIdReclamo(e.target.value)}
          />
          <div className="modal-buttons">
            <button className="section-button" onClick={() => verImagenesPorReclamo(idReclamo)}>
              Ver Imágenes
            </button>
            <button className="section-button" onClick={() => setShowModal(null)}>
              Cerrar
            </button>
          </div>
        </>
      ) : (
        <div className="image-gallery">
          {modalContent.map((imagen, index) => (
            <img
              key={index}
              src={imagen.contenido}
              alt={`Imagen ${index + 1}`}
              className="image-preview"
              style={{ maxWidth: "100%", maxHeight: "200px", margin: "10px" }}
            />
          ))}
          <div className="modal-buttons">
            <button className="section-button" onClick={() => setModalContent([])}>
              Ver Otro Reclamo
            </button>
            <button className="section-button" onClick={() => setShowModal(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

{/* modal para unidades*/}

{showModal === "verMisUnidadesDuenio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Mis Unidades como Dueño</h2>
      <div className="modal-body">
        <pre>{modalContent}</pre>
      </div>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "verMisUnidadesInquilino" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Mis Unidades como Inquilino</h2>
      <div className="modal-body">
        <pre>{modalContent}</pre>
      </div>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{/* Modal para mostrar los resultados */}

{showModal === "verMisReclamos" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles del Reclamo</h2>
      <div
        className="modal-body"
        dangerouslySetInnerHTML={{ __html: modalContent }}  // Aquí renderizamos el contenido como HTML
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
}  
  
export default UsuarioDashboard;

