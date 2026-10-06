export function BarraAccionesMasivas({
    cantidadSeleccionados,
    mostrarReasignar,
    setMostrarReasignar,
    agenteDestino,
    setAgenteDestino,
    agentes,
    alCerrar,
    alReasignar,
    alEntregarTurno
}) {
    if (cantidadSeleccionados === 0) return null;

    return (
        <div className="acciones-bar">
            <button className="btn-accion" onClick={alCerrar}>
                Cerrar ({cantidadSeleccionados})
            </button>
            
            <button className="btn-accion" onClick={() => setMostrarReasignar(!mostrarReasignar)}>
                ← → Reasignar
            </button>

            <button className="btn-accion" onClick={alEntregarTurno}>
                Entrega casos
            </button>

            {mostrarReasignar && (
                <div className="selector-agente-box">
                    <select 
                        value={agenteDestino} 
                        onChange={(e) => setAgenteDestino(e.target.value)}
                    >
                        <option value="">Seleccionar Agente...</option>
                        {Array.isArray(agentes) && agentes.map((ag) => (
                            <option key={ag.id_usuarios} value={ag.id_usuarios}>
                                {ag.nombre}
                            </option>
                        ))}
                    </select>
                    <button className="btn-confirmar" onClick={alReasignar}>
                        Confirmar
                    </button>
                </div>
            )}
        </div>
    );
}