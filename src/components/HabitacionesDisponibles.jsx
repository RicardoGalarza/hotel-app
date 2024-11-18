import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HabitacionesDisponibles = ({ habitacionesFiltradas = [] }) => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionesMostradas, setHabitacionesMostradas] = useState([]);
    const [rotatedHabitaciones, setRotatedHabitaciones] = useState([]);
    const [opinionesPorHabitacion, setOpinionesPorHabitacion] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const habitacionesPorPagina = 10;
    const [favoritos, setFavoritos] = useState([]);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [sugerencias, setSugerencias] = useState([]);
    const navigate = useNavigate();

    const fetchHabitaciones = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/habitaciones`);
            setHabitaciones(response.data);
            setHabitacionesMostradas(response.data);
            setRotatedHabitaciones(shuffleArray(response.data)); // Mezcla aleatoria al cargar
            fetchOpinionesPorHabitacion(response.data);
        } catch (error) {
            console.error('Error al cargar habitaciones:', error);
        }
    }, []);

    useEffect(() => {
        if (habitacionesFiltradas.length > 0) {
            setHabitaciones(habitacionesFiltradas);
            setHabitacionesMostradas(habitacionesFiltradas);
            setRotatedHabitaciones(shuffleArray(habitacionesFiltradas)); // Mezcla aleatoria
        } else {
            fetchHabitaciones();
        }
        fetchFavoritos();
    }, [habitacionesFiltradas, fetchHabitaciones]);

    // Función para mezclar el array de manera aleatoria
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const fetchFavoritos = async () => {
        try {
            const cuentaId = JSON.parse(localStorage.getItem('userId'));
            if (cuentaId) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/favoritos/cuenta/${cuentaId}`);
                setFavoritos(response.data);
            }
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
        }
    };

    const fetchOpinionesPorHabitacion = async (habitaciones) => {
        try {
            const opinionesData = {};
            for (const habitacion of habitaciones) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/opiniones/habitacion/${habitacion.id}`);
                const opiniones = response.data;
                const totalEstrellas = opiniones.reduce((sum, opinion) => sum + opinion.estrellas, 0);
                const promedioEstrellas = opiniones.length ? (totalEstrellas / opiniones.length).toFixed(1) : '0';
                opinionesData[habitacion.id] = {
                    promedioEstrellas,
                    cantidadOpiniones: opiniones.length,
                };
            }
            setOpinionesPorHabitacion(opinionesData);
        } catch (error) {
            console.error('Error al cargar opiniones:', error);
        }
    };

    const handleBusquedaChange = async (e) => {
        const termino = e.target.value.trim();
        setTerminoBusqueda(termino);

        if (termino.length > 0) {
            try {
                const ciudadResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ciudades?nombre=${termino}`);
                if (ciudadResponse.data && ciudadResponse.data.length > 0) {
                    const ciudadId = ciudadResponse.data[0].id;
                    const habitacionesPorCiudad = await axios.get(`${process.env.REACT_APP_API_URL}/habitaciones/ciudad/${ciudadId}`);
                    setHabitacionesMostradas(habitacionesPorCiudad.data);
                    setRotatedHabitaciones(habitacionesPorCiudad.data);
                    setSugerencias(habitacionesPorCiudad.data);
                } else {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/habitaciones/buscar?busqueda=${termino}`);
                    if (response.data && response.data.length > 0) {
                        setHabitacionesMostradas(response.data);
                        setRotatedHabitaciones(response.data);
                        setSugerencias(response.data);
                    } else {
                        setHabitacionesMostradas([]);
                        setRotatedHabitaciones([]);
                        setSugerencias([]);
                    }
                }
            } catch (error) {
                console.error('Error al buscar habitaciones:', error);
                setHabitacionesMostradas([]);
                setRotatedHabitaciones([]);
                setSugerencias([]);
            }
        } else {
            setHabitacionesMostradas(habitaciones);
            setRotatedHabitaciones(habitaciones);
            setSugerencias([]);
        }
    };

    const handleSugerenciaClick = (habitacion) => {
        setTerminoBusqueda(habitacion.nombre);
        setHabitacionesMostradas([habitacion]);
        setRotatedHabitaciones([habitacion]);
        setSugerencias([]);
    };

    const paginacion = (numeroPagina) => {
        setCurrentPage(numeroPagina);
    };

    const totalPaginas = Math.ceil(habitacionesMostradas.length / habitacionesPorPagina);
    const indexOfLastHabitacion = currentPage * habitacionesPorPagina;
    const indexOfFirstHabitacion = indexOfLastHabitacion - habitacionesPorPagina;
    const habitacionesPaginadas = rotatedHabitaciones.slice(indexOfFirstHabitacion, indexOfLastHabitacion);

    const toggleFavorito = async (habitacionId) => {
        const cuentaId = parseInt(localStorage.getItem('userId'), 10);
        const esFavorito = favoritos.some(fav => fav.habitacion.id === habitacionId);

        try {
            if (!cuentaId) {
                navigate('/login');
            } else {
                if (esFavorito) {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/favoritos`, {
                        data: { cuentaId, habitacionId },
                        headers: { 'Content-Type': 'application/json' },
                    });
                    setFavoritos(favoritos.filter(fav => fav.habitacion.id !== habitacionId));
                } else {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/favoritos`, { cuentaId, habitacionId });
                    setFavoritos([...favoritos, response.data]);
                }
            }
        } catch (error) {
            console.error('Error al actualizar el estado del favorito:', error);
        }
    };

    const esFavorito = (habitacionId) => {
        return favoritos.some(fav => fav.habitacion.id === habitacionId);
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Habitaciones Disponibles</h2>

            <div className="mb-4 d-flex justify-content-center align-items-center">
                <div className="input-group" style={{ width: '40%', position: 'relative' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar habitaciones..."
                        value={terminoBusqueda}
                        onChange={handleBusquedaChange}
                        aria-haspopup="true"
                    />
                    {sugerencias.length > 0 && (
                        <ul
                            className="dropdown-menu show"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                zIndex: 1050,
                            }}
                        >
                            {sugerencias.map((habitacion) => (
                                <li
                                    key={habitacion.id}
                                    className="dropdown-item"
                                    onClick={() => handleSugerenciaClick(habitacion)}
                                >
                                    {habitacion.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {habitacionesPaginadas.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
                    {habitacionesPaginadas.map((habitacion) => {
                        if (!habitacion || !habitacion.imagenes || habitacion.imagenes.length === 0) {
                            return null;
                        }
                        const { promedioEstrellas, cantidadOpiniones } = opinionesPorHabitacion[habitacion.id] || { promedioEstrellas: '0', cantidadOpiniones: 0 };

                        return (
                            <div className="col mb-4" key={habitacion.id}>
                                <div className="card h-100" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                    <div style={{ height: '250px', overflow: 'hidden' }}>
                                        <img
                                            src={`https://storage.googleapis.com/habitaciones/${habitacion.imagenes[0].url}`}
                                            alt={habitacion.nombre}
                                            className="img-fluid w-100"
                                            style={{ objectFit: 'cover', height: '100%' }}
                                        />
                                        <button
                                            onClick={() => toggleFavorito(habitacion.id)}
                                            className="btn"
                                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent' }}
                                        >
                                            <i className="fa" style={{ color: esFavorito(habitacion.id) ? 'red' : 'grey', fontSize: '24px' }}>
                                                ♥
                                            </i>
                                        </button>
                                    </div>

                                    <div className="card-body" style={{ padding: '15px' }}>
                                        <h5 className="card-title">{habitacion.nombre}</h5>
                                        <p className="card-text" style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{habitacion.descripcion}</p>
                                        <div className="d-flex justify-content-start align-items-center mb-3">
                                            <span className="badge" style={{ fontSize: '1.2rem', marginRight: '0.5rem', backgroundColor: '#28a745', color: '#fff', padding: '5px 10px' }}>
                                                {promedioEstrellas}
                                            </span>
                                            <div className="d-flex flex-column ms-2">
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#6C757D' }}>
                                                    {promedioEstrellas >= 4 ? 'Excelente' : 'Buena'}
                                                </span>
                                                <span className="text-muted">
                                                    {cantidadOpiniones} opiniones
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <strong style={{ fontSize: '1.4rem', color: '#333' }}>
                                                ${habitacion.precio.toLocaleString('es-ES')} CLP
                                            </strong>
                                            <a href={`/habitaciones/${habitacion.id}`} className="btn btn-primary" style={{ borderRadius: '10px', padding: '5px 15px' }}>
                                                Ver Detalles
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="alert alert-warning" role="alert">
                    No se encontraron habitaciones disponibles.
                </div>
            )}

            <Pagination className="justify-content-center">
                <Pagination.First onClick={() => paginacion(1)} disabled={currentPage === 1} />
                {[...Array(totalPaginas)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginacion(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Last onClick={() => paginacion(totalPaginas)} disabled={currentPage === totalPaginas} />
            </Pagination>
        </div>
    );
};
export default HabitacionesDisponibles;
