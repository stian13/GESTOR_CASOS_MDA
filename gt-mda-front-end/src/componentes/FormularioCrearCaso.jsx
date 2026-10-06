import { useState } from "react";

const OPCIONES_PROYECTOS = [
    { id: 'tigo', etiqueta: 'Tigo' },
    { id: 'media_commerce', etiqueta: 'Media Commerce' },
    { id: 'etb', etiqueta: 'ETB' },
    { id: 'tigo_telefonica', etiqueta: 'Tigo/ telefonica' },
    { id: 'isp', etiqueta: 'ISP' },
    { id: 'otros', etiqueta: 'Otros' }
];

const ESTADO_INICIAL = {
    numeroCaso: '',
    asunto: '',
    proyecto: '',
    comentario: ''
};

export function FormularioCrearCaso({ usuario, alGuardarExitoso }) {
    const [formData, setFormData] = useState(ESTADO_INICIAL);
    const urlBkCrearCaso = 'http://localhost:3000/casos';

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const guardarCaso = async (e) => {
        e.preventDefault();
        
        if (!formData.proyecto) {
            alert("Por favor selecciona un proyecto.");
            return;
        }

        try {
            const res = await fetch(urlBkCrearCaso, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numero_de_caso: formData.numeroCaso,
                    asunto: formData.asunto,
                    proyecto: formData.proyecto,
                    comentario: formData.comentario,
                    id_usuarios: usuario?.id
                })
            });

            if (res.ok) {
                setFormData(ESTADO_INICIAL); // Limpieza de campos
                alGuardarExitoso(); // Notifica al padre para recargar la tabla
            } else {
                alert("Error al guardar el caso. Revisa los datos enviados.");
            }
        } catch (error) {
            console.error("Error al guardar el caso:", error);
            alert("Ocurrió un error al conectar con el servidor.");
        }
    };

    return (
        <form className="asignador-form" onSubmit={guardarCaso}>
            {/* Fila 1: Número de caso y Asunto */}
            <div className="form-row">
                <input 
                    type="text" 
                    name="numeroCaso" 
                    placeholder="Numero de caso" 
                    className="input-field input-small"
                    value={formData.numeroCaso}
                    onChange={manejarCambio}
                    required
                />
                <input 
                    type="text" 
                    name="asunto" 
                    placeholder="Asunto" 
                    className="input-field input-large"
                    value={formData.asunto}
                    onChange={manejarCambio}
                    required
                />
            </div>

            {/* Fila 2: Proyectos y Comentario */}
            <div className="form-row columns-layout">
                {/* Columna Izquierda: Radios de Proyectos */}
                <div className="proyecto-section">
                    <p className="section-title">Proyecto</p>
                    <div className="radio-grid">
                        {OPCIONES_PROYECTOS.map((proj) => (
                            <label key={proj.id} className="radio-label">
                                <input 
                                    type="radio" 
                                    name="proyecto" 
                                    value={proj.id} 
                                    checked={formData.proyecto === proj.id} 
                                    onChange={manejarCambio}
                                /> 
                                {proj.etiqueta}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Columna Derecha: Comentario */}
                <div className="comentario-section">
                    <input 
                        type="text" 
                        name="comentario" 
                        placeholder="Comentario" 
                        className="input-field input-large" 
                        value={formData.comentario}
                        onChange={manejarCambio}
                    />
                </div>
            </div>

            {/* Botón Guardar */}
            <div className="form-actions">
                <button type="submit" className="btn-save">Guardar</button>
            </div>
        </form>
    );
}