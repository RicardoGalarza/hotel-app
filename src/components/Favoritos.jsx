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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/favoritos/cuenta/${userId}`);
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
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/opiniones/habitacion/${favorito.habitacion.id}`);
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
                await axios.delete(`${process.env.REACT_APP_API_URL}/favoritos`, {
                    data: { cuentaId, habitacionId },
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/favoritos`, { cuentaId, habitacionId });
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
                        <div className="col-12 col-sm-6 col-md-4 mb-4" key={favorito.habitacion.id}>
                            <div className="card h-100" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                {/* Contenedor de la imagen con altura fija */}
                                <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                                    <img
                                        src={`https://storage.googleapis.com/habitaciones/${favorito.habitacion.imagenes[0].url}`}
                                        alt={favorito.habitacion.nombre}
                                        className="img-fluid"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Contenido de la tarjeta */}
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title text-truncate">{favorito.habitacion.nombre}</h5>
                                    <p className="card-text text-truncate" style={{ maxHeight: '60px' }}>
                                        {favorito.habitacion.descripcion}
                                    </p>

                                    <div className="d-flex justify-content-start align-items-center mb-3">
                                        <span className="badge bg-success" style={{ fontSize: '1.2rem', marginRight: '0.5rem', borderRadius: '5px' }}>
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

                                    <button onClick={() => toggleFavorito(favorito.habitacion.id)} className="btn p-0" style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent' }}>
                                        <i className="fa" style={{ color: esFavorito(favorito.habitacion.id) ? 'red' : 'grey', fontSize: '24px' }}>❤</i>
                                    </button>

                                    <div className="d-flex justify-content-between align-items-end mt-3">
                                        <strong style={{ fontSize: '1.4rem', color: '#333' }}>
                                            USD {favorito.habitacion.precio.toLocaleString()}
                                        </strong>
                                        <a href={`/habitaciones/${favorito.habitacion.id}`} className="btn btn-primary btn-sm">
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
