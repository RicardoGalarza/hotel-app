import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeaderCliente = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [apellido, setApellido] = useState(null);
    const [correo, setCorreo] = useState(null);

    // Este useEffect hace la llamada a la API para obtener los datos del usuario desde su ID
    useEffect(() => {
        const storedUserId = parseInt(localStorage.getItem('userId'));

        if (storedUserId) {
            setUserId(storedUserId);
            // Llamada a la API para obtener los datos del usuario
            fetch(`http://localhost:8080/cuentas/${storedUserId}`)
                .then((response) => response.json())
                .then((data) => {
                    setNombre(data.nombre);
                    setApellido(data.apellido);
                    setCorreo(data.correo);
                    // Almacenar los datos en el localStorage si lo deseas
                    localStorage.setItem('nombre', data.nombre);
                    localStorage.setItem('apellido', data.apellido);
                    localStorage.setItem('correo', data.correo);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos del usuario:', error);
                });
        }
    }, []);

    // Manejar el logout
    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        localStorage.removeItem('correo');
        setUserId(null);
        setNombre(null);
        setApellido(null);
        setCorreo(null);
        navigate('/');
    };

    // Función para obtener las iniciales del nombre
    const obtenerIniciales = (nombre, apellido) => {
        if (!nombre || !apellido) return '';
        return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    };

    return (
        <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3">
            <div className="container d-flex align-items-center">
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img
                        src="https://img.freepik.com/vector-premium/logo-diseno-hotel_423075-16.jpg"
                        alt="Logo de la empresa"
                        className="rounded-circle"
                        style={{ height: '50px', width: '50px', marginRight: '15px' }}
                    />
                    <h2 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px' }}>Hotel Ricardo</h2>
                </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {userId ? (
                                // Mostrar el avatar con las iniciales y el menú cuando el usuario está logueado
                                <li className="nav-item dropdown">
                                    <button
                                        className="btn dropdown-toggle"
                                        id="userMenu"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                    >
                                        <div
                                            className="avatar rounded-circle d-inline-flex align-items-center justify-content-center"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                fontSize: '1.25rem',
                                            }}
                                        >
                                            {obtenerIniciales(nombre, apellido)}
                                        </div>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end text-center" aria-labelledby="userMenu">
                                        <li>
                                            <span className="dropdown-item-text">
                                                <strong>Hola, {nombre ? nombre : 'Usuario'}</strong>
                                            </span>
                                            <span className="dropdown-item-text">{correo}</span>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link to="/InformacionPersonal" className="dropdown-item">Mi cuenta</Link>
                                        </li>
                                        <li>
                                            <Link to="/favoritos" className="dropdown-item">Favoritos</Link>
                                        </li>

                                        <li>
                                            <Link to="/historial" className="dropdown-item">Mi Historial</Link>
                                        </li>

                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button onClick={handleLogout} className="dropdown-item">Cerrar sesión</button>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                // Mostrar los botones de crear cuenta e iniciar sesión si no hay un usuario logueado
                                <>
                                    <li className="nav-item">
                                        <Link to="/crearcuentacliente" className="btn btn-primary me-2">
                                            Crear cuenta
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/login" className="btn btn-primary me-2">
                                            Iniciar sesión
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderCliente;
