import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Administrador = () => {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const isLoggedIn = localStorage.getItem('isAdmin');
        if (!isLoggedIn) {
            // Redirigir al login si no está autenticado
            navigate('/administracion');
        }
    }, [navigate]);

    useEffect(() => {
        // Verificar si es un dispositivo móvil
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
            setIsMobile(true);
        }
    }, []);

    if (isMobile) {
        return (
            <div className="container mt-5">
                <h1 className="text-center">Panel no disponible en dispositivos móviles</h1>
                <p className="text-center">Accede desde un ordenador para utilizar el panel de administración.</p>
            </div>
        );
    }

    // Mostrar el panel solo si el usuario está autenticado
    return (
        <div className="container mt-5">

            <div className="card p-4 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="mb-4 text-center">Bienvenido Administrador</h2>
                <p>Aquí puedes acceder a todas las funciones desarrolladas para la administración de tu negocio.</p>
                <ul className="list-unstyled">
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/crearhabitacion">Crear Habitación</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/verhabitacion">Ver Habitaciones</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/crear-categoria">Crear Categoría</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/ver-categorias">Ver Categorías</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/crear-cuenta">Crear Cuenta</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/listar-cuentas">Listar Cuentas</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/crear-caracteristica">Crear Característica</Link>
                    </li>
                    <li>
                        <Link className="btn btn-outline-primary mb-2 w-100" to="/admin/ver-caracteristicas">Listar Características</Link>
                    </li>
                </ul>
                <em>Nota: Esta página no es accesible desde dispositivos móviles.</em>
            </div>
        </div>
    );
};

export default Administrador;
