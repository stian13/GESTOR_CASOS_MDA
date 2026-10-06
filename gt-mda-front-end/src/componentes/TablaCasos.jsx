import { useState, useEffect } from "react";
import { PestanasFiltro } from "./PestanasFiltro";
import { BarraAccionesMasivas } from "./BarraAccionesMasivas";
import { ModalEditarCaso } from "./ModalEditarCaso";
import './EstilosTablaCaso.css';

const PESTANAS = [
    { id: 'mis_casos', etiqueta: 'Mis casos' },
    { id: 'todos', etiqueta: 'Todos' },
    { id: 'media_commerce', etiqueta: 'Media Commerce' },
    { id: 'etb', etiqueta: 'ETB' },
    { id: 'tigo', etiqueta: 'Tigo' },
    { id: 'tigo_telefonica', etiqueta: 'Tigo/ telefonica' },
    { id: 'isp', etiqueta: 'ISP' },
    { id: 'otros', etiqueta: 'Otros' },
];

export function TablaCasos({ recargar, usuario }) {
    const [casos, setCasos] = useState([]);
    const [agentes, setAgentes] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('mis_casos');
    const [casosSeleccionados, setCasosSeleccionados] = useState([]);
    const [agenteDestino, setAgenteDestino] = useState('');
    const [mostrarReasignar, setMostrarReasignar] = useState(false);
    const [casoAEditar, setCasoAEditar] = useState(null);

    // 📡 Peticiones HTTP
    const obtenerCasos = async () => {
        try {
            const res = await fetch('http://localhost:3000/casos');
            const datos = await res.json();
            setCasos(datos);
        } catch (error) {
            console.error("Error al obtener casos:", error);
        }
    };

    const obtenerAgentes = async () => {
        try {
            const res = await fetch('http://localhost:3000/usuarios');
            if (res.ok) {
                const datos = await res.json();
                setAgentes(Array.isArray(datos) ? datos : []);
            }
        } catch (error) {
            console.error("Error al obtener agentes:", error);
        }
    };

    useEffect(() => {
        obtenerCasos();
        obtenerAgentes();
    }, [recargar]);

    // 🔍 Filtrado y Selección
    const casosFiltrados = casos.filter((c) => {
        if (filtroActivo === 'todos') return true;
        if (filtroActivo === 'mis_casos') return c.id_usuarios === usuario?.id;
        return c.proyecto === filtroActivo;
    });

    const idsVisibles = casosFiltrados.map((c) => c.id);
    const todosSeleccionados = idsVisibles.length > 0 && idsVisibles.every((id) => casosSeleccionados.includes(id));

    const toggleCaso = (id) => {
        setCasosSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const toggleTodos = () => {
        if (todosSeleccionados) {
            setCasosSeleccionados((prev) => prev.filter((id) => !idsVisibles.includes(id)));
        } else {
            setCasosSeleccionados((prev) => Array.from(new Set([...prev, ...idsVisibles])));
        }
    };

    // ⚡ Manejadores de acciones
    const manejarCierreCasos = async () => {
        if (!window.confirm(`¿Estás seguro de cerrar/borrar ${casosSeleccionados.length} caso(s)?`)) return;
        try {
            const res = await fetch('http://localhost:3000/casos/cerrar', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idsCasos: casosSeleccionados })
            });
            if (res.ok) {
                setCasosSeleccionados([]);
                obtenerCasos();
            }
        } catch (error) {
            console.error('Error al cerrar casos:', error);
        }
    };

    const manejarReasignacion = async () => {
        if (!agenteDestino) return alert("Por favor selecciona un agente destino.");
        try {
            const res = await fetch('http://localhost:3000/casos/reasignar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuarios: Number(agenteDestino), idsCasos: casosSeleccionados })
            });
            if (res.ok) {
                setCasosSeleccionados([]);
                setMostrarReasignar(false);
                setAgenteDestino('');
                obtenerCasos();
            }
        } catch (error) {
            console.error('Error al reasignar casos:', error);
        }
    };

    const manejarEntregaTurno = () => {
        const seleccionadosInfo = casos.filter((c) => casosSeleccionados.includes(c.id));
        const texto = seleccionadosInfo
            .map((c) => `• Caso: #${c.numero_de_caso} | Proyecto: ${c.proyecto} | Asunto: ${c.asunto} | Comentario: ${c.comentario}`)
            .join('\n');
        navigator.clipboard.writeText(`--- ENTREGAS DE TURNO ---\n${texto}`);
        alert(`¡Entrega de ${casosSeleccionados.length} caso(s) copiada al portapapeles!`);
    };

    const guardarEdicionCaso = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/casos/${casoAEditar.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numero_de_caso: casoAEditar.numero_de_caso,
                    asunto: casoAEditar.asunto,
                    comentario: casoAEditar.comentario,
                    proyecto: casoAEditar.proyecto,
                    id_usuarios: Number(casoAEditar.id_usuarios)
                })
            });

            if (res.ok) {
                alert("Caso actualizado correctamente.");
                setCasoAEditar(null);
                obtenerCasos();
            }
        } catch (error) {
            console.error("Error al actualizar caso:", error);
        }
    };

    return (
        <div className="tabla-container">
            {/* Barra de Acciones */}
            <BarraAccionesMasivas
                cantidadSeleccionados={casosSeleccionados.length}
                mostrarReasignar={mostrarReasignar}
                setMostrarReasignar={setMostrarReasignar}
                agenteDestino={agenteDestino}
                setAgenteDestino={setAgenteDestino}
                agentes={agentes}
                alCerrar={manejarCierreCasos}
                alReasignar={manejarReasignacion}
                alEntregarTurno={manejarEntregaTurno}
            />

            {/* Pestañas de Filtro */}
            <PestanasFiltro
                filtroActivo={filtroActivo}
                setFiltroActivo={setFiltroActivo}
                pestanas={PESTANAS}
            />

            {/* Tabla de Casos tipo Tarjetas */}
            <table className="tabla-casos">
                <thead>
                    <tr>
                        <th style={{ width: '90px' }}># Caso</th>
                        <th>Asunto</th>
                        <th>Agente</th>
                        <th>Comentario</th>
                        <th style={{ textAlign: 'center', width: '60px' }}>Editar</th>
                        <th style={{ textAlign: 'center', width: '80px' }}>
                            <div className="header-todo">
                                <span>Todo</span>
                                <input
                                    type="checkbox"
                                    className="checkbox-caso"
                                    checked={todosSeleccionados}
                                    onChange={toggleTodos}
                                />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {casosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="sin-datos">
                                No hay casos registrados en esta categoría.
                            </td>
                        </tr>
                    ) : (
                        casosFiltrados.map((caso) => {
                            const estaSeleccionado = casosSeleccionados.includes(caso.id);
                            return (
                                <tr key={caso.id} className={estaSeleccionado ? "fila-seleccionada" : ""}>
                                    <td className="col-numero">#{caso.numero_de_caso}</td>
                                    <td className="col-asunto">{caso.asunto}</td>
                                    <td className="col-agente">
                                        <span>{caso.nombre_agente || 'Sin asignar'}</span>
                                        <span className="indicador-rojo"></span>
                                    </td>
                                    <td className="col-comentario">{caso.comentario || 'Sin comentarios'}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button 
                                            className="btn-editar" 
                                            onClick={() => setCasoAEditar({ ...caso })}
                                            title="Editar caso"
                                        >
                                            ✏️
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            className="checkbox-caso"
                                            checked={estaSeleccionado}
                                            onChange={() => toggleCaso(caso.id)}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* Modal de Edición */}
            <ModalEditarCaso
                casoAEditar={casoAEditar}
                setCasoAEditar={setCasoAEditar}
                agentes={agentes}
                alGuardar={guardarEdicionCaso}
            />
        </div>
    );
}