export function PestanasFiltro({ filtroActivo, setFiltroActivo, pestanas }) {
    return (
        <div className="tabs-container">
            {pestanas.map((pestana) => (
                <button
                    key={pestana.id}
                    className={`tab-btn ${filtroActivo === pestana.id ? 'active' : ''}`}
                    onClick={() => setFiltroActivo(pestana.id)}
                >
                    {pestana.etiqueta}
                </button>
            ))}
        </div>
    );
}