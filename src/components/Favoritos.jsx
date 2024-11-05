import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';

const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opinionesPorHabitacion, setOpinionesPorHabitacion] = useState({});

    const [paginaActual, setPaginaActual] = useState(1);
    const favoritosPorPagina = 4;

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:8080/favoritos/cuenta/${userId}`);
                setFavoritos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, []);

    useEffect(() => {
        const fetchOpiniones = async () => {
            try {
                const opinionesMap = {};
                for (let favorito of favoritos) {
                    const response = await axios.get(`http://localhost:8080/opiniones/habitacion/${favorito.habitacion.id}`);
                    const data = response.data;
                    const promedioEstrellas = data.reduce((acc, opinion) => acc + opinion.estrellas, 0) / data.length || 0;
                    opinionesMap[favorito.habitacion.id] = {
                        promedioEstrellas: promedioEstrellas.toFixed(1),
                        cantidadOpiniones: data.length,
                    };
                }
                setOpinionesPorHabitacion(opinionesMap);
            } catch (error) {
                console.error('Error al obtener opiniones para la habitación:', error);
            }
        };

        if (favoritos.length > 0) {
            fetchOpiniones();
        }
    }, [favoritos]);

    const toggleFavorito = async (habitacionId) => {
        const cuentaId = parseInt(localStorage.getItem('userId'), 10);
        const esFavorito = favoritos.some(fav => fav.habitacion.id === habitacionId);

        try {
            if (esFavorito) {
                setFavoritos(favoritos.filter(fav => fav.habitacion.id !== habitacionId));
                await axios.delete('http://localhost:8080/favoritos', {
                    data: { cuentaId, habitacionId },
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                const response = await axios.post(`http://localhost:8080/favoritos`, { cuentaId, habitacionId });
                setFavoritos([...favoritos, response.data]);
            }
        } catch (error) {
            console.error('Error al actualizar el estado del favorito:', error);
        }
    };

    const esFavorito = (habitacionId) => {
        return favoritos.some(fav => fav.habitacion.id === habitacionId);
    };

    const indiceUltimoFavorito = paginaActual * favoritosPorPagina;
    const indicePrimerFavorito = indiceUltimoFavorito - favoritosPorPagina;
    const favoritosPaginaActual = favoritos.slice(indicePrimerFavorito, indiceUltimoFavorito);

    const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);
    const paginasTotales = Math.ceil(favoritos.length / favoritosPorPagina);

    if (loading) {
        return <div>Cargando favoritos...</div>;
    }

    if (favoritos.length === 0) {
        return <div>No tienes productos favoritos guardados.</div>;
    }

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Mis Favoritos</h2>

            <div className="row justify-content-center">
                {favoritosPaginaActual.map(favorito => {
                    const { promedioEstrellas, cantidadOpiniones } = opinionesPorHabitacion[favorito.habitacion.id] || { promedioEstrellas: 0, cantidadOpiniones: 0 };

                    return (
                        <div className="col-md-6 mb-4" key={favorito.habitacion.id}>
                            <div className="card h-100" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: '15px', overflow: 'hidden' }}>
                                {/* Contenedor de la imagen con altura fija */}
                                <div
                                    style={{
                                        flex: '1 0 40%',
                                        height: '250px', 
                                        overflow: 'hidden',
                                        position: 'relative' 
                                    }}
                                >
                                    <img
                                        src={`http://localhost:8080/${favorito.habitacion.id}/${favorito.habitacion.imagenes[0].nombre}`}
                                        alt={favorito.habitacion.nombre}
                                        className="img-fluid"
                                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Contenido de la tarjeta */}

                                <div className="card-body" style={{ flex: '1 0 60%', padding: '15px', overflow: 'hidden', height: '250px' }}>
                                    <h5 className="card-title">{favorito.habitacion.nombre}</h5>
                                    <p className="card-text" style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{favorito.habitacion.descripcion}</p>

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

                                    <button onClick={() => toggleFavorito(favorito.habitacion.id)} className="btn" style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent' }}>
                                        <i className="fa" style={{ color: esFavorito(favorito.habitacion.id) ? 'red' : 'grey', fontSize: '24px' }}>❤</i>
                                    </button>

                                    <div className="d-flex justify-content-between align-items-end">
                                        <strong style={{ fontSize: '1.4rem', color: '#333' }}>
                                            USD {favorito.habitacion.precio}
                                        </strong>
                                        <a href={`/habitaciones/${favorito.habitacion.id}`} className="btn btn-primary" style={{ borderRadius: '10px', padding: '5px 15px' }}>
                                            Ver detalles
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="d-flex justify-content-center mt-4">
                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
                    <Pagination.Item active>{paginaActual}</Pagination.Item>
                    <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === paginasTotales} />
                </Pagination>
            </div>
        </div>
    );
};

export default Favoritos;
