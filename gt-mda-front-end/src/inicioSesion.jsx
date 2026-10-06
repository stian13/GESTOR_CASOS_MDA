import { useState } from "react";
import './stylesInicioSesion.css';

export function InicioSesion({ alIngresar }) {
    const [nombre, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensajeServidor, setMensajeServidor] = useState('');
    const [cargando, setCargando] = useState(false);

    const urlBkLogin = 'http://localhost:3000/login';

    const manejaringreso = async (e) => {
        e.preventDefault();
        setMensajeServidor('');
        setCargando(true);

        try {
            const res = await fetch(urlBkLogin, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, contrasena })
            });

            const datos = await res.json();

            if (res.ok) {
                alIngresar(datos);
            } else {
                setMensajeServidor(datos.mensaje || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setMensajeServidor('Error de usuario o contraseña. Intenta nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            {/* Título Principal */}
            <h1 className="login-title">Asignador Casos</h1>

            {/* Tarjeta Gris de Formulario */}
            <div className="login-card">
                <form onSubmit={manejaringreso} className="login-form">
                    <input 
                        type="text" 
                        placeholder="Usuario :" 
                        className="login-input" 
                        value={nombre} 
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />

                    <input 
                        type="password" 
                        placeholder="contrasena :" 
                        className="login-input" 
                        value={contrasena} 
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />

                    <button type="submit" className="login-btn" disabled={cargando}>
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                {mensajeServidor && (
                    <div className="login-mensaje-error">
                        {mensajeServidor}
                    </div>
                )}
            </div>
        </div>
    );
}