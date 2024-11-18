import axios from 'axios';
import React, { useEffect, useState } from 'react';


const HistorialReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número de elementos por página

    useEffect(() => {
        // Función para obtener el historial de reservas desde el backend
        const fetchReservas = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/reserva/historial?clienteId=${userId}`);
                setReservas(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el historial de reservas');
                setLoading(false);
            }
        };

        fetchReservas();
    }, []);

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Asegúrate de mostrar exactamente la fecha como se recibe sin ajustes
        return date.toISOString().split('T')[0]; // Retorna 'YYYY-MM-DD'
    };
    

    // Calcular los índices de inicio y fin para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservas.slice(indexOfFirstItem, indexOfLastItem);

    // Función para cambiar de página
    const handleNextPage = () => {
        if (currentPage < Math.ceil(reservas.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <div>Cargando historial de reservas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2>Historial de Reservas</h2>
            {currentItems.length === 0 ? (
                <p>No se encontraron reservas.</p>
            ) : (
                <ul className="list-group">
                    {currentItems.map((reserva) => (
                        <li key={reserva.id} className="list-group-item mb-3">
                            <h4>{reserva.habitacion.nombre}</h4>
                            <p>{reserva.habitacion.descripcion}</p>
                            <p>
                                <strong>Ciudad:</strong> {reserva.habitacion.ciudad.nombre}
                            </p>
                            <p>
                                <strong>Fecha de Reserva:</strong> {formatDate(reserva.fechaReserva)}
                            </p>
                            <p>
                                <strong>Fecha de Fin de Reserva:</strong> {formatDate(reserva.fechaFinReserva)}
                            </p>
                            <p>
                                <strong>Precio:</strong> ${reserva.habitacion.precio.toLocaleString()}
                            </p>
                            <p>
                                <strong>Categorías:</strong>{' '}
                                {reserva.habitacion.categorias.map((categoria) => (
                                    <span key={categoria.id} className="badge bg-secondary me-2">
                                        {categoria.nombre}
                                    </span>
                                ))}
                            </p>
                            <div className="imagenes">
                                <strong>Imágenes:</strong>
                                <div className="d-flex flex-wrap">
                                    {reserva.habitacion.imagenes.map((imagen) => (
                                        <img
                                            key={imagen.id}
                                            src={`https://storage.googleapis.com/habitaciones/${imagen.url}`}
                                            alt={imagen.nombre}
                                            className="img-thumbnail m-2"
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p>
                                <strong>Huéspedes:</strong> Adultos: {reserva.habitacion.huespedesAdultos}, Niños:{' '}
                                {reserva.habitacion.huespedesNinos}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
            {/* Paginación */}
            <nav className="d-flex justify-content-center">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handlePrevPage}>
                            «
                        </button>
                    </li>
                    <li className="page-item active">
                        <span className="page-link">{currentPage}</span>
                    </li>
                    <li className={`page-item ${currentPage === Math.ceil(reservas.length / itemsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={handleNextPage}>
                            »
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default HistorialReservas;
