import React, { useState } from "react";

import "./AdminDashboard.css";

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
  const [unidades, setUnidades] = useState([]); 
  const [nombreEdificio, setNombreEdificio] = useState("");
  const [direccionEdificio, setDireccionEdificio] = useState("");
  const [codigoUnidad, setCodigoUnidad] = useState(""); // Estado para el código de unidad
  const [pisoUnidad, setPisoUnidad] = useState(""); // Estado para el piso de unidad
  const [unidad, setUnidad] = useState(null); // Estado para la unidad
  const [idEdificio, setIdEdificio] = useState(""); 

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

  /*METODOS EDIFICIOS*/

// Obtener todos los edificios
const obtenerTodosLosEdificios = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/edificios", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Token JWT
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        setModalContent(data); // Almacena los datos en modalContent
        setShowModal("verTodosLosEdificios"); // Abre el modal
      } else {
        alert("No hay edificios disponibles.");
      }
    } else {
      const errorText = await response.text();
      alert(`Error al obtener edificios: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener edificios:", error);
    alert("Error al conectar con el servidor.");
  }
};


// Obtener un edificio por ID
const obtenerEdificioPorCodigo = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:8080/api/edificios/${codigo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const edificio = await response.json();
      setModalContent(edificio); // Almacena los datos del edificio en modalContent
      setShowModal("detallesEdificio"); // Abre el modal para mostrar el edificio
    } else {
      const errorData = await response.text();
      alert(`Error: ${errorData || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al obtener el edificio por código:", error);
    alert("Error al conectar con el servidor.");
  }
};




// Obtener unidades por edificio
const obtenerUnidadesPorEdificio = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:8080/api/edificios/${codigo}/unidades`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    if (response.ok) {
      const data = await response.json(); // Obtiene la lista de unidades
      setModalContent(data); // Almacena los datos en `modalContent`
      setShowModal("mostrarUnidadesPorEdificio"); // Abre el modal para mostrar las unidades
    } else {
      const errorText = await response.text();
      alert(`Error al obtener unidades: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener unidades por edificio:", error);
    alert("Error al conectar con el servidor.");
  }
};


// Agregar un edificio
const agregarEdificio = async (edificio) => {
  try {
    const response = await fetch("http://localhost:8080/api/edificios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(edificio),
    });
    if (!response.ok) throw new Error("Error al agregar edificio");
    alert(await response.text());
  } catch (error) {
    console.error("Error al agregar edificio:", error);
    alert("Error al agregar edificio.");
  }
};

// Actualizar un edificio
const actualizarEdificio = async (edificio) => {
  try {
    const response = await fetch("http://localhost:8080/api/edificios", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(edificio),
    });
    if (!response.ok) throw new Error("Error al actualizar edificio");
    alert(await response.text());
  } catch (error) {
    console.error("Error al actualizar edificio:", error);
    alert("Error al actualizar edificio.");
  }
};

// Eliminar un edificio
const eliminarEdificio = async (codigo) => {
  try {
    const response = await fetch("http://localhost:8080/api/edificios", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ codigo }),
    });
    if (!response.ok) throw new Error("Error al eliminar edificio");
    alert(await response.text());
  } catch (error) {
    console.error("Error al eliminar edificio:", error);
    alert("Error al eliminar edificio.");
  }
};

const obtenerHabilitadosPorEdificio = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:8080/api/edificios/${codigo}/habilitados`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModalContent(data); // Almacena los datos en modalContent
      setShowModal("habilitadosPorEdificio"); // Abre el modal para mostrar los datos
    } else {
      const errorText = await response.text();
      alert(`Error: ${errorText || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al obtener habilitados por edificio:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Obtener Dueños de un Edificio
const obtenerDueniosPorEdificio = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:8080/api/edificios/${codigo}/duenios`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModalContent(data); // Actualiza el contenido del modal
      setShowModal("verDuenios"); // Cambia el modal
    } else {
      const errorText = await response.text();
      alert(`Error al obtener dueños: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener dueños por edificio:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Obtener Habitantes de un Edificio
const obtenerHabitantesPorEdificio = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:8080/api/edificios/${codigo}/habitantes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModalContent(data);
      setShowModal("verHabitantes");
    } else {
      const errorText = await response.text();
      alert(`Error al obtener habitantes: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener habitantes por edificio:", error);
    alert("Error al conectar con el servidor.");
  }
};


// Obtener Inquilinos de un Edificio
const obtenerInquilinosPorEdificio = async (codigo) => {
  try {
    const response = await fetch(`http://localhost:8080/api/edificios/${codigo}/inquilinos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModalContent(data); // Almacena los datos en el modalContent
      setShowModal("verInquilinos"); // Cambia a mostrar el modal con los resultados
    } else {
      const errorText = await response.text();
      alert(`Error al obtener inquilinos: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener inquilinos por edificio:", error);
    alert("Error al conectar con el servidor.");
  }
};




  /*METODOS UNIDADES*/

  const obtenerTodasLasUnidades = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/unidades", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const unidadesConId = data.map((unidad, index) => ({
          ...unidad,
          id: index + 1, // Agregar un identificador si no está presente
        }));
        setModalContent(unidadesConId); // Almacena las unidades con ID en modalContent
        setShowModal("verTodasLasUnidades"); // Muestra el modal con la lista
      } else {
        const errorText = await response.text();
        alert(`Error al obtener las unidades: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al obtener las unidades:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  const obtenerUnidadPorId = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/unidades/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setModalContent(data); // Almacena la unidad en modalContent
        setShowModal("verUnidadPorId"); // Muestra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al obtener la unidad: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al obtener la unidad:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  const agregarUnidad = async (unidad, idEdificio) => {
    try {
      const response = await fetch(`http://localhost:8080/api/unidades/${idEdificio}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(unidad),
      });
  
      if (response.ok) {
        alert("Unidad agregada con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al agregar la unidad: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al agregar la unidad:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  const actualizarUnidad = async (unidad) => {
    try {
      const response = await fetch("http://localhost:8080/api/unidades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(unidad),
      });
  
      if (response.ok) {
        alert("Unidad actualizada con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al actualizar la unidad: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al actualizar la unidad:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const eliminarUnidad = async (idUnidad) => {
    try {
      const response = await fetch(`http://localhost:8080/api/unidades/${idUnidad}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
  
      if (response.ok) {
        alert("Unidad eliminada con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al eliminar la unidad: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al eliminar la unidad:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const obtenerUnidadPorPisoNumero = async (codigo, piso, numero) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/unidades/unidad?codigo=${codigo}&piso=${piso}&numero=${numero}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setModalContent(data);
        setShowModal("verUnidadPorPisoNumero");
      } else {
        const errorText = await response.text();
        alert(`Error al obtener la unidad: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al obtener la unidad:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  const obtenerDueniosPorUnidad = async (codigo, piso, numero) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/unidades/${codigo}/duenios?piso=${piso}&numero=${numero}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setModalContent(data); // Almacena los dueños en modalContent
        setShowModal("mostrarDueniosPorUnidad"); // Muestra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al obtener los dueños: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al obtener los dueños:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const obtenerInquilinosPorUnidad = async (codigo, piso, numero) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/unidades/${codigo}/inquilinos?piso=${piso}&numero=${numero}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setModalContent(data); // Almacena los inquilinos en modalContent
        setShowModal("mostrarInquilinosPorUnidad"); // Muestra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al obtener los inquilinos: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al obtener los inquilinos:", error);
      alert("Error al conectar con el servidor.");
    }
  }; 
  const obtenerUnidadesAlquiladas = async (codigoEdificio) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/unidades/alquiladas/${codigoEdificio}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setModalContent(data); // Almacena las unidades alquiladas en modalContent
        setShowModal("mostrarUnidadesAlquiladas"); // Abre el modal de resultados
      } else {
        const errorText = await response.text();
        alert(`Error al obtener las unidades alquiladas: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al obtener las unidades alquiladas:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const transferirUnidad = async (codigo, piso, numero, documento) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/unidades/${codigo}/transferir`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({ piso, numero, documento }),
        }
      );
  
      if (response.ok) {
        alert("Unidad transferida con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al transferir la unidad: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al transferir la unidad:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  const agregarDuenioUnidad = async (codigo, piso, numero, documento) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/unidades/${codigo}/agregarDuenio?piso=${piso}&numero=${numero}&documento=${documento}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
  
      if (response.ok) {
        alert("Dueño agregado con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorText = await response.text();
        alert(`Error al agregar dueño: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al agregar dueño:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  // Función para alquilar una unidad
const alquilarUnidad = async (codigo, piso, numero, documento) => {
  try {
    const response = await fetch(`http://localhost:8080/api/unidades/${codigo}/alquilar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ piso, numero, documento }),
    });

    if (response.ok) {
      alert("Unidad alquilada con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al alquilar la unidad: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al alquilar la unidad:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para agregar un inquilino a una unidad
const agregarInquilinoUnidad = async (codigo, piso, numero, documento) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/unidades/${codigo}/agregarInquilino?piso=${piso}&numero=${numero}&documento=${documento}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      alert("Inquilino agregado con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al agregar inquilino: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al agregar inquilino:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para liberar una unidad
const liberarUnidad = async (codigo, piso, numero) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/unidades/${codigo}/liberar?piso=${piso}&numero=${numero}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      alert("Unidad liberada con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al liberar la unidad: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al liberar la unidad:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para habitar una unidad
const habitarUnidad = async (codigo, piso, numero, documento) => {
  try {
    const response = await fetch(`http://localhost:8080/api/unidades/${codigo}/habitar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ piso, numero, documento }),
    });

    if (response.ok) {
      alert("Unidad habitada con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al habitar la unidad: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al habitar la unidad:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para eliminar un inquilino de una unidad
const eliminarInquilinoDeUnidad = async (codigo, piso, numero, dni) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/unidades/${codigo}/eliminarInquilino?piso=${piso}&numero=${numero}&dni=${dni}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      alert("Inquilino eliminado con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al eliminar inquilino: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al eliminar inquilino:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para eliminar un dueño de una unidad
const eliminarDuenioDeUnidad = async (codigo, piso, numero, dni) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/unidades/${codigo}/eliminarDuenio?piso=${piso}&numero=${numero}&dni=${dni}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      alert("Dueño eliminado con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al eliminar dueño: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al eliminar dueño:", error);
    alert("Error al conectar con el servidor.");
  }
};


  /*METODOS PERSONAS*/
  const obtenerTodasLasPersonas = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/personas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
  
      if (response.ok) {
        const personas = await response.json();
        setModalContent(personas); // Almacena las personas en el contenido del modal
        setShowModal("obtenerTodasLasPersonas"); // Muestra el modal
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al obtener las personas:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  
  const obtenerPersonaPorId = async (documento) => {
    try {
      const response = await fetch(`http://localhost:8080/api/personas/${documento}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
  
      if (response.ok) {
        const persona = await response.json();
        setModalContent(persona); // Almacena los datos en modalContent
        setShowModal("detallesPersona"); // Abre el modal para mostrar los datos
      } else {
        const errorData = await response.text();
        alert(`Error: ${errorData || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al obtener persona por ID:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  

  
  const obtenerUnidadesPorId = async (documento) => {
    try {
      const response = await fetch(`http://localhost:8080/api/personas/${documento}/unidades`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
  
      if (response.ok) {
        const unidades = await response.json();
        setModalContent(unidades); // Almacena las unidades en modalContent
        setShowModal("detallesUnidadesPersona"); // Abre el modal para mostrar las unidades
      } else {
        const errorData = await response.text();
        alert(`Error: ${errorData || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al obtener unidades por documento:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  
  const agregarPersona = async (persona) => {
    try {
      const response = await fetch("http://localhost:8080/api/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Incluye el token de autorización
        },
        body: JSON.stringify(persona), // Envía el JSON con la información de la persona
      });
  
      if (response.ok) {
        alert("Persona agregada con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al agregar persona:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  const actualizarPersona = async (persona) => {
    try {
      const response = await fetch("http://localhost:8080/api/personas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(persona),
      });
  
      if (response.ok) {
        alert("Persona actualizada con éxito.");
        setShowModal(null); // Cierra el modal
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al actualizar persona:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  const eliminarPersona = async (documento) => {
    try {
      const response = await fetch(`http://localhost:8080/api/personas`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Indica que se está enviando JSON
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Token JWT
        },
        body: JSON.stringify({ documento }), // Enviar el documento en el cuerpo
      });
  
      if (response.ok) {
        const message = await response.text(); // Leer la respuesta como texto
        alert(message || "Persona eliminada con éxito.");
        setShowModal(null); // Cerrar el modal
      } else {
        const errorData = await response.text(); // Leer el error como texto
        alert(`Error: ${errorData || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al eliminar persona:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  

  /*METODOS TIPOS DE RECLAMOS*/
// Función para obtener todos los tipos de reclamos
const obtenerTodosLosTiposReclamo = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/tiposReclamo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const tipos = await response.json();
      setModalContent(tipos);
      setShowModal("obtenerTodosLosTiposReclamo");
    } else {
      const errorData = await response.text();
      alert(`Error: ${errorData || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al obtener tipos de reclamo:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para obtener un tipo de reclamo por ID
const obtenerTipoReclamoPorId = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/tiposReclamo/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const tipo = await response.json();
      setModalContent(tipo);
      setShowModal("obtenerTipoReclamoPorId");
    } else {
      const errorData = await response.text();
      alert(`Error: ${errorData || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al obtener tipo de reclamo por ID:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Función para agregar un tipo de reclamo
const agregarTipoReclamo = async (tipoReclamo) => {
  try {
    console.log("Enviando datos al servidor:", tipoReclamo); // Debug
    const response = await fetch("http://localhost:8080/api/tiposReclamo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Token de autenticación
      },
      body: JSON.stringify({ descripcion: tipoReclamo.descripcion }), // Envía solo la descripción
    });

    if (response.ok) {
      const data = await response.json(); // Leer el objeto creado
      alert(`Tipo de reclamo agregado correctamente. ID asignado: ${data.id}`);
      setShowModal(null); // Cierra el modal
      setModalContent({ descripcion: "" }); // Limpia el estado
    } else {
      const errorData = await response.text(); // Lee el error como texto
      alert(`Error: ${errorData || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al agregar tipo de reclamo:", error);
    alert("Error al conectar con el servidor.");
  }
};




// Función para actualizar un tipo de reclamo
const actualizarTipoReclamo = async (tipoReclamo) => {
  try {
    const response = await fetch("http://localhost:8080/api/tiposReclamo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(tipoReclamo), // Envía el JSON completo
    });

    if (response.ok) {
      alert("Tipo de reclamo actualizado correctamente.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorData = await response.text();
      alert(`Error: ${errorData || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al actualizar tipo de reclamo:", error);
    alert("Error al conectar con el servidor.");
  }
};


// Función para eliminar un tipo de reclamo
const eliminarTipoReclamo = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/tiposReclamo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      alert("Tipo de reclamo eliminado correctamente.");
      setShowModal(null);
    } else {
      const errorData = await response.text();
      alert(`Error: ${errorData || "Error desconocido"}`);
    }
  } catch (error) {
    console.error("Error al eliminar tipo de reclamo:", error);
    alert("Error al conectar con el servidor.");
  }
};

/* METODOS USUARIO (ADMIN) */
const actualizarUsuario = async (datos) => {
  try {
    const response = await fetch("http://localhost:8080/api/usuario/actualizar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      alert("Usuario actualizado con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al actualizar usuario: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    alert("Error al conectar con el servidor.");
  }
};

const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/usuario/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      alert("Usuario eliminado correctamente.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al eliminar usuario: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    alert("Error al conectar con el servidor.");
  }
};

const agregarAdmin = async (usuario) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/registrarAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(usuario),
    });

    if (response.ok) {
      alert("Administrador registrado con éxito.");
      setShowModal(null); // Cierra el modal
    } else {
      const errorText = await response.text();
      alert(`Error al registrar administrador: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al registrar administrador:", error);
    alert("Error al conectar con el servidor.");
  }
};

 

  /*METODOS RECLAMOS*/

  // Obtener todos los reclamos
const obtenerTodosLosReclamos = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/reclamos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setModalContent(data); // Guarda los reclamos
      setShowModal("mostrarTodosLosReclamos"); // Abre el modal
    } else {
      const errorText = await response.text();
      alert(`Error al obtener reclamos: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener los reclamos:", error);
    alert("Error al conectar con el servidor.");
  }
};

// Obtener reclamos por ID de unidad
const obtenerReclamosPorIdUnidad = async (idUnidad) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/reclamos/unidad/${idUnidad}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setModalContent(data); // Establece el contenido
      setShowModal("mostrarReclamosPorIdUnidad"); // Abre el modal
    } else {
      const errorText = await response.text();
      alert(`Error al obtener reclamos por unidad: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener reclamos por unidad:", error);
    alert("Error al conectar con el servidor.");
  }
};


// Obtener reclamos por persona
const buscarReclamosPorPersona = async (documentoPersona) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/reclamos/persona/${documentoPersona}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Reclamos recibidos por persona:", data);
      setModalContent(data); // Guardar los datos en el estado para mostrarlos en el modal
      setShowModal("mostrarReclamosPorPersona"); // Abrir el modal
    } else {
      const errorText = await response.text();
      alert(`Error al obtener reclamos por persona: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al buscar reclamos por persona:", error);
    alert("Error al conectar con el servidor.");
  }
};



// Obtener todos los reclamos de áreas comunes
const obtenerReclamosAreasComunes = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reclamos/areas-comunes/todos",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Reclamos recibidos:", data); // Confirmar que `numero` está presente
      setModalContent(data); // Guardar la respuesta en el estado
      setShowModal("mostrarReclamosAreasComunes"); // Abrir el modal
    } else {
      const errorText = await response.text();
      alert(`Error al obtener reclamos de áreas comunes: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al obtener reclamos de áreas comunes:", error);
    alert("Error al conectar con el servidor.");
  }
};





const cambiarEstadoReclamo = async (reclamo) => {
  try {
    const payload = {
      ...reclamo,
      idReclamo: parseInt(reclamo.idReclamo, 10), // Convertir a número
    };

    const response = await fetch("http://localhost:8080/api/reclamos/estado", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Estado del reclamo actualizado correctamente.");
      setShowModal(null);
    } else {
      const errorText = await response.text();
      alert(`Error al cambiar estado: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al cambiar estado del reclamo:", error);
    alert("Error al conectar con el servidor.");
  }
};


// Eliminar un reclamo
const eliminarReclamo = async (idReclamo) => {
  try {
    const payload = { idReclamo: parseInt(idReclamo, 10) }; // Convertir a número

    const response = await fetch("http://localhost:8080/api/reclamos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Reclamo eliminado correctamente.");
      setShowModal(null);
    } else {
      const errorText = await response.text();
      alert(`Error al eliminar reclamo: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al eliminar reclamo:", error);
    alert("Error al conectar con el servidor.");
  }
};


  const mostrarReclamo = async (url) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const result = await handleApiCall(url, options);
    if (result) {
      const formattedResult = Array.isArray(result) ? result.map((reclamo, index) => {
        const unidadInfo = reclamo.unidad ? `Piso: ${reclamo.unidad.piso}, Número: ${reclamo.unidad.numero}` : 'N/A';
        return `Reclamo ${index + 1}:
          - ID Reclamo: ${reclamo.numero}
          - Documento de Reclamante: ${reclamo.usuario ? reclamo.usuario.documento : 'No disponible'}
          - Código de Edificio: ${reclamo.edificio ? reclamo.edificio.codigo : 'N/A'}
          - Ubicación: ${reclamo.ubicacion}
          - Identificador de Unidad: ${unidadInfo}
          - Descripción: ${reclamo.descripcion}
          - Estado: ${reclamo.estado}
          - Detalle Estado: ${reclamo.detalleEstado}
          - Fecha: ${reclamo.fecha}\n`;
      }).join("\n") : "No se encontraron reclamos.";
      setModalContent(formattedResult);
      setShowModal("verMisReclamos");
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
  /* METODOS PARA IMAGENES */
  const obtenerTodasLasImagenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/imagenes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener todas las imágenes");
      }
      const data = await response.json();
      setModalContent(data);
      setShowModal("mostrarTodasLasImagenes");
    } catch (error) {
      console.error(error.message);
    }
  };
  const verImagenPorId = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/imagenes/verimagen/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
  
      setModalContent({ imageURL });
      setShowModal("mostrarImagen");
    } catch (error) {
      console.error("Error al obtener la imagen:", error.message);
      alert("No se pudo obtener la imagen. Revisa la consola para más detalles.");
    }
  };
  
  const verImagenesPorReclamo = async (idReclamo) => {
    try {
      const response = await fetch(`http://localhost:8080/api/imagenes/ver/imagenreclamo/${idReclamo}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setModalContent(data);
      setShowModal("mostrarImagenesReclamo");
    } catch (error) {
      console.error("Error al obtener las imágenes del reclamo:", error.message);
      alert("No se pudieron obtener las imágenes. Revisa la consola para más detalles.");
    }
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

<button className="section-button" onClick={() => obtenerTodosLosReclamos()}>
  Ver Todos los Reclamos
</button>

<button
  className="section-button"
  onClick={() => setShowModal("verReclamosPorIdUnidad")}
>
  Ver Reclamos por Unidad
</button>

<button
  className="section-button"
  onClick={obtenerReclamosAreasComunes}
>
  Ver Reclamos en Áreas Comunes
</button>

<button
  className="section-button"
  onClick={() => setShowModal("buscarReclamosPorPersona")}
>
  Buscar Reclamos por Persona
</button>





<button
  className="section-button"
  onClick={() => setShowModal("cambiarEstadoReclamo")}
>
  Cambiar Estado de Reclamo
</button>

<button
  className="section-button"
  onClick={() => setShowModal("eliminarReclamo")}
>
  Eliminar Reclamo
</button>
{/* <button
  className="section-button"
  onClick={() => {
    const id = prompt("Ingrese el ID de la imagen:");
    if (id) verImagenPorId(id);
  }}
>
  Ver Imagen por ID
</button>
<button
  className="section-button"
  onClick={() => {
    const idReclamo = prompt("Ingrese el ID del reclamo:");
    if (idReclamo) verImagenesPorReclamo(idReclamo);
  }}
>
  Ver Imágenes por Reclamo
</button>
<button
  className="section-button"
  onClick={obtenerTodasLasImagenes}
>
  Ver Todas las Imágenes
</button> */}
</div>


<div className="section-container">
        <h2 className="section-title">Edificios</h2>
        <button
  className="section-button"
  onClick={obtenerTodosLosEdificios} // Invoca directamente el método
>
  Ver Todos los Edificios
</button>


<button
  className="section-button"
  onClick={() => {
    setModalContent({ codigo: "" }); // Limpia el contenido previo
    setShowModal("ingresarCodigoEdificio");
  }}
>
  Ver Edificio por Código
</button>


<button
  className="section-button"
  onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setModalContent(""); // Limpia cualquier contenido previo
    setShowModal("verUnidadesPorEdificio"); // Abre el modal para ingresar el código
  }}
>
  Ver Unidades por Edificio
</button>


<button className="section-button" onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setModalContent(""); // Limpia cualquier contenido previo
    setShowModal("agregarEdificio");
  }}>Agregar Edificio</button>

<button className="section-button" onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setNombreEdificio(""); // Limpia el campo previo
    setDireccionEdificio(""); // Limpia el campo previo
    setModalContent(""); // Limpia cualquier contenido previo
    setShowModal("actualizarEdificio");
  }}>Actualizar Edificio</button>

<button className="section-button" onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setModalContent(""); // Limpia cualquier contenido previo
    setShowModal("eliminarEdificio");
  }}>Eliminar Edificio</button>

<button
  className="section-button"
  onClick={() => {
    setModalContent({ codigo: "" }); // Limpia el contenido previo
    setShowModal("ingresarCodigoHabilitados");
  }}
>
  Ver Personas Habilitadas
</button>

<button
  className="section-button"
  onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setShowModal("verDueniosPorEdificio");
  }}
>
  Ver Dueños
</button>

<button
  className="section-button"
  onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setShowModal("verHabitantesPorEdificio");
  }}
>
  Ver Habitantes
</button>

<button
  className="section-button"
  onClick={() => {
    setCodigoEdificio(""); // Limpia el campo previo
    setShowModal("verInquilinosPorEdificio");
  }}
>
  Ver Inquilinos
</button>


</div>



      <div className="section-container">
        <h2 className="section-title">Unidades</h2>
        <button className="section-button" onClick={obtenerTodasLasUnidades}>
  Ver Todas las Unidades
</button>

<button
  className="section-button"
  onClick={() => {
    setCodigoUnidad("");
    setShowModal("verUnidadPorIdInput");
  }}
>
  Ver Unidad por ID
</button>

<button
  className="section-button"
  onClick={() => {
    setCodigoEdificio("");
    setPisoUnidad("");
    setNumeroUnidad("");
    setShowModal("verUnidadPorPisoNumeroInput");
  }}
>
  Ver Unidad por Piso y Número
</button>

<button
  className="section-button"
  onClick={() => {
    setUnidad({ piso: "", numero: "" });
    setIdEdificio("");
    setShowModal("agregarUnidad");
  }}
>
  Agregar Unidad
</button>

<button
  className="section-button"
  onClick={() => {
    setUnidad({ id: "", piso: "", numero: "" });
    setShowModal("actualizarUnidad");
  }}
>
  Actualizar Unidad
</button>

<button
  className="section-button"
  onClick={() => {
    setIdUnidad("");
    setShowModal("eliminarUnidad");
  }}
>
  Eliminar Unidad
</button>
 {/* Ver Dueños por Unidad */}
 <button
    className="section-button"
    onClick={() => {
      setModalContent({ codigo: "", piso: "", numero: "" }); // Limpia el contenido previo
      setShowModal("verDueniosPorUnidad");
    }}
  >
    Ver Dueños por Unidad
  </button>

  {/* Ver Inquilinos por Unidad */}
  <button
  className="section-button"
  onClick={() => {
    setModalContent({ codigo: "", piso: "", numero: "" }); // Limpia cualquier contenido previo
    setShowModal("verInquilinosPorUnidad");
  }}
>
  Ver Inquilinos por Unidad
</button>


  {/* Ver Unidades Alquiladas por Edificio */}
  <button
    className="section-button"
    onClick={() => {
      setModalContent({ codigoEdificio: "" }); // Limpia el contenido previo
      setShowModal("verUnidadesAlquiladas");
    }}
  >
    Ver Unidades Alquiladas
  </button>

  {/* Transferir Unidad */}
  <button
    className="section-button"
    onClick={() => {
      setModalContent({ codigo: "", piso: "", numero: "", documento: "" });
      setShowModal("transferirUnidad");
    }}
  >
    Transferir Unidad
  </button>

  {/* Agregar Dueño a Unidad */}
  <button
  className="section-button"
  onClick={() => {
    setModalContent({ codigo: "", piso: "", numero: "", documento: "" }); // Limpia cualquier contenido previo
    setShowModal("agregarDuenioUnidad");
  }}
>
  Agregar Dueño a Unidad
</button>
{/* Botón para alquilar una unidad */}
<button
  className="section-button"
  onClick={() => setShowModal("alquilarUnidad")}
>
  Alquilar Unidad
</button>

{/* Botón para agregar un inquilino */}
<button
  className="section-button"
  onClick={() => setShowModal("agregarInquilinoUnidad")}
>
  Agregar Inquilino a Unidad
</button>

{/* Botón para liberar una unidad */}
<button
  className="section-button"
  onClick={() => setShowModal("liberarUnidad")}
>
  Liberar Unidad
</button>

{/* Botón para habitar una unidad */}
<button
  className="section-button"
  onClick={() => setShowModal("habitarUnidad")}
>
  Habitar Unidad
</button>

{/* Botón para eliminar un inquilino */}
<button
  className="section-button"
  onClick={() => setShowModal("eliminarInquilinoDeUnidad")}
>
  Eliminar Inquilino
</button>

{/* Botón para eliminar un dueño */}
<button
  className="section-button"
  onClick={() => setShowModal("eliminarDuenioDeUnidad")}
>
  Eliminar Dueño
</button>


      </div>


      <div className="section-container">
        <h2 className="section-title">Personas</h2>

        <button className="section-button"
         onClick={obtenerTodasLasPersonas}> Ver Todas las Personas
         </button>

         <button
  className="section-button"
  onClick={() => {
    setModalContent({ documento: "" }); // Limpia el contenido previo
    setShowModal("ingresarDocumentoPersona");
  }}
>
  Ver Persona por Documento
</button>

<button
  className="section-button"
  onClick={() => {
    setModalContent({ documento: "" }); // Limpia el contenido previo
    setShowModal("ingresarDocumentoUnidades");
  }}
>
  Ver Unidades por Persona
</button>

<button
  className="section-button"
  onClick={() => setShowModal("agregarPersona")} // Abre el modal para agregar persona
>
  Agregar Persona
</button>

<button
  className="section-button"
  onClick={() => setShowModal("actualizarPersona")} // Abre el modal para actualizar persona
>
  Actualizar Persona
</button>

<button
  className="section-button"
  onClick={() => setShowModal("eliminarPersona")} // Abre el modal para eliminar persona
>
  Eliminar Persona
</button>

      </div>

      <div className="section-container">
        <h2 className="section-title">Tipos de Reclamo</h2>
        <div>
  <button className="section-button" onClick={obtenerTodosLosTiposReclamo}>
    Ver Todos los Tipos de Reclamo
  </button>
  <button
    className="section-button"
    onClick={() => {
      const id = prompt("Ingrese el ID del tipo de reclamo:");
      if (id) {
        obtenerTipoReclamoPorId(id);
      }
    }}
  >
    Ver Tipo de Reclamo por ID
  </button>
  <button
    className="section-button"
    onClick={() => setShowModal("agregarTipoReclamo")}
  >
    Agregar Tipo de Reclamo
  </button>
  <button
    className="section-button"
    onClick={() => setShowModal("actualizarTipoReclamo")}
  >
    Actualizar Tipo de Reclamo
  </button>
  <button
    className="section-button"
    onClick={() => {
      const id = prompt("Ingrese el ID del tipo de reclamo para eliminar:");
      if (id) {
        eliminarTipoReclamo(id);
      }
    }}
  >
    Eliminar Tipo de Reclamo
  </button>
</div>


      </div>


      <div className="section-container">
        <h2 className="section-title">Usuarios</h2>
        {/* Botón para actualizar usuario */}
<button
  className="section-button"
  onClick={() => {
    setModalContent({
      documento: "",
      nombreUsuario: "",
      contrasena: "",
    }); // Inicializa los datos
    setShowModal("actualizarUsuario");
  }}
>
  Actualizar Usuario
</button>

{/* Botón para eliminar usuario */}
<button
  className="section-button"
  onClick={() => {
    setModalContent({ id: "" }); // Inicializa el ID
    setShowModal("eliminarUsuario");
  }}
>
  Eliminar Usuario
</button>

{/* Botón para agregar administrador */}
<button
  className="section-button"
  onClick={() => {
    setModalContent({
      nombreUsuario: "",
      contrasena: "",
      persona: { documento: "" },
      rol: { id: 1 },
    }); // Inicializa los datos
    setShowModal("agregarAdmin");
  }}
>
  Registrar Administrador
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
)};

{/*SHOWMODAL PERSONAS*/}
{showModal === "obtenerTodasLasPersonas" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Todas las Personas</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((persona, index) => (
              <li key={index}>
                {persona.nombre} {persona.apellido} - Documento: {persona.documento}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay personas disponibles.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
{showModal === "ingresarDocumentoPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Documento</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento"
        value={modalContent.documento}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerPersonaPorId(modalContent.documento)}
        >
          Ver Persona
        </button>
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

{showModal === "ingresarDocumentoUnidades" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Documento</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento"
        value={modalContent.documento}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerUnidadesPorId(modalContent.documento)}
        >
          Ver Unidades
        </button>
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



{showModal === "obtenerPersonaPorId" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles de la Persona</h2>
      <div className="modal-body">
        {modalContent ? (
          <p>
            Nombre: {modalContent.nombre} {modalContent.apellido} <br />
            Documento: {modalContent.documento} <br />
          </p>
        ) : (
          <p>No se encontraron detalles de la persona.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)} 
{showModal === "obtenerUnidadesPorPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Unidades Asociadas</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((unidad, index) => (
              <li key={index} className="unidad-item">
                <p>
                  <strong>Edificio:</strong> {unidad.edificio.nombre} <br />
                  <strong>Dirección:</strong> {unidad.edificio.direccion} <br />
                  <strong>Piso:</strong> {unidad.piso} <br />
                  <strong>Número:</strong> {unidad.numero} <br />
                  <strong>Habitado:</strong> {unidad.habitado ? "Sí" : "No"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay unidades asociadas a este documento.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)} 
        >Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "detallesPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles de la Persona</h2>
      {modalContent ? (
        <p>
          Documento: {modalContent.documento} <br />
          Nombre: {modalContent.nombre}
        </p>
      ) : (
        <p>No se encontraron detalles para este documento.</p>
      )}
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


{showModal === "agregarPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Persona</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento"
        value={modalContent?.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Nombre"
        value={modalContent?.nombre || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, nombre: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => agregarPersona(modalContent)}
        >
          Guardar
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "actualizarPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Persona</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento"
        value={modalContent?.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Nombre"
        value={modalContent?.nombre || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, nombre: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => actualizarPersona(modalContent)}
        >
          Guardar
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "eliminarPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Persona</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento"
        value={modalContent?.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => eliminarPersona(modalContent.documento)}
        >
          Eliminar
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cerrar el modal
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "obtenerTodosLosTiposReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Todos los Tipos de Reclamo</h2>
      <ul>
        {Array.isArray(modalContent) &&
          modalContent.map((tipo, index) => (
            <li key={index}>
              <strong>ID:</strong> {tipo.id} <br />
              <strong>Descripción:</strong> {tipo.descripcion}
            </li>
          ))}
      </ul>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}


{showModal === "obtenerTipoReclamoPorId" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Tipo de Reclamo</h2>
      <p>{modalContent.descripcion}</p>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}

{showModal === "agregarTipoReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Tipo de Reclamo</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Descripción"
        value={modalContent?.descripcion || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, descripcion: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => agregarTipoReclamo(modalContent)}
        >
          Guardar
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}



{showModal === "actualizarTipoReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Tipo de Reclamo</h2>
      <input
        className="modal-input"
        type="number"
        placeholder="ID"
        value={modalContent?.id || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, id: parseInt(e.target.value) })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Descripción"
        value={modalContent?.descripcion || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, descripcion: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => actualizarTipoReclamo(modalContent)}
        >
          Actualizar
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{/* SHOWMODAL PARA EDIFICIOS */}
{showModal === "verTodosLosEdificios" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Lista de Edificios</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((edificio, index) => (
              <li key={index}>
                {edificio.nombre} - {edificio.direccion} (Código: {edificio.codigo})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay edificios disponibles.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "ingresarCodigoEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Código del Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerEdificioPorCodigo(modalContent.codigo)}
        >
          Ver Edificio
        </button>
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



{showModal === "verEdificioPorCodigo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles del Edificio</h2>
      <div className="modal-body">
        {modalContent ? (
          <p>
            Nombre: {modalContent.nombre} <br />
            Dirección: {modalContent.direccion} <br />
            Código: {modalContent.codigo}
          </p>
        ) : (
          <p>No se encontraron detalles del edificio.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "verUnidadesPorEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Unidades por Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerUnidadesPorEdificio(codigoEdificio)} // Llama al método con el código ingresado
        >
          Ver Unidades
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
{showModal === "detallesUnidadesPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Unidades Asociadas</h2>
      {Array.isArray(modalContent) && modalContent.length > 0 ? (
        <ul>
          {modalContent.map((unidad, index) => (
            <li key={index}>
              Piso: {unidad.piso}, Número: {unidad.numero}, Habitado:{" "}
              {unidad.habitado ? "Sí" : "No"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay unidades asociadas para este documento.</p>
      )}
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

{showModal === "detallesEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles del Edificio</h2>
      {modalContent ? (
        <p>
          Código: {modalContent.codigo} <br />
          Nombre: {modalContent.nombre} <br />
          Dirección: {modalContent.direccion}
        </p>
      ) : (
        <p>No se encontraron detalles para este código.</p>
      )}
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


{showModal === "mostrarUnidadesPorEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Unidades del Edificio</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((unidad, index) => (
              <li key={index}>
                Piso: {unidad.piso}, Número: {unidad.numero}, 
                {unidad.habitado ? " Habitado" : " No Habitado"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay unidades disponibles en este edificio.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => setShowModal(null)} // Cierra el modal
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{showModal === "agregarEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Edificio</h2>
      <input
        type="text"
        placeholder="Nombre del edificio"
        value={modalContent?.nombre || ""}
        onChange={(e) => setModalContent({ ...modalContent, nombre: e.target.value })}
      />
      <input
        type="text"
        placeholder="Dirección del edificio"
        value={modalContent?.direccion || ""}
        onChange={(e) => setModalContent({ ...modalContent, direccion: e.target.value })}
      />
      <button className="section-button" onClick={() => agregarEdificio(modalContent)}>Guardar</button>
      <button className="section-button" onClick={() => setShowModal(null)}>Cancelar</button>
    </div>
  </div>
)}

{showModal === "actualizarEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Edificio</h2>
      <input
        type="text"
        placeholder="Código del edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nombre del edificio"
        value={nombreEdificio}
        onChange={(e) => setNombreEdificio(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección del edificio"
        value={direccionEdificio}
        onChange={(e) => setDireccionEdificio(e.target.value)}
      />
      <button className="section-button" onClick={() => actualizarEdificio({ codigo: codigoEdificio, nombre: nombreEdificio, direccion: direccionEdificio })}>
        Guardar
      </button>
      <button className="section-button" onClick={() => setShowModal(null)}>Cancelar</button>
    </div>
  </div>
)}

{showModal === "eliminarEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Edificio</h2>
      <input
        type="text"
        placeholder="Código del edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <button className="section-button" onClick={() => eliminarEdificio(codigoEdificio)}>Eliminar</button>
      <button className="section-button" onClick={() => setShowModal(null)}>Cancelar</button>
    </div>
  </div>
)}

{showModal === "ingresarCodigoHabilitados" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Código del Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerHabilitadosPorEdificio(modalContent.codigo)}
        >
          Ver Personas Habilitadas
        </button>
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

{showModal === "ingresarCodigoDuenios" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Código del Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerDueniosPorEdificio(modalContent.codigo)}
        >
          Ver Dueños
        </button>
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
{showModal === "ingresarCodigoHabilitados" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Código del Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerHabilitadosPorEdificio(modalContent.codigo)}
        >
          Ver Personas Habilitadas
        </button>
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

{showModal === "ingresarCodigoDuenios" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Código del Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerDueniosPorEdificio(modalContent.codigo)}
        >
          Ver Dueños
        </button>
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

{showModal === "ingresarCodigoHabitantes" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ingresar Código del Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerHabitantesPorEdificio(modalContent.codigo)}
        >
          Ver Habitantes
        </button>
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


{showModal === "habilitadosPorEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Personas Habilitadas</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((persona, index) => (
              <li key={index}>
                {persona.nombre} {persona.apellido} (DNI: {persona.documento})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay personas habilitadas en este edificio.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}



{showModal === "verDueniosPorEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Dueños por Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerDueniosPorEdificio(codigoEdificio)}
        >
          Ver Dueños
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "verDuenios" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Lista de Dueños</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((persona, index) => (
              <li key={index}>
                <strong>Nombre:</strong> {persona.nombre} {persona.apellido} <br />
                <strong>DNI:</strong> {persona.documento}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron dueños para este edificio.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}



{showModal === "verHabitantesPorEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Habitantes por Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerHabitantesPorEdificio(codigoEdificio)}
        >
          Ver Habitantes
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
{showModal === "verHabitantes" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Lista de Habitantes</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((persona, index) => (
              <li key={index}>
                <strong>Nombre:</strong> {persona.nombre} {persona.apellido} <br />
                <strong>DNI:</strong> {persona.documento}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron habitantes para este edificio.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{showModal === "verInquilinosPorEdificio" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Inquilinos por Edificio</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerInquilinosPorEdificio(codigoEdificio)}
        >
          Ver Inquilinos
        </button>
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
{showModal === "verInquilinos" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Lista de Inquilinos</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((persona, index) => (
              <li key={index}>
                <strong>Nombre:</strong> {persona.nombre} {persona.apellido} <br />
                <strong>DNI:</strong> {persona.documento}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron inquilinos para este edificio.</p>
        )}
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
{/* { SHOWMODAL PARA UNIDADES } */}
{showModal === "verTodasLasUnidades" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Lista de Unidades</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((unidad) => (
              <li key={unidad.id}>
                ID: {unidad.id} <br />
                Edificio: {unidad.edificio.nombre} <br />
                Dirección: {unidad.edificio.direccion} <br />
                Piso: {unidad.piso} <br />
                Número: {unidad.numero} <br />
                Habitado: {unidad.habitado ? "Sí" : "No"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay unidades disponibles.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "verUnidadPorId" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles de la Unidad</h2>
      <div className="modal-body">
        {modalContent ? (
          <>
            <p>
              <strong>Edificio:</strong> {modalContent.edificio?.nombre || "Sin nombre"} <br />
              <strong>Dirección del Edificio:</strong> {modalContent.edificio?.direccion || "Sin dirección"} <br />
              <strong>Piso:</strong> {modalContent.piso || "Sin piso"} <br />
              <strong>Número:</strong> {modalContent.numero || "Sin número"} <br />
              <strong>Habitado:</strong> {modalContent.habitado ? "Sí" : "No"} <br />
            </p>
          </>
        ) : (
          <p>No se encontraron detalles de la unidad.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{showModal === "verUnidadPorIdInput" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Buscar Unidad por ID</h2>
      <input
        type="text"
        className="modal-input"
        placeholder="Ingrese el ID de la unidad"
        value={codigoUnidad}
        onChange={(e) => setCodigoUnidad(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => obtenerUnidadPorId(codigoUnidad)}
        >
          Buscar
        </button>
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
{showModal === "agregarUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Unidad</h2>
      <input
        type="text"
        className="modal-input"
        placeholder="Piso"
        value={unidad.piso || ""}
        onChange={(e) =>
          setUnidad({ ...unidad, piso: e.target.value })
        }
      />
      <input
        type="text"
        className="modal-input"
        placeholder="Número"
        value={unidad.numero || ""}
        onChange={(e) =>
          setUnidad({ ...unidad, numero: e.target.value })
        }
      />
      <input
        type="text"
        className="modal-input"
        placeholder="ID del Edificio"
        value={idEdificio || ""}
        onChange={(e) => setIdEdificio(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => agregarUnidad(unidad, idEdificio)}
        >
          Guardar
        </button>
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
{showModal === "actualizarUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Unidad</h2>
      <input
        type="text"
        className="modal-input"
        placeholder="ID de la Unidad"
        value={unidad.id || ""}
        onChange={(e) =>
          setUnidad({ ...unidad, id: e.target.value })
        }
      />
      <input
        type="text"
        className="modal-input"
        placeholder="Piso"
        value={unidad.piso || ""}
        onChange={(e) =>
          setUnidad({ ...unidad, piso: e.target.value })
        }
      />
      <input
        type="text"
        className="modal-input"
        placeholder="Número"
        value={unidad.numero || ""}
        onChange={(e) =>
          setUnidad({ ...unidad, numero: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => actualizarUnidad(unidad)}
        >
          Guardar
        </button>
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
{showModal === "eliminarUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Unidad</h2>
      <p>Ingrese el ID de la unidad que desea eliminar:</p>
      <input
        type="text"
        className="modal-input"
        placeholder="ID de la Unidad"
        value={idUnidad}
        onChange={(e) => setIdUnidad(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => eliminarUnidad(idUnidad)}
        >
          Eliminar
        </button>
        <button
          className="section-button"
          onClick={() => setShowModal(null)}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
{showModal === "verUnidadPorPisoNumeroInput" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Buscar Unidad por Código, Piso y Número</h2>
      <input
        type="text"
        className="modal-input"
        placeholder="Código del Edificio"
        value={codigoEdificio}
        onChange={(e) => setCodigoEdificio(e.target.value)}
      />
      <input
        type="text"
        className="modal-input"
        placeholder="Piso"
        value={pisoUnidad}
        onChange={(e) => setPisoUnidad(e.target.value)}
      />
      <input
        type="text"
        className="modal-input"
        placeholder="Número"
        value={numeroUnidad}
        onChange={(e) => setNumeroUnidad(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            obtenerUnidadPorPisoNumero(codigoEdificio, pisoUnidad, numeroUnidad)
          }
        >
          Buscar
        </button>
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
{showModal === "verUnidadPorPisoNumero" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Detalles de la Unidad</h2>
      <div className="modal-body">
        {modalContent ? (
          <p>
            Edificio: {modalContent.edificio.nombre} <br />
            Dirección: {modalContent.edificio.direccion} <br />
            Piso: {modalContent.piso} <br />
            Número: {modalContent.numero} <br />
            Habitado: {modalContent.habitado ? "Sí" : "No"}
          </p>
        ) : (
          <p>No se encontraron detalles de la unidad.</p>
        )}
      </div>
      <div className="modal-buttons">
        <button className="section-button" onClick={() => setShowModal(null)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

{showModal === "verDueniosPorUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Dueños por Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            obtenerDueniosPorUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero
            )
          }
        >
          Ver Dueños
        </button>
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
{showModal === "mostrarDueniosPorUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Dueños de la Unidad</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((duenio, index) => (
              <li key={index}>
                Documento: {duenio.documento} <br />
                Nombre: {duenio.nombre}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron dueños para esta unidad.</p>
        )}
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
{showModal === "verUnidadesAlquiladas" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Unidades Alquiladas</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del Edificio"
        value={modalContent.codigoEdificio || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigoEdificio: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            obtenerUnidadesAlquiladas(modalContent.codigoEdificio)
          }
        >
          Ver Unidades
        </button>
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
{showModal === "mostrarUnidadesAlquiladas" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Unidades Alquiladas</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((unidad, index) => (
              <li key={index}>
                Piso: {unidad.piso}, Número: {unidad.numero}, Habitado:{" "}
                {unidad.habitado ? "Sí" : "No"} <br />
                Edificio: {unidad.edificio.nombre} - {unidad.edificio.direccion}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron unidades alquiladas para este edificio.</p>
        )}
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
)}{showModal === "transferirUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Transferir Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento del nuevo dueño"
        value={modalContent.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            transferirUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.documento
            )
          }
        >
          Transferir
        </button>
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
{showModal === "verInquilinosPorUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Ver Inquilinos por Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            obtenerInquilinosPorUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero
            )
          }
        >
          Ver Inquilinos
        </button>
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

{showModal === "mostrarInquilinosPorUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Inquilinos de la Unidad</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((inquilino, index) => (
              <li key={index}>
                Documento: {inquilino.documento} <br />
                Nombre: {inquilino.nombre}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron inquilinos para esta unidad.</p>
        )}
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
{showModal === "agregarDuenioUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Dueño a Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento del dueño"
        value={modalContent.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            agregarDuenioUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.documento
            )
          }
        >
          Agregar Dueño
        </button>
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
{/* Modal para alquilar una unidad */}
{showModal === "alquilarUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Alquilar Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento del inquilino"
        value={modalContent.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            alquilarUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.documento
            )
          }
        >
          Alquilar
        </button>
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

{/* Modal para agregar inquilino a una unidad */}
{showModal === "agregarInquilinoUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Agregar Inquilino a Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento del inquilino"
        value={modalContent.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            agregarInquilinoUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.documento
            )
          }
        >
          Agregar
        </button>
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

{/* Modal para liberar una unidad */}
{showModal === "liberarUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Liberar Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            liberarUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero
            )
          }
        >
          Liberar
        </button>
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

{/* Modal para habitar una unidad */}
{showModal === "habitarUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Habitar Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento de la persona"
        value={modalContent.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            habitarUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.documento
            )
          }
        >
          Habitar
        </button>
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

{/* Modal para eliminar un inquilino */}
{showModal === "eliminarInquilinoDeUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Inquilino de Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="DNI del inquilino"
        value={modalContent.dni || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, dni: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            eliminarInquilinoDeUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.dni
            )
          }
        >
          Eliminar
        </button>
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

{/* Modal para eliminar un dueño */}
{showModal === "eliminarDuenioDeUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Dueño de Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Código del edificio"
        value={modalContent.codigo || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, codigo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Piso"
        value={modalContent.piso || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, piso: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Número"
        value={modalContent.numero || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, numero: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="DNI del dueño"
        value={modalContent.dni || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, dni: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            eliminarDuenioDeUnidad(
              modalContent.codigo,
              modalContent.piso,
              modalContent.numero,
              modalContent.dni
            )
          }
        >
          Eliminar
        </button>
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


{/* SHOW MODAL USUARIO */}
{showModal === "actualizarUsuario" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Actualizar Usuario</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento"
        value={modalContent.documento || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documento: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Nombre de Usuario"
        value={modalContent.nombreUsuario || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, nombreUsuario: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="password"
        placeholder="Contraseña"
        value={modalContent.contrasena || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, contrasena: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => actualizarUsuario(modalContent)}
        >
          Actualizar
        </button>
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
{showModal === "eliminarUsuario" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Eliminar Usuario</h2>
      <input
        className="modal-input"
        type="text" // Permite al usuario ingresar texto, pero se validará
        placeholder="ID del Usuario"
        value={modalContent.id || ""}
        onChange={(e) => {
          // Validar que el valor ingresado sea un número
          const valor = e.target.value;
          if (!isNaN(valor) && valor.trim() !== "") {
            setModalContent({ ...modalContent, id: valor });
          } else {
            setModalContent({ ...modalContent, id: "" });
          }
        }}
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => {
            if (modalContent.id && !isNaN(modalContent.id)) {
              eliminarUsuario(parseInt(modalContent.id)); // Convertir a int antes de enviar
            } else {
              alert("Por favor, ingrese un ID válido.");
            }
          }}
        >
          Eliminar
        </button>
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

{showModal === "agregarAdmin" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Registrar Administrador</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Nombre de Usuario"
        value={modalContent.nombreUsuario || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, nombreUsuario: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="password"
        placeholder="Contraseña"
        value={modalContent.contrasena || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, contrasena: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Documento de la Persona"
        value={modalContent.persona.documento || ""}
        onChange={(e) =>
          setModalContent({
            ...modalContent,
            persona: { ...modalContent.persona, documento: e.target.value },
          })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() => agregarAdmin(modalContent)}
        >
          Registrar
        </button>
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

{/* metodos reclamos */}
{showModal === "mostrarTodosLosReclamos" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Todos los Reclamos</h2>
      <ul>
        {modalContent.map((reclamo, index) => (
          <li key={index}>
            ID: {reclamo.id} <br />
            Descripción: {reclamo.descripcion}
          </li>
        ))}
      </ul>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}


{showModal === "verReclamosPorIdUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Reclamos por Unidad</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="ID de Unidad"
        onChange={(e) =>
          setModalContent({ ...modalContent, idUnidad: e.target.value })
        }
      />
      <button
        className="section-button"
        onClick={() => obtenerReclamosPorIdUnidad(modalContent.idUnidad)}
      >
        Ver Reclamos
      </button>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}

{showModal === "buscarReclamosPorPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Buscar Reclamos por Persona</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="Documento de la Persona"
        value={modalContent.documentoPersona || ""}
        onChange={(e) =>
          setModalContent({ ...modalContent, documentoPersona: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button
          className="section-button"
          onClick={() =>
            buscarReclamosPorPersona(modalContent.documentoPersona)
          }
        >
          Buscar
        </button>
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

{showModal === "mostrarReclamosPorPersona" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Reclamos por Persona</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((reclamo, index) => (
              <li key={index}>
                <strong>ID:</strong> {reclamo.numero || "N/A"} <br />
                <strong>Edificio:</strong> {reclamo.edificio.nombre || "N/A"} -{" "}
                {reclamo.edificio.direccion || "N/A"} <br />
                <strong>Descripción:</strong> {reclamo.descripcion || "N/A"}{" "}
                <br />
                <strong>Estado:</strong> {reclamo.estado || "N/A"} <br />
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron reclamos para esta persona.</p>
        )}
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


{showModal === "mostrarReclamosAreasComunes" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Reclamos en Áreas Comunes</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((reclamo, index) => (
              <li key={index}>
                <strong>ID:</strong> {reclamo.numero || "N/A"} <br />
                <strong>Edificio:</strong> {reclamo.edificio.nombre || "N/A"} - {reclamo.edificio.direccion || "N/A"} <br />
                <strong>Ubicación:</strong> {reclamo.ubicacion || "Sin ubicación"} <br />
                <strong>Descripción:</strong> {reclamo.descripcion || "Sin descripción"} <br />
                <strong>Estado:</strong> {reclamo.estado || "Sin estado"} <br />
                <strong>Usuario:</strong> {reclamo.usuario.nombre || "N/A"} ({reclamo.usuario.documento || "N/A"}) <br />
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron reclamos en áreas comunes.</p>
        )}
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





{showModal === "mostrarReclamosPorIdUnidad" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Reclamos por Unidad</h2>
      <ul>
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          modalContent.map((reclamo, index) => (
            <li key={index}>
              ID: {reclamo.id} <br />
              Descripción: {reclamo.descripcion}
            </li>
          ))
        ) : (
          <p>No se encontraron reclamos para esta unidad.</p>
        )}
      </ul>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}



{showModal === "cambiarEstadoReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Cambiar Estado de Reclamo</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="ID Reclamo"
        onChange={(e) =>
          setModalContent({ ...modalContent, idReclamo: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Estado"
        onChange={(e) =>
          setModalContent({ ...modalContent, estado: e.target.value })
        }
      />
      <input
        className="modal-input"
        type="text"
        placeholder="Detalle Estado"
        onChange={(e) =>
          setModalContent({ ...modalContent, detalleEstado: e.target.value })
        }
      />
      <button
        className="section-button"
        onClick={() => cambiarEstadoReclamo(modalContent)}
      >
        Cambiar Estado
      </button>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}

{showModal === "eliminarReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2>Eliminar Reclamo</h2>
      <input
        className="modal-input"
        type="text"
        placeholder="ID Reclamo"
        onChange={(e) =>
          setModalContent({ ...modalContent, idReclamo: e.target.value })
        }
      />
      <button
        className="section-button"
        onClick={() => eliminarReclamo(modalContent.idReclamo)}
      >
        Eliminar Reclamo
      </button>
      <button className="section-button" onClick={() => setShowModal(null)}>
        Cerrar
      </button>
    </div>
  </div>
)}
{/* SHOW MODAL PARA IMAGENES */}

{showModal === "mostrarTodasLasImagenes" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Todas las Imágenes</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((imagen, index) => (
              <li key={index}>
                ID: {imagen.id} <br />
                Tipo: {imagen.tipo} <br />
                <img
                  src={`data:${imagen.tipo};base64,${imagen.contenido}`}
                  alt="Imagen"
                  style={{ width: "100px", height: "100px" }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron imágenes.</p>
        )}
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


{showModal === "mostrarImagenesReclamo" && (
  <div className="modal">
    <div className="modal-content custom-modal">
      <h2 className="modal-title">Imágenes del Reclamo</h2>
      <div className="modal-body">
        {Array.isArray(modalContent) && modalContent.length > 0 ? (
          <ul>
            {modalContent.map((imagen, index) => (
              <li key={index}>
                Tipo: {imagen.tipo} <br />
                <img
                  src={imagen.contenido}
                  alt="Imagen Reclamo"
                  style={{ width: "100px", height: "100px" }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron imágenes para este reclamo.</p>
        )}
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



 {/*FIN FIN FIN FIN FIN FIN*/}
 </div>
)}

export default UsuarioDashboard;
