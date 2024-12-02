import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routing from "./Routing"; // Asegúrate de importar Routing
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);

reportWebVitals();
