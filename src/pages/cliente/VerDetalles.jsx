import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Pagination } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import Rating from 'react-rating-stars-component';
import { useNavigate, useParams } from 'react-router-dom';
import CalendarioDoble from '../../components/CalendarioDoble';
import PoliticasProducto from '../../components/PoliticasProducto';

const VerDetalles = () => {
    const { id } = useParams();
    const [habitacion, setHabitacion] = useState(null);
    const [error, setError] = useState(null);
    const [opiniones, setOpiniones] = useState([]);
    const [nuevaOpinion, setNuevaOpinion] = useState({ estrellas: 0, opinion: '' });
    const [favorito, setFavorito] = useState(false);
    const [politicas, setPoliticas] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const navigate = useNavigate();
    const [actualizarCalendario, setActualizarCalendario] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const opinionesPerPage = 3;

    // Estados para la alerta
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    // Ocultar la alerta automáticamente después de 5 segundos
    useEffect(() => {
        if (mostrarAlerta) {
            const timer = setTimeout(() => {
                setMostrarAlerta(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mostrarAlerta]);

    const calcularPuntuacionMedia = (opiniones) => {
        if (opiniones.length === 0) return 0;
        const totalEstrellas = opiniones.reduce((total, opinion) => total + opinion.estrellas, 0);
        return (totalEstrellas / opiniones.length).toFixed(1);
    };

    useEffect(() => {
        const fetchHabitacion = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/habitaciones/${id}`);
                setHabitacion(response.data);
            } catch (err) {
                setError('Hubo un error al obtener los detalles de la habitación.');
            }
        };

        const fetchOpiniones = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/opiniones/habitacion/${id}`);
                setOpiniones(response.data);
            } catch (err) {
                setError('Hubo un error al obtener las opiniones.');
            }
        };

        const cuentaId = JSON.parse(localStorage.getItem('userId'));

        const fetchFavorito = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/favoritos/cuenta/${cuentaId}`);
                const esFavorito = response.data.some(fav => fav.habitacion.id === parseInt(id));
                setFavorito(esFavorito);
            } catch (err) {
                setError('Hubo un error al verificar si es favorito.');
            }
        };

        const fetchPoliticas = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/politicas/habitaciones/${id}`);
                setPoliticas(response.data);
            } catch (err) {
                setError('Error al cargar las políticas');
            } finally {
                setLoading(false);
            }
        };

        const fetchCaracteristicas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/habitaciones/${id}/caracteristicas`);
                setCaracteristicas(response.data);
            } catch (err) {
                setError('Error al cargar las características');
            }
        };

        fetchPoliticas();
        fetchHabitacion();
        fetchOpiniones();
        fetchCaracteristicas();

        if (cuentaId > 0) {
            fetchFavorito();
        }
    }, [id]);

    const handleContactarClick = () => {
        if (habitacion && habitacion.whatsapp) {
            const enlaceWhatsApp = `https://wa.me/${habitacion.whatsapp}`;
            window.open(enlaceWhatsApp, '_blank');
        } else {
            alert('No se puede contactar al arrendador. El número de WhatsApp no está disponible.');
        }
    };

    const puntuacionMedia = calcularPuntuacionMedia(opiniones);

    const formatearMiles = (numero) => numero.toLocaleString('es-ES');

    const handleOpinionChange = (event) => {
        const { name, value } = event.target;
        setNuevaOpinion((prevOpinion) => ({ ...prevOpinion, [name]: value }));
    };

    const handleRatingChange = (newRating) => {
        setNuevaOpinion((prevOpinion) => ({ ...prevOpinion, estrellas: newRating }));
    };

    const handleSubmitOpinion = async (event) => {
        event.preventDefault();
        try {
            if (nuevaOpinion.opinion == null) nuevaOpinion.opinion = ' ';
            const cuentaLogueado = JSON.parse(localStorage.getItem('userId'));
            if (!cuentaLogueado) {
                navigate('/login');
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/opiniones`, {
                    habitacionId: id,
                    cuentaId: cuentaLogueado,
                    estrellas: nuevaOpinion.estrellas,
                    opinion: nuevaOpinion.opinion,
                });
                setOpiniones([...opiniones, response.data]);
                setNuevaOpinion({ estrellas: 0, opinion: '' });
            }
        } catch (err) {
            setError('Hubo un error al enviar la opinión.');
        }
    };

    const handleFechaSeleccionada = (inicio, fin) => {
        setFechaInicio(inicio);
        setFechaFin(fin);
    };

    const handleReservaClick = async () => {
        if (!fechaInicio) {
            setMensajeAlerta("Por favor, selecciona una fecha o un rango de fechas.");
            setTipoAlerta('danger');
            setMostrarAlerta(true);
            return;
        }

        const fechaFinReserva = fechaFin || fechaInicio;

        try {
            const cuentaId = JSON.parse(localStorage.getItem('userId'));

            if (!cuentaId) {
                setMensajeAlerta('El usuario no está autenticado. Por favor, inicia sesión.');
                setTipoAlerta('danger');
                setMostrarAlerta(true);
                return;
            }

            const verificarDisponibilidad = await axios.get(`${process.env.REACT_APP_API_URL}/reserva/validar-disponibilidad`, {
                params: {
                    habitacionId: id,
                    fechaInicio: fechaInicio.toISOString().split('T')[0],
                    fechaFin: fechaFinReserva.toISOString().split('T')[0]
                }
            });

            if (verificarDisponibilidad.data === "Disponible") {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/reserva/crear`, {
                    habitacionId: id,
                    clienteId: parseInt(cuentaId, 10),
                    fechaReserva: fechaInicio.toISOString().split('T')[0],
                    fechaFinReserva: fechaFinReserva.toISOString().split('T')[0]
                });

                if (response.status === 200) {
                    setMensajeAlerta("Reserva realizada con éxito.");
                    setTipoAlerta('success');
                    setMostrarAlerta(true);
                    setFechaInicio(null);
                    setFechaFin(null);
                    setActualizarCalendario(!actualizarCalendario);
                }
            } else {
                setMensajeAlerta("La habitación no está disponible para el rango de fechas seleccionado.");
                setTipoAlerta('danger');
                setMostrarAlerta(true);
            }
        } catch (error) {
            console.error("Error al realizar la reserva:", error);
            setMensajeAlerta("Hubo un error al realizar la reserva.");
            setTipoAlerta('danger');
            setMostrarAlerta(true);
        }
    };

    const toggleFavorito = async () => {
        const cuentaId = parseInt(localStorage.getItem('userId'), 10);

        try {
            if (!cuentaId) {
                navigate('/login');
            } else {
                if (favorito) {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/favoritos`, {
                        data: {
                            cuentaId: parseInt(cuentaId),
                            habitacionId: parseInt(id),
                        }
                    });
                } else {
                    await axios.post(`${process.env.REACT_APP_API_URL}/favoritos`, {
                        cuentaId: parseInt(cuentaId),
                        habitacionId: parseInt(id),
                    });
                }
                setFavorito(!favorito);
            }
        } catch (err) {
            console.error(error);
            setError('Hubo un error al actualizar el estado del favorito.');
        }
    };

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!habitacion) return <div>Cargando detalles...</div>;

    const indexOfLastOpinion = currentPage * opinionesPerPage;
    const indexOfFirstOpinion = indexOfLastOpinion - opinionesPerPage;
    const currentOpiniones = opiniones.slice(indexOfFirstOpinion, indexOfLastOpinion);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container py-5">
            {mostrarAlerta && (
                <Alert variant={tipoAlerta} onClose={() => setMostrarAlerta(false)} dismissible>
                    {mensajeAlerta}
                </Alert>
            )}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                <h2 className="text-start mb-2 mb-md-0">{habitacion.nombre}</h2>
                <div className="d-flex flex-wrap justify-content-end">
                    <button
                        onClick={toggleFavorito}
                        className="btn btn-outline-primary d-flex align-items-center mb-2 me-2"
                        style={{
                            borderRadius: '50px',
                            padding: '10px',
                            borderColor: favorito ? 'red' : 'grey',
                        }}
                    >
                        {favorito ? (
                            <FaHeart color="red" size="24px" style={{ marginRight: '5px' }} />
                        ) : (
                            <FaHeart color="grey" size="24px" style={{ marginRight: '5px' }} />
                        )}
                        {favorito ? 'Guardada' : 'Favorito'}
                    </button>
                    <button
                        onClick={handleContactarClick}
                        className="btn btn-outline-primary d-flex align-items-center mb-2 me-2"
                        style={{ borderRadius: '50px', padding: '10px' }}
                    >
                        <i className="fab fa-whatsapp" style={{ fontSize: '24px', marginRight: '5px' }}></i>
                        Contactar
                    </button>
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Mira esta habitación: ${habitacion.nombre} - ${habitacion.descripcion}. Precio: ${habitacion.precio}. Link: ${process.env.REACT_APP_API_URL}/detalle/${habitacion.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary d-flex align-items-center mb-2"
                        style={{
                            borderRadius: '50px',
                            padding: '10px',
                        }}
                    >
                        <i className="fab fa-whatsapp" style={{ fontSize: '24px', marginRight: '5px' }}></i>
                        Compartir
                    </a>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card h-100 zoom">
                        <img
                            src={`https://storage.googleapis.com/habitaciones/${habitacion.imagenes[0].url}`}
                            alt="Imagen principal"
                            className="img-fluid"
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row">
                        {habitacion.imagenes.slice(1, 5).map((imagen, index) => (
                            <div className="col-md-6 mb-3" key={index}>
                                <div className="card h-100 zoom">
                                    <img
                                        src={`https://storage.googleapis.com/habitaciones/${imagen.url}`}
                                        alt={`Imagen ${index + 2}`}
                                        className="img-fluid"
                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p>{habitacion.descripcion}</p>
                <p><strong>Precio:</strong> ${formatearMiles(habitacion.precio)} CLP</p>
                <div>
                    <strong>Categorías:</strong>
                    {habitacion.categorias.length > 0 ? (
                        habitacion.categorias.map((categoria) => (
                            <Badge key={categoria.id} bg="light" text="dark" className="me-1">
                                {categoria.nombre}
                            </Badge>
                        ))
                    ) : (
                        <span>Sin categoría</span>
                    )}
                </div>
                <div className="mt-3">
                    <strong>Servicios principales:</strong>
                    <div className="row mt-2">
                        {caracteristicas.length > 0 ? (
                            caracteristicas.map((caracteristica) => (
                                <div className="col-6 col-md-4 mb-3 d-flex align-items-center" key={caracteristica.id}>
                                    <img
                                        src={`https://storage.googleapis.com/habitaciones/${caracteristica.imagenNombre}`}
                                        alt={caracteristica.nombre}
                                        style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                    />
                                    <span>{caracteristica.nombre}</span>
                                </div>
                            ))
                        ) : (
                            <span>No hay características disponibles</span>
                        )}
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => navigate("/")}
                    >
                        Volver Atrás
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/galeria-completa/${id}`)}
                    >
                        Ver Más
                    </button>
                </div>
                <CalendarioDoble habitacionId={habitacion.id} onFechaSeleccionada={handleFechaSeleccionada} actualizarCalendario={actualizarCalendario} />
                <button onClick={handleReservaClick} className="btn btn-primary mt-3">Reservar</button>
            </div>

            <div className="mt-4">
                {loading ? <p>Cargando políticas...</p> : <PoliticasProducto politicas={politicas} />}
            </div>

            <div className="puntuacion-media mt-3 d-flex align-items-center">
                <div className="d-flex align-items-center">
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', backgroundColor: '#28a745', padding: '5px 10px', borderRadius: '5px' }}>
                        {puntuacionMedia}
                    </span>
                    <span className="ms-2" style={{ fontSize: '18px', fontWeight: 'bold', color: '#6c757d' }}>Excelente</span>
                </div>
                <span className="ms-3" style={{ color: '#6c757d' }}>{opiniones.length} opiniones</span>
            </div>

            <div className="mt-4">
                <h4>Dejar una opinión</h4>
                <form onSubmit={handleSubmitOpinion}>
                    <div className="mb-3">
                        <label htmlFor="estrellas" className="form-label">Puntaje (1 a 5 estrellas)</label>
                        <Rating count={5} size={24} activeColor="#ffd700" value={nuevaOpinion.estrellas} onChange={handleRatingChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="opinion" className="form-label">Opinión</label>
                        <textarea className="form-control" id="opinion" name="opinion" value={nuevaOpinion.opinion} onChange={handleOpinionChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Enviar Opinión</button>
                </form>
            </div>

            <div className="mt-4">
                <h3>Opiniones</h3>
                <div className="row">
                    {currentOpiniones.length > 0 ? (
                        currentOpiniones.map((opinion) => (
                            <div className="col-md-4 mb-3" key={opinion.id}>
                                <div className="card h-100" style={{ width: '20rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Valoración: {opinion.estrellas} estrellas</h5>
                                        <p className="card-text">{opinion.opinion}</p>
                                        <p className="text-muted">{opinion.cuenta.nombre}</p>
                                        <p className="text-muted">{new Date(opinion.fechaCreacion).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay opiniones disponibles para esta habitación.</p>
                    )}
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        <Pagination.Item active>{currentPage}</Pagination.Item>
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(opiniones.length / opinionesPerPage)} />
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default VerDetalles;
