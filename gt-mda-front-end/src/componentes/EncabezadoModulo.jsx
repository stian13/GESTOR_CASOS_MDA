export function EncabezadoModulo({ usuario, alSalir }) {
    return (
        <header className="asignador-header">
            <h1>Asignador Casos</h1>
            <div className="header-buttons">
                <button className="btn-dark">{usuario?.nombre || 'Usuario'}</button>
                <button className="btn-dark" onClick={alSalir}>Salir</button>
            </div>
        </header>
    );
}