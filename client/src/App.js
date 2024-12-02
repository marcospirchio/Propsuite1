import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [documentoPersona, setDocumentoPersona] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate(); // Hook para redirección

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: username,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwtToken", data.token); // Guardar el token en localStorage
        let userRole = data.role; // Obtener el rol directamente de la respuesta

        // Normalizar el rol si es necesario
        if (userRole === "USUARIO") {
          userRole = "USER";
        }

        if (userRole === "ADMIN") {
          setMessage("Inicio de sesión exitoso. Redirigiendo al Admin Dashboard...");
          setIsSuccess(true); // Mensaje de éxito
          setTimeout(() => navigate("/admin-dashboard"), 1000);
        } else if (userRole === "USER") {
          setMessage("Inicio de sesión exitoso. Redirigiendo al User Dashboard...");
          setIsSuccess(true); // Mensaje de éxito
          setTimeout(() => navigate("/user-dashboard"), 1000);
        } else {
          setMessage("Rol desconocido. No se puede redirigir.");
          setIsSuccess(false); // Mensaje de error
        }
      } else {
        setMessage(data.message || "Error al iniciar sesión");
        setIsSuccess(false); // Mensaje de error
      }
    } catch (error) {
      setMessage("No se pudo conectar al servidor.");
      setIsSuccess(false); // Mensaje de error
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: username,
          contrasena: password,
          persona: {
            documento: documentoPersona,
          },
        }),
      });

      if (response.ok) {
        const data = await response.text();
        setMessage(data);
        setIsSuccess(true); // Mensaje de éxito
        setShowRegister(false);
        setShowLogin(true);
      } else {
        const errorData = await response.text();
        setMessage(errorData || "Error al registrar usuario.");
        setIsSuccess(false); // Mensaje de error
      }
    } catch (error) {
      setMessage("No se pudo conectar al servidor.");
      setIsSuccess(false); // Mensaje de error
    }
  };

  const handleKeyDown = (event, action) => {
    if (event.key === "Enter") {
      action();
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="main-title">PROPSUITE</h1>
        <hr className="divider" />
        {message && <p className={isSuccess ? "success-message" : "error-message"}>{message}</p>}

        {!showLogin && !showRegister && (
          <>
            <h2 className="subtitle">¡Gestión de edificios al alcance de tu mano!</h2>
            <div className="button-container">
              <button className="custom-button" onClick={() => setShowLogin(true)}>
                Iniciar Sesión
              </button>
              <button className="custom-button" onClick={() => setShowRegister(true)}>
                Registrarse
              </button>
            </div>
          </>
        )}

        {showLogin && (
          <div className="form-horizontal">
            <div className="input-group">
              <label>Usuario</label>
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleLogin)}
              />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleLogin)}
              />
            </div>
            <div className="button-container">
              <button className="custom-button" onClick={handleLogin}>
                Iniciar Sesión
              </button>
              <button className="custom-button" onClick={() => setShowLogin(false)}>
                Volver
              </button>
            </div>
          </div>
        )}

        {showRegister && (
          <div className="form-horizontal">
            <div className="input-group">
              <label>Usuario</label>
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleRegister)}
              />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleRegister)}
              />
            </div>
            <div className="input-group">
              <label>Documento de Persona</label>
              <input
                type="text"
                placeholder="Ingrese el documento de la persona"
                value={documentoPersona}
                onChange={(e) => setDocumentoPersona(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleRegister)}
              />
            </div>
            <div className="button-container">
              <button className="custom-button" onClick={handleRegister}>
                Registrarse
              </button>
              <button className="custom-button" onClick={() => setShowRegister(false)}>
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
