import { useState } from "react";
import './componentes/AsignadorTurnos.css';
import { EncabezadoModulo } from './componentes/EncabezadoModulo';
import { FormularioCrearCaso } from './componentes/FormularioCrearCaso';
import { TablaCasos } from './componentes/TablaCasos';

export function ModuloCreadorCasos({ usuario, alCerrarSesion }) {
    // 🔔 Estado disparador para refrescar la tabla al guardar un caso nuevo
    const [actualizarTabla, setActualizarTabla] = useState(0);

    const recargarCasos = () => {
        setActualizarTabla((prev) => prev + 1);
    };

    return (
        <div className="asignador-container">
            {/* Encabezado */}
            <EncabezadoModulo usuario={usuario} alSalir={alCerrarSesion} />

            {/* Formulario para registrar un nuevo caso */}
            <FormularioCrearCaso usuario={usuario} alGuardarExitoso={recargarCasos} />

            {/* Tabla de Casos */}
            <TablaCasos recargar={actualizarTabla} usuario={usuario} />
        </div>
    );
}