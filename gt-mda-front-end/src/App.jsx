import { useState } from "react";
import { InicioSesion } from './inicioSesion';
import { ModuloCreadorCasos } from './ModuloCreadorCasos';

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // 🚪 Función para cerrar sesión
  const manejarCerrarSesion = () => {
    setUsuarioActivo(null);
  };

  return (
    <>
      {usuarioActivo ? (
        <ModuloCreadorCasos 
          usuario={usuarioActivo} 
          alCerrarSesion={manejarCerrarSesion} 
        />
      ) : (
        <InicioSesion alIngresar={(datosUsuario) => setUsuarioActivo(datosUsuario)} />
      )}
    </>
  );
}

export default App;