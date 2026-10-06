export function ModalEditarCaso({ casoAEditar, setCasoAEditar, agentes, alGuardar }) {
    if (!casoAEditar) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-contenido">
                <h3>✏️ Editar Caso</h3>
                <form onSubmit={alGuardar}>
                    <div className="campo-form">
                        <label>Número de Caso:</label>
                        <input 
                            type="text" 
                            value={casoAEditar.numero_de_caso || ''}
                            onChange={(e) => setCasoAEditar({...casoAEditar, numero_de_caso: e.target.value})}
                            required
                        />
                    </div>

                    <div className="campo-form">
                        <label>Asunto:</label>
                        <input 
                            type="text" 
                            value={casoAEditar.asunto || ''}
                            onChange={(e) => setCasoAEditar({...casoAEditar, asunto: e.target.value})}
                            required
                        />
                    </div>

                    <div className="campo-form">
                        <label>Proyecto:</label>
                        <select 
                            value={casoAEditar.proyecto || ''} 
                            onChange={(e) => setCasoAEditar({...casoAEditar, proyecto: e.target.value})}
                            required
                        >
                            <option value="media_commerce">Media Commerce</option>
                            <option value="etb">ETB</option>
                            <option value="tigo">Tigo</option>
                            <option value="tigo_telefonica">Tigo/ telefonica</option>
                            <option value="isp">ISP</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <div className="campo-form">
                        <label>Agente Responsable:</label>
                        <select 
                            value={casoAEditar.id_usuarios || ''} 
                            onChange={(e) => setCasoAEditar({...casoAEditar, id_usuarios: e.target.value})}
                            required
                        >
                            <option value="">Seleccionar Agente...</option>
                            {Array.isArray(agentes) && agentes.map((ag) => (
                                <option key={ag.id_usuarios} value={ag.id_usuarios}>
                                    {ag.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-form">
                        <label>Comentario:</label>
                        <textarea 
                            rows="3"
                            value={casoAEditar.comentario || ''}
                            onChange={(e) => setCasoAEditar({...casoAEditar, comentario: e.target.value})}
                        />
                    </div>

                    <div className="modal-acciones">
                        <button type="button" className="btn-cancelar" onClick={() => setCasoAEditar(null)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}