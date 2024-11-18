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
            <h1 className="text-center">Panel de Administración</h1>
            <div className="card p-4 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="mb-4 text-center">Bienvenido Administrador</h2>
                <p>Aquí puedes acceder a todas las funciones desarrolladas para la administración de tu negocio.</p>
                <ul>
                    <li>
                        <Link to="/admin/crearhabitacion">Crear Habitación</Link>
                    </li>
                    <li>
                        <Link to="/admin/verhabitacion">Ver Habitaciones</Link>
                    </li>
                    <li>
                        <Link to="/admin/crear-categoria">Crear Categoría</Link>
                    </li>
                    <li>
                        <Link to="/admin/ver-categorias">Ver Categorías</Link>
                    </li>
                </ul>
                <em>Nota: Esta página no es accesible desde dispositivos móviles.</em>
            </div>
        </div>
    );
};

export default Administrador;
