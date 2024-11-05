import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HabitacionesDisponibles = ({ habitacionesFiltradas }) => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [habitacionesMostradas, setHabitacionesMostradas] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [opinionesPorHabitacion, setOpinionesPorHabitacion] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const habitacionesPorPagina = 10;
    const [favoritos, setFavoritos] = useState([]);
    const navigate = useNavigate();

    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [sugerencias, setSugerencias] = useState([]);

    useEffect(() => {
        const fetchHabitaciones = async () => {
            try {
                const response = await axios.get('http://localhost:8080/habitaciones');
                const data = response.data;
                setHabitaciones(data);
                fetchOpinionesPorHabitacion(data); // Cargar opiniones después de obtener habitaciones
            } catch (error) {
                console.log('Error al cargar habitaciones:', error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categorias');
                const data = response.data;
                setCategorias(data);
            } catch (error) {
                console.log('Error al cargar categorías:', error);
            }
        };

        const fetchFavoritos = async () => {
            try {
                const cuentaId = JSON.parse(localStorage.getItem('userId'));
                const response = await axios.get(`http://localhost:8080/favoritos/cuenta/${cuentaId}`);
                setFavoritos(response.data);
            } catch (error) {
                console.log('Error al cargar favoritos:', error);
            }
        };

        const habitacionesFiltradasPorCategoria = categoriaSeleccionada
            ? habitacionesFiltradas.filter(hab => hab.categoria === categoriaSeleccionada)
            : habitacionesFiltradas;

        setHabitacionesMostradas(habitacionesFiltradasPorCategoria);

        fetchHabitaciones();
        fetchCategorias();
        fetchFavoritos();
    }, [categoriaSeleccionada, habitacionesFiltradas]);

    // Función mejorada para cargar opiniones y calcular el promedio de estrellas
    const fetchOpinionesPorHabitacion = async (habitaciones) => {
        try {
            const opinionesData = {};
            for (const habitacion of habitaciones) {
                const response = await axios.get(`http://localhost:8080/opiniones/habitacion/${habitacion.id}`);
                const opiniones = response.data;

                const totalEstrellas = opiniones.reduce((sum, opinion) => sum + opinion.estrellas, 0);
                const promedioEstrellas = opiniones.length ? (totalEstrellas / opiniones.length).toFixed(1) : '0';
                opinionesData[habitacion.id] = {
                    promedioEstrellas,
                    cantidadOpiniones: opiniones.length
                };
            }
            setOpinionesPorHabitacion(opinionesData);
        } catch (error) {
            console.log('Error al cargar opiniones:', error);
        }
    };

    const formatearMiles = (numero) => {
        return numero.toLocaleString('es-ES');
    };

    const handleBusquedaChange = async (e) => {
        const termino = e.target.value;
        setTerminoBusqueda(termino);

        if (termino.length >= 3) {
            try {
                const response = await axios.get(`http://localhost:8080/habitaciones/buscar?busqueda=${termino}`);
                setSugerencias(response.data);
                setHabitacionesMostradas(response.data);
            } catch (error) {
                console.log('Error al buscar habitaciones:', error);
            }
        } else {
            setSugerencias([]);
            setHabitacionesMostradas(habitacionesFiltradas);
        }
    };

    const handleSugerenciaClick = (habitacion) => {
        setTerminoBusqueda(habitacion.nombre);
        setHabitacionesMostradas([habitacion]);
        setSugerencias([]);
    };

    const indexOfLastHabitacion = currentPage * habitacionesPorPagina;
    const indexOfFirstHabitacion = indexOfLastHabitacion - habitacionesPorPagina;
    const habitacionesActuales = habitacionesFiltradas.slice(indexOfFirstHabitacion, indexOfLastHabitacion);

    const paginacion = (numeroPagina) => {
        setCurrentPage(numeroPagina);
    };

    const totalPaginas = Math.ceil(habitacionesFiltradas.length / habitacionesPorPagina);

    const toggleFavorito = async (habitacionId) => {
        const cuentaId = parseInt(localStorage.getItem('userId'), 10);
        const esFavorito = favoritos.some(fav => fav.habitacion.id === habitacionId);

        try {
            if (!cuentaId) {
                navigate('/login');
            } else {
                if (esFavorito) {
                    await axios.delete('http://localhost:8080/favoritos', {
                        data: { cuentaId, habitacionId },
                        headers: { 'Content-Type': 'application/json' }
                    });
                    setFavoritos(favoritos.filter(fav => fav.habitacion.id !== habitacionId));
                } else {
                    const response = await axios.post('http://localhost:8080/favoritos', { cuentaId, habitacionId });
                    setFavoritos([...favoritos, response.data]);
                }
            }
        } catch (error) {
            console.log('Error al actualizar el estado del favorito:', error);
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
                        aria-expanded={sugerencias.length > 0}
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

            {habitacionesMostradas.length > 0 ? (
                <div className="row">
                    {habitacionesMostradas.map((habitacion) => {
                        const { promedioEstrellas, cantidadOpiniones } = opinionesPorHabitacion[habitacion.id] || { promedioEstrellas: '0', cantidadOpiniones: 0 };

                        return (
                            <div className="col-md-6 mb-4" key={habitacion.id}>
                                <div className="card h-100" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: '15px', overflow: 'hidden', width: '100%' }}>
                                    <div style={{ flex: '1 0 40%', height: '250px', overflow: 'hidden' }}>
                                        <img
                                            src={`http://localhost:8080/${habitacion.id}/${habitacion.imagenes[0].nombre}`}
                                            alt={habitacion.nombre}
                                            className="img-fluid"
                                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
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

                                    <div className="card-body" style={{ flex: '1 0 60%', padding: '15px', overflow: 'hidden', height: '250px' }}>
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
                                                ${formatearMiles(habitacion.precio)} CLP
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
